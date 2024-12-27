<?php
session_start();
include "conexion.php";

$sqlQuery = "SELECT * FROM tasks where user_id = ?";
$stmt = $SQLConection->prepare($sqlQuery);
$stmt->bind_param("i", $_SESSION["user_id"]);
$stmt->execute();

$result = $stmt->get_result();

$tasks = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $tasks[] = $row;
    }
}

$SQLConection->close();

echo json_encode($tasks);
?>