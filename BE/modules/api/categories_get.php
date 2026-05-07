<?php
require_once __DIR__ . '/cors.php';
define('_TAI', true);
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/database.php';
require_once __DIR__ . '/../../includes/functions.php';

$categories = [
    'THOI-SU',
    'PHAP-LUAT',
    'TIN-TRONG-NUOC',
    'THE-GIOI',
    'GIAI-TRI',
    'SHOW-BIT',
    'CA-SY',
    'KINH-DOANH',
    'CONG-NGHE',
    'SUC-KHOE',
    'VAN-HOA',
    'KHOA-HOC',
    'GIAO-DUC',
    'DOI-SONG',
    'THE-THAO'
];

echo json_encode([
    'status' => 'success',
    'data' => $categories
]);
?>
