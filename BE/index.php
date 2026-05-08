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

$module = _MODULES;
$action = _ACTION;

if (!empty($_GET['module'])) {
    $module = $_GET['module'];
}

if (!empty($_GET['action'])) {
    $action = $_GET['action'];
}

$path = 'modules/' . $module . '/' . $action . '.php';

if (!empty($path)) {
    if (!file_exists($path)) {
        $modulePath = 'modules/' . $module;
        if (is_dir($modulePath)) {
            $it = new RecursiveDirectoryIterator($modulePath);
            foreach (new RecursiveIteratorIterator($it) as $file) {
                if ($file->getFilename() === $action . '.php') {
                    $path = $file->getPathname();
                    break;
                }
            }
        }
    }

    if (file_exists($path)) {
        require_once $path;
    } else {
        require_once './modules/errors/404.php';
    }
} else {
    require_once './modules/errors/500.php';
}
?>