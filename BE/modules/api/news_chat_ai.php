<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/cors.php';
if (!defined('_HOST')) {
    require_once __DIR__ . '/../../config.php';
    require_once __DIR__ . '/../../includes/database.php';
}

function callGeminiApi(array $data, string $apiKey, string $model, string $caCertPath): ?array
{
    $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data, JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => ["Content-Type: application/json; charset=utf-8"],
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => !empty($caCertPath),
    ]);
    if (!empty($caCertPath)) {
        curl_setopt($ch, CURLOPT_CAINFO, $caCertPath);
    }
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        $err = curl_error($ch);
        curl_close($ch);
        return ["error" => "cURL error: " . $err];
    }
    curl_close($ch);
    $responseData = json_decode($response, true);
    if (!$responseData) {
        return ["error" => "HTTP $httpCode: Không thể phân tích phản hồi", "http_code" => $httpCode];
    }
    if ($httpCode !== 200 || isset($responseData['error'])) {
        $errorMsg = $responseData['error']['message'] ?? 'Unknown error';
        return ["error" => "API error ($httpCode): $errorMsg", "http_code" => $httpCode];
    }
    return $responseData;
}

function callGeminiApiWithMultipleKeys(array $data, array $apiKeys, string $model, string $caCertPath, int $retriesPerKey = 2, int $delaySeconds = 3): array
{
    $resp = [];
    foreach ($apiKeys as $apiKey) {
        if (empty($apiKey))
            continue;
        for ($i = 0; $i <= $retriesPerKey; $i++) {
            $resp = callGeminiApi($data, $apiKey, $model, $caCertPath);
            $errorStr = $resp['error'] ?? '';
            $httpCode = $resp['http_code'] ?? 200;
            if (empty($errorStr)) {
                return $resp;
            }
            if (preg_match('/quota|expired|invalid/i', $errorStr)) {
                break;
            }
            if (!preg_match('/overloaded|temporarily unavailable|high demand/i', $errorStr) && $httpCode !== 503) {
                return $resp;
            }
            if ($i < $retriesPerKey) {
                sleep($delaySeconds);
            }
        }
    }
    return $resp;
}

function extractKeyword($text)
{
    $stopwords = ['tôi', 'muốn', 'biết', 'về', 'tin', 'tức', 'thông', 'hãy', 'cho', 'các', 'bài', 'liên', 'quan', 'đến', 'ai', 'là', 'gì', 'hôm', 'nay', 'có', 'hot', 'không', 'ko', 'mới', 'nhất', 'nào', 'kể', 'nghe', 'xem', 'thế'];
    $words = preg_split('/[\s,\.]+/u', $text);
    $filtered = array_filter($words, fn($word) => !in_array(mb_strtolower($word, 'UTF-8'), $stopwords));
    return trim(implode(' ', $filtered));
}

$apiKeys = array_filter(array_map('trim', explode(',', _GEMINI_API_KEY)));
$caCertPath = "";
$model = "gemini-2.5-flash";
$inputData = json_decode(file_get_contents('php://input'), true) ?? [];
$mode = $_POST['mode'] ?? ($inputData['mode'] ?? '');
$prompt = trim($_POST['prompt'] ?? ($inputData['prompt'] ?? ''));
$articleContext = trim($_POST['articleContext'] ?? ($inputData['articleContext'] ?? ''));
if ($mode === 'clear') {
    unset($_SESSION['chat_history']);
    echo json_encode(["status" => "success", "message" => "Lịch sử chat đã được xóa."], JSON_UNESCAPED_UNICODE);
    exit;
}
if (empty($prompt)) {
    echo json_encode(["status" => "error", "error" => "Không có nội dung gửi lên."]);
    exit;
}

$history = $_SESSION['chat_history'] ?? [];
$articles = [];
if (isset($conn) && $conn) {
    $conn->set_charset("utf8mb4");
    $keyword = extractKeyword($prompt);
    if (empty($keyword)) {
        $stmt = $conn->prepare("SELECT title, source, link, pubDate FROM crawl_news ORDER BY pubDate DESC LIMIT 5");
    } else {
        $stmt = $conn->prepare("SELECT title, source, link, pubDate FROM crawl_news WHERE title LIKE ? ORDER BY pubDate DESC LIMIT 5");
    }
    if ($stmt) {
        if (!empty($keyword)) {
            $like = "%" . $keyword . "%";
            $stmt->bind_param("s", $like);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $articles[] = $row;
        }
        $stmt->close();
    }
}

date_default_timezone_set('Asia/Ho_Chi_Minh');
$currentDate = date('d/m/Y H:i');
$context = "";

if (!empty($articleContext)) {
    $context = "Ngữ cảnh bài báo người dùng đang quan tâm:\n$articleContext\n\n";
    $context .= "Dựa vào ngữ cảnh bài báo này, hãy trả lời câu hỏi của tôi một cách chi tiết. Nếu câu hỏi nằm ngoài bài báo, bạn có thể trả lời bình thường dựa trên kiến thức của bạn.\n";
} elseif (!empty($articles)) {
    $context = "Ngữ cảnh tin tức mới nhất:\n";
    foreach ($articles as $a) {
        $context .= "- {$a['title']} (Nguồn: {$a['source']}, Ngày: {$a['pubDate']})\n";
    }
    $combinedTitles = mb_strtolower(json_encode($articles, JSON_UNESCAPED_UNICODE), 'UTF-8');
    if (strpos($combinedTitles, 'lương cường') !== false && mb_strpos(mb_strtolower($prompt, 'UTF-8'), 'chủ tịch') !== false) {
        $context .= "\nLưu ý: Theo dữ liệu mới nhất, ông Lương Cường là Chủ tịch nước Việt Nam hiện nay.\n";
    }
}

$finalPrompt = "Thời gian hiện tại: {$currentDate}.\n";
if (!empty($context)) {
    $finalPrompt .= "\n{$context}\nDựa vào ngữ cảnh trên (nếu có liên quan), hãy trả lời câu hỏi sau:\n";
}
$finalPrompt .= $prompt;
$history[] = ["role" => "user", "parts" => [["text" => $prompt]]];
$requestData = [
    "system_instruction" => [
        "parts" => [
            [
                "text" => "Bạn là một AI chuyên về tin tức Việt Nam (năm hiện tại là 2026). Luôn trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu, thân thiện.
                Nhiệm vụ: Tóm tắt và trả lời các câu hỏi về tin tức dựa trên 'Ngữ cảnh' được cung cấp. Nếu người dùng hỏi tin tức mà không có ngữ cảnh nào, hãy lịch sự báo rằng bạn chưa cập nhật được dữ liệu tin tức mới trên hệ thống. TUYỆT ĐỐI KHÔNG nói những câu như 'tôi là AI không thể dự đoán tương lai' hay 'tôi chỉ được huấn luyện đến năm...'."
            ]
        ]
    ],
    "contents" => array_merge(
        array_slice($history, 0, -1),
        [["role" => "user", "parts" => [["text" => $finalPrompt]]]]
    ),
    "generationConfig" => [
        "temperature" => 0.7,
        "topK" => 40,
        "topP" => 0.8,
        "maxOutputTokens" => 1024
    ]
];

$apiResponse = callGeminiApiWithMultipleKeys($requestData, $apiKeys, $model, $caCertPath, 2, 3);
if (isset($apiResponse['error'])) {
    if (preg_match('/quota/i', $apiResponse['error'])) {
        $aiMessage = "Xin lỗi, API Key của bạn đã sử dụng hết lượt miễn phí trong ngày hôm nay. Vui lòng thử lại vào ngày mai hoặc thêm thẻ thanh toán nhé!";
    } elseif (preg_match('/overloaded|high demand/i', $apiResponse['error'])) {
        $aiMessage = "Xin lỗi, hệ thống AI đang quá tải lúc này. Bạn vui lòng thử lại sau ít phút nhé!";
    } else {
        $aiMessage = "Lỗi từ API: " . $apiResponse['error'];
    }
} elseif (isset($apiResponse['candidates'][0]['content']['parts'])) {
    $parts = $apiResponse['candidates'][0]['content']['parts'];
    $aiMessage = implode("\n", array_column($parts, 'text'));
} else {
    $aiMessage = "Không có phản hồi văn bản từ AI !!!";
}

$history[] = ["role" => "model", "parts" => [["text" => $aiMessage]]];
if (count($history) > 10) {
    $history = array_slice($history, -10);
    if (!empty($history) && $history[0]['role'] !== 'user') {
        array_shift($history);
    }
}
$_SESSION['chat_history'] = $history;
echo json_encode([
    "status" => "success",
    "message" => $aiMessage,
    "history" => $history,
    "articles" => $articles
], JSON_UNESCAPED_UNICODE);