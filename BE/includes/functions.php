<?php
if (!defined('_TAI')) {
    die('Truy cập không hợp lệ');
}

function layout($layoutName, $data = [])
{

    if (file_exists(_PATH_URL_TEMPLATES . '/layouts/' . $layoutName . '.php')) {
        require_once _PATH_URL_TEMPLATES . '/layouts/' . $layoutName . '.php';
    }
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
function sendMail($emailTo, $subject, $content)
{
    $mail = new PHPMailer(true);

    try {
        $mail->SMTPDebug = SMTP::DEBUG_OFF;
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'tai0935058232@gmail.com';
        $mail->Password = 'bnigrquipuxswkxj';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;

        $mail->setFrom('tai0935058232@gmail.com', 'Tai Course');
        $mail->addAddress($emailTo);
        $mail->CharSet = 'UTF-8';
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $content;

        $mail->SMTPOptions = array(
            'ssl' => [
                'verify_peer' => true,
                'verify_depth' => 3,
                'allow_self_signed' => true,
            ],
        );
        $mail->send();

    } catch (Exception $e) {
        echo "Gửi thất bại. Mailer Error: {$mail->ErrorInfo}";
    }
}

function isPost()
{
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        return true;
    }
    return false;
}

function isGet()
{
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        return true;
    }
    return false;
}

function filterData($method = '')
{
    $filterArr = [];
    if (empty($method)) {
        if (isGet()) {
            if (!empty($_GET)) {
                foreach ($_GET as $key => $value) {
                    $key = strip_tags($key);
                    if (is_array($value)) {
                        $filterArr[$key] = filter_var($_GET[$key], FILTER_SANITIZE_SPECIAL_CHARS, FILTER_REQUIRE_ARRAY);
                    } else {
                        $filterArr[$key] = filter_var($_GET[$key], FILTER_SANITIZE_SPECIAL_CHARS, );
                    }
                }
            }
        }
        if (isPost()) {
            if (!empty($_POST)) {
                foreach ($_POST as $key => $value) {
                    $key = strip_tags($key);

                    if (is_array($value)) {

                        $filterArr[$key] = filter_input(INPUT_POST, $key, FILTER_SANITIZE_SPECIAL_CHARS, FILTER_REQUIRE_ARRAY);
                    } else {
                        $filterArr[$key] = filter_input(INPUT_POST, $key, FILTER_SANITIZE_SPECIAL_CHARS);
                    }
                }
            }
        }
    } else {
        if ($method == 'get') {
            if (!empty($_GET)) {
                foreach ($_GET as $key => $value) {
                    $key = strip_tags($key);
                    if (is_array($value)) {
                        $filterArr[$key] = filter_var($_GET[$key], FILTER_SANITIZE_SPECIAL_CHARS, FILTER_REQUIRE_ARRAY);
                    } else {
                        $filterArr[$key] = filter_var($_GET[$key], FILTER_SANITIZE_SPECIAL_CHARS, );
                    }
                }
            }

        } else if ($method == 'post') {
            if (!empty($_POST)) {
                foreach ($_POST as $key => $value) {
                    $key = strip_tags($key);

                    if (is_array($value)) {

                        $filterArr[$key] = filter_input(INPUT_POST, $key, FILTER_SANITIZE_SPECIAL_CHARS, FILTER_REQUIRE_ARRAY);
                    } else {
                        $filterArr[$key] = filter_input(INPUT_POST, $key, FILTER_SANITIZE_SPECIAL_CHARS);
                    }
                }
            }
        }
    }
    return $filterArr;
}

function validateEmail($email)
{
    if (!empty($email)) {
        $checkEmail = filter_var($email, FILTER_VALIDATE_EMAIL);
    }
    return $checkEmail;
}

function validateInt($number)
{
    if (!empty($number)) {
        $checkNumber = filter_var($number, FILTER_VALIDATE_INT);
    }
    return $checkNumber;
}

function getMsg($msg, $type = 'success')
{
    echo '<div class="annouce-message alert alert-' . $type . '">';
    echo $msg;
    echo '</div>';
}

function formError($errors, $fieldName)
{
    return (!empty($errors[$fieldName])) ? '<div class="error">' . reset($errors[$fieldName]) . '</div>' : false;
}

function oldData($oldData, $fieldName)
{
    return !empty($oldData[$fieldName]) ? $oldData[$fieldName] : null;
}

function redirect($path, $pathFull = false)
{
    if ($pathFull) {
        header("Location: $path");
        exit();
    } else {
        $url = _HOST_URL . $path;
        header("Location: $url");
        exit();
    }
}

function isLogin()
{
    $checkLogin = false;
    $tokenLogin = getSession('token_login');
    $checkToken = getOne("SELECT * FROM token_login WHERE '$tokenLogin'");
    if (!empty($checkToken)) {
        $checkLogin = true;

    } else {
        removeSession('token_login');
    }
    return $checkLogin;
}

function renderView($viewName, $data = []) {
    extract($data);
    $viewPath = _PATH_URL_TEMPLATES . '/views/' . $viewName . '.php';
    if (file_exists($viewPath)) {
        require_once $viewPath;
    } else {
        echo "View {$viewName} không tồn tại.";
    }
}