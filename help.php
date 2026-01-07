



<?php

// ================= NOT WORKING FOR NOW ===============//


// Include database connection file
include 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the form data
    $name = isset($_POST['userName']) ? $_POST['userName'] : '';
    $email = isset($_POST['userEmail']) ? $_POST['userEmail'] : '';
    $issue = isset($_POST['userIssue']) ? $_POST['userIssue'] : '';

    // Validate form data
    if (empty($name) || empty($email) || empty($issue)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit;
    }

    // Prepare and execute the SQL query to insert the help data
    $stmt = $conn->prepare("INSERT INTO help (name, email, issue) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $issue);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Your request has been submitted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error saving data']);
    }

    // Close the statement and connection
    $stmt->close();
    $conn->close();
}
?>
