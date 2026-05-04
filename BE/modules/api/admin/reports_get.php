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
    SELECT r.id, r.user_id, r.news_id as target_id, r.reason, r.details, r.status, r.created_at, 
           'article' as type, u.fullname as reporter_name, n.title as target_title, n.image as news_image, n.category as news_category
    FROM article_reports r
    JOIN users u ON r.user_id = u.id
    JOIN crawl_news n ON r.news_id = n.id
    
    UNION ALL
    
    SELECT r.id, r.user_id, r.comment_id as target_id, r.reason, r.details, r.status, r.created_at, 
           'comment' as type, u.fullname as reporter_name, c.content as target_title, NULL as news_image, NULL as news_category
    FROM comment_reports r
    JOIN users u ON r.user_id = u.id
    JOIN comments c ON r.comment_id = c.id
    
    ORDER BY status ASC, created_at DESC
");

echo json_encode(['status' => 'success', 'data' => $reports]);
?>
