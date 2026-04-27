<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    header("Location: ?module=admin&action=loginqtv");
    exit;
}

require_once __DIR__ . '/../../includes/session.php';
require_once __DIR__ . '/../../includes/database.php';

$sql = "SELECT t.*, u.fullname, u.email 
        FROM transactions t 
        LEFT JOIN users u ON t.content LIKE CONCAT('%VIP ', u.id, '%') 
        ORDER BY t.id DESC";
$transactions = getAll($sql); 

renderView('admin/transactions', [
    'transactions' => $transactions
]);
