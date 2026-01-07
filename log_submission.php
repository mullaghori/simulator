<?php
header("Content-Type: application/json");
file_put_contents('submission_log.txt', date('Y-m-d H:i:s') . " - " . file_get_contents('php://input') . "\n", FILE_APPEND);
echo json_encode(['success' => true, 'message' => 'Submission logged']);
?>