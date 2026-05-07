<?php
layout('admin_header');
layout('admin_sidebar');
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h4 class="fw-bold mb-0">Quản lý thanh toán</h4>
            <p class="text-muted small mb-0">Danh sách các giao dịch chuyển khoản nâng cấp tài khoản VIP.</p>
        </div>
    </div>

    <!-- Data Table Card -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="card-header bg-white border-bottom py-3">
            <h6 class="mb-0 fw-bold"><i class="fa-solid fa-money-bill-transfer me-2 text-success"></i>Lịch sử giao dịch</h6>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light text-muted small text-uppercase">
                        <tr>
                            <th class="ps-4">ID / Mã GD</th>
                            <th>Người dùng</th>
                            <th>Số tiền</th>
                            <th>Nội dung (Content)</th>
                            <th>Cổng TT</th>
                            <th>Thời gian</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody class="border-top-0">
                        <?php if(!empty($transactions)): ?>
                            <?php foreach($transactions as $item): ?>
                                <tr>
                                    <td class="ps-4 text-muted small">
                                        #<?= $item['id'] ?><br>
                                        <small><?= htmlspecialchars($item['referenceCode'] ?? '') ?></small>
                                    </td>
                                    <td>
                                        <h6 class="mb-0 fw-bold"><?= htmlspecialchars($item['fullname'] ?? 'Chưa xác định') ?></h6>
                                        <small class="text-muted"><?= htmlspecialchars($item['email'] ?? '') ?></small>
                                    </td>
                                    <td>
                                        <span class="fw-bold text-success"><?= number_format($item['transferAmount']) ?> VNĐ</span>
                                    </td>
                                    <td class="text-muted small">
                                        <?= htmlspecialchars($item['content']) ?>
                                    </td>
                                    <td>
                                        <span class="badge bg-secondary bg-opacity-10 text-secondary px-2 py-1 rounded-pill"><?= htmlspecialchars($item['gateway'] ?? 'Chưa rõ') ?></span>
                                    </td>
                                    <td class="text-muted small">
                                        <?= date('d/m/Y H:i:s', strtotime($item['transactionDate'])) ?>
                                    </td>
                                    <td>
                                        <?php if($item['status'] == 1): ?>
                                            <span class="badge bg-success bg-opacity-10 text-success px-2 py-1 rounded-pill">Thành công</span>
                                        <?php else: ?>
                                            <span class="badge bg-warning bg-opacity-10 text-warning px-2 py-1 rounded-pill">Đang chờ</span>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="7" class="text-center py-5 text-muted">
                                    <i class="fa-solid fa-money-bills fs-1 text-light mb-3"></i>
                                    <p class="mb-0">Chưa có giao dịch thanh toán nào được ghi nhận.</p>
                                </td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<?php layout('admin_footer'); ?>
