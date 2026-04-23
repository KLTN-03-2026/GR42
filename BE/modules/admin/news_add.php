<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// KIỂM TRA QUYỀN ADMIN
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    header("Location: ?module=admin&action=loginqtv");
    exit;
}

require_once __DIR__ . '/../../includes/session.php';
require_once __DIR__ . '/../../includes/database.php';
global $conn;

$msg = '';
$msgType = '';

// XỬ LÝ THÊM MỚI
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $content = trim($_POST['content'] ?? '');
    $thumbnail = trim($_POST['thumbnail'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $view = isset($_POST['view']) ? (int)$_POST['view'] : 0;
    
    if (!empty($title)) {
        $insertData = [
            'title' => $title,
            'description' => $description,
            'content' => $content,
            'thumbnail' => $thumbnail,
            'category' => $category,
            'view' => $view,
            'pubdate' => date('Y-m-d H:i:s'),
            'created_at' => date('Y-m-d H:i:s')
        ];

        try {
            insert('crawl_news', $insertData);
            $msg = "Thêm bài báo mới thành công!";
            $msgType = "success";
            unset($_POST);
        } catch (Exception $e) {
            $msg = "Có lỗi xảy ra: " . $e->getMessage();
            $msgType = "danger";
        }
    } else {
        $msg = "Vui lòng nhập tiêu đề bài báo.";
        $msgType = "warning";
    }
}

// LẤY DANH SÁCH DANH MỤC
$categories = [];
try {
    $catSql = "SELECT DISTINCT category FROM crawl_news WHERE category != '' AND category IS NOT NULL ORDER BY category ASC";
    $catList = getAll($catSql);
    foreach ($catList as $item) {
        $categories[] = $item['category'];
    }
} catch (Exception $e) {
    $categories = [];
}

renderView('admin/news_add', [
    'categories' => $categories,
    'msg' => $msg,
    'msgType' => $msgType
]);
