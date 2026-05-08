<?php
require_once _PATH_URL . '/includes/database.php';
require_once _PATH_URL . '/includes/session.php';

$client_id = _GOOGLE_CLIENT_ID;
$client_secret = _GOOGLE_CLIENT_SECRET;
$redirect_uri = _HOST_URL . '/?module=auth&action=google_callback';

if (isset($_GET['code'])) {
    $token_url = "https://oauth2.googleapis.com/token";
    $post_data = [
        'code' => $_GET['code'],
        'client_id' => $client_id,
        'client_secret' => $client_secret,
        'redirect_uri' => $redirect_uri,
        'grant_type' => 'authorization_code'
    ];

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $token_url,
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POSTFIELDS => http_build_query($post_data),
        CURLOPT_SSL_VERIFYPEER => false
    ]);

    $response = curl_exec($ch);
    $data = json_decode($response, true);

    if (!empty($data['access_token'])) {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => "https://www.googleapis.com/oauth2/v2/userinfo",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $data['access_token']],
            CURLOPT_SSL_VERIFYPEER => false
        ]);
        $userinfo = json_decode(curl_exec($ch), true);

        if (!empty($userinfo['email'])) {
            $email = $userinfo['email'];
            $name = $userinfo['name'] ?? 'Người dùng Google';
            global $conn;
            $emailEsc = $conn->real_escape_string($email);
            $checkUser = getOne("SELECT * FROM users WHERE email = '$emailEsc'");

            if (empty($checkUser)) {
                $newUser = [
                    'email' => $email,
                    'fullname' => $name,
                    'password' => password_hash(uniqid(), PASSWORD_DEFAULT),
                    'status' => 1,
                    'avatar' => $userinfo['picture'] ?? '',
                    'created_at' => date('Y-m-d H:i:s')
                ];
                if (insert('users', $newUser)) {
                    $userId = lastID();
                    if (!$userId) {
                        $newUserCheck = getOne("SELECT id FROM users WHERE email = '$emailEsc'");
                        $userId = $newUserCheck['id'];
                    }
                } else {
                    header('Location: ' . _FRONTEND_URL . '/login?error=' . urlencode('Lỗi tạo tài khoản mới'));
                    exit;
                }
            } else {
                $userId = $checkUser['id'];
                if (empty($checkUser['avatar']) && !empty($userinfo['picture'])) {
                    update('users', ['avatar' => $userinfo['picture']], "id = '$userId'");
                }
            }

            // Tạo token đăng nhập
            $token = sha1(uniqid() . time());
            $tokenData = [
                'token' => $token,
                'user_id' => $userId,
                'created_at' => date('Y-m-d H:i:s')
            ];

            $res = $conn->query("INSERT INTO token_login (token, user_id, created_at) VALUES ('$token', $userId, NOW())");
            if (!$res) {
                header('Location: ' . _FRONTEND_URL . '/login?error=' . urlencode('Lỗi hệ thống: Không thể tạo phiên đăng nhập'));
                exit;
            }

            $state = $_GET['state'] ?? '';
            if ($state === 'react') {
                $redirectUrl = _FRONTEND_URL . "/login?token=" . $token;
            } else {
                $redirectUrl = _HOST_URL . "/?module=news&action=list";
            }
            header("Location: " . $redirectUrl);
            exit;
        } else {
            header('Location: ' . _FRONTEND_URL . '/login?error=' . urlencode('Không thể lấy thông tin từ Google'));
            exit;
        }
    } else {
        $errorDetail = $data['error_description'] ?? ($data['error'] ?? 'Unknown error');
        header('Location: ' . _FRONTEND_URL . '/login?error=' . urlencode('Lỗi Google: ' . $errorDetail));
        exit;
    }
} else {
    header('Location: ' . _FRONTEND_URL . '/login?error=' . urlencode('Thiếu mã xác thực từ Google'));
    exit;
}
