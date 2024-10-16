<?php

$file = '../ams_db/lists.json'; // JSON file path
$valid = ['success' => false, 'message' => ''];

// Function to generate the next available numeric ID
function getNextId($lists)
{
    if (empty($lists)) return 1;
    $ids = array_column($lists, 'id');
    $maxId = max(array_map('intval', $ids));
    return $maxId + 1;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON input: " . json_last_error_msg());
    }

    // Check if required fields are provided
    if (!isset($input['c_name'])) {
        throw new Exception("ID and name are required.");
    }

    // Read existing lists
    $lists = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Error decoding JSON: " . json_last_error_msg());
    }

    // Generate the next available ID
    $input['id'] = (string) getNextId($lists);
    // Add new list
    $lists[] = $input;

    // Save back to file
    if (file_put_contents($file, json_encode($lists, JSON_PRETTY_PRINT)) === false) {
        throw new Exception("Failed to save the list.");
    }

    $valid['success'] = true;
    $valid['message'] = "List created successfully.";
} catch (Exception $e) {
    $valid['message'] = $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($valid);
