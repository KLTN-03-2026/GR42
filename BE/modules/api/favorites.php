<?php
require_once __DIR__ . '/cors.php';
if (!defined('_TAI')) {
    define('_TAI', true);
}
if (!defined('_HOST')) {
    require_once __DIR__ . '/../../config.php';
    require_once __DIR__ . '/../../includes/database.php';
}

$method = $_SERVER['REQUEST_METHOD'];
$inputData = json_decode(file_get_contents('php://input'), true);
$token = trim($_GET['token'] ?? ($inputData['token'] ?? ''));
$action_type = trim($_GET['action_type'] ?? ($inputData['action_type'] ?? 'list'));

if (empty($token)) {
    die(json_encode(['status' => 'error', 'message' => 'Thiếu token xác thực']));
}

$checkToken = getOne("SELECT user_id FROM token_login WHERE token = '$token'");
if (!$checkToken) {
    die(json_encode(['status' => 'error', 'message' => 'Token không hợp lệ']));
}
$user_id = (int)$checkToken['user_id'];

if ($method === 'GET' || $action_type === 'list') {
    $favorites = getAll("
        SELECT n.id, n.title, n.category, n.source, n.image, n.pubDate, 1 AS is_favourite
        FROM favourite_news f
        JOIN crawl_news n ON f.news_id = n.id
        WHERE f.user_id = $user_id
        ORDER BY f.created_at DESC
    ");
    echo json_encode(['status' => 'success', 'data' => $favorites]);
} 
else if ($method === 'POST') {
    if ($action_type === 'toggle') {
        $news_id = (int)($inputData['news_id'] ?? 0);
        if ($news_id <= 0) die(json_encode(['status' => 'error', 'message' => 'ID không hợp lệ']));
        
        $news = getOne("SELECT title FROM crawl_news WHERE id = $news_id");
        if (!$news) die(json_encode(['status' => 'error', 'message' => 'Tin tức không tồn tại']));
        
        $fav = getOne("
            SELECT f.id 
            FROM favourite_news f 
            JOIN crawl_news n2 ON f.news_id = n2.id
            WHERE n2.title = '" . $conn->real_escape_string($news['title']) . "' AND f.user_id = $user_id
        ");
        
        if ($fav) {
            $titleEscaped = $conn->real_escape_string($news['title']);
            $conn->query("
                DELETE f FROM favourite_news f
                JOIN crawl_news n ON f.news_id = n.id
                WHERE n.title = '$titleEscaped' AND f.user_id = $user_id
            ");
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
