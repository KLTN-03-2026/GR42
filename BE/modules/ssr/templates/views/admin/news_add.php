<?php
layout('admin_header');
layout('admin_sidebar');
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h4 class="fw-bold mb-0">Thêm Bài Báo Mới</h4>
            <p class="text-muted small mb-0">Viết bài mới, thêm hình ảnh hoặc chọn chuyên mục.</p>
        </div>
        <a href="?module=admin&action=news" class="btn btn-light shadow-sm rounded-pill px-4">
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
        <a href="?module=admin&action=news" class="btn btn-sm btn-success ms-3 rounded-pill">Quay lại danh sách</a>
        <?php endif; ?>
    </div>
    <?php endif; ?>

    <form action="" method="POST">
        <div class="row">
            <div class="col-12 col-xl-8">
                <div class="card border-0 shadow-sm rounded-4 mb-4">
                    <div class="card-header bg-white border-bottom py-3">
                        <h6 class="mb-0 fw-bold text-primary"><i class="fa-solid fa-pen-to-square me-2"></i>Nội dung bài viết</h6>
                    </div>
                    <div class="card-body p-4">
                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">Tiêu đề<span class="text-danger">*</span></label>
                            <input type="text" class="form-control form-control-lg" name="title"
                                value="<?= htmlspecialchars($_POST['title'] ?? '') ?>" required
                                placeholder="Nhập tiêu đề bài báo...">
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">Mô tả</label>
                            <textarea class="form-control" name="description" rows="3"
                                placeholder="Tóm tắt ngắn gọn bài báo..."><?= htmlspecialchars($_POST['description'] ?? '') ?></textarea>
                        </div>

                        <div class="mb-4">
                            <label class="form-label fw-bold small text-muted">Nội dung chi tiết</label>
                            <textarea id="editor" class="form-control" name="content" rows="12"
                                placeholder="Nhập nội dung đầy đủ..."><?= htmlspecialchars($_POST['content'] ?? '') ?></textarea>
                        </div>

                        <hr class="my-4">
                        <div class="d-flex justify-content-end">
                            <button type="submit" class="btn btn-primary px-5 rounded-pill shadow-sm fw-bold">
                                <i class="fa-solid fa-plus me-2"></i>Đăng Bài Viết
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 col-xl-4">
                <!-- Sidebar Form Info -->
                <div class="card border-0 shadow-sm rounded-4 mb-4">
                    <div class="card-header bg-white border-bottom py-3">
                        <h6 class="mb-0 fw-bold"><i class="fa-solid fa-gear me-2 text-secondary"></i>Thuộc tính</h6>
                    </div>
                    <div class="card-body p-4">
                        <div class="mb-4 text-center">
                            <label class="form-label fw-bold small text-muted d-block text-start">Ảnh bìa</label>
                            <input type="text" class="form-control form-control-sm" name="thumbnail"
                                value="<?= htmlspecialchars($_POST['thumbnail'] ?? '') ?>" placeholder="https://...">
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">Chuyên mục</label>
                            <select class="form-select" name="category">
                                <option value="">--- Chọn chuyên mục ---</option>
                                <?php if(!empty($categories)): ?>
                                <?php foreach($categories as $catName): ?>
                                <option value="<?= htmlspecialchars($catName) ?>" <?= (isset($_POST['category']) && $_POST['category'] === $catName) ? 'selected' : '' ?>>
                                    <?= htmlspecialchars($catName) ?>
                                </option>
                                <?php endforeach; ?>
                                <?php endif; ?>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>

<!-- Thư viện CKEditor 5 -->
<script src="https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/ckeditor.js"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
    if (document.querySelector('#editor')) {
        ClassicEditor
            .create(document.querySelector('#editor'), {
                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList',
                    'blockQuote', '|', 'imageUpload', 'insertTable', 'mediaEmbed', 'undo', 'redo'
                ]
            })
            .catch(error => {
                console.error(error);
            });
    }
});
</script>

<?php layout('admin_footer'); ?>
