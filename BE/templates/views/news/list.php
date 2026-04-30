<link href="templates/assets/css/chatbot.css" rel="stylesheet">
<link href="templates/assets/css/buttons.css" rel="stylesheet">
<script src="templates/assets/js/news.js?v=1" defer></script>
<script src="templates/assets/js/chatbot.js?v=1" defer></script>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<header class="menu-bar bg-white shadow-sm sticky-top">
    <div class=" container d-flex align-items-center justify-content-between py-2 flex-wrap">
        <nav>
            <ul class="nav nav-pills flex-nowrap overflow-auto mb-0">
                <?php
                $categories = [
                    '' => __('cat_all'),
                    'doi-song' => __('cat_life'),
                    'kinh-doanh' => __('cat_business'),
                    'giao-duc' => __('cat_education'),
                    'the-gioi' => __('cat_world'),
                    'phap-luat' => __('cat_law'),
                    'thoi-su' => __('cat_news'),
                    'giai-tri' => __('cat_entertainment'),
                    'suc-khoe' => __('cat_health'),
                    'cong-nghe' => __('cat_tech'),
                    'the-thao' => __('cat_sports')
                ];
                foreach ($categories as $key => $name):
                    $active = $category == $key ? 'active' : '';
                    ?>
                <li class="nav-item">
                    <a class="nav-link <?= $active ?>"
                        href="?<?= http_build_query(array_merge($_GET, ['category' => $key])) ?>">
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
                <div class="top-news" id="topNews"></div>
            </section>
        </div>
        <aside class="home-top__side">
            <h3 class="side-title"><?= __('hot_news_today') ?></h3>
            <div class="side-news" id="hotNewsSide">
            </div>
        </aside>
    </section>
    <section class="home-news">
        <div class="home-news__header">
            <h2><?= __('latest_news') ?></h2>
        </div>
        <div id="newsList" class="home-news__list grid-view" aria-label="Danh sách tin chính"></div>
        <div id="loading" class="text-center py-3 text-muted"><?= __('loading') ?></div>
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
                <span><?= __('ai_chat') ?></span>
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
            <input type="text" id="chat-input" placeholder="<?= __('type_message') ?>" aria-label="<?= __('type_message') ?>">
            <button id="send-btn" aria-label="Gửi tin nhắn"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
    </div>
</div>