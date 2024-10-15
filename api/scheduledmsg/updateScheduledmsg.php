<?php
header('Content-Type: application/json');
$file = '../ams_db/scheduled_msgs.json';
$data = json_decode(file_get_contents('php://input'), true);

$response = ['success' => false, 'message' => ''];

try {
    if (!isset($data['id'])) {
        throw new Exception("ID is required for update.");
    }

    $messages = json_decode(file_get_contents($file), true);
    $found = false;

    foreach ($messages as &$msg) {
        if ($msg['id'] === $data['id']) {
            $msg['cust_temp'] = $data['cust_temp'] ?? $msg['cust_temp'];
            $msg['cont_list'] = $data['cont_list'] ?? $msg['cont_list'];
            $msg['temp_name'] = $data['temp_name'] ?? $msg['temp_name'];
            $msg['date'] = $data['date'] ?? $msg['date'];
            $msg['time'] = $data['time'] ?? $msg['time'];
            $found = true;
            break;
        }
    }

    if (!$found) {
        throw new Exception("Message not found.");
    }

    file_put_contents($file, json_encode($messages, JSON_PRETTY_PRINT));
    $response = ['success' => true, 'message' => 'Message updated successfully.'];
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
