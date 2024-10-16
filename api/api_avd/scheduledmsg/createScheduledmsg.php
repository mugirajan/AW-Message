<?php
header('Content-Type: application/json');
$file = '../ams_db/scheduledMsg.json';
$data = json_decode(file_get_contents('php://input'), true);

$response = ['success' => false, 'message' => ''];

// Function to generate the next available numeric ID
function getNextId($messages)
{
    if (empty($messages)) return 1; // Start with ID 1 if no messages exist
    $ids = array_column($messages, 'id');
    $maxId = max(array_map('intval', $ids));
    return $maxId + 1;
}

try {
    if (!isset($data['temp_name'])) {
        throw new Exception("Template Name is required.");
    }

    // Load existing messages or create an empty array if the file does not exist
    $messages = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

    // Generate the next available ID
    $data['id'] = (string) getNextId($messages);

    // Add the new message with generated ID
    $messages[] = $data;

    // Write the updated messages back to the JSON file
    file_put_contents($file, json_encode($messages, JSON_PRETTY_PRINT));

    $response = ['success' => true, 'message' => 'Scheduled message created successfully.'];
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
