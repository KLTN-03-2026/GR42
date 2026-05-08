<?php
// modules/user/list.php
session_start();

// 1. KIỂM TRA QUYỀN ADMIN (Chặn nếu không phải admin)
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    // Chuyển hướng về loginqtv nếu chưa đăng nhập
    header("Location: ?module=admin&action=loginqtv");
    exit;
}

// 2. KẾT NỐI DATABASE
if (file_exists(__DIR__ . '/../../includes/session.php')) require_once __DIR__ . '/../../includes/session.php';
// Fallback kết nối nếu không tìm thấy file session
if (!isset($conn)) $conn = new mysqli("localhost", "root", "", "crawl_news");

// 3. LẤY DỮ LIỆU USER TỪ DATABASE
$sql = "SELECT * FROM users ORDER BY id DESC";
$result = $conn->query($sql);

$admin_name = isset($_SESSION['user_name']) ? $_SESSION['user_name'] : 'Admin';
$module = isset($_GET['module']) ? $_GET['module'] : '';
$action = isset($_GET['action']) ? $_GET['action'] : '';
renderView('users/list', [
    'result' => $result,
    'admin_name' => $admin_name,
    'module' => $module,
    'action' => $action
]);