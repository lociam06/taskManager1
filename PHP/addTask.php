<?php
session_start();
include "./conexion.php";

$data = json_decode(file_get_contents("php://input"), true);
$title = $data["task-tittle-input"];
$description = $data["task-description-input"];

$userID = $_SESSION["user_id"];

$sqlQuery = "INSERT INTO tasks(title, description, category_id, user_id) VALUES(?, ?, 1, ?)";
$stmt = $SQLConection->prepare($sqlQuery);
$stmt->bind_param("sss", $title, $description, $userID);
$stmt->execute();

echo json_encode($stmt->insert_id);

$stmt->close();
?>