<?php
if (!defined('_TAI')) {
    define('_TAI', true);
}
require_once _PATH_URL . '/config.php';
require_once _PATH_URL . '/includes/connect.php';
require_once _PATH_URL . '/includes/database.php';
require_once '../../includes/session.php';

header('Content-Type: application/json');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$user_id = $_SESSION['user_id'] ?? 0;
$news_id = isset($_POST['news_id']) ? (int)$_POST['news_id'] : 0;
$token = $_POST['token'] ?? '';

error_log("History Add Request - UserID: $user_id, NewsID: $news_id, Token: $token");

if ($user_id <= 0 && !empty($token)) {
    $checkToken = getOne("SELECT user_id FROM token_login WHERE token = '$token'");
    if ($checkToken) {
        $user_id = $checkToken['user_id'];
        error_log("Found UserID from Token: $user_id");
    }
}

if ($user_id > 0 && $news_id > 0) {
    $checkHistory = getOne("SELECT id FROM history WHERE user_id = $user_id AND news_id = $news_id");
    if ($checkHistory) {
        update('history', ['viewed_at' => date('Y-m-d H:i:s')], "id = " . $checkHistory['id']);
    } else {
        insert('history', [
            'user_id' => $user_id,
            'news_id' => $news_id,
            'viewed_at' => date('Y-m-d H:i:s')
        ]);
    }
    echo json_encode(['status' => 'success', 'message' => 'Lịch sử đã được ghi nhận']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Thiếu thông tin người dùng hoặc bài báo']);
}
?>
