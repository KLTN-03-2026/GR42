<section class="vh-100" style="background: #f8f9fb;">
    <div class="container-fluid h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">

            <div class="col-md-9 col-lg-6 col-xl-5 d-none d-md-block">
                <img src="<?php echo _HOST_URL_TEMPLATES; ?>/assets/image/draw2.webp" class="img-fluid rounded-3 shadow"
                    alt="Illustration">
            </div>

            <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                <div class="card shadow-sm rounded-4 p-4">
                    <div class="text-center mb-4">
                        <h2 class="fw-bold">Đăng nhập hệ thống</h2>
                        <p class="text-muted">Nhập email và mật khẩu để tiếp tục</p>
                    </div>

                    <?php
                    if (!empty($msg) && !empty($msg_type)) {
                        getMsg($msg, $msg_type);
                    }
                    ?>

                    <form method="POST" action="">
                        <div class="form-outline mb-3">
                            <input type="email" name="email" id="formEmail" class="form-control form-control-lg"
                                placeholder="Địa chỉ email"
                                value="<?php echo !empty($oldData) ? oldData($oldData, 'email') : ''; ?>" />
                            <?php
                            if (!empty($errorsArr)) {
                                echo formError($errorsArr, 'email');
                            }
                            ?>
                        </div>

                        <div class="form-outline mb-3">
                            <input type="password" name="password" id="formPassword"
                                class="form-control form-control-lg" placeholder="Nhập mật khẩu" />
                            <?php
                            if (!empty($errorsArr)) {
                                echo formError($errorsArr, 'password');
                            }
                            ?>
                        </div>

                        <div class="d-flex justify-content-end mb-4">
                            <a href="<?php echo _HOST_URL; ?>?module=auth&action=forgot"
                                class="text-decoration-none text-primary">Quên mật khẩu?</a>
                        </div>

                        <div class="d-grid mb-3">
                            <button type="submit" class="btn btn-primary btn-lg rounded-3">Đăng nhập</button>
                        </div>

                        <div class="d-grid mb-3">
                            <a href="<?= htmlspecialchars($google_login_url) ?>"
                                class="btn btn-outline-danger btn-lg rounded-3">
                                <i class="fab fa-google me-2"></i>Đăng nhập với Google
                            </a>
                        </div>

                        <p class="text-center small text-muted">
                            Bạn chưa có tài khoản?
                            <a href="<?php echo _HOST_URL; ?>?module=auth&action=register"
                                class="text-danger fw-bold">Đăng ký ngay</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
.card {
    transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.form-control:focus {
    border-color: #d33;
    box-shadow: 0 0 0 0.2rem rgba(211, 51, 51, 0.25);
}
</style>
