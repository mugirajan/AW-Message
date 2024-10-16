<?php
header('Content-Type: application/json');
$file = '../ams_db/scheduledMsg.json';

if (!file_exists($file)) {
    echo json_encode(['success' => false, 'message' => 'File does not exist.']);
    exit;
}

$data = json_decode(file_get_contents($file), true);
echo json_encode(['success' => true, 'data' => $data]);
?>
