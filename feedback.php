


<?php

// ============= NOT WORKING FOR NOW ========== //

header("Content-Type: application/json");

// Use external DB connection file
require_once 'connect_db.php';

// Decode JSON input
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit;
}

// Sanitize input
$name = $conn->real_escape_string(trim($data['name'] ?? ''));
$email = $conn->real_escape_string(trim($data['email'] ?? ''));
$contactNo = $conn->real_escape_string(trim($data['contactNo'] ?? ''));
$feedback = $conn->real_escape_string(trim($data['feedback'] ?? ''));

// Basic validation
if (empty($name) || empty($email) || empty($feedback)) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

// Insert into DB
$sql = "INSERT INTO feedback (name, contactNo, email, feedback) VALUES ('$name', '$contactNo', '$email', '$feedback')";
if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Insert failed: " . $conn->error]);
}

$conn->close();
