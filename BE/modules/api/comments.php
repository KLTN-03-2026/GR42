<?php
require_once __DIR__ . '/cors.php';
define('_TAI', true);
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$inputData = json_decode(file_get_contents('php://input'), true);
$token = $_GET['token'] ?? ($inputData['token'] ?? '');
$action = $_GET['action'] ?? ($inputData['action'] ?? 'list');

if ($method === 'POST' && empty($token)) {
    die(json_encode(['status' => 'error', 'message' => 'Thiếu token xác thực']));
}

$user_id = 0;
if (!empty($token)) {
    $checkToken = getOne("SELECT user_id FROM token_login WHERE token = '$token'");
    if ($checkToken) {
        $user_id = (int)$checkToken['user_id'];
    } else if ($method === 'POST') {
        die(json_encode(['status' => 'error', 'message' => 'Token không hợp lệ']));
    }
}

if ($method === 'GET' || $action === 'list') {
    $news_id = (int)($_GET['news_id'] ?? 0);
    if ($news_id <= 0) die(json_encode(['status' => 'error', 'message' => 'ID không hợp lệ']));
    
    $comments = getAll("
        SELECT c.id, c.user_id, c.content, c.created_at, u.fullname, u.avatar
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.news_id = $news_id
        ORDER BY c.created_at DESC
    ");
    echo json_encode(['status' => 'success', 'data' => $comments]);
} 
else if ($method === 'POST') {
    if ($action === 'add') {
        $news_id = (int)($inputData['news_id'] ?? 0);
        $content = trim($inputData['content'] ?? '');
        
        if ($news_id <= 0 || empty($content)) {
            die(json_encode(['status' => 'error', 'message' => 'Dữ liệu không hợp lệ']));
        }
        
        $res = insert('comments', [
            'user_id' => $user_id,
            'news_id' => $news_id,
            'content' => $content,
            'created_at' => date('Y-m-d H:i:s')
        ]);
        
        if ($res) {
            $newId = lastID();
            $comment = getOne("
                SELECT c.id, c.user_id, c.content, c.created_at, u.fullname, u.avatar
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.id = $newId
            ");
            echo json_encode(['status' => 'success', 'data' => $comment]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Lỗi thêm bình luận']);
        }
    } 
    else if ($action === 'delete') {
        $comment_id = (int)($inputData['id'] ?? 0);
        $res = delete('comments', "id = $comment_id AND user_id = $user_id");
        echo json_encode(['status' => $res ? 'success' : 'error', 'message' => $res ? 'Đã xóa' : 'Lỗi xóa hoặc không có quyền']);
    }
}
?>
