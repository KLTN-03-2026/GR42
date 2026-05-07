<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/database.php';
require_once __DIR__ . '/../../includes/functions.php';

$user_id = 0;
$token = isset($_GET['token']) ? trim($_GET['token']) : '';

if (empty($token)) {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (function_exists('getSession')) {
        $token = getSession('token_login');
    }
    // Lấy thử trực tiếp từ session nếu getSession không có
    if (empty($token) && isset($_SESSION['token_login'])) {
        $token = $_SESSION['token_login'];
    }
}

if (!empty($token)) {
    $checkToken = getOne("SELECT * FROM token_login WHERE token = '$token'");
    if (!empty($checkToken)) {
        $user_id = $checkToken['user_id'];
    }
}

$perPage = 10;
$page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
$offset = ($page - 1) * $perPage;
$keyword = isset($_GET['keyword']) ? trim($_GET['keyword']) : '';
$category = isset($_GET['category']) ? trim($_GET['category']) : '';

$where = " WHERE 1=1 ";
$types = "";
$params = [];
$orderBy = "n.pubdate DESC";
$selectFields = "";

if (!empty($keyword)) {
    $where .= " AND title LIKE ? ";
    $types .= "s";
    $params[] = "%" . $keyword . "%";
}

if (!empty($category)) {
    $where .= " AND category = ? ";
    $types .= "s";
    $params[] = $category;
} else if ($user_id > 0) {
    $interestsRes = getAll("SELECT category_name FROM user_interests WHERE user_id = $user_id");
    if (!empty($interestsRes)) {
        $interests = array_column($interestsRes, 'category_name');
        $safeInterests = array_map(function($val) use ($conn) {
            return "'" . $conn->real_escape_string($val) . "'";
        }, $interests);
        $interestsString = implode(',', $safeInterests);
        
        $selectFields = ", 
            CASE WHEN n.category IN ($interestsString) THEN 1 ELSE 0 END as is_interest,
            ROW_NUMBER() OVER(PARTITION BY CASE WHEN n.category IN ($interestsString) THEN 1 ELSE 0 END ORDER BY n.pubdate DESC) as r_num
        ";
        
        $orderBy = "r_num ASC, is_interest DESC";
    }
}

$sqlCount = "SELECT COUNT(DISTINCT title) as total FROM crawl_news $where";
$stmtCount = $conn->prepare($sqlCount);
if (!empty($params)) {
    $stmtCount->bind_param($types, ...$params);
}
$stmtCount->execute();
$totalResult = $stmtCount->get_result()->fetch_assoc();
$total = $totalResult ? $totalResult['total'] : 0;
$stmtCount->close();

$sql = "SELECT n.*, n.image, n.pubdate as pubDate,
       EXISTS (
           SELECT 1 
           FROM favourite_news f 
           JOIN crawl_news n2 ON f.news_id = n2.id
           WHERE n2.title = n.title AND f.user_id = ?
       ) AS is_favourite
       $selectFields
FROM (
    SELECT MAX(id) as id
    FROM crawl_news
    $where
    GROUP BY title
) as unique_news
JOIN crawl_news n ON n.id = unique_news.id
ORDER BY $orderBy
LIMIT ? OFFSET ?";

$stmt = $conn->prepare($sql);
$typesAll = "i" . $types . "ii";
$paramsAll = [$user_id];
foreach ($params as $p) {
    $paramsAll[] = $p;
}
$paramsAll[] = $perPage;
$paramsAll[] = $offset;

$stmt->bind_param($typesAll, ...$paramsAll);
$stmt->execute();
$result = $stmt->get_result();

$listNews = [];
while ($row = $result->fetch_assoc()) {
    $row['is_favourite'] = (bool) $row['is_favourite'];
    $listNews[] = $row;
}
$stmt->close();
echo json_encode([
    'status' => 'success',
    'data' => $listNews,
    'pagination' => [
        'page' => $page,
        'perPage' => $perPage,
        'total' => $total,
        'totalPages' => ceil($total / $perPage)
    ]
], JSON_UNESCAPED_UNICODE);
