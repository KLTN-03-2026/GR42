<?php
if (!defined('_TAI')) {
    define('_TAI', true);
}

$data = [
    'title' => 'Lịch sử đọc'
];
layout('header', $data);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$user_id = $_SESSION['user_id'] ?? 1;
$sql = "SELECT h.news_id, c.title, c.link, c.image, h.viewed_at 
        FROM history h 
        JOIN crawl_news c ON h.news_id = c.id 
        WHERE h.user_id = " . intval($user_id) . " 
        ORDER BY h.viewed_at DESC";

$listHistory = getAll($sql);

renderView('news/history_list', [
    'data' => $data,
    'listHistory' => $listHistory
]);

layout('footer', $data);
?>
