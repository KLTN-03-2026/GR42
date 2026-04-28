<?php
require_once dirname(__DIR__, 2) . '/config.php';
require_once dirname(__DIR__, 2) . '/includes/database.php';
require_once 'cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

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

$checkExist = getRows("SELECT id FROM transactions WHERE referenceCode = '$referenceCode' AND referenceCode != '' AND referenceCode IS NOT NULL");

if ($checkExist > 0) {
    echo json_encode(['success' => true, 'message' => 'Transaction already processed']);
    exit;
}
$userIdToSave = null;
if (preg_match('/VIP\s*(\d+)/i', $content, $matches)) {
    $parsedId = (int)$matches[1];
    if ($parsedId > 0) {
        $checkUser = getRows("SELECT id FROM users WHERE id = $parsedId");
        if ($checkUser > 0) {
            $userIdToSave = $parsedId;
        }
    }
}

$insertData = [
    'user_id' => $userIdToSave,
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
    if ($transferAmount >= 30000 && $userIdToSave > 0) {
        update('users', ['is_vip' => 1], "id = $userIdToSave");
    }
    
    echo json_encode(['success' => true, 'message' => 'Webhook received and saved successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save transaction']);
}
?>
