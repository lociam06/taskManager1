<?php
session_start();
include "./conexion.php";

$data = json_decode(file_get_contents("php://input"), true);
$taskID = $data;
$userID = $_SESSION["user_id"];

$sqlQuery = "DELETE FROM tasks WHERE id = ? and user_id = ?";
$stmt = $SQLConection->prepare($sqlQuery);
$stmt->bind_param("ii", $taskID, $userID);
$stmt->execute();

echo json_encode($data);
$stmt->close();
?>