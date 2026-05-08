<?php
layout('admin_header');
layout('admin_sidebar');
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h4 class="fw-bold mb-0">Thêm Người Dùng Mới</h4>
            <p class="text-muted small mb-0">Tạo tài khoản thành viên hoặc quản trị viên mới cho hệ thống.</p>
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
            <?php if($msgType == 'success'): ?>
            <a href="?module=admin&action=users" class="btn btn-sm btn-success ms-3 rounded-pill">Quay lại danh sách</a>
            <?php endif; ?>
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
                                <label class="form-label fw-bold small text-muted">Họ và Tên <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" name="fullname" value="<?= htmlspecialchars($_POST['fullname'] ?? '') ?>" required placeholder="VD: Nguyễn Văn A">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold small text-muted">Địa chỉ Email <span class="text-danger">*</span></label>
                                <input type="email" class="form-control" name="email" value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" required placeholder="VD: email@example.com">
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">Mật khẩu <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <input type="password" class="form-control" name="password" required placeholder="Nhập mật khẩu (ít nhất 6 ký tự)">
                                <button class="btn btn-outline-secondary" type="button" onclick="const p=document.getElementsByName('password')[0]; p.type=p.type==='password'?'text':'password';"><i class="fa-regular fa-eye"></i></button>
                            </div>
                        </div>
                        
                    </div>
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
                            <div class="bg-light text-secondary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 border border-2 border-dashed" style="width: 80px; height: 80px; font-size: 2rem;">
                                <i class="fa-solid fa-user-plus"></i>
                            </div>
                            <h5 class="fw-bold mb-1 text-muted">Tài khoản mới</h5>
                        </div>

                        <div class="mb-3 text-start">
                            <label class="form-label fw-bold small text-muted">Vai trò / Phân quyền <span class="text-danger">*</span></label>
                            <select class="form-select" name="role">
                                <option value="user" <?= (isset($_POST['role']) && $_POST['role'] === 'user') ? 'selected' : '' ?>>Thành viên (User)</option>
                                <option value="admin" <?= (isset($_POST['role']) && $_POST['role'] === 'admin') ? 'selected' : '' ?>>Quản trị viên (Admin)</option>
                            </select>
                        </div>

                        <div class="mb-3 text-start mt-3">
                            <label class="form-label fw-bold small text-muted">Trạng thái Tài khoản</label>
                            <select class="form-select" name="status">
                                <option value="1" <?= (isset($_POST['status']) && $_POST['status'] == 1) ? 'selected' : 'selected' ?>>Đang hoạt động</option>
                                <option value="0" <?= (isset($_POST['status']) && $_POST['status'] == 0 && isset($_POST['status'])) ? 'selected' : '' ?>>Tạm khoá (Banned)</option>
                            </select>
                        </div>
                        
                        <div class="mt-4 pt-3 border-top">
                            <button type="submit" class="btn btn-primary w-100 rounded-pill shadow-sm fw-bold py-2">
                                <i class="fa-solid fa-plus me-2"></i>Tạo Người Dùng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>

<?php layout('admin_footer'); ?>
