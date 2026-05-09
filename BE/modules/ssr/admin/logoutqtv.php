<?php
session_start();

session_unset();

session_destroy();

header("Location: ?module=ssr/admin&action=loginqtv");
exit;
?>