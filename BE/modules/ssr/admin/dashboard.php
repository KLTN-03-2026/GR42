<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    header("Location: ?module=ssr/admin&action=loginqtv");
    exit;
}

$admin_name = isset($_SESSION['user_name']) ? $_SESSION['user_name'] : 'Admin';

$totalUsers = getOne("SELECT COUNT(*) as count FROM users")['count'];
$totalNews = getOne("SELECT COUNT(*) as count FROM crawl_news")['count'];
$totalComments = getOne("SELECT COUNT(*) as count FROM comments")['count'];
$todayVisits = getOne("SELECT COUNT(DISTINCT user_id) as count FROM token_login WHERE DATE(created_at) = CURDATE()")['count'];

$recentActivity = getAll("
    (SELECT 'user' as type, fullname as title, created_at as date, email as subtitle FROM users ORDER BY created_at DESC LIMIT 5)
    UNION ALL
    (SELECT 'comment' as type, content as title, created_at as date, (SELECT title FROM crawl_news WHERE id = news_id) as subtitle FROM comments ORDER BY created_at DESC LIMIT 5)
    ORDER BY date DESC LIMIT 8
");

renderView('admin/dashboard', [
    'admin_name' => $admin_name,
    'stats' => [
        'total_users' => $totalUsers,
        'total_news' => $totalNews,
        'total_comments' => $totalComments,
        'today_visits' => $todayVisits
    ],
    'recent_activity' => $recentActivity
]);