
<link href="templates/assets/css/profile.css" rel="stylesheet">

<div class="profile-container">
    <h2>Thông tin tài khoản</h2>

    <?php if(!empty($msg) && !empty($msg_type)): ?>
    <div class="msg-<?= $msg_type ?>"><?= $msg ?></div>
    <?php endif; ?>

    <form action="" method="post" enctype="multipart/form-data" class="profile-form">

        <div class="form-group">
            <label for="fullname">Họ và tên</label>
            <input id="fullname" name="fullname" type="text" value="<?= oldData($oldData, 'fullname') ?>"
                placeholder="Nhập họ và tên">
            <?= formError($errorsArr, 'fullname') ?>
        </div>

        <div class="form-group">
            <label for="email">Email</label>
            <input id="email" name="email" type="text" value="<?= oldData($oldData, 'email') ?>"
                placeholder="Nhập email">
            <?= formError($errorsArr, 'email') ?>
        </div>

        <div class="form-group">
            <label for="password">Mật khẩu (để trống nếu không đổi)</label>
            <input id="password" name="password" type="password" placeholder="Nhập mật khẩu mới">
        </div>

        <div class="form-group">
            <label for="avatar">Ảnh đại diện</label>
            <input id="avatar" name="avatar" type="file">
            <div class="avatar-preview">
                <img id="previewImage" src="<?= !empty($oldData['avatar']) ? $oldData['avatar'] : '' ?>"
                    alt="Avatar" style="<?= !empty($oldData['avatar']) ? '' : 'display:none;' ?>">
            </div>
        </div>

        <div class="form-group">
            <label style="margin-bottom: 10px; display: block; font-weight: bold;">Sở thích (Chuyên mục yêu thích)</label>
            <div class="interests-container" style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
                <?php if(!empty($categories)): ?>
                    <?php foreach($categories as $cat): ?>
                        <label style="display: flex; align-items: center; gap: 5px; font-weight: normal; cursor: pointer; padding: 8px 15px; border: 1px solid #ddd; border-radius: 20px; background: #f9f9f9;">
                            <input type="checkbox" name="interests[]" value="<?= htmlspecialchars($cat) ?>" 
                                <?= (isset($user_interests) && in_array($cat, $user_interests)) ? 'checked' : '' ?>
                                style="margin: 0; width: auto; height: auto;">
                            <?= htmlspecialchars($cat) ?>
                        </label>
                    <?php endforeach; ?>
                <?php else: ?>
                    <p style="color: #888; font-size: 14px; font-style: italic;">Chưa có chuyên mục nào khả dụng.</p>
                <?php endif; ?>
            </div>
        </div>

        <div class="form-actions">
            <button type="submit" class="btn-submit">Lưu thay đổi</button>
            <a href="?module=news&action=list" class="btn-back-home">Quay về trang chủ</a>
        </div>
    </form>
</div>
<script>
const thumbInput = document.getElementById('avatar');
const previewImg = document.getElementById('previewImage');

thumbInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});
</script>
