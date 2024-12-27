<?php
    $db_host = "localhost";
    $db_name = "task_manager";
    $db_user = "root";
    $db_password = "";

    $SQLConection = new mysqli($db_host, $db_user, $db_password, $db_name);

    if ($SQLConection->connect_error) {
        die("Conccion fallida: " . $SQLConection->connect_error);
    }
?>