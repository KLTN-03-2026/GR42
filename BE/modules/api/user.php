<?php
require_once __DIR__ . '/cors.php';
define('_TAI', true);
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$inputData = json_decode(file_get_contents('php://input'), true);
$token = $_GET['token'] ?? ($inputData['token'] ?? '');
$action = $_GET['action'] ?? ($inputData['action'] ?? 'get_all');

if (empty($token)) {
    die(json_encode(['status' => 'error', 'message' => 'Thiếu token xác thực']));
}

$checkToken = getOne("SELECT user_id FROM token_login WHERE token = '$token'");
if (!$checkToken) {
    die(json_encode(['status' => 'error', 'message' => 'Token không hợp lệ']));
}
$user_id = (int)$checkToken['user_id'];

if ($method === 'GET' || $action === 'get_all') {
    // 1. Get Profile
    $profile = getOne("SELECT id, fullname, email, phone, address, avatar, role FROM users WHERE id = $user_id");
    
    // 2. Get Interests
    $interests = [];
    $intRes = getAll("SELECT category_name FROM user_interests WHERE user_id = $user_id");
    foreach($intRes as $row) {
        $interests[] = $row['category_name'];
    }

    echo json_encode([
        'status' => 'success',
        'data' => [
            'profile' => $profile,
            'interests' => $interests
        ]
    ]);
} 
else if ($method === 'POST') {
    if ($action === 'update_profile') {
        $updateData = [
            'fullname' => $inputData['fullname'] ?? '',
            'phone' => $inputData['phone'] ?? '',
            'address' => $inputData['address'] ?? ''
        ];
        $res = update('users', $updateData, "id = $user_id");
        echo json_encode(['status' => $res ? 'success' : 'error', 'msg' => $res ? 'Cập nhật thành công' : 'Lỗi cập nhật']);
    } 
    else if ($action === 'update_interests') {
        $interests = $inputData['interests'] ?? [];
        delete('user_interests', "user_id = $user_id");
        foreach ($interests as $cat) {
            insert('user_interests', ['user_id' => $user_id, 'category_name' => $cat]);
        }
        echo json_encode(['status' => 'success', 'msg' => 'Đã cập nhật sở thích']);
    }
}
?>
