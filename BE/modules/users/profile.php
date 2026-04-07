<?php
if(!defined('_TAI')) {
    die('Truy cập không hợp lệ');
}

$data = [
    'title' => 'Thông tin tài khoản'
];
if(session_status() === PHP_SESSION_NONE){
    session_start();
}
layout('header', $data); 


// Lấy thông tin user qua token
$getData = filterData('get');
$token = getSession('token_login');

if(!empty($token)){
    $checkTokenLogin = getOne("SELECT * FROM token_login WHERE token = '$token'");
    if(!empty($checkTokenLogin)){
        $user_id = $checkTokenLogin['user_id'];
        $detailUser = getOne("SELECT * FROM users WHERE id = $user_id");
    }
}

if(isPost()){
    $filter = filterData();
    $errors = [];

    if(empty(trim($filter['fullname']))){
        $errors['fullname']['required'] = 'Họ tên bắt buộc phải nhập';
    } else if(strlen(trim($filter['fullname'])) < 5){
        $errors['fullname']['length'] = 'Họ tên phải hơn 5 kí tự';
    }

    if($filter['email'] != $detailUser['email']){
        if(empty(trim($filter['email']))){
            $errors['email']['required'] = 'Email bắt buộc phải nhập';
        } else if(!validateEmail(trim($filter['email']))){
            $errors['email']['isEmail'] = 'Email không đúng định dạng';
        } else {
            $email = $filter['email'];
            $checkEmail = getRows("SELECT * FROM users WHERE email = '$email'");
            if($checkEmail > 0){
                $errors['email']['check'] = 'Email đã tồn tại';
            }
        }
    }

    if(empty($errors)){

        $dataUpdate = [
            'fullname' => $filter['fullname'],
            'email' => $filter['email'],
            'updated_at' => date('Y-m-d H:i:s')
        ];

        // ✅ Upload avatar
        if(!empty($_FILES['avatar']['name'])){
            $uploadDir = 'templates/uploads/';
            if(!file_exists($uploadDir)){
                mkdir($uploadDir, 0777, true);
            }
            
            $fileName = time() . '-' . basename($_FILES['avatar']['name']);
            $targetFile = $uploadDir . $fileName;

            if(move_uploaded_file($_FILES['avatar']['tmp_name'], $targetFile)){
                $dataUpdate['avatar'] = $targetFile;
            }
        }

        if(!empty($filter['password'])){
            $dataUpdate['password'] = password_hash($filter['password'], PASSWORD_DEFAULT);
        }

        $condition = "id = " . $user_id;

        if(update('users', $dataUpdate, $condition)){
            setSessionFlash('msg', 'Cập nhật thành công');
            setSessionFlash('msg_type', 'success');
            redirect('?module=users&action=profile');
        } else {
            setSessionFlash('msg', 'Cập nhật thất bại');
            setSessionFlash('msg_type', 'danger');
        }

    } else {
        setSessionFlash('msg', 'Vui lòng kiểm tra lại dữ liệu nhập vào');
        setSessionFlash('msg_type', 'danger');
        setSessionFlash('oldData', $filter);
        setSessionFlash('errors', $errors);
    }
}

// Load session flash thông báo
$msg = getSessionFlash('msg');
$msg_type = getSessionFlash('msg_type');

// Load dữ liệu
$oldData = getSessionFlash('oldData');
if(!empty($detailUser)){
    $oldData = $detailUser;
}
$errorsArr =  getSessionFlash('errors');
renderView('users/profile', [
    'data' => $data,
    'msg' => $msg,
    'msg_type' => $msg_type,
    'oldData' => $oldData,
    'errorsArr' => $errorsArr
]);