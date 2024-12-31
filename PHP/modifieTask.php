<?php
session_start();
include "./conexion.php";

$data = json_decode(file_get_contents("php://input"), true);
$taskID = $data["id"];
$taskTitle = $data["title"];
$taskDescription = $data["description"];

$sqlQuery = "UPDATE tasks SET title = ?, description = ? WHERE id = ?";
$stmt = $SQLConection->prepare($sqlQuery);
$stmt->bind_param("ssi", $taskTitle, $taskDescription, $taskID);
$stmt->execute();

$stmt->close();
?>