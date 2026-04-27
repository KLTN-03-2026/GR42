<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../../includes/database.php';

$token = $_GET['token'] ?? '';

if (empty($token)) {
    echo json_encode(['status' => 'error', 'msg' => 'Token không hợp lệ']);
    exit;
}

$checkToken = getOne("SELECT user_id FROM token_login WHERE token = '$token'");
if (!$checkToken) {
    echo json_encode(['status' => 'error', 'msg' => 'Phiên làm việc hết hạn']);
    exit;
}

$userId = $checkToken['user_id'];
$user = getOne("SELECT role FROM users WHERE id = '$userId'");

if (!$user || $user['role'] !== 'admin') {
    echo json_encode(['status' => 'error', 'msg' => 'Bạn không có quyền truy cập']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $comments = getAll("
        SELECT c.*, u.fullname, u.email, n.title as news_title 
        FROM comments c 
        LEFT JOIN users u ON c.user_id = u.id 
        LEFT JOIN crawl_news n ON c.news_id = n.id 
        ORDER BY c.created_at DESC
    ");
    echo json_encode(['status' => 'success', 'data' => $comments]);
} 
else if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';
    
    if ($action === 'delete') {
        $id = (int)($input['id'] ?? 0);
        if ($id > 0) {
            delete('comments', "id = $id");
            echo json_encode(['status' => 'success', 'msg' => 'Đã xóa bình luận']);
        } else {
            echo json_encode(['status' => 'error', 'msg' => 'ID không hợp lệ']);
        }
    }
}
