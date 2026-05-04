<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 1. KIỂM TRA QUYỀN ADMIN
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    header("Location: ?module=admin&action=loginqtv");
    exit;
}

require_once __DIR__ . '/../../includes/database.php';

// Xử lý thao tác báo cáo
if (isset($_GET['report_action']) && isset($_GET['id']) && isset($_GET['type'])) {
    $id = (int)$_GET['id'];
    $type = $_GET['type'];
    $action = $_GET['report_action'];
    $target_id = isset($_GET['target_id']) ? (int)$_GET['target_id'] : 0;
    
    $report_table = ($type === 'comment') ? 'comment_reports' : 'article_reports';
    $content_table = ($type === 'comment') ? 'comments' : 'crawl_news';

    if ($action === 'delete_report') {
        // Chỉ xóa bản ghi báo cáo
        query("DELETE FROM $report_table WHERE id = $id");
    } else if ($action === 'process') {
        // Đánh dấu đã xử lý
        query("UPDATE $report_table SET status = 1 WHERE id = $id");
    } else if ($action === 'delete_content') {
        // Xóa cả nội dung và báo cáo
        if ($target_id > 0) {
            if ($type === 'comment') {
                // Xóa các dữ liệu liên quan đến bình luận trước (tránh lỗi khóa ngoại)
                query("DELETE FROM comment_likes WHERE comment_id = $target_id");
                query("DELETE FROM comment_reports WHERE comment_id = $target_id");
                query("DELETE FROM comments WHERE id = $target_id");
            } else {
                // Xóa dữ liệu liên quan đến bài báo (nếu có)
                query("DELETE FROM article_reports WHERE news_id = $target_id");
                query("DELETE FROM crawl_news WHERE id = $target_id");
            }
        }
    }
    
    header("Location: ?module=admin&action=reports");
    exit;
}

// Lấy danh sách báo cáo (Gộp cả bài viết và bình luận)
$sql = "
    SELECT r.id, r.user_id, r.news_id as target_id, r.reason, r.details, r.status, r.created_at, 
           'article' as type, u.fullname as reporter_name, n.title as target_title
    FROM article_reports r
    JOIN users u ON r.user_id = u.id
    JOIN crawl_news n ON r.news_id = n.id
    
    UNION ALL
    
    SELECT r.id, r.user_id, r.comment_id as target_id, r.reason, r.details, r.status, r.created_at, 
           'comment' as type, u.fullname as reporter_name, c.content as target_title
    FROM comment_reports r
    JOIN users u ON r.user_id = u.id
    JOIN comments c ON r.comment_id = c.id
    
    ORDER BY status ASC, created_at DESC
";

$reports = getAll($sql);

renderView('admin/reports', [
    'reports' => $reports
]);
