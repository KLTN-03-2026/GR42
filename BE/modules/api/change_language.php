<?php
if (!defined('_TAI')) {
    die('Truy cập không hợp lệ');
}

require_once __DIR__ . '/cors.php';

$lang = $_GET['lang'] ?? 'vi';

if (in_array($lang, ['vi', 'en'])) {
    $_SESSION['lang'] = $lang;
    echo json_encode([
        'status' => 'success',
        'message' => 'Language changed to ' . $lang,
        'lang' => $lang
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid language'
    ]);
}
exit();
