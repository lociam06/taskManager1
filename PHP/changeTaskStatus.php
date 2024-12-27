<?php
session_start();
include "./conexion.php";

$data = json_decode(file_get_contents("php://input"), true);
$taskID = $data["taskID"];
$actualStatus = $data["status"];
$newStatus = "pending";

if($actualStatus == true) {
    $newStatus = "completed";
}
elseif($actualStatus == false) {
    $newStatus = "pending";
}

$sqlQuery = "UPDATE tasks SET status = ? WHERE id = ?";
$stmt = $SQLConection->prepare($sqlQuery);
$stmt->bind_param("si", $newStatus, $taskID);
$stmt->execute();
echo json_encode(array($newStatus, $actualStatus, $taskID));

$stmt->close();
?>