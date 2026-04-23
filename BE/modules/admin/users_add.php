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
require_once __DIR__ . '/../../includes/functions.php';
global $conn;

$msg = '';
$msgType = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullname = trim($_POST['fullname'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $role = trim($_POST['role'] ?? 'user');
    $status = isset($_POST['status']) ? (int)$_POST['status'] : 1;

    if (!empty($fullname) && !empty($email) && !empty($password)) {
        // Kiểm tra email trùng
        $checkEmail = getOne("SELECT id FROM users WHERE email = '$email'");
        if ($checkEmail) {
            $msg = "Email này đã được sử dụng bởi người dùng khác!";
            $msgType = "danger";
        } else {
            $insertData = [
                'fullname' => $fullname,
                'email' => $email,
                'password' => password_hash($password, PASSWORD_DEFAULT),
                'role' => $role,
                'status' => $status,
                'created_at' => date('Y-m-d H:i:s')
            ];

            try {
                insert('users', $insertData);
                $msg = "Thêm người dùng mới thành công!";
                $msgType = "success";
                
                unset($_POST);
            } catch (Exception $e) {
                $msg = "Có lỗi xảy ra: " . $e->getMessage();
                $msgType = "danger";
            }
        }
    } else {
        $msg = "Vui lòng nhập đầy đủ các thông tin bắt buộc (Tên, Email, Mật khẩu).";
        $msgType = "warning";
    }
}

renderView('admin/users_add', [
    'msg' => $msg,
    'msgType' => $msgType
]);
