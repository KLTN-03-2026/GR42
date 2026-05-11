<?php
layout('admin_header');
layout('admin_sidebar');

?>

<div class="container-fluid">
    <div class="row mb-4">
        <div class="col-12">
            <div class="card bg-primary text-white" style="border-radius: 15px; background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);">
                <div class="card-body p-4">
                    <h3 class="fw-bold mb-1">Xin chào, <?= isset($admin_name) ? $admin_name : 'Quản trị viên' ?>! 👋</h3>
                    <p class="mb-0 text-white-50">Chào mừng bạn quay trở lại. Chúc bạn một ngày làm việc hiệu quả.</p>
                </div>
            </div>
        </div>
    </div>

    <div class="row g-4 mb-4">
        <div class="col-12 col-sm-6 col-xl-3">
            <div class="stat-card bg-gradient-primary h-100 shadow-sm border-0">
                <div class="stat-card-title">Tổng Người Dùng</div>
                <div class="stat-card-value"><?= number_format($stats['total_users']) ?></div>
                <i class="fa-solid fa-users stat-card-icon"></i>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
            <div class="stat-card bg-gradient-success h-100 shadow-sm border-0">
                <div class="stat-card-title">Tổng Bài Báo</div>
                <div class="stat-card-value"><?= number_format($stats['total_news']) ?></div>
                <i class="fa-solid fa-newspaper stat-card-icon"></i>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
            <div class="stat-card bg-gradient-warning h-100 shadow-sm border-0">
                <div class="stat-card-title">Tổng Bình Luận</div>
                <div class="stat-card-value"><?= number_format($stats['total_comments']) ?></div>
                <i class="fa-solid fa-comments stat-card-icon"></i>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-xl-3">
            <div class="stat-card bg-gradient-danger h-100 shadow-sm border-0">
                <div class="stat-card-title">Lượt Truy Cập Hôm Nay</div>
                <div class="stat-card-value"><?= number_format($stats['today_visits']) ?></div>
                <i class="fa-solid fa-chart-line stat-card-icon"></i>
            </div>
        </div>
    </div>
    <div class="row g-4">
        <div class="col-12 col-lg-8">
            <div class="card h-100 shadow-sm border-0">
                <div class="card-header bg-white d-flex align-items-center justify-content-between">
                    <h6 class="mb-0 text-primary fw-bold"><i class="fa-solid fa-bolt me-2"></i>Hoạt Động Gần Đây</h6>
                    <button class="btn btn-sm btn-outline-primary">Xem tất cả</button>
                </div>
                <div class="card-body p-0">
                    <div class="list-group list-group-flush">
                        <?php if (!empty($recent_activity)): ?>
                            <?php foreach ($recent_activity as $activity): ?>
                                <div class="list-group-item px-4 py-3 border-bottom-0">
                                    <div class="d-flex align-items-start">
                                        <div class="bg-<?= $activity['type'] === 'user' ? 'primary' : 'success' ?> text-white rounded-circle p-2 me-3" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                                            <i class="fa-solid fa-<?= $activity['type'] === 'user' ? 'user-plus' : 'comment' ?>"></i>
                                        </div>
                                        <div class="flex-grow-1">
                                            <h6 class="mb-1 fw-bold">
                                                <?= $activity['type'] === 'user' ? 'Người dùng mới đăng ký' : 'Bình luận mới' ?>
                                            </h6>
                                            <p class="mb-1 text-muted small">
                                                <?php if ($activity['type'] === 'user'): ?>
                                                    Tài khoản <span class="text-dark fw-bold"><?= $activity['title'] ?></span> (<?= $activity['subtitle'] ?>) vừa gia nhập.
                                                <?php else: ?>
                                                    "<span class="text-dark fw-bold"><?= mb_strimwidth($activity['title'], 0, 50, '...') ?></span>" tại bài viết <i><?= $activity['subtitle'] ?></i>
                                                <?php endif; ?>
                                            </p>
                                            <small class="text-muted"><i class="fa-regular fa-clock me-1"></i><?= date('d/m/Y, H:i', strtotime($activity['date'])) ?></small>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <div class="p-4 text-center text-muted">Chưa có hoạt động nào.</div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-12 col-lg-4">
            <div class="card h-100 shadow-sm border-0">
                <div class="card-header bg-white">
                    <h6 class="mb-0 text-primary fw-bold"><i class="fa-solid fa-rocket me-2"></i>Thao Tác Nhanh</h6>
                </div>
                <div class="card-body">
                    <div class="d-grid gap-3">
                        <a href="?module=ssr/admin&action=news_add" class="btn btn-primary text-start px-4 py-3 d-flex justify-content-between align-items-center rounded-3">
                            <span class="fw-bold"><i class="fa-solid fa-plus me-2"></i>Thêm Bài Báo Mới</span>
                            <i class="fa-solid fa-chevron-right opacity-50"></i>
                        </a>
                        <a href="?module=ssr/admin&action=users_add" class="btn btn-outline-primary text-start px-4 py-3 d-flex justify-content-between align-items-center rounded-3">
                            <span class="fw-bold"><i class="fa-solid fa-user-plus me-2"></i>Thêm Người Dùng</span>
                            <i class="fa-solid fa-chevron-right opacity-50"></i>
                        </a>
                        <a href="?module=ssr/admin&action=comments" class="btn btn-outline-warning text-start px-4 py-3 d-flex justify-content-between align-items-center rounded-3">
                            <span class="fw-bold"><i class="fa-solid fa-comments me-2"></i>Duyệt Bình Luận <span class="badge bg-danger ms-2 rounded-pill">12</span></span>
                            <i class="fa-solid fa-chevron-right opacity-50"></i>
                        </a>
                        <a href="#" onclick="runCrawl(event)" class="btn btn-outline-success text-start px-4 py-3 d-flex justify-content-between align-items-center rounded-3">
                            <span class="fw-bold"><i class="fa-solid fa-spider me-2"></i>Chạy Thu Thập Dữ Liệu</span>
                            <i class="fa-solid fa-chevron-right opacity-50"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function runCrawl(e) {
    e.preventDefault();
    if(confirm('Bạn có chắc chắn muốn tiến hành thu thập dữ liệu mới? (Quá trình này sẽ mất một chút thời gian)')) {
        const btn = e.currentTarget;
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<span class="fw-bold"><i class="fa-solid fa-spinner fa-spin me-2"></i>Đang chạy...</span><i class="fa-solid fa-chevron-right opacity-50"></i>';
        btn.classList.add('disabled');

        fetch('?module=api/tools&action=crawl_database')
            .then(res => res.json())
            .then(data => {
                if(data.status === 'success') {
                    alert('Thành công! Đã thêm: ' + data.new + ' - Cập nhật: ' + data.updated + ' bài báo.');
                    window.location.reload();
                } else {
                    alert('Lỗi: ' + (data.message || 'Thất bại'));
                }
            })
            .catch(err => {
                console.error(err);
                alert('Lỗi kết nối máy chủ!');
            })
            .finally(() => {
                btn.innerHTML = originalHtml;
                btn.classList.remove('disabled');
            });
    }
}
</script>

<?php layout('admin_footer'); ?>
