<?php
layout('admin_header');
layout('admin_sidebar');
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h4 class="fw-bold mb-0">Chỉnh sửa Người Dùng</h4>
            <p class="text-muted small mb-0">Thay đổi thông tin hồ sơ, vai trò, mật khẩu của thành viên.</p>
        </div>
        <a href="?module=admin&action=users" class="btn btn-light shadow-sm rounded-pill px-4">
            <i class="fa-solid fa-arrow-left me-2"></i>Trở về danh sách
        </a>
    </div>

    <?php if(!empty($msg)): ?>
        <div class="alert alert-<?= $msgType ?> alert-dismissible fade show rounded-4" role="alert">
            <?php if($msgType == 'success'): ?>
                <i class="fa-solid fa-circle-check me-2"></i>
            <?php else: ?>
                <i class="fa-solid fa-triangle-exclamation me-2"></i>
            <?php endif; ?>
            <?= htmlspecialchars($msg) ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    <?php endif; ?>

    <form action="" method="POST">
        <div class="row">
            <div class="col-12 col-xl-8">
                <!-- Thông tin cá nhân -->
                <div class="card border-0 shadow-sm rounded-4 mb-4">
                    <div class="card-header bg-white border-bottom py-3">
                        <h6 class="mb-0 fw-bold text-primary"><i class="fa-solid fa-id-card me-2"></i>Thông tin tài khoản</h6>
                    </div>
                    <div class="card-body p-4">
                        <div class="row g-3 mb-3">
                            <div class="col-md-6">
                                <label class="form-label fw-bold small text-muted">Họ và Tên</label>
                                <input type="text" class="form-control" value="<?= htmlspecialchars($editUser['fullname'] ?? '') ?>" disabled>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold small text-muted">Địa chỉ Email</label>
                                <input type="email" class="form-control" value="<?= htmlspecialchars($editUser['email'] ?? '') ?>" disabled>
                            </div>
                        </div>

                        <?php if(array_key_exists('phone', $editUser)): ?>
                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">Số điện thoại</label>
                            <input type="text" class="form-control" value="<?= htmlspecialchars($editUser['phone'] ?? '') ?>" disabled>
                        </div>
                        <?php endif; ?>

                        <?php if(array_key_exists('address', $editUser)): ?>
                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">Địa chỉ</label>
                            <input type="text" class="form-control" value="<?= htmlspecialchars($editUser['address'] ?? '') ?>" disabled>
                        </div>
                        <?php endif; ?>

                        <!-- Password change has been disabled -->
                </div>
            </div>

            <div class="col-12 col-xl-4">
                <!-- Phân Quyền & Hệ thống -->
                <div class="card border-0 shadow-sm rounded-4 mb-4">
                    <div class="card-header bg-white border-bottom py-3">
                        <h6 class="mb-0 fw-bold"><i class="fa-solid fa-gear me-2 text-secondary"></i>Thiết lập</h6>
                    </div>
                    <div class="card-body p-4 text-center">
                        <div class="mb-4">
                            <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow" style="width: 80px; height: 80px; font-size: 2rem; font-weight: bold;">
                                <?= strtoupper(substr($editUser['fullname'] ?? 'U', 0, 1)) ?>
                            </div>
                            <h5 class="fw-bold mb-1"><?= htmlspecialchars($editUser['fullname'] ?? 'Chưa cập nhật') ?></h5>
                            <span class="badge bg-light text-dark border">#ID: <?= $editUser['id'] ?? '?' ?></span>
                        </div>

                        <?php if(array_key_exists('role', $editUser)): ?>
                            <div class="mb-3 text-start">
                                <label class="form-label fw-bold small text-muted">Vai trò / Phân quyền</label>
                                <select class="form-select" name="role" <?= ((int)$editUser['id'] === (int)$_SESSION['user_id']) ? 'disabled' : '' ?>>
                                    <option value="admin" <?= (isset($editUser['role']) && $editUser['role'] === 'admin') ? 'selected' : '' ?>>Quản trị viên (Admin)</option>
                                    <option value="user" <?= (!isset($editUser['role']) || $editUser['role'] !== 'admin') ? 'selected' : '' ?>>Thành viên (User)</option>
                                </select>
                                <?php if((int)$editUser['id'] === (int)$_SESSION['user_id']): ?>
                                    <small class="text-danger mt-1 d-block"><i class="fa-solid fa-circle-exclamation me-1"></i>Không thể tự đổi quyền của bản thân.</small>
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>

                        <?php if(array_key_exists('status', $editUser)): ?>
                            <div class="mb-3 text-start mt-3">
                                <label class="form-label fw-bold small text-muted">Trạng thái Tài khoản</label>
                                <select class="form-select" disabled>
                                    <option value="1" <?= (isset($editUser['status']) && $editUser['status'] == 1) ? 'selected' : '' ?>>Đang hoạt động</option>
                                    <option value="0" <?= (isset($editUser['status']) && $editUser['status'] == 0) ? 'selected' : '' ?>>Tạm khoá (Banned)</option>
                                </select>
                            </div>
                        <?php endif; ?>
                        
                        <div class="mb-3 text-start mt-4">
                            <button type="submit" class="btn btn-primary w-100 rounded-pill shadow-sm fw-bold">
                                <i class="fa-solid fa-floppy-disk me-2"></i>Lưu Phân Quyền
                            </button>
                        </div>

                        <div class="border-top pt-3 mt-4 text-start">
                            <small class="text-muted d-block mb-1">
                                <i class="fa-regular fa-calendar-plus me-1"></i> Ngày tạo: 
                                <strong><?= isset($editUser['created_at']) ? date('d/m/Y H:i', strtotime($editUser['created_at'])) : '---' ?></strong>
                            </small>
                            <small class="text-muted d-block">
                                <i class="fa-solid fa-clock-rotate-left me-1"></i> Lần sửa cuối: 
                                <strong><?= isset($editUser['updated_at']) ? date('d/m/Y H:i', strtotime($editUser['updated_at'])) : 'Vừa xong' ?></strong>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>

<?php layout('admin_footer'); ?>
