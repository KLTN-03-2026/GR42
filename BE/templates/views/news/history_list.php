<?php global $lang; ?>
<link rel="stylesheet" href="<?= _HOST_URL ?>/templates/assets/css/favourite.css">
<div class="container py-4">
    <div class="favorite-wrapper">
        <h2 class="mb-4"><i class="fa fa-clock-rotate-left text-primary"></i> Lịch sử đọc</h2>
        <div class="mb-3">
            <a href="?module=news&action=list" class="btn btn-secondary">
                Trang chủ
            </a>
        </div>

        <?php if (empty($listHistory)): ?>
        <div class="alert alert-info">Bạn chưa xem bài báo nào.</div>
        <?php else: ?>
        <?php foreach ($listHistory as $item): ?>
        <div class="fav-item" id="history-<?= $item['news_id'] ?>">
            <a href="<?= htmlspecialchars($item['link']) ?>" target="_blank">
                <img src="<?= htmlspecialchars($item['image']) ?>" alt="<?= htmlspecialchars($item['title']) ?>">
            </a>
            <div class="fav-info">
                <h5>
                    <a href="<?= htmlspecialchars($item['link']) ?>" target="_blank">
                        <?= htmlspecialchars($item['title']) ?>
                    </a>
                </h5>
                <div class="meta">Xem lúc: <?= date('d/m/Y H:i', strtotime($item['viewed_at'])) ?></div>
            </div>
        </div>
        <?php endforeach; ?>
        <?php endif; ?>
    </div>
</div>

<style>
.fav-item {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transition: transform 0.2s;
}
.fav-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.fav-item img {
    width: 120px;
    height: 80px;
    object-cover: cover;
    border-radius: 8px;
    margin-right: 20px;
}
.fav-info h5 {
    margin: 0 0 8px 0;
    font-size: 1.1rem;
    font-weight: 600;
}
.fav-info h5 a {
    color: #333;
    text-decoration: none;
}
.fav-info h5 a:hover {
    color: #007bff;
}
.fav-info .meta {
    font-size: 0.85rem;
    color: #666;
}
</style>
