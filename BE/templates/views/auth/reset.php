<section class="vh-100">
    <div class="container-fluid h-custom">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-md-9 col-lg-6 col-xl-5">
                <img src="<?php echo _HOST_URL_TEMPLATES; ?>/assets/image/draw2.webp" class="img-fluid"
                    alt="Sample image">
            </div>
            <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                <?php
                if (!empty($msg) && !empty($msg_type)) {
                    getMsg($msg, $msg_type);
                }

                ?>
                <form method="POST" action="" enctype="multipart/form-data">
                    <div class="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                        <h2 class="fw-normal mb-5 me-3">Đặt lại mật khẩu</h2>

                    </div>
                    <div data-mdb-input-init class="form-outline mb-4">
                        <input type="password" name="password" class="form-control form-control-lg"
                            placeholder="Nhập mật khẩu mới" />
                        <?php
                        if (!empty($errorsArr)) {
                            echo formError($errorsArr, 'password');
                        }
                        ?>
                    </div>
                    <div data-mdb-input-init class="form-outline mb-4">
                        <input type="password" name="confirm_password" class="form-control form-control-lg"
                            placeholder="Nhập lại mật khẩu mới" />
                        <?php
                        if (!empty($errorsArr)) {
                            echo formError($errorsArr, 'confirm_password');
                        }
                        ?>
                    </div>

                    <div class="text-center text-lg-start mt-4 pt-2">
                        <button type="submit" type="button" data-mdb-button-init data-mdb-ripple-init
                            class="btn btn-primary btn-lg"
                            style="padding-left: 2.5rem; padding-right: 2.5rem;">Gửi</button>
                    </div>


                </form>
                <p style="margin-top: 15px;"> <a href="<?php echo _HOST_URL; ?>?module=auth&action=login"
                        class="link-danger">Đăng nhập
                    </a></p>
            </div>
        </div>
    </div>

</section>
