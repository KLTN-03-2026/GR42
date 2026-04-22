<?php
require_once __DIR__ . '/cors.php';
define('_TAI', true);
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/database.php';
require_once __DIR__ . '/../../includes/functions.php';

$sql = "SELECT DISTINCT category FROM crawl_news WHERE category != '' AND category IS NOT NULL";
$categories = getAll($sql);

echo json_encode([
    'status' => 'success',
    'data' => array_map(function($item) {
        return $item['category'];
    }, $categories)
]);
?>
