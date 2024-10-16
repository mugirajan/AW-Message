<?php
header('Content-Type: application/json');
$file = '../ams_db/scheduledMsg.json';
$id = $_GET['id'] ?? '';

if (!file_exists($file)) {
    echo json_encode(['success' => false, 'message' => 'File does not exist.']);
    exit;
}

$data = json_decode(file_get_contents($file), true);
$message = array_filter($data, fn($msg) => $msg['id'] === $id);

if (empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Scheduled message not found.']);
} else {
    echo json_encode(['success' => true, 'data' => array_values($message)[0]]);
}
?>
