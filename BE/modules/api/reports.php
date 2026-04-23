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

$method = $_SERVER['REQUEST_METHOD'];
$inputData = json_decode(file_get_contents('php://input'), true);
$token = trim($_GET['token'] ?? ($inputData['token'] ?? ''));

if (empty($token)) {
    die(json_encode(['status' => 'error', 'message' => 'Thiếu token xác thực']));
}

$checkToken = getOne("SELECT user_id FROM token_login WHERE token = '$token'");
if (!$checkToken) {
    die(json_encode(['status' => 'error', 'message' => 'Token không hợp lệ']));
}
$user_id = (int)$checkToken['user_id'];

if ($method === 'POST') {
    $news_id = (int)($inputData['news_id'] ?? 0);
    $reason = trim($inputData['reason'] ?? '');
    $details = trim($inputData['details'] ?? '');

    if ($news_id <= 0 || empty($reason)) {
        die(json_encode(['status' => 'error', 'message' => 'Dữ liệu không hợp lệ']));
    }

    $res = insert('article_reports', [
        'user_id' => $user_id,
        'news_id' => $news_id,
        'reason' => $reason,
        'details' => $details,
        'status' => 0,
        'created_at' => date('Y-m-d H:i:s')
    ]);

    if ($res) {
        echo json_encode(['status' => 'success', 'message' => 'Báo cáo của bạn đã được gửi. Chúng tôi sẽ ẩn bài báo này đối với bạn và xử lý trong thời gian sớm nhất.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Lỗi gửi báo cáo']);
    }
}
?>
