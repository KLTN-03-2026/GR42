<?php
require_once _PATH_URL . '/config.php';
require_once _PATH_URL . '/includes/database.php';
require_once _PATH_URL . '/modules/api/cors.php';

$token = $_GET['token'] ?? '';
if (empty($token)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Thiếu token xác thực']);
    exit;
}

$checkToken = getOne("SELECT user_id FROM token_login WHERE token = '$token'");
if (!$checkToken) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Token không hợp lệ']);
    exit;
}

$user_id = (int)$checkToken['user_id'];

// Kiểm tra xem user đã là VIP chưa
$user = getOne("SELECT is_vip FROM users WHERE id = $user_id");
if ($user && $user['is_vip'] == 1) {
    echo json_encode(['status' => 'success', 'is_vip' => 1, 'message' => 'Tài khoản của bạn đã là VIP']);
    exit;
}

// Kiểm tra xem token Sepay đã được cấu hình chưa
if (!defined('_SEPAY_TOKEN') || empty(_SEPAY_TOKEN)) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Sepay token is not configured in .env / config.php']);
    exit;
}

$limit = $_GET['limit'] ?? 20;
$queryString = http_build_query(['limit' => $limit]);
$sepayUrl = "https://my.sepay.vn/userapi/transactions/list?" . $queryString;

// Cấu hình cURL gọi API Sepay
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $sepayUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . _SEPAY_TOKEN,
    "Content-Type: application/json"
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Curl error: ' . curl_error($ch)]);
    curl_close($ch);
    exit;
}
curl_close($ch);

$sepayData = json_decode($response, true);
$foundVIP = false;

if ($httpCode === 200 && $sepayData && isset($sepayData['transactions'])) {
    foreach ($sepayData['transactions'] as $tx) {
        $content = $tx['transaction_content'] ?? '';
        $amount = (int)($tx['amount_in'] ?? 0);
        
        // Kiểm tra nội dung chuyển khoản có chứa "VIP {user_id}" và số tiền >= 30000
        if (preg_match('/VIP\s*' . $user_id . '/i', $content) && $amount >= 30000) {
            $foundVIP = true;
            $refCode = $tx['reference_number'] ?? '';
            
            // Kiểm tra xem giao dịch này đã được xử lý chưa
            $checkExist = getRows("SELECT id FROM transactions WHERE referenceCode = '$refCode' AND referenceCode != ''");
            if ($checkExist == 0) {
                $insertData = [
                    'user_id' => $user_id,
                    'gateway' => $tx['bank_brand_name'] ?? 'Sepay API',
                    'transactionDate' => $tx['transaction_date'] ?? null,
                    'accountNumber' => $tx['account_number'] ?? null,
                    'content' => $content,
                    'transferAmount' => $amount,
                    'accumulated' => $tx['accumulated'] ?? 0,
                    'referenceCode' => $refCode,
                    'status' => 1
                ];
                insert('transactions', $insertData);
            }
            break;
        }
    }
}

if ($foundVIP) {
    update('users', ['is_vip' => 1], "id = $user_id");
    echo json_encode(['status' => 'success', 'is_vip' => 1, 'message' => 'Xác nhận thanh toán thành công. Tài khoản đã được nâng cấp VIP!']);
} else {
    echo json_encode(['status' => 'pending', 'is_vip' => 0, 'message' => 'Chưa tìm thấy giao dịch thanh toán hoặc giao dịch đang được xử lý.']);
}
?>
