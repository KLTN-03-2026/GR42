<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once '../../includes/database.php';

$token = $_GET['token'] ?? '';

if (empty($token)) {
    echo json_encode(['status' => 'error', 'msg' => 'Token không hợp lệ']);
    exit;
}

// Verify admin token
$checkToken = getOne("SELECT user_id FROM token_login WHERE token = '$token'");
if (!$checkToken) {
    echo json_encode(['status' => 'error', 'msg' => 'Phiên làm việc hết hạn']);
    exit;
}

$userId = $checkToken['user_id'];
$user = getOne("SELECT role FROM users WHERE id = '$userId'");

if (!$user || $user['role'] !== 'admin') {
    echo json_encode(['status' => 'error', 'msg' => 'Bạn không có quyền truy cập']);
    exit;
}

// Get statistics
$totalUsers = getOne("SELECT COUNT(*) as count FROM users")['count'];
$totalNews = getOne("SELECT COUNT(*) as count FROM crawl_news")['count'];

// Get category distribution
$categories = getAll("SELECT category, COUNT(*) as count FROM crawl_news GROUP BY category ORDER BY count DESC LIMIT 5");

// Get recent news
$recentNews = getAll("SELECT id, title, category, pubDate, source, image FROM crawl_news ORDER BY id DESC LIMIT 5");

echo json_encode([
    'status' => 'success',
    'data' => [
        'stats' => [
            'total_users' => (int)$totalUsers,
            'total_news' => (int)$totalNews,
        ],
        'categories' => $categories,
        'recent_news' => $recentNews
    ]
]);
