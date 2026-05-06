<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/database.php';

$token = isset($_GET['token']) ? trim($_GET['token']) : '';

if (empty($token)) {
    echo json_encode(['status' => 'error', 'msg' => 'Thiếu token xác thực']);
    exit;
}

$checkToken = getOne("SELECT user_id FROM token_login WHERE token = '$token'");
if (empty($checkToken)) {
    echo json_encode(['status' => 'error', 'msg' => 'Token không hợp lệ hoặc đã hết hạn']);
    exit;
}

$user_id = $checkToken['user_id'];

$sql = "
    SELECT h.viewed_at, n.id, n.title, n.image, n.source, n.pubDate, n.category, n.link
    FROM history h
    JOIN crawl_news n ON h.news_id = n.id
    WHERE h.user_id = $user_id
    ORDER BY h.viewed_at DESC
    LIMIT 20
";

$history = getAll($sql);

echo json_encode([
    'status' => 'success',
    'data' => $history
]);
