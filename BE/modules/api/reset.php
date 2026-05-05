<?php
if (!defined('_TAI')) {
    die('Truy cập không hợp lệ');
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (session_status() === PHP_SESSION_ACTIVE) {
    session_write_close();
}

$response = [
    'status' => 'error',
    'msg' => 'Đã có lỗi xảy ra.'
];

if (isPost()) {
    $rawLogData = file_get_contents("php://input");
    $data = json_decode($rawLogData, true);
    
    $token = !empty($data['token']) ? trim($data['token']) : '';
    $password = !empty($data['password']) ? trim($data['password']) : '';
    $confirm_password = !empty($data['confirm_password']) ? trim($data['confirm_password']) : '';

    if (empty($token)) {
        $response['msg'] = 'Liên kết không hợp lệ hoặc đã hết hạn.';
    } elseif (empty($password)) {
        $response['msg'] = 'Mật khẩu bắt buộc phải nhập.';
    } elseif (strlen($password) < 6) {
        $response['msg'] = 'Mật khẩu phải từ 6 ký tự trở lên.';
    } elseif ($password !== $confirm_password) {
        $response['msg'] = 'Mật khẩu nhập lại không khớp.';
    } else {
        $checkToken = getOne("SELECT * FROM users WHERE forget_token = '$token'");

        if (!empty($checkToken)) {
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            $updateData = [
                'password' => $passwordHash,
                'forget_token' => null,
                'updated_at' => date('Y-m-d H:i:s')
            ];
            $condition = "id=" . $checkToken['id'];

            $updateStatus = update('users', $updateData, $condition);
            if ($updateStatus) {
                // Gửi mail thông báo đổi mật khẩu thành công
                $emailTo = $checkToken['email'];
                $subject = 'Đổi mật khẩu thành công !!';
                $content = 'Chúc mừng bạn đã đổi mật khẩu thành công trên Vertex. <br>';
                $content .= 'Nếu không phải bạn thao tác hãy liên hệ ngay với admin. <br>';
                $content .= 'Cảm ơn bạn đã ủng hộ Vertex!!!';
                
                sendMail($emailTo, $subject, $content);

                $response['status'] = 'success';
                $response['msg'] = 'Đổi mật khẩu thành công! Bạn có thể đăng nhập ngay bây giờ.';
            } else {
                $response['msg'] = 'Đã có lỗi cơ sở dữ liệu. Vui lòng thử lại sau!';
            }
        } else {
            $response['msg'] = 'Liên kết đã hết hạn hoặc không tồn tại trong hệ thống!';
        }
    }
} else {
    $response['msg'] = 'Phương thức không được hỗ trợ.';
}

echo json_encode($response);
exit;
