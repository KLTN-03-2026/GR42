<?php
require_once __DIR__ . '/cors.php';
define('_TAI', true);
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$inputData = json_decode(file_get_contents('php://input'), true);
$token = $_GET['token'] ?? ($inputData['token'] ?? '');
$action = $_GET['action'] ?? ($inputData['action'] ?? 'list');

if (empty($token)) {
    die(json_encode(['status' => 'error', 'message' => 'Thiếu token xác thực']));
}

$checkToken = getOne("SELECT user_id FROM token_login WHERE token = '$token'");
if (!$checkToken) {
    die(json_encode(['status' => 'error', 'message' => 'Token không hợp lệ']));
}
$user_id = (int)$checkToken['user_id'];

if ($method === 'GET' || $action === 'list') {
    $favorites = getAll("
        SELECT n.id, n.title, n.category, n.source, n.image, n.pubDate, n.description
        FROM favourite_news f
        JOIN crawl_news n ON f.news_id = n.id
        WHERE f.user_id = $user_id
        ORDER BY f.created_at DESC
    ");
    echo json_encode(['status' => 'success', 'data' => $favorites]);
} 
else if ($method === 'POST') {
    if ($action === 'toggle') {
        $news_id = (int)($inputData['news_id'] ?? 0);
        if ($news_id <= 0) die(json_encode(['status' => 'error', 'message' => 'ID không hợp lệ']));
        
        $exists = getOne("SELECT id FROM favourite_news WHERE user_id = $user_id AND news_id = $news_id");
        
        if ($exists) {
            delete('favourite_news', "user_id = $user_id AND news_id = $news_id");
            echo json_encode(['status' => 'success', 'action' => 'removed', 'message' => 'Đã xóa khỏi yêu thích']);
        } else {
            insert('favourite_news', [
                'user_id' => $user_id,
                'news_id' => $news_id,
                'created_at' => date('Y-m-d H:i:s')
            ]);
            echo json_encode(['status' => 'success', 'action' => 'added', 'message' => 'Đã thêm vào yêu thích']);
        }
    }
}
?>
