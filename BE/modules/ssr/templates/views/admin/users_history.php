<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h4 class="fw-bold mb-0">Lịch sử đọc: <?= htmlspecialchars($user['fullname']) ?></h4>
            <p class="text-muted small mb-0">Danh sách các bài báo mà người dùng này đã xem.</p>
        </div>
        <a href="?module=ssr/admin&action=users" class="btn btn-secondary shadow-sm rounded-pill px-4">
            <i class="fa-solid fa-arrow-left me-2"></i>Quay lại
        </a>
    </div>

    <!-- Data Table Card -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="card-header bg-white border-bottom py-3">
            <h6 class="mb-0 fw-bold"><i class="fa-solid fa-clock-rotate-left me-2 text-info"></i>Lịch sử bài báo đã xem</h6>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light text-muted small text-uppercase">
                        <tr>
                            <th class="ps-4">Thời gian xem</th>
                            <th>Bài báo</th>
                            <th>Chuyên mục</th>
                            <th>Nguồn</th>
                        </tr>
                    </thead>
                    <tbody class="border-top-0">
                        <?php if(!empty($history)): ?>
                            <?php foreach($history as $item): ?>
                                <tr>
                                    <td class="ps-4 text-muted small">
                                        <?= date('d/m/Y H:i:s', strtotime($item['viewed_at'])) ?>
                                    </td>
                                    <td>
                                        <h6 class="mb-0 fw-bold"><?= htmlspecialchars($item['title']) ?></h6>
                                        <small class="text-muted">ID bài báo: #<?= $item['news_id'] ?></small>
                                    </td>
                                    <td>
                                        <span class="badge bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-pill"><?= htmlspecialchars($item['category'] ?? 'Chưa rõ') ?></span>
                                    </td>
                                    <td class="text-muted small">
                                        <?= htmlspecialchars($item['source']) ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="4" class="text-center py-5 text-muted">
                                    <i class="fa-solid fa-clock fs-1 text-light mb-3"></i>
                                    <p class="mb-0">Người dùng này chưa có lịch sử đọc bài</p>
                                </td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
