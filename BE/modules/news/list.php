<?php
if (!defined('_TAI')) {
    define('_TAI', true);
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$data = [
    'title' => 'Trang chủ'
];
layout('header', $data);

$filter = filterData();
$keyword = $filter['keyword'] ?? '';
$category = $filter['category'] ?? '';
renderView('news/list', [
    'data' => $data,
    'category' => $category,
    'keyword' => $keyword
]);