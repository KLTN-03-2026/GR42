<?php
if (!defined('_TAI')) {
    die('Truy cập không hợp lệ');
}

require_once dirname(__DIR__) . '/config.php';

try {
    if (class_exists('PDO')) {
        $options = [
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ];
        $dsn = _DRIVER . ":host=" . _HOST . ";dbname=" . _DB . ";charset=utf8";
        $conn = new PDO($dsn, _USER, _PASS, $options);
    }
} catch (Exception $ex) {
    require_once __DIR__ . '/../modules/errors/404.php';
    die("Lỗi kết nối CSDL: " . $ex->getMessage());
}