<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    header("Location: ?module=admin&action=loginqtv");
    exit;
}

require_once __DIR__ . '/../../includes/session.php';
global $conn;
if (!isset($conn)) $conn = new mysqli("localhost", "root", "", "crawl_news");

$page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$limit = 100; 
$offset = ($page - 1) * $limit;

$keyword = isset($_GET['keyword']) ? trim($_GET['keyword']) : '';
$whereClause = "";
if ($keyword !== '') {
    $whereClause = " WHERE title LIKE '%" . $conn->real_escape_string($keyword) . "%' ";
}

$totalRecords = 0;
$countSql = "SELECT COUNT(id) as total FROM crawl_news" . $whereClause;
$countResult = $conn->query($countSql);
if ($countResult && $row = $countResult->fetch_assoc()) {
    $totalRecords = $row['total'];
}
$totalPages = ceil($totalRecords / $limit);

$sql = "SELECT * FROM crawl_news" . $whereClause . " ORDER BY pubdate DESC, id DESC LIMIT $limit OFFSET $offset";
$news = [];
$result = $conn->query($sql);
if ($result) {
    while($row = $result->fetch_assoc()) {
        $news[] = $row;
    }
}

// XÓA NEWS 
if(isset($_GET['delete_id'])) {
    $del_id = (int)$_GET['delete_id'];
    $conn->query("DELETE FROM crawl_news WHERE id = $del_id");
    header("Location: ?module=admin&action=news");
    exit;
}

renderView('admin/news', [
    'news' => $news,
    'page' => $page,
    'totalPages' => $totalPages,
    'totalRecords' => $totalRecords,
    'limit' => $limit
]);
