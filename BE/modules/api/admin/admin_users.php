<?php
require_once __DIR__ . '/../cors.php';
define('_TAI', true);
require_once __DIR__ . '/../../../config.php';
require_once __DIR__ . '/../../../includes/database.php';
require_once __DIR__ . '/../../../includes/functions.php';

$method = $_SERVER['REQUEST_METHOD'];
$token = $_GET['token'] ?? '';

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $token = $data['token'] ?? '';
}

if (empty($token)) {
    die(json_encode(['status' => 'error', 'msg' => 'Thiếu token xác thực']));
}

// Verify Admin
$checkToken = getOne("SELECT user_id FROM token_login WHERE token = '$token'");
if (!$checkToken) {
    die(json_encode(['status' => 'error', 'msg' => 'Token không hợp lệ']));
}

$admin_id = $checkToken['user_id'];
$admin = getOne("SELECT role FROM users WHERE id = $admin_id");
if (!$admin || $admin['role'] !== 'admin') {
    die(json_encode(['status' => 'error', 'msg' => 'Bạn không có quyền truy cập']));
}

if ($method === 'GET') {
    // List Users
    $users = getAll("SELECT id, fullname, email, avatar, role, status, created_at FROM users ORDER BY created_at DESC");
    echo json_encode(['status' => 'success', 'data' => $users]);
} 
else if ($method === 'POST') {
    $action = $data['action'] ?? '';
    $id = (int)($data['id'] ?? 0);

    if (empty($id)) die(json_encode(['status' => 'error', 'msg' => 'Thiếu ID người dùng']));

    if ($action === 'delete') {
        die(json_encode(['status' => 'error', 'msg' => 'Tài khoản của bạn chỉ có quyền xem và cấp quyền, không thể xóa người dùng']));
    } 
    else if ($action === 'update') {
        if (isset($data['status'])) {
            die(json_encode(['status' => 'error', 'msg' => 'Bạn không có quyền thay đổi trạng thái người dùng']));
        }
        
        $updateData = [];
        if (isset($data['role'])) $updateData['role'] = $data['role'];
        
        if (empty($updateData)) die(json_encode(['status' => 'error', 'msg' => 'Thiếu dữ liệu cập nhật']));
        
        $res = update('users', $updateData, "id = $id");
        echo json_encode(['status' => $res ? 'success' : 'error', 'msg' => $res ? 'Cập nhật thành công' : 'Lỗi khi cập nhật']);
    } else {
        die(json_encode(['status' => 'error', 'msg' => 'Thao tác không hợp lệ']));
    }
}
?>
