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
                        <h2 class="fw-bold">Quên mật khẩu</h2>
                        <p class="text-muted">Nhập email để nhận liên kết đặt lại mật khẩu</p>
                    </div>

                    <?php
                    if (!empty($msg) && !empty($msg_type)) {
                        getMsg($msg, $msg_type);
                    }
                    ?>

                    <form method="POST" action="" enctype="multipart/form-data">
                        <div class="form-outline mb-3">
                            <input type="email" name="email"
                                value="<?php echo !empty($oldData) ? oldData($oldData, 'email') : ''; ?>"
                                class="form-control form-control-lg" placeholder="Địa chỉ email" />
                            <?php
                            if (!empty($errorsArr)) {
                                echo formError($errorsArr, 'email');
                            }
                            ?>
                        </div>
                        <div class="d-grid mb-3">
                            <button type="submit" class="btn btn-primary btn-lg rounded-3">Gửi yêu cầu</button>
                        </div>
                        <p class="text-center small text-muted">Đã nhớ mật khẩu?
                            <a href="<?php echo _HOST_URL; ?>?module=auth&action=login" class="text-danger fw-bold">Đăng
                                nhập ngay</a>
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
