<?php
require_once dirname(__DIR__, 2) . '/config.php';
require_once dirname(__DIR__, 2) . '/includes/database.php';
require_once 'cors.php';

// Chỉ nhận phương thức POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// Đọc dữ liệu JSON từ body
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Lấy thông tin từ Sepay webhook
$gateway = $data['gateway'] ?? null;
$transactionDate = $data['transactionDate'] ?? null;
$accountNumber = $data['accountNumber'] ?? null;
$subAccount = $data['subAccount'] ?? null;
$code = $data['code'] ?? null;
$content = $data['content'] ?? null;
$transferType = $data['transferType'] ?? null;
$transferAmount = $data['transferAmount'] ?? 0;
$accumulated = $data['accumulated'] ?? 0;
$referenceCode = $data['referenceCode'] ?? null;
$description = $data['description'] ?? null;

// Kiểm tra xem mã giao dịch đã tồn tại chưa để tránh lưu trùng lặp
$checkExist = getRows("SELECT id FROM transactions WHERE referenceCode = '$referenceCode' AND referenceCode != '' AND referenceCode IS NOT NULL");

if ($checkExist > 0) {
    echo json_encode(['success' => true, 'message' => 'Transaction already processed']);
    exit;
}

// Lưu giao dịch vào cơ sở dữ liệu
$insertData = [
    'gateway' => $gateway,
    'transactionDate' => $transactionDate,
    'accountNumber' => $accountNumber,
    'subAccount' => $subAccount,
    'code' => $code,
    'content' => $content,
    'transferType' => $transferType,
    'transferAmount' => $transferAmount,
    'accumulated' => $accumulated,
    'referenceCode' => $referenceCode,
    'description' => $description,
    'status' => 1
];

$result = insert('transactions', $insertData);

if ($result) {
    // TẠI ĐÂY BẠN CÓ THỂ THÊM LOGIC ĐỂ XỬ LÝ ĐƠN HÀNG HOẶC CỘNG TIỀN VÀO TÀI KHOẢN NGƯỜI DÙNG
    // Ví dụ: Tìm user_id từ nội dung chuyển khoản ($content) và cập nhật số dư, hoặc nâng cấp VIP
    
    // Nâng cấp VIP nếu số tiền >= 30,000 và nội dung có chữ VIP [ID]
    if ($transferAmount >= 30000 && preg_match('/VIP\s*(\d+)/i', $content, $matches)) {
        $userIdToUpgrade = (int)$matches[1];
        if ($userIdToUpgrade > 0) {
            update('users', ['is_vip' => 1], "id = $userIdToUpgrade");
        }
    }
    
    echo json_encode(['success' => true, 'message' => 'Webhook received and saved successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save transaction']);
}
?>
