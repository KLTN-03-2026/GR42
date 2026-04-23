<?php
define('_TAI', true);
define('_HOST', '127.0.0.1');
require_once __DIR__ . '/../BE/config.php';
require_once __DIR__ . '/../BE/includes/database.php';

$res = query("DESCRIBE users");
while($row = $res->fetch_assoc()) {
    print_r($row);
}
?>
