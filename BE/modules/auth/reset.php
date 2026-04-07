<?php
if (!defined('_TAI')) {
    die('Truy cập không hợp lệ');
}
$data = [
    'title' => 'Đặt lại mật khẩu'
];
layout('header-auth', $data);
$filterGet = filterData('get');

if (!empty($filterGet['token'])) {
    $tokenReset = $filterGet['token'];
}


if (!empty($tokenReset)) {
    $checkToken = getOne("SELECT * FROM users WHERE forget_token = '$tokenReset'");
    if (!empty($checkToken)) {
        if (isPost()) {
            $filter = filterData();
            $errors = [];
            if (empty(trim($filter['password']))) {
                $errors['password']['required'] = 'Mật khẩu bắt buộc phải nhập';
            } else {
                if (strlen(trim($filter['password'])) < 6) {
                    $errors['password']['length'] = 'Mật khẩu phải lớn hơn 6 kí tự';
                }
            }
            if (empty($errors)) {
                $password = $filter['password'];
            }
            if (empty(trim($filter['password']))) {
                $errors['confirm_password']['required'] = 'Vui lòng nhập lại mật khẩu';
            } else {
                if (trim($filter['password']) !== trim($filter['confirm_password'])) {
                    $errors['confirm_password']['like'] = 'Mật khẩu nhập vào không khớp';
                }
            }
            if (empty($errors)) {
                $password = password_hash($filter['password'], PASSWORD_DEFAULT);
                $data = [
                    'password' => $password,
                    'forget_token' => null,
                    'updated_at' => date('Y:m:d H:i:s')
                ];
                $condition = "id=" . $checkToken['id'];
                $updateStatus = update('users', $data, $condition);

                if ($updateStatus) {

                    $emailTo = $checkToken['email'];
                    $subject = 'Đổi mật khẩu thành công !!';
                    $content = 'Chúc mừng bạn đã đổi thành công trên TAI. </br>';
                    $content .= 'Nếu không phải bạn thao tác hãy liên hệ ngay với admin </br>';
                    $content .= 'Cảm ơn bạn đã ủng hộ Tai!!!';

                    sendMail($emailTo, $subject, $content);
                    setSessionFlash('msg', 'Đổi mật khẩu thành công.');
                    setSessionFlash('msg_type', 'success');

                } else {
                    setSessionFlash('msg', 'Đã có lỗi xảy ra vui lòng thử lại sau');
                    setSessionFlash('msg_type', 'danger');
                }

            } else {
                setSessionFlash('msg', 'Vui lòng kiểm tra lại dữ liệu nhập vào');
                setSessionFlash('msg_type', 'danger');
                setSessionFlash('oldData', $filter);
                setSessionFlash('errors', $errors);
            }
        }
    } else {
        getMsg('Liên kết đã hết hạn hoặc không tồn tại', 'danger');
    }
} else {
    getMsg('Liên kết đã hết hạn hoặc không tồn tại', 'danger');
}


$msg = getSessionFlash('msg');
$msg_type = getSessionFlash('msg_type');
$oldData = getSessionFlash('oldData');
$errorsArr = getSessionFlash('errors');


renderView('auth/reset', [
    'msg' => $msg,
    'msg_type' => $msg_type,
    'oldData' => $oldData,
    'errorsArr' => $errorsArr
]);

layout('footer');