<?php
require_once __DIR__ . '/cors.php';
if (!defined('_TAI')) {
    define('_TAI', true);
}
if (!defined('_HOST')) {
    require_once __DIR__ . '/../../config.php';
    require_once __DIR__ . '/../../includes/database.php';
}

query("CREATE TABLE IF NOT EXISTS `comment_likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comment_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_like` (`comment_id`, `user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;");

if (!query("SHOW COLUMNS FROM `comments` LIKE 'parent_id'")->fetch_assoc()) {
    query("ALTER TABLE `comments` ADD COLUMN `parent_id` int DEFAULT NULL AFTER `news_id`;");
}

$method = $_SERVER['REQUEST_METHOD'];
$inputData = json_decode(file_get_contents('php://input'), true);
$token = trim($_GET['token'] ?? ($inputData['token'] ?? ''));
$action_type = trim($_GET['action_type'] ?? ($inputData['action_type'] ?? 'list'));

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

if ($method === 'GET' || $action_type === 'list') {
    $news_id = (int)($_GET['news_id'] ?? 0);
    if ($news_id <= 0) die(json_encode(['status' => 'error', 'message' => 'ID không hợp lệ']));
    
    $comments = getAll("
        SELECT c.id, c.user_id, c.content, c.created_at, c.parent_id, u.fullname, 
               CASE WHEN u.avatar LIKE 'http%' THEN u.avatar ELSE CONCAT('" . _HOST_URL . "/', u.avatar) END as avatar,
               (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) as like_count,
               (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND user_id = $user_id) as is_liked
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.news_id = $news_id
        ORDER BY c.created_at ASC
    ");
    echo json_encode(['status' => 'success', 'data' => $comments]);
} 
else if ($method === 'POST') {
    if ($action_type === 'add') {
        $news_id = (int)($inputData['news_id'] ?? 0);
        $content = trim($inputData['content'] ?? '');
        $parent_id = isset($inputData['parent_id']) ? (int)$inputData['parent_id'] : null;
        
        if ($news_id <= 0 || empty($content)) {
            die(json_encode(['status' => 'error', 'message' => 'Dữ liệu không hợp lệ']));
        }
        
        $res = insert('comments', [
            'user_id' => $user_id,
            'news_id' => $news_id,
            'content' => $content,
            'parent_id' => $parent_id,
            'created_at' => date('Y-m-d H:i:s')
        ]);
        
        if ($res) {
            $newId = lastID();
            $comment = getOne("
                SELECT c.id, c.user_id, c.content, c.created_at, c.parent_id, u.fullname, 
                       CASE WHEN u.avatar LIKE 'http%' THEN u.avatar ELSE CONCAT('" . _HOST_URL . "/', u.avatar) END as avatar,
                       0 as like_count, 0 as is_liked
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.id = $newId
            ");
            echo json_encode(['status' => 'success', 'data' => $comment]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Lỗi thêm bình luận']);
        }
    } 
    else if ($action_type === 'like') {
        $comment_id = (int)($inputData['comment_id'] ?? 0);
        $check = getOne("SELECT id FROM comment_likes WHERE comment_id = $comment_id AND user_id = $user_id");
        if ($check) {
            delete('comment_likes', "comment_id = $comment_id AND user_id = $user_id");
            $action = 'unliked';
        } else {
            insert('comment_likes', ['comment_id' => $comment_id, 'user_id' => $user_id]);
            $action = 'liked';
        }
        $count = getOne("SELECT COUNT(*) as count FROM comment_likes WHERE comment_id = $comment_id")['count'];
        echo json_encode(['status' => 'success', 'action' => $action, 'like_count' => $count]);
    }    else if ($action_type === 'delete') {
        $comment_id = (int)($inputData['id'] ?? 0);
        $res = delete('comments', "id = $comment_id AND user_id = $user_id");
        echo json_encode(['status' => $res ? 'success' : 'error', 'message' => $res ? 'Đã xóa' : 'Lỗi xóa hoặc không có quyền']);
    }
}
?>
