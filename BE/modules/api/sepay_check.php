<?php
require_once dirname(__DIR__, 2) . '/config.php';
require_once 'cors.php';

// Kiểm tra xem token đã được cấu hình chưa
if (!defined('_SEPAY_TOKEN') || empty(_SEPAY_TOKEN)) {
    http_response_code(500);
    echo json_encode(['error' => 'Sepay token is not configured in .env / config.php']);
    exit;
}

// Cho phép truyền các tham số lọc nếu cần (ví dụ: limit, account_number, transaction_date_min, v.v.)
$limit = $_GET['limit'] ?? 20;
$account_number = $_GET['account_number'] ?? '';
$transaction_date_min = $_GET['transaction_date_min'] ?? '';
$transaction_date_max = $_GET['transaction_date_max'] ?? '';

// Build URL query
$queryParams = [
    'limit' => $limit
];

if (!empty($account_number)) $queryParams['account_number'] = $account_number;
if (!empty($transaction_date_min)) $queryParams['transaction_date_min'] = $transaction_date_min;
if (!empty($transaction_date_max)) $queryParams['transaction_date_max'] = $transaction_date_max;

$queryString = http_build_query($queryParams);
$sepayUrl = "https://my.sepay.vn/userapi/transactions/list?" . $queryString;

// Cấu hình cURL gọi API Sepay
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $sepayUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . _SEPAY_TOKEN,
    "Content-Type: application/json"
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(['error' => 'Curl error: ' . curl_error($ch)]);
    curl_close($ch);
    exit;
}
curl_close($ch);

// Trả về dữ liệu nguyên bản từ Sepay cho frontend/client
http_response_code($httpCode);
header('Content-Type: application/json; charset=utf-8');
echo $response;
?>
