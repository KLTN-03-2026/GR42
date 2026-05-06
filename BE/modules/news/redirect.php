<?php
if (!defined('_TAI')) {
    define('_TAI', true);
}
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    die('ID bài báo không hợp lệ');
}

// Lấy thông tin bài báo
$news = getOne("SELECT id, link FROM crawl_news WHERE id = $id");
if (!$news) {
    die('Bài báo không tồn tại');
}

// Ghi lịch sử nếu đã đăng nhập
$user_id = 0;
if (!empty($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
} else {
    $token = getSession('token_login');
    if (!empty($token)) {
        $checkToken = getOne("SELECT user_id FROM token_login WHERE token = '" . addslashes($token) . "'");
        if ($checkToken) {
            $user_id = $checkToken['user_id'];
        }
    }
}

file_put_contents(__DIR__ . '/debug_redirect.txt', date('Y-m-d H:i:s') . " - ID: $id, UserID: $user_id\n", FILE_APPEND);

if ($user_id > 0) {
    $checkHistory = getOne("SELECT id FROM history WHERE user_id = $user_id AND news_id = $id");
    if ($checkHistory) {
        update('history', ['viewed_at' => date('Y-m-d H:i:s')], "id = " . $checkHistory['id']);
    } else {
        insert('history', [
            'user_id' => $user_id,
            'news_id' => $id,
            'viewed_at' => date('Y-m-d H:i:s')
        ]);
    }
}

// Chuyển hướng người dùng sang trang báo gốc
header("Location: " . $news['link']);
exit;
?>
