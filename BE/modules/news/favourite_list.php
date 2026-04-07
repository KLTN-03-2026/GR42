<?php
if (!defined('_TAI')) {
    define('_TAI', true);
}

$data = [
    'title' => 'Tin yêu thích'
];
layout('header', $data);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$user_id = $_SESSION['user_id'] ?? 1;
$sql = "SELECT f.news_id, c.title, c.link, c.image, f.created_at 
        FROM favourite_news f 
        JOIN crawl_news c ON f.news_id = c.id 
        WHERE f.user_id = " . intval($user_id) . " 
        ORDER BY f.created_at DESC";

$listFav = getAll($sql);
renderView('news/favourite_list', [
    'data' => $data,
    'listFav' => $listFav
]);