<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/database.php';
require_once __DIR__ . '/../../includes/session.php';
require_once __DIR__ . '/../../includes/functions.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (empty($_SESSION['user_id'])) {
    header('Location: /login.php');
    exit;
}

$news_id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

$data = ['title' => 'Bình luận bài viết'];
layout('header', $data);

$stmt = $conn->prepare("SELECT *, image, pubdate as pubDate FROM crawl_news WHERE id = ?");
$stmt->bind_param("i", $news_id);
$stmt->execute();
$news = $stmt->get_result()->fetch_assoc();
$stmt->close();

// Ghi lịch sử khi xem trang bình luận (được tính là đã đọc bài báo)
$user_id = $_SESSION['user_id'] ?? 0;
if ($user_id <= 0) {
    $token = getSession('token_login');
    if (!empty($token)) {
        $checkToken = getOne("SELECT user_id FROM token_login WHERE token = '" . addslashes($token) . "'");
        if ($checkToken) {
            $user_id = $checkToken['user_id'];
        }
    }
}
if ($user_id > 0 && $news) {
    $checkHistory = getOne("SELECT id FROM history WHERE user_id = $user_id AND news_id = $news_id");
    if ($checkHistory) {
        update('history', ['viewed_at' => date('Y-m-d H:i:s')], "id = " . $checkHistory['id']);
    } else {
        insert('history', [
            'user_id' => $user_id,
            'news_id' => $news_id,
            'viewed_at' => date('Y-m-d H:i:s')
        ]);
    }
}

$sql = "
    SELECT c.*, u.fullname, u.avatar
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.news_id = ?
    ORDER BY c.created_at DESC
";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $news_id);
$stmt->execute();
$comments = $stmt->get_result();
$stmt->close();
renderView('news/comment', [
    'news_id' => $news_id,
    'news' => $news,
    'comments' => $comments
]);