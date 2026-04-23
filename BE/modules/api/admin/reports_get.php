<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../../config.php';
require_once __DIR__ . '/../../../includes/database.php';

$token = trim($_GET['token'] ?? '');
if (empty($token)) {
    die(json_encode(['status' => 'error', 'message' => 'Thiếu token']));
}

$checkAdmin = getOne("SELECT u.role FROM token_login t JOIN users u ON t.user_id = u.id WHERE t.token = '$token'");
if (!$checkAdmin || $checkAdmin['role'] !== 'admin') {
    die(json_encode(['status' => 'error', 'message' => 'Không có quyền truy cập']));
}

$reports = getAll("
    SELECT r.*, u.fullname as reporter_name, n.title as news_title, n.image as news_image, n.category as news_category
    FROM article_reports r
    JOIN users u ON r.user_id = u.id
    JOIN crawl_news n ON r.news_id = n.id
    ORDER BY r.status ASC, r.created_at DESC
");

echo json_encode(['status' => 'success', 'data' => $reports]);
?>
