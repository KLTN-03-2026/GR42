<?php
if (!defined('_TAI')) {
    die('Truy cap khong hop le');
}
require_once __DIR__ . '/cors.php';
if (session_status() === PHP_SESSION_ACTIVE) {
    session_write_close();
}

$response = [
    'status' => 'error',
    'msg' => 'Da co loi xay ra',
    'errors' => []
];

if (isPost()) {
    global $conn;
    $rawLogData = file_get_contents("php://input");
    $data = json_decode($rawLogData, true);

    $fullname = trim($data['fullname'] ?? $_POST['fullname'] ?? '');
    $email = trim($data['email'] ?? $_POST['email'] ?? '');
    $password = trim($data['password'] ?? $_POST['password'] ?? '');
    $confirm_password = trim($data['confirm_password'] ?? $_POST['confirm_password'] ?? $password);

    $errors = [];

    if (empty($fullname)) {
        $errors['fullname'] = 'Ho ten bat buoc phai nhap';
    } else {
        if (mb_strlen($fullname) < 5) {
            $errors['fullname'] = 'Ho ten phai hon 5 ki tu';
        }
    }

    if (empty($email)) {
        $errors['email'] = 'Email bat buoc phai nhap';
    } else {
        if (!validateEmail($email)) {
            $errors['email'] = 'Email khong dung dinh dang';
        } else {
            $checkEmail = getRows("SELECT * FROM users WHERE email = '$email'");
            if ($checkEmail > 0) {
                $errors['email'] = 'Email da duoc su dung';
            }
        }
    }

    if (empty($password)) {
        $errors['password'] = 'Mat khau bat buoc phai nhap';
    } else {
        if (strlen($password) < 6) {
            $errors['password'] = 'Mat khau phai lon hon 6 ki tu';
        }
    }

    if (empty($confirm_password)) {
        $errors['confirm_password'] = 'Vui long nhap lai mat khau';
    } else {
        if ($password !== $confirm_password) {
            $errors['confirm_password'] = 'Mat khau nhap vao khong khop';
        }
    }

    if (empty($errors)) {
        $active_token = sha1(uniqid() . time());
        $dbData = [
            'fullname' => $fullname,
            'password' => password_hash($password, PASSWORD_DEFAULT),
            'email' => $email,
            'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($fullname) . '&background=random&color=fff',
            'active_token' => $active_token,
            'status' => 1,
            'created_at' => date('Y-m-d H:i:s')
        ];

        $insertStatus = insert('users', $dbData);
        if ($insertStatus) {
            $emailTo = $email;
            $subject = 'Kich hoat tai khoan he thong Tai!!';
            $content = 'Chuc mung ban da dang ky thanh cong tai khoan tai Tai. </br>';
            $content .= 'Tai khoan cua ban da duoc kich hoat va co the su dung ngay lap tuc. </br>';
            $content .= 'Cam on ban da ung ho Tai!!!';

            try {
                ob_clean();
                sendMail($emailTo, $subject, $content);
                ob_get_clean();
            } catch (Exception $e) {
                
            }

            $response['status'] = 'success';
            $response['msg'] = 'Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.';
        }
    } else {
        $response['msg'] = 'Vui long kiem tra lai thong tin nhap vao';
        $response['errors'] = $errors;
    }
} else {
    $response['msg'] = 'Phuong thuc khong hop le';
}

echo json_encode($response);
exit;
