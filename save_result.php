<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Start output buffering
ob_start();

// Include DB connection
require 'db_connect.php';

// Set JSON header
header("Content-Type: application/json");

// Check DB connection
if (!isset($conn) || $conn->connect_error) {
    http_response_code(500);
    die(json_encode(["success" => false, "message" => "Database connection failed"]));
}

// Only accept POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    die(json_encode(["success" => false, "message" => "Only POST requests allowed"]));
}

// Get and validate JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (json_last_error() !== JSON_ERROR_NONE || !$data) {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Invalid JSON data"]));
}

// Extract and sanitize fields
$requiredFields = [
    'inputArray' => 'string',
    'sortedArray' => 'string',
    'startTime' => 'string',
    'endTime' => 'string',
    'executionTime' => 'string',
    'algorithmUsed' => 'string'
];

$cleanData = [];
foreach ($requiredFields as $field => $type) {
    if (!isset($data[$field])) {
        http_response_code(400);
        die(json_encode(["success" => false, "message" => "Missing field: $field"]));
    }
    $cleanData[$field] = ($type === 'string') ? trim($data[$field]) : $data[$field];
}

// Validate date format (YYYY-MM-DD HH:MM:SS)
$dateFormat = '/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/';
if (!preg_match($dateFormat, $cleanData['startTime']) || 
    !preg_match($dateFormat, $cleanData['endTime'])) {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Invalid date format"]));
}

// Validate execution time is numeric
if (!is_numeric($cleanData['executionTime'])) {
    http_response_code(400);
    die(json_encode(["success" => false, "message" => "Invalid execution time"]));
}

// Database operations with transaction
$conn->begin_transaction();

try {
    // Insert into log table
    $stmt = $conn->prepare("
        INSERT INTO log 
        (algorithmUsed, inputArray, sortedArray, startTime, endTime, executionTime) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    $stmt->bind_param(
        "sssssd",
        $cleanData['algorithmUsed'],
        $cleanData['inputArray'],
        $cleanData['sortedArray'],
        $cleanData['startTime'],
        $cleanData['endTime'],
        $cleanData['executionTime']
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Insert failed: " . $stmt->error);
    }
    
    // Commit transaction
    $conn->commit();
    
    // Clean output and send success
    ob_end_clean();
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Data saved successfully"
    ]);
    
} catch (Exception $e) {
    $conn->rollback();
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}