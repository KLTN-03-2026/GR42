<?php
require 'config.php';
require 'includes/database.php';

$sql = "ALTER TABLE crawl_news CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
if ($conn->query($sql)) {
    echo "Success!";
} else {
    echo "Error: " . $conn->error;
}
