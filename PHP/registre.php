<?php
include "conexion.php";

$userName = $_POST["userNameInput"];
$email = $_POST["emailInput"];
$pass = $_POST["passInput"];

$UserVerificationError = "none";

$verificationQuery = "SELECT * FROM users WHERE username = ?";
$verificateUser = $SQLConection->prepare($verificationQuery);
$verificateUser->bind_param("s", $userName);
$verificateUser->execute();
$verificationResults = $verificateUser->get_result();
if($verificationResults->num_rows > 0) $UserVerificationError = "user";

$verificationQuery = "SELECT * FROM users WHERE email = ?";
$verificateUser = $SQLConection->prepare($verificationQuery);
$verificateUser->bind_param("s", $email);
$verificateUser->execute();
$verificationResults = $verificateUser->get_result();
if($verificationResults->num_rows > 0) $UserVerificationError = "email";

if($UserVerificationError == "none"){
    $InsertSqlQuery = "INSERT INTO users(username, email, password) values (?, ?, ?);";
    $insertUser = $SQLConection->prepare($InsertSqlQuery);
    $insertUser->bind_param("sss", $userName, $email, $pass);
    $insertUser->execute();
    header("Location: ../HTML/succefulyRegistre.html");
}else{
    header("Location: ../HTML/login_RegisterForm.html?formError=registre&error=" . $UserVerificationError);
}
?>