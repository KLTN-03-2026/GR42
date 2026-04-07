<?php
if (!defined('_TAI')) {
    die('Truy cập không hợp lệ');
}

// Lấy thông tin user từ session
$token = getSession('token_login');
$user  = [];

if (!empty($token)) {
    $checkTokenLogin = getOne("SELECT * FROM token_login WHERE token = '" . addslashes($token) . "'");
    if (!empty($checkTokenLogin)) {
        $user_id       = $checkTokenLogin['user_id'];
        $getUserDetail = getOne("SELECT fullname, avatar FROM users WHERE id = $user_id");
        if (!empty($getUserDetail)) {
            $user = $getUserDetail; 
        }
    }
}

if (empty($user)) {
    redirect('?module=auth&action=login');
    exit;
}
?>
<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <title><?= !empty($data['title']) ? htmlspecialchars($data['title']) : 'Trang quản trị' ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="<?= _HOST_URL ?>/templates/assets/css/search.css">
    <link rel="stylesheet" href="<?= _HOST_URL ?>/templates/assets/css/list.css">


    <script src="templates/assets/js/news.js?v=1" defer></script>
    <style>
    .header {
        width: 100%;
        height: 56px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        /* tím – xanh */
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 15px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .user-info img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 2px solid #fff;
    }

    .user-info span {
        font-size: 14px;
        font-weight: 500;
        color: #fff;
    }

    .actions {
        display: flex;
        gap: 10px;
        margin-left: 15px;
    }

    .actions .btn {
        padding: 6px 12px;
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
        text-decoration: none;
        border-radius: 6px;
        font-size: 14px;
        transition: background 0.3s ease;
    }

    .actions .btn:hover {
        background: rgba(255, 255, 255, 0.35);
    }
    </style>
</head>

<body>

    <!-- Header -->
    <div class="header">
        <a href="list.php" class="d-flex align-items-center mb-2 mb-md-0" aria-label="Trang chủ">
            <img src="templates/assets/image/logo_news.jpg" alt="Logo tin tức" class="logo">
        </a>
        <form action="index.php" method="get" class="position-relative mb-2 mb-md-0 flex-grow-1 me-3" role="search">
            <input type="hidden" name="module" value="news">
            <input type="hidden" name="action" value="list">

            <div class="search-wrapper position-relative">
                <input type="text" id="searchBox" name="keyword"
                    value="<?php echo htmlspecialchars($keyword ?? '', ENT_QUOTES, 'UTF-8'); ?>"
                    class="form-control search-input" placeholder="Tìm kiếm tin tức..." autocomplete="off"
                    onkeyup="suggestSearch()" aria-label="Tìm kiếm tin tức">
                <button class="search-btn" type="submit" aria-label="Tìm kiếm">
                    <i class="fa fa-search"></i>
                </button>
                <div id="suggestionBox" role="listbox"></div>
            </div>
        </form>

        <div class="user-info">
            <img src="<?= !empty($user['avatar']) ? htmlspecialchars($user['avatar']) : './templates/uploads/avatar.jpg' ?>"
                alt="User Image">
            <span><?= htmlspecialchars($user['fullname']) ?></span>
        </div>
        <div class="actions">
            <a href="<?= _HOST_URL  ?>/?module=news&action=favourite_list" class="btn">Tin yêu thích</a>
            <a href="<?= _HOST_URL  ?>/?module=users&action=profile" class="btn">Xem hồ sơ</a>
            <a href="<?= _HOST_URL  ?>/?module=auth&action=logout" class="btn">Đăng xuất</a>
        </div>

    </div>


    <div style="padding: 15px;">