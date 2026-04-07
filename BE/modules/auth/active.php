<?php

if (!defined('_TAI')) {
    die('Truy cập không hợp lệ');
}
$data = [
    'title' => 'Kích hoạt tài khoản'
];
layout('header-auth', $data);

$filter = filterData('get');

$status = 'expired';

if (!empty($filter['token'])) {
    $token = $filter['token'];
    $checkToken = getOne("SELECT * FROM users WHERE active_token = '$token'");
    
    if (!empty($checkToken)) {
        $status = 'success';
        $dataUpdate = [
            'status' => 1,
            'active_token' => null,
            'updated_at' => date('Y-m-d H:i:s')
        ];
        $condition = "id = " . $checkToken['id'];
        update('users', $dataUpdate, $condition);
    }
}

renderView('auth/active', ['status' => $status]);

layout('footer');