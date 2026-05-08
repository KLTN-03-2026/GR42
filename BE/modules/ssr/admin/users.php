<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    header("Location: ?module=admin&action=loginqtv");
    exit;
}

require_once __DIR__ . '/../../includes/session.php';
global $conn;
if (!isset($conn)) $conn = new mysqli("localhost", "root", "", "crawl_news");

$sql = "SELECT * FROM users ORDER BY id DESC";
$users = getAll($sql); 
if(empty($users)) {
    $result = $conn->query($sql);
    $users = [];
    if($result) {
        while($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
    }
}

// Deletion is disabled as requested by user

renderView('admin/users', [
    'users' => $users
]);
