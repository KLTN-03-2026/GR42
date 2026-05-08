<?php
if(!defined('_TAI')) {
    die('Truy cập không hợp lệ');
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    die('ID người dùng không hợp lệ');
}

$user = getOne("SELECT * FROM users WHERE id = $id");
if (!$user) {
    die('Người dùng không tồn tại');
}

$history = getAll("
    SELECT h.viewed_at, n.title, n.category, n.source, n.id as news_id
    FROM history h
    JOIN crawl_news n ON h.news_id = n.id
    WHERE h.user_id = $id
    ORDER BY h.viewed_at DESC
");

layout('admin_header');
layout('admin_sidebar');
view('admin', 'users_history', [
    'user' => $user,
    'history' => $history
]);
layout('admin_footer');
?>
