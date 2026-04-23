<?php
require_once __DIR__ . '/cors.php';

require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/database.php';

$news_id = isset($_GET['news_id']) ? (int) $_GET['news_id'] : 0;
if ($news_id <= 0) {
    echo json_encode(['status' => 'error', 'message' => 'ID không hợp lệ']);
    exit;
}
$news = getOne("SELECT title, content FROM crawl_news WHERE id = $news_id");
if (!$news) {
    echo json_encode(['status' => 'error', 'message' => 'Không tìm thấy bài báo']);
    exit;
}

function callGeminiApi(array $data, string $apiKey, string $model): ?array
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
        CURLOPT_SSL_VERIFYPEER => false,
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $responseData = json_decode($response, true);
    if (!$responseData)
        return ["error" => "HTTP $httpCode: Không thể phân tích phản hồi", "http_code" => $httpCode];
    if ($httpCode !== 200 || isset($responseData['error'])) {
        $errorMsg = $responseData['error']['message'] ?? 'Unknown error';
        return ["error" => "API error ($httpCode): $errorMsg", "http_code" => $httpCode];
    }
    return $responseData;
}

function callGeminiApiWithMultipleKeys(array $data, array $apiKeys, string $model, int $retriesPerKey = 2, int $delaySeconds = 3): array
{
    $resp = [];
    foreach ($apiKeys as $apiKey) {
        if (empty($apiKey))
            continue;
        for ($i = 0; $i <= $retriesPerKey; $i++) {
            $resp = callGeminiApi($data, $apiKey, $model);
            $errorStr = $resp['error'] ?? '';
            $httpCode = $resp['http_code'] ?? 200;
            if (empty($errorStr))
                return $resp;
            if (preg_match('/quota|expired|invalid/i', $errorStr))
                break;
            if (!preg_match('/overloaded|temporarily unavailable|high demand/i', $errorStr) && $httpCode !== 503)
                return $resp;
            if ($i < $retriesPerKey)
                sleep($delaySeconds);
        }
    }
    return $resp;
}

$apiKeys = array_filter(array_map('trim', explode(',', _GEMINI_API_KEY)));
$model = "gemini-2.5-flash";
$cleanContent = strip_tags($news['content'] ?? '');
if (mb_strlen($cleanContent, 'UTF-8') > 10000) {
    $cleanContent = mb_substr($cleanContent, 0, 10000, 'UTF-8') . "...";
}
if (mb_strlen($cleanContent, 'UTF-8') > 5000) {
    $cleanContent = mb_substr($cleanContent, 0, 5000, 'UTF-8') . "...";
}
$prompt = "Bạn là một biên tập viên. Hãy đọc kỹ bài báo dưới đây và viết một bản tóm tắt gọn gàng, súc tích.\n"
    . "Yêu cầu bắt buộc:\n"
    . "- Độ dài khoảng 1000 ký tự (khoảng 150 - 300 từ).\n"
    . "- BẮT BUỘC trả về kết quả dưới định dạng thẻ HTML (chỉ dùng các thẻ <b>, <i>, <ul>, <li>, <p>, <br>). KHÔNG bọc bằng block ```html.\n"
    . "- Không dùng định dạng Markdown. Trình bày thành đoạn văn ngắn hoặc gạch đầu dòng.\n"
    . "Tiêu đề: " . $news['title'] . "\nNội dung: " . $cleanContent;
$requestData = [
    "contents" => [
        ["role" => "user", "parts" => [["text" => $prompt]]]
    ],
    "generationConfig" => [
        "temperature" => 0.4,
        "maxOutputTokens" => 4000
    ]
];

$responseData = callGeminiApiWithMultipleKeys($requestData, $apiKeys, $model, 2, 3);
if (isset($responseData['error'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Lỗi từ API Gemini',
        'raw' => $responseData
    ], JSON_UNESCAPED_UNICODE);
} elseif (isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
    echo json_encode([
        'status' => 'success',
        'summary' => $responseData['candidates'][0]['content']['parts'][0]['text']
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Không có phản hồi từ AI',
    ], JSON_UNESCAPED_UNICODE);
}
