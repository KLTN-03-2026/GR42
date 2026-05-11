<?php
require_once _PATH_URL . '/modules/api/cors.php';
if (!defined('_HOST')) {
    require_once _PATH_URL . '/config.php';
    require_once _PATH_URL . '/includes/database.php';
}

function streamGeminiApi(array $data, string $apiKey, string $model): array
{
    $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:streamGenerateContent?alt=sse&key={$apiKey}";
    $ch = curl_init();

    $headersSent = false;
    $errorBody = '';
    $httpCode = 0;

    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => false,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data, JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => ["Content-Type: application/json; charset=utf-8"],
        CURLOPT_TIMEOUT => 60,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_WRITEFUNCTION => function ($curl, $chunk) use (&$headersSent, &$errorBody, &$httpCode) {
            $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            if ($httpCode === 0)
                $httpCode = $code;
            if ($code === 200) {
                if (!$headersSent) {
                    header('Content-Type: text/event-stream; charset=utf-8');
                    header('Cache-Control: no-cache');
                    header('Connection: keep-alive');
                    $headersSent = true;
                }
                echo $chunk;
                if (ob_get_level() > 0)
                    ob_flush();
                flush();
            } else {
                $errorBody .= $chunk;
            }
            return strlen($chunk);
        }
    ]);

    curl_exec($ch);
    $finalHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_errno($ch)) {
        $err = curl_error($ch);
        curl_close($ch);
        return ["error" => "cURL error: " . $err];
    }
    curl_close($ch);

    if ($finalHttpCode !== 200) {
        $responseData = json_decode($errorBody, true);
        if (!$responseData) {
            return ["error" => "HTTP $finalHttpCode: Không thể phân tích phản hồi", "http_code" => $finalHttpCode];
        }
        $errorMsg = $responseData['error']['message'] ?? 'Unknown error';
        return ["error" => "API error ($finalHttpCode): $errorMsg", "http_code" => $finalHttpCode];
    }
    return ["success" => true];
}

function streamGeminiApiWithMultipleKeys(array $data, array $apiKeys, string $model, int $retriesPerKey = 2, int $delaySeconds = 3): array
{
    foreach ($apiKeys as $apiKey) {
        if (empty($apiKey))
            continue;
        for ($i = 0; $i <= $retriesPerKey; $i++) {
            $resp = streamGeminiApi($data, $apiKey, $model);
            if (isset($resp['success'])) {
                return $resp;
            }
            $errorStr = $resp['error'] ?? '';
            $httpCode = $resp['http_code'] ?? 200;
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
    return ["error" => "Tất cả API Key đều lỗi hoặc đã hết hạn ngạch."];
}

function extractKeywords(string $text): array
{
    $stopwords = ['tôi', 'muốn', 'biết', 'về', 'tin', 'tức', 'thông', 'hãy', 'cho', 'các', 'bài', 'liên', 'quan', 'đến', 'ai', 'là', 'gì', 'hôm', 'nay', 'có', 'hot', 'không', 'ko', 'mới', 'nhất', 'nào', 'kể', 'nghe', 'xem', 'thế', 'làm', 'sao', 'như', 'đâu'];
    $words = preg_split('/[\s,\.]+/', mb_strtolower($text, 'UTF-8'));
    $filtered = array_filter($words, fn($word) => mb_strlen($word, 'UTF-8') > 2 && !in_array($word, $stopwords));
    return array_values(array_unique($filtered));
}

$apiKeys = array_filter(array_map('trim', explode(',', _GEMINI_API_KEY)));
$model = "gemini-2.5-flash";

$inputData = json_decode(file_get_contents('php://input'), true) ?? [];
$prompt = trim($_POST['prompt'] ?? ($inputData['prompt'] ?? ''));
$articleContext = trim($_POST['articleContext'] ?? ($inputData['articleContext'] ?? ''));
$clientHistory = $inputData['history'] ?? [];

if (empty($prompt)) {
    echo json_encode(["status" => "error", "error" => "Không có nội dung gửi lên."]);
    exit;
}

$geminiHistory = [];
if (is_array($clientHistory)) {
    foreach ($clientHistory as $msg) {
        $role = ($msg['role'] === 'user') ? 'user' : 'model';
        $geminiHistory[] = ["role" => $role, "parts" => [["text" => $msg['content']]]];
    }
}

$articles = [];
if (isset($conn) && $conn) {
    $conn->set_charset("utf8mb4");
    $keywords = extractKeywords($prompt);

    $sql = "SELECT id, title, source, link, pubdate as pubDate FROM crawl_news ";
    $params = [];
    $types = "";

    if (!empty($keywords)) {
        $conditions = [];
        $topKeywords = array_slice($keywords, 0, 3);
        foreach ($topKeywords as $kw) {
            $conditions[] = "title LIKE ?";
            $params[] = "%" . $kw . "%";
            $types .= "s";
        }
        $sql .= "WHERE " . implode(" OR ", $conditions) . " ";
    }

    $sql .= "ORDER BY pubdate DESC LIMIT 5";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
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
    $context .= "Dựa vào ngữ cảnh bài báo này, hãy trả lời câu hỏi chi tiết. Nếu hỏi ngoài lề, hãy trả lời bình thường.\n";
} elseif (!empty($articles)) {
    $context = "Ngữ cảnh tin tức mới nhất:\n";
    foreach ($articles as $a) {
        $context .= "- Tiêu đề: {$a['title']} (Nguồn: {$a['source']}, Ngày: {$a['pubDate']}, Đường dẫn: /article/{$a['id']})\n";
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

$requestData = [
    "system_instruction" => [
        "parts" => [
            [
                "text" => "Bạn là một trợ lý AI thông minh chuyên về tin tức (hiện tại là năm 2026). Luôn trả lời bằng tiếng Việt, thân thiện và có sử dụng định dạng Markdown (như in đậm, in nghiêng, danh sách) để văn bản dễ đọc hơn.
Nhiệm vụ: Dựa vào 'Ngữ cảnh' để trả lời. Nếu không có ngữ cảnh, hãy dùng kiến thức sẵn có nhưng nhớ báo cho người dùng biết là bạn chưa tìm thấy tin tức mới nhất về chủ đề này trên hệ thống. 
QUAN TRỌNG: Bất cứ khi nào bạn nhắc đến một bài báo có trong 'Ngữ cảnh', BẠN BẮT BUỘC PHẢI TẠO ĐƯỜNG DẪN đến bài báo đó bằng định dạng Markdown: [Tiêu đề bài báo](Đường dẫn). Bạn PHẢI lấy chính xác chuỗi 'Đường dẫn' được cung cấp trong ngữ cảnh (ví dụ: /article/123), TUYỆT ĐỐI KHÔNG tự ý ghép thêm bất kỳ tên miền nào (như localhost hay vnexpress) vào trước đường dẫn.
KHÔNG trả lời theo kiểu 'tôi là AI không thể dự đoán' hay 'chỉ được huấn luyện đến năm...'"
            ]
        ]
    ],
    "contents" => array_merge(
        $geminiHistory,
        [["role" => "user", "parts" => [["text" => $finalPrompt]]]]
    ),
    "generationConfig" => [
        "temperature" => 0.7,
        "topK" => 40,
        "topP" => 0.8,
        "maxOutputTokens" => 1024
    ]
];

$apiResponse = streamGeminiApiWithMultipleKeys($requestData, $apiKeys, $model);

if (isset($apiResponse['error'])) {
    header('Content-Type: application/json; charset=utf-8');
    $errMsg = $apiResponse['error'];
    if (preg_match('/quota/i', $errMsg)) {
        $errMsg = "Xin lỗi, API Key đã hết lượt sử dụng. Vui lòng thử lại sau.";
    } elseif (preg_match('/overloaded/i', $errMsg)) {
        $errMsg = "Hệ thống AI đang quá tải. Vui lòng thử lại sau.";
    }
    echo json_encode([
        "status" => "error",
        "message" => $errMsg
    ], JSON_UNESCAPED_UNICODE);
}