<?php
require_once __DIR__ . '/cors.php';
if (!defined('_TAI')) {
    define('_TAI', true);
}
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/database.php';

$news_id = isset($_GET['news_id']) ? (int)$_GET['news_id'] : 0;
if ($news_id <= 0) {
    echo json_encode(['status' => 'error', 'message' => 'ID không hợp lệ']);
    exit;
}

$news = getOne("SELECT title, content FROM crawl_news WHERE id = $news_id");
if (!$news) {
    echo json_encode(['status' => 'error', 'message' => 'Không tìm thấy bài báo']);
    exit;
}

$apiKey = _GEMINI_API_KEY;
$model = "gemini-1.5-flash-latest";
$url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

$prompt = "Hãy tóm tắt nội dung bài báo sau đây một cách ngắn gọn, súc tích trong khoảng 3-4 câu. 
Tiêu đề: " . $news['title'] . "
Nội dung: " . strip_tags($news['content']);

$requestData = [
    "contents" => [
        ["role" => "user", "parts" => [["text" => $prompt]]]
    ],
    "generationConfig" => [
        "temperature" => 0.5,
        "maxOutputTokens" => 500
    ]
];

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($requestData, JSON_UNESCAPED_UNICODE),
    CURLOPT_HTTPHEADER => ["Content-Type: application/json; charset=utf-8"],
    CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => false,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$responseData = json_decode($response, true);

if ($httpCode === 200 && isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
    $summary = $responseData['candidates'][0]['content']['parts'][0]['text'];
    echo json_encode([
        'status' => 'success',
        'summary' => $summary
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Lỗi từ API Gemini',
        'raw' => $responseData
    ]);
}
