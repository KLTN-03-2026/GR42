<?php
if (!defined('_PATH_URL')) {
    define('_PATH_URL', dirname(dirname(dirname(__DIR__))));
}

require_once _PATH_URL . '/modules/api/cors.php';

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
exit();
?>
