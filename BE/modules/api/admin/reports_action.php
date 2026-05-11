<?php
require_once _PATH_URL . '/modules/api/cors.php';
require_once _PATH_URL . '/config.php';
require_once _PATH_URL . '/includes/database.php';

$inputData = json_decode(file_get_contents('php://input'), true);
$token = trim($inputData['token'] ?? '');
$id = (int)($inputData['id'] ?? 0);
$action = trim($inputData['action'] ?? '');
$type = trim($inputData['type'] ?? 'article');

if (empty($token) || $id <= 0) {
    die(json_encode(['status' => 'error', 'message' => 'Dữ liệu không hợp lệ']));
}

$checkAdmin = getOne("SELECT u.role FROM token_login t JOIN users u ON t.user_id = u.id WHERE t.token = '$token'");
if (!$checkAdmin || $checkAdmin['role'] !== 'admin') {
    die(json_encode(['status' => 'error', 'message' => 'Không có quyền truy cập']));
}

$table = ($type === 'comment') ? 'comment_reports' : 'article_reports';

if ($action === 'process') {
    $res = update($table, ['status' => 1], "id = $id");
} else if ($action === 'delete') {
    $res = delete($table, "id = $id");
} else if ($action === 'delete_content') {
    $report = getOne("SELECT * FROM $table WHERE id = $id");
    if (!$report) {
        die(json_encode(['status' => 'error', 'message' => 'Báo cáo không tồn tại']));
    }

    $target_id = ($type === 'comment') ? $report['comment_id'] : $report['news_id'];

    if ($type === 'comment') {
        query("DELETE FROM comment_likes WHERE comment_id = $target_id");
        query("DELETE FROM comment_reports WHERE comment_id = $target_id");
        $res = query("DELETE FROM comments WHERE id = $target_id");
    } else {
        query("DELETE FROM article_reports WHERE news_id = $target_id");
        $res = query("DELETE FROM crawl_news WHERE id = $target_id");
    }
} else {
    die(json_encode(['status' => 'error', 'message' => 'Hành động không hợp lệ']));
}

echo json_encode(['status' => $res ? 'success' : 'error', 'message' => $res ? 'Thành công' : 'Lỗi xử lý']);
?>
