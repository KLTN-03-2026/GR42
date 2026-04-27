<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../../includes/database.php';

$token = $_GET['token'] ?? '';

if (empty($token)) {
    echo json_encode(['status' => 'error', 'msg' => 'Token không hợp lệ']);
    exit;
}

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

$totalUsers = getOne("SELECT COUNT(*) as count FROM users")['count'];
$totalNews = getOne("SELECT COUNT(*) as count FROM crawl_news")['count'];
$totalComments = getOne("SELECT COUNT(*) as count FROM comments")['count'];
$todayNews = getOne("SELECT COUNT(*) as count FROM crawl_news WHERE DATE(savedtime) = CURDATE()")['count'];
$todayComments = getOne("SELECT COUNT(*) as count FROM comments WHERE DATE(created_at) = CURDATE()")['count'];

$categories = getAll("SELECT category, COUNT(*) as count FROM crawl_news GROUP BY category ORDER BY count DESC LIMIT 5");

$recentNews = getAll("SELECT id, title, category, pubDate, source, image FROM crawl_news ORDER BY id DESC LIMIT 5");

$recentActivity = getAll("
    (SELECT 'user' as type, fullname as title, created_at as date, email as subtitle FROM users ORDER BY created_at DESC LIMIT 3)
    UNION ALL
    (SELECT 'comment' as type, content as title, created_at as date, (SELECT title FROM crawl_news WHERE id = news_id) as subtitle FROM comments ORDER BY created_at DESC LIMIT 3)
    ORDER BY date DESC LIMIT 5
");

$weeklyNews = getAll("
    SELECT DATE(savedtime) as date, COUNT(*) as count 
    FROM crawl_news 
    WHERE savedtime >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
    GROUP BY DATE(savedtime)
    ORDER BY date ASC
");

echo json_encode([
    'status' => 'success',
    'data' => [
        'stats' => [
            'total_users' => (int)$totalUsers,
            'total_news' => (int)$totalNews,
            'total_comments' => (int)$totalComments,
            'today_news' => (int)$todayNews,
            'today_comments' => (int)$todayComments,
            'today_visits' => 4521 
        ],
        'categories' => $categories,
        'recent_news' => $recentNews,
        'recent_activity' => $recentActivity,
        'weekly_news' => $weeklyNews
    ]
]);
