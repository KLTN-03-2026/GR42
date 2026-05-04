<?php
require_once __DIR__ . '/../cors.php';
if (!defined('_TAI')) {
    define('_TAI', true);
    require_once __DIR__ . '/../../../config.php';
    require_once __DIR__ . '/../../../includes/database.php';
    require_once __DIR__ . '/../../../includes/functions.php';
}

$token = $_GET['token'] ?? '';
if (empty($token)) die(json_encode(['status' => 'error', 'msg' => 'Thiếu token']));

$checkToken = getOne("SELECT user_id FROM token_login WHERE token = '$token'");
if (!$checkToken) die(json_encode(['status' => 'error', 'msg' => 'Token không hợp lệ']));

$admin = getOne("SELECT role FROM users WHERE id = " . $checkToken['user_id']);
if (!$admin || $admin['role'] !== 'admin') die(json_encode(['status' => 'error', 'msg' => 'Không có quyền truy cập']));

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';
    
    if ($action === 'delete') {
        $id = (int)($input['id'] ?? 0);
        if ($id > 0) {
            delete('crawl_news', "id = $id");
            echo json_encode(['status' => 'success', 'msg' => 'Đã xóa bài báo']);
            exit;
        }
    }

    if ($action === 'add') {
        $dataInsert = [
            'title' => $input['title'] ?? '',
            'category' => $input['category'] ?? '',
            'content' => $input['content'] ?? '',
            'source' => $input['source'] ?? 'Admin',
            'link' => $input['link'] ?? '',
            'image' => $input['thumbnail'] ?? '',
            'pubdate' => $input['pubDate'] ?? date('Y-m-d H:i:s'),
            'savedtime' => date('Y-m-d H:i:s')
        ];
        
        if (insert('crawl_news', $dataInsert)) {
            echo json_encode(['status' => 'success', 'msg' => 'Đã thêm bài báo mới']);
            exit;
        } else {
            echo json_encode(['status' => 'error', 'msg' => 'Lỗi khi thêm bài báo vào database']);
            exit;
        }
    }
}

$page     = (int)($_GET['page'] ?? 1);
$limit    = (int)($_GET['limit'] ?? 10);
$search   = $_GET['search'] ?? '';
$category = $_GET['category'] ?? '';
$offset   = ($page - 1) * $limit;

$where = "1=1";
if (!empty($search))   $where .= " AND (title LIKE '%$search%' OR source LIKE '%$search%' OR id = '$search')";
if (!empty($category)) $where .= " AND category = '$category'";

$total = getOne("SELECT COUNT(*) as count FROM crawl_news WHERE $where")['count'];
$data  = getAll("SELECT id, title, category, source, link, image, pubdate FROM crawl_news WHERE $where ORDER BY id DESC LIMIT $offset, $limit");

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
