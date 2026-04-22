<?php
require_once __DIR__ . '/cors.php';
define('_TAI', true);
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/database.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$token = isset($_GET['token']) ? trim($_GET['token']) : '';

if ($id <= 0) {
    echo json_encode(['status' => 'error', 'msg' => 'ID bài báo không hợp lệ']);
    exit;
}

$news = getOne("SELECT * FROM crawl_news WHERE id = $id");

if (!$news) {
    echo json_encode(['status' => 'error', 'msg' => 'Không tìm thấy bài báo']);
    exit;
}

$is_favourite = false;
if (!empty($token)) {
    $checkToken = getOne("SELECT user_id FROM token_login WHERE token = '$token'");
    if (!empty($checkToken)) {
        $user_id = $checkToken['user_id'];
        $fav = getOne("
            SELECT f.id 
            FROM favourite_news f 
            JOIN crawl_news n2 ON f.news_id = n2.id
            WHERE n2.title = '" . $conn->real_escape_string($news['title']) . "' AND f.user_id = $user_id
        ");
        if (!empty($fav)) {
            $is_favourite = true;
        }
    }
}

$comments = getAll("
    SELECT c.id, c.user_id, c.content, c.created_at, u.fullname, u.avatar
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.news_id = $id
    ORDER BY c.created_at DESC
    LIMIT 15
");

// Lấy tin liên quan (Cùng chuyên mục, cùng nguồn hoặc ngẫu nhiên)
$related = getAll("
    SELECT id, title, category, source, image, pubDate 
    FROM crawl_news 
    WHERE category = '{$news['category']}' AND id <> $id 
    ORDER BY id DESC 
    LIMIT 5
");

echo json_encode([
    'status' => 'success',
    'data' => [
        'id' => $news['id'],
        'title' => $news['title'],
        'description' => $news['description'],
        'content' => $news['content'],
        'image' => $news['image'],
        'source' => $news['source'],
        'pubDate' => $news['pubDate'],
        'link' => $news['link'],
        'category' => $news['category'],
        'is_favourite' => $is_favourite,
        'comments' => $comments,
        'related' => $related
    ]
]);
