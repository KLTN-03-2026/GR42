<?php
date_default_timezone_set('Asia/Ho_Chi_Minh');
session_start();
ob_start();

require_once 'config.php';
require_once './includes/connect.php';
require_once './includes/database.php';
require_once './includes/session.php';
require_once './includes/mailer/Exception.php';
require_once './includes/mailer/PHPMailer.php';
require_once './includes/mailer/SMTP.php';
require_once './includes/functions.php';

// Cấu hình đa ngôn ngữ
$lang = 'vi'; // Mặc định
if (!empty($_SESSION['lang'])) {
    $lang = $_SESSION['lang'];
}

// Cho phép đổi ngôn ngữ qua query string
if (!empty($_GET['lang'])) {
    $lang = $_GET['lang'];
    $_SESSION['lang'] = $lang;
}

$langFile = './includes/languages/' . $lang . '.php';
if (file_exists($langFile)) {
    $translations = require_once $langFile;
} else {
    $translations = require_once './includes/languages/vi.php';
}

$pass = 123456789;
$rel = password_hash($pass, PASSWORD_DEFAULT);
$pass_user_input = '12345678239';
$rel2=password_verify($pass_user_input,$rel);


$module = _MODULES;
$action = _ACTION;

if (!empty($_GET['module'])){
    $module = $_GET['module'];
}

if (!empty($_GET['action'])){
    $action = $_GET['action'];
}

$path = 'modules/'. $module. '/'. $action . '.php';

if(!empty($path)){
    if(file_exists($path)){
        require_once $path;
    }else {
       require_once './modules/errors/404.php';
    }
}else{
    require_once './modules/errors/500.php';
}