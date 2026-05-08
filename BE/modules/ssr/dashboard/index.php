<?php
if(!defined('_TAI')) {
    die('Truy cập không hợp lệ');
}

$data = [
    'title' => 'Hệ thống TAI'
];

layout('header', $data);
layout('sidebar');
require_once './templates/layouts/header.php';
require_once './templates/layouts/sidebar.php';
?>
renderView('dashboard/index', $data);

layout('footer');