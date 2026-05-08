<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 1. KIỂM TRA QUYỀN ADMIN
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    header("Location: ?module=admin&action=loginqtv");
    exit;
}

require_once __DIR__ . '/../../includes/session.php';
require_once __DIR__ . '/../../includes/database.php';
global $conn;

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if($id <= 0) {
    header("Location: ?module=admin&action=users");
    exit;
}

// LẤY THÔNG TIN USER
$sql = "SELECT * FROM users WHERE id = $id";
$editUser = getOne($sql);
if(!$editUser) {
    header("Location: ?module=admin&action=users");
    exit;
}

$msg = '';
$msgType = '';

// XỬ LÝ CẬP NHẬT
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $updateData = [];
    
    // Chỉ cho phép cập nhật role
    if (isset($_POST['role'])) {
        $updateData['role'] = trim($_POST['role']);
    }
    
    if (!empty($updateData)) {
        try {
            update('users', $updateData, "id = $id");
            $msg = "Cập nhật quyền người dùng thành công!";
            $msgType = "success";
            // Cập nhật lại biến hiển thị
            $editUser = getOne($sql);
        } catch (Exception $e) {
            $msg = "Có lỗi xảy ra: " . $e->getMessage();
            $msgType = "danger";
        }
    } else {
        $msg = "Không có quyền nào được thay đổi.";
        $msgType = "warning";
    }
}

renderView('admin/users_edit', [
    'editUser' => $editUser,
    'msg' => $msg,
    'msgType' => $msgType
]);
