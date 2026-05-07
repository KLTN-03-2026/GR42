<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../../config.php';

$lat = isset($_GET['lat']) ? $_GET['lat'] : null;
$lon = isset($_GET['lon']) ? $_GET['lon'] : null;
$q = isset($_GET['q']) ? $_GET['q'] : 'Hanoi';

$apiKey = _OPENWEATHERMAP_API_KEY;
$cacheDir = __DIR__ . '/../../cache';

if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0777, true);
}

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
        $cityMap = [
            'Tỉnh Ðà Nẵng' => 'Đà Nẵng',
            'Da Nang' => 'Đà Nẵng',
            'Tỉnh Thừa Thiên-Huế' => 'Huế',
            'Thành phố Cần Thơ' => 'Cần Thơ',
            'Thành phố Hồ Chí Minh' => 'TP. Hồ Chí Minh',
            'Ha Noi' => 'Hà Nội',
            'Hanoi' => 'Hà Nội'
        ];

        if (isset($cityMap[$data['name']])) {
            $data['name'] = $cityMap[$data['name']];
        }
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