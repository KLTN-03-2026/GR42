<?php
const _TAI = true;
const _MODULES = 'dashboard';
const _ACTION = 'index';
const _DEBUG = true;

$envConfig = [];
$envFilePath = dirname(__DIR__) . '/.env';
if (file_exists($envFilePath)) {
    $envConfig = parse_ini_file($envFilePath);
}

define('_DRIVER', 'mysql');
define('_HOST', $envConfig['DB_HOST'] ?? 'localhost');
define('_DB', $envConfig['DB_NAME'] ?? 'crawl_news');
define('_USER', $envConfig['DB_USER'] ?? 'root');
define('_PASS', $envConfig['DB_PASS'] ?? '');

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$currentPath = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
if (strpos($currentPath, '/modules') !== false) {
    $projectRoot = substr($currentPath, 0, strpos($currentPath, '/modules'));
} else {
    $projectRoot = $currentPath;
}
define('_HOST_URL', $protocol . $host . $projectRoot);
define('_FRONTEND_URL', 'http://localhost:3000');
define('_HOST_URL_TEMPLATES', _HOST_URL . '/templates');

define('_PATH_URL', __DIR__);
define('_PATH_URL_TEMPLATES', _PATH_URL . '/templates');

/*API KEYS AND GG CLIENT*/
define('_GEMINI_API_KEY', $envConfig['GEMINI_API_KEY'] ?? '');
define('_GOOGLE_CLIENT_ID', $envConfig['GOOGLE_CLIENT_ID'] ?? '');
define('_GOOGLE_CLIENT_SECRET', $envConfig['GOOGLE_CLIENT_SECRET'] ?? '');
/*Json URL GGSHEET*/
define('_JSON_URL_SHEET', $envConfig['JSON_URL_SHEET'] ?? '');

/*Sepay Token*/
define('_SEPAY_TOKEN', $envConfig['SEPAY_TOKEN'] ?? '');

/*Mailer Config*/
define('_MAIL_HOST', $envConfig['MAIL_HOST'] ?? 'smtp.gmail.com');
define('_MAIL_USERNAME', $envConfig['MAIL_USERNAME'] ?? '');
define('_MAIL_PASSWORD', $envConfig['MAIL_PASSWORD'] ?? '');
define('_MAIL_PORT', $envConfig['MAIL_PORT'] ?? 465);
define('_MAIL_FROM_NAME', $envConfig['MAIL_FROM_NAME'] ?? 'Tai Course');