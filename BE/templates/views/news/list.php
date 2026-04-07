<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($data['title']) ?></title>
    <meta name="description"
        content="Trang tin tức cập nhật mới nhất về đời sống, kinh doanh, giáo dục, thế giới, pháp luật, thời sự, giải trí và sức khỏe.">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
    <link href="templates/assets/css/list.css" rel="stylesheet">
    <link href="templates/assets/css/chatbot.css" rel="stylesheet">
    <link href="templates/assets/css/search.css" rel="stylesheet">
    <link href="templates/assets/css/buttons.css" rel="stylesheet">
    <script src="templates/assets/js/news.js?v=1" defer></script>
    <script src="templates/assets/js/chatbot.js?v=1" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</head>

<body>
    <header class="menu-bar bg-white shadow-sm sticky-top">
        <div class=" container d-flex align-items-center justify-content-between py-2 flex-wrap">
            <nav>
                <ul class="nav nav-pills flex-nowrap overflow-auto mb-0">
                    <?php
                    $categories = [
                        '' => 'Tất cả',
                        'doi-song' => 'Đời Sống',
                        'kinh-doanh' => 'Kinh Doanh',
                        'giao-duc' => 'Giáo Dục',
                        'the-gioi' => 'Thế Giới',
                        'phap-luat' => 'Pháp Luật',
                        'thoi-su' => 'Thời Sự',
                        'giai-tri' => 'Giải Trí',
                        'suc-khoe' => 'Sức Khỏe',
                        'cong-nghe' => 'Công Nghệ',
                        'the-thao' => 'Thể Thao'
                    ];
                    foreach ($categories as $key => $name):
                        $active = $category == $key ? 'active' : '';
                        ?>
                    <li class="nav-item">
                        <a class="nav-link <?= $active ?>"
                            href="index.php?module=news&action=list&category=<?= $key ?>">
                            <?= htmlspecialchars($name) ?>
                        </a>
                    </li>
                    <?php endforeach; ?>
                </ul>
            </nav>
        </div>
    </header>

    <main class="container py-4">
        <section class="home-top">
            <div class="home-top__main">
                <section class="hero-wrapper" aria-label="Tin nổi bật">
                    <!-- JS render hero vào đây -->
                    <div class="top-news" id="topNews"></div>
                </section>
            </div>
            <aside class="home-top__side">
                <h3 class="side-title">Nổi bật hôm nay</h3>
                <div class="side-news" id="hotNewsSide">
                </div>
            </aside>
        </section>
        <section class="home-news">
            <div class="home-news__header">
                <h2>Tin mới nhất</h2>
            </div>
            <div id="newsList" class="home-news__list grid-view" aria-label="Danh sách tin chính"></div>
            <div id="loading" class="text-center py-3 text-muted">Đang tải...</div>
        </section>
    </main>

    <div id="chatbot-container" aria-label="Chatbot AI">
        <div id="chat-bubble" class="chat-bubble" role="button" aria-label="Mở chatbot">
            <i class="fa-solid fa-comment-dots"></i>
        </div>
        <div id="chat-window" class="chat-window" role="dialog" aria-modal="true" aria-label="Hội thoại AI">
            <div class="chat-header">
                <div class="title d-flex align-items-center">
                    <div class="bot-avatar"><i class="fa-solid fa-robot"></i></div>
                    <span>Hỏi đáp AI</span>
                </div>
                <div class="actions">
                    <button id="clear-chat" class="clear-btn" title="Xóa lịch sử" aria-label="Xóa lịch sử">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <button id="close-chat" class="close-btn" title="Đóng hội thoại" aria-label="Đóng hội thoại">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
            <div id="chat-box" class="chat-box" aria-live="polite" aria-relevant="additions"></div>
            <div class="chat-input">
                <input type="text" id="chat-input" placeholder="Nhập tin nhắn..." aria-label="Nhập tin nhắn">
                <button id="send-btn" aria-label="Gửi tin nhắn"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>
    </div>

</body>

</html>
