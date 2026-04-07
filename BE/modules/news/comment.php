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

$stmt = $conn->prepare("SELECT * FROM crawl_news WHERE id = ?");
$stmt->bind_param("i", $news_id);
$stmt->execute();
$news = $stmt->get_result()->fetch_assoc();
$stmt->close();

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