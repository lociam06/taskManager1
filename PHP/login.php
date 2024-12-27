<?php
session_start();
include "conexion.php";

$userEmail = $_POST["emailInput"];
$userPass = $_POST["passInput"];

$errorMesage = "";

$sqlQuery = "SELECT * FROM users WHERE email = ? AND password = ?";
$stmt = $SQLConection->prepare($sqlQuery);
$stmt->bind_param("ss", $userEmail, $userPass);
$stmt->execute();

$results = $stmt->get_result();

if($results->num_rows > 0){
    $user = $results->fetch_assoc();
    $_SESSION["user_id"] = $user["id"];
    echo $_SESSION["user_id"];
    header("Location: ../index.html");
    
}else{
    header("Location: ../HTML/login_RegisterForm.html?formError=login&autoLog=false");
}
?>