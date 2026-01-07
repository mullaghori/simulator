



<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db_connect.php';

// Enable CORS if needed
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Get algorithm usage counts
if (isset($_GET['action']) && $_GET['action'] === 'counts') {
    $query = "SELECT algorithmUsed as algorithm, COUNT(*) as count FROM log GROUP BY algorithmUsed";
    $result = $conn->query($query);
    
    $counts = [];
    while ($row = $result->fetch_assoc()) {
        $counts[] = $row;
    }
    
    echo json_encode($counts);
    exit;
}

// Get logs with pagination and filtering
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = 10;
$offset = ($page - 1) * $limit;

// Base query
$query = "SELECT * FROM log";
$countQuery = "SELECT COUNT(*) as total FROM log";

// Add filters if provided
$where = [];
$params = [];
$types = '';

if (isset($_GET['algorithm']) && $_GET['algorithm'] !== 'all') {
    $where[] = "algorithmUsed = ?";
    $params[] = $_GET['algorithm'];
    $types .= 's';
}

if (isset($_GET['search']) && !empty($_GET['search'])) {
    $search = "%{$_GET['search']}%";
    $where[] = "(algorithmUsed LIKE ? OR inputArray LIKE ? OR sortedArray LIKE ?)";
    $params[] = $search;
    $params[] = $search;
    $params[] = $search;
    $types .= 'sss';
}

// Add WHERE clause if needed
if (!empty($where)) {
    $whereClause = " WHERE " . implode(" AND ", $where);
    $query .= $whereClause;
    $countQuery .= $whereClause;
}

// Add sorting and pagination
$query .= " ORDER BY createdAt DESC LIMIT ? OFFSET ?";
$params[] = $limit;
$params[] = $offset;
$types .= 'ii';

// Prepare and execute main query
$stmt = $conn->prepare($query);
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();
$logs = $result->fetch_all(MYSQLI_ASSOC);

// Get total count
$countStmt = $conn->prepare($countQuery);
if (!empty($params)) {
    // Remove limit/offset params for count query
    $countParams = array_slice($params, 0, count($params) - 2);
    $countTypes = substr($types, 0, -2);
    if (!empty($countParams)) {
        $countStmt->bind_param($countTypes, ...$countParams);
    }
}
$countStmt->execute();
$totalResult = $countStmt->get_result();
$total = $totalResult->fetch_assoc()['total'];

// Calculate total pages
$pages = ceil($total / $limit);

// Return response
echo json_encode([
    'logs' => $logs,
    'total' => $total,
    'page' => $page,
    'pages' => $pages
]);

$conn->close();
?>