<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Content-Type: audio/mpeg');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$text = isset($input['text']) ? $input['text'] : '';

if (empty(trim($text))) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'No text provided']);
    exit;
}

// Ensure the text isn't too long to avoid issues and chunk by spaces or dots.
// Simple naive chunking for 190 characters.
$chunks = [];
while (mb_strlen($text) > 0) {
    if (mb_strlen($text) > 190) {
        $part = mb_substr($text, 0, 190);
        $lastSpace = mb_strrpos($part, ' ');
        if ($lastSpace === false) $lastSpace = 190;
        $chunks[] = mb_substr($text, 0, $lastSpace);
        $text = mb_substr($text, $lastSpace);
    } else {
        $chunks[] = $text;
        $text = '';
    }
}

$audioData = '';

foreach ($chunks as $chunk) {
    $chunk = trim($chunk);
    if (empty($chunk)) continue;
    
    $url = 'https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=vi-VN&q=' . urlencode($chunk);
    
    // Fetch with cURL to override User-Agent
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    // Suppress warnings in case of temporary Google block
    list($response, $httpcode) = @array(curl_exec($ch), curl_getinfo($ch, CURLINFO_HTTP_CODE));
    curl_close($ch);
    
    if ($httpcode == 200 && $response) {
        $audioData .= $response;
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Google TTS request failed']);
        exit;
    }
}

echo $audioData;
?>
