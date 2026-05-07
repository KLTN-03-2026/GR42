<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../../config.php';

$lat = isset($_GET['lat']) ? $_GET['lat'] : null;
$lon = isset($_GET['lon']) ? $_GET['lon'] : null;
$q = isset($_GET['q']) ? $_GET['q'] : 'Hanoi';

$apiKey = 'a970c4064122ec6945e1064585bf8762';
$cacheDir = __DIR__ . '/../../cache';

if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0777, true);
}

// Generate unique cache key based on params
$cacheKey = md5($lat . '_' . $lon . '_' . $q);
$cacheFile = $cacheDir . '/weather_' . $cacheKey . '.json';
$cacheTime = 900;

if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheTime) {
    echo file_get_contents($cacheFile);
    exit;
}

if ($lat && $lon) {
    $url = "https://api.openweathermap.org/data/2.5/weather?lat={$lat}&lon={$lon}&units=metric&lang=vi&appid={$apiKey}";
} else {
    $url = "https://api.openweathermap.org/data/2.5/weather?q=" . urlencode($q) . "&units=metric&lang=vi&appid={$apiKey}";
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpcode == 200) {
    $data = json_decode($response, true);

    // Clean up city names for better UI
    if (isset($data['name'])) {
        if ($data['name'] === 'Tỉnh Ðà Nẵng' || $data['name'] === 'Da Nang')
            $data['name'] = 'Đà Nẵng';
        if ($data['name'] === 'Tỉnh Thừa Thiên-Huế')
            $data['name'] = 'Huế';
        if ($data['name'] === 'Thành phố Cần Thơ')
            $data['name'] = 'Cần Thơ';
        if ($data['name'] === 'Thành phố Hồ Chí Minh')
            $data['name'] = 'TP. Hồ Chí Minh';
    }

    $finalResponse = json_encode([
        'status' => 'success',
        'data' => $data
    ]);

    // Save to cache
    file_put_contents($cacheFile, $finalResponse);

    echo $finalResponse;
} else {
    $curl_error = curl_error($ch);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch weather data. HTTP Code: ' . $httpcode . '. Response: ' . $response . ($curl_error ? ' cURL Error: ' . $curl_error : '')
    ]);
}
?>