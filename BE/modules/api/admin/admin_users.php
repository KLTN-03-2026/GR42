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
    
    $users = getAll("SELECT id, fullname, email, phone, address, avatar, role, status, created_at FROM users ORDER BY created_at DESC");
    foreach ($users as &$u) {
        if ($u['avatar'] && !preg_match('/^http/', $u['avatar']) && !preg_match('/^data:/', $u['avatar'])) {
            $u['avatar'] = _HOST_URL . '/' . $u['avatar'];
        }
    }
    echo json_encode(['status' => 'success', 'data' => $users]);
} 
else if ($method === 'POST') {
    $action = $data['action'] ?? '';
    $id = (int)($data['id'] ?? 0);

    if (empty($id)) die(json_encode(['status' => 'error', 'msg' => 'Thiếu ID người dùng']));

    if ($action === 'delete') {
        $res = delete('users', "id = $id");
        echo json_encode(['status' => $res ? 'success' : 'error', 'msg' => $res ? 'Đã xóa người dùng' : 'Lỗi khi xóa']);
    } 
    else if ($action === 'update') {
        $updateData = [];
        if (isset($data['fullname'])) $updateData['fullname'] = $data['fullname'];
        if (isset($data['email']))    $updateData['email'] = $data['email'];
        if (isset($data['phone']))    $updateData['phone'] = $data['phone'];
        if (isset($data['address']))  $updateData['address'] = $data['address'];
        if (isset($data['role']))     $updateData['role'] = $data['role'];
        if (isset($data['status']))   $updateData['status'] = (int)$data['status'];
        
        if (empty($updateData)) die(json_encode(['status' => 'error', 'msg' => 'Thiếu dữ liệu cập nhật']));
        
        $res = update('users', $updateData, "id = $id");
        echo json_encode(['status' => $res ? 'success' : 'error', 'msg' => $res ? 'Cập nhật thành công' : 'Lỗi khi cập nhật']);
    } 
    else if ($action === 'add') {
        $fullname = $data['fullname'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '123456'; 
        $role = $data['role'] ?? 'user';
        
        if (empty($fullname) || empty($email)) {
            die(json_encode(['status' => 'error', 'msg' => 'Vui lòng nhập đầy đủ họ tên và email']));
        }
        
        $checkEmail = getOne("SELECT id FROM users WHERE email = '$email'");
        if ($checkEmail) {
            die(json_encode(['status' => 'error', 'msg' => 'Email đã tồn tại trong hệ thống']));
        }
        
        $insertData = [
            'fullname' => $fullname,
            'email' => $email,
            'password' => password_hash($password, PASSWORD_DEFAULT),
            'role' => $role,
            'status' => 1,
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        $res = insert('users', $insertData);
        echo json_encode(['status' => $res ? 'success' : 'error', 'msg' => $res ? 'Đã thêm người dùng mới' : 'Lỗi khi thêm người dùng']);
    } else {
        die(json_encode(['status' => 'error', 'msg' => 'Thao tác không hợp lệ']));
    }
}
?>
