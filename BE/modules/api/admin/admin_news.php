<?php
require_once __DIR__ . '/../cors.php';
define('_TAI', true);
require_once __DIR__ . '/../../../config.php';
require_once __DIR__ . '/../../../includes/database.php';
require_once __DIR__ . '/../../../includes/functions.php';

$token = $_GET['token'] ?? '';
if (empty($token)) die(json_encode(['status' => 'error', 'msg' => 'Thiếu token']));

$checkToken = getOne("SELECT user_id FROM token_login WHERE token = '$token'");
if (!$checkToken) die(json_encode(['status' => 'error', 'msg' => 'Token không hợp lệ']));

$admin = getOne("SELECT role FROM users WHERE id = " . $checkToken['user_id']);
if (!$admin || $admin['role'] !== 'admin') die(json_encode(['status' => 'error', 'msg' => 'Không có quyền truy cập']));

$page     = (int)($_GET['page'] ?? 1);
$limit    = (int)($_GET['limit'] ?? 10);
$search   = $_GET['search'] ?? '';
$category = $_GET['category'] ?? '';
$offset   = ($page - 1) * $limit;

$where = "1=1";
if (!empty($search))   $where .= " AND (title LIKE '%$search%' OR source LIKE '%$search%' OR id = '$search')";
if (!empty($category)) $where .= " AND category = '$category'";

$total = getOne("SELECT COUNT(*) as count FROM crawl_news WHERE $where")['count'];
$data  = getAll("SELECT id, title, category, source, link, image, pubDate FROM crawl_news WHERE $where ORDER BY id DESC LIMIT $offset, $limit");

echo json_encode([
    'status' => 'success',
    'data' => $data,
    'pagination' => [
        'total' => (int)$total,
        'page' => $page,
        'limit' => $limit,
        'total_pages' => ceil($total / $limit)
    ]
]);
?>
