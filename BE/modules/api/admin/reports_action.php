<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../../config.php';
require_once __DIR__ . '/../../../includes/database.php';

$inputData = json_decode(file_get_contents('php://input'), true);
$token = trim($inputData['token'] ?? '');
$id = (int)($inputData['id'] ?? 0);
$action = trim($inputData['action'] ?? '');

if (empty($token) || $id <= 0) {
    die(json_encode(['status' => 'error', 'message' => 'Dữ liệu không hợp lệ']));
}

$checkAdmin = getOne("SELECT u.role FROM token_login t JOIN users u ON t.user_id = u.id WHERE t.token = '$token'");
if (!$checkAdmin || $checkAdmin['role'] !== 'admin') {
    die(json_encode(['status' => 'error', 'message' => 'Không có quyền truy cập']));
}

if ($action === 'process') {
    $res = update('article_reports', ['status' => 1], "id = $id");
} else if ($action === 'delete') {
    $res = delete('article_reports', "id = $id");
} else {
    die(json_encode(['status' => 'error', 'message' => 'Hành động không hợp lệ']));
}

echo json_encode(['status' => $res ? 'success' : 'error', 'message' => $res ? 'Thành công' : 'Lỗi xử lý']);
?>
