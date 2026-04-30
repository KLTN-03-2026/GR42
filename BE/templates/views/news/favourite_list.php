<?php global $lang; ?>
<link rel="stylesheet" href="<?= _HOST_URL ?>/templates/assets/css/favourite.css">
<div class="container py-4">
    <div class="favorite-wrapper">
        <h2 class="mb-4"><i class="fa fa-heart text-danger"></i> <?= __('favorite_news') ?></h2>
        <div class="mb-3">
            <a href="?module=news&action=list" class="btn btn-secondary">
                <?= __('home') ?>
            </a>
        </div>

        <?php if (empty($listFav)): ?>
        <div class="alert alert-info"><?= __('no_favorites_msg') ?></div>
        <?php else: ?>
        <?php foreach ($listFav as $item): ?>
        <div class="fav-item" id="fav-<?= $item['news_id'] ?>">
            <a href="<?= htmlspecialchars($item['link']) ?>" target="_blank">
                <img src="<?= htmlspecialchars($item['image']) ?>" alt="<?= htmlspecialchars($item['title']) ?>">
            </a>
            <div class="fav-info">
                <h5>
                    <a href="<?= htmlspecialchars($item['link']) ?>" target="_blank">
                        <?= htmlspecialchars($item['title']) ?>
                    </a>
                </h5>
                <div class="meta"><?= __('saved_at') ?>: <?= date('d/m/Y H:i', strtotime($item['created_at'])) ?></div>
            </div>
            <button class="remove-btn" onclick="removeFav(<?= $item['news_id'] ?>)">
                <i class="fa fa-trash"></i>
            </button>
        </div>
        <?php endforeach; ?>
        <?php endif; ?>
    </div>
</div>

<script>
async function removeFav(news_id) {
    if (!confirm("Bạn có chắc muốn xóa tin này khỏi yêu thích?")) return;

    const formData = new FormData();
    formData.append("news_id", news_id);

    try {
        const res = await fetch("modules/api/favourite_remove.php", {
            method: "POST",
            body: formData
        });
        const data = await res.json();

        if (data.status === "success") {
            const item = document.getElementById("fav-" + news_id);
            if (item) {
                item.classList.add("fade-out");
                setTimeout(() => {
                    item.remove();
                    if (document.querySelectorAll(".fav-item").length === 0) {
                        document.querySelector(".container").insertAdjacentHTML(
                            "beforeend",
                            '<div class="alert alert-info"><?= __('no_favorites_msg') ?></div>'
                        );
                    }
                }, 300);
            }
        } else {
            alert(data.message || "Có lỗi xảy ra");
        }
    } catch (err) {
        console.error("Lỗi:", err);
    }
}
</script>
