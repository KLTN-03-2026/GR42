<?php
require_once __DIR__ . '/cors.php';
if (!defined('_TAI')) {
    define('_TAI', true);
}
if (!defined('_HOST')) {
    require_once __DIR__ . '/../../config.php';
    require_once __DIR__ . '/../../includes/database.php';
}

query("CREATE TABLE IF NOT EXISTS `article_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `news_id` int NOT NULL,
  `reason` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `details` text COLLATE utf8mb3_unicode_ci,
  `status` tinyint DEFAULT '0' COMMENT '0: pending, 1: processed',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;");

query("CREATE TABLE IF NOT EXISTS `comment_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `comment_id` int NOT NULL,
  `reason` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `details` text COLLATE utf8mb3_unicode_ci,
  `status` tinyint DEFAULT '0' COMMENT '0: pending, 1: processed',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;");

$method = $_SERVER['REQUEST_METHOD'];
$inputData = json_decode(file_get_contents('php://input'), true);
$token = trim($_GET['token'] ?? ($inputData['token'] ?? ''));
$user_id = 0;
if (!empty($token)) {
    $checkToken = getOne("SELECT user_id FROM token_login WHERE token = '$token'");
    if ($checkToken) {
        $user_id = (int)$checkToken['user_id'];
    }
}

if ($user_id <= 0 && !empty($_SESSION['user_id'])) {
    $user_id = (int)$_SESSION['user_id'];
}

if ($user_id <= 0) {
    die(json_encode(['status' => 'error', 'message' => 'Bạn cần đăng nhập để thực hiện hành động này']));
}

if ($method === 'POST') {
    $news_id = (int)($inputData['news_id'] ?? 0);
    $comment_id = (int)($inputData['comment_id'] ?? 0);
    $reason = trim($inputData['reason'] ?? '');
    $details = trim($inputData['details'] ?? '');

    if (empty($reason)) {
        die(json_encode(['status' => 'error', 'message' => 'Dữ liệu không hợp lệ: Thiếu lý do']));
    }

    if ($comment_id > 0) {
        // Báo cáo bình luận
        $res = insert('comment_reports', [
            'user_id' => $user_id,
            'comment_id' => $comment_id,
            'reason' => $reason,
            'details' => $details,
            'status' => 0,
            'created_at' => date('Y-m-d H:i:s')
        ]);
    } else if ($news_id > 0) {
        // Báo cáo bài báo
        $res = insert('article_reports', [
            'user_id' => $user_id,
            'news_id' => $news_id,
            'reason' => $reason,
            'details' => $details,
            'status' => 0,
            'created_at' => date('Y-m-d H:i:s')
        ]);
    } else {
        die(json_encode(['status' => 'error', 'message' => 'Dữ liệu không hợp lệ: Thiếu ID đối tượng báo cáo']));
    }

    if ($res) {
        echo json_encode(['status' => 'success', 'message' => 'Báo cáo của bạn đã được gửi. Chúng tôi sẽ xử lý trong thời gian sớm nhất.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Lỗi gửi báo cáo']);
    }
}
?>
