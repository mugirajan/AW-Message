<?php

// Preflight response
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Set headers to return JSON response
header('Content-Type: application/json');

// Initialize response array for success/error message
$valid = array('success' => false, 'message' => '');

// Get the POST request data (JSON)
$data = file_get_contents('php://input');
$receivedData = json_decode($data, true);

// Check if JSON data was received properly
if (!$receivedData) {
    $valid['message'] = 'Invalid JSON format or no data received';
    echo json_encode($valid);
    exit;
}

// Load existing JSON data from file
$jsonFilePath = '../ams_db/contacts.json';
if (!file_exists($jsonFilePath)) {
    $valid['message'] = 'Data file not found';
    echo json_encode($valid);
    exit;
}

$existingData = file_get_contents($jsonFilePath);
$jsonArray = json_decode($existingData, true);

// Check if data.json is valid JSON
if (!$jsonArray) {
    $valid['message'] = 'Unable to read data file';
    echo json_encode($valid);
    exit;
}

// Look for the record to update using the "id"
$idToUpdate = $receivedData['id'] ?? null;
$found = false;

// Loop through the array to find the matching record
foreach ($jsonArray as &$record) {
    if ($record['id'] === $idToUpdate) {
        // Update the record with the new data
        $record = array_merge($record, $receivedData);
        $found = true;
        break;
    }
}

// Handle if the record was not found
if (!$found) {
    $valid['message'] = 'Record not found';
    echo json_encode($valid);
    exit;
}

// Save the updated array back to data.json
if (file_put_contents($jsonFilePath, json_encode($jsonArray, JSON_PRETTY_PRINT))) {
    $valid['success'] = true;
    $valid['message'] = 'Record updated successfully';
} else {
    $valid['message'] = 'Failed to save updated data';
}

// Return response
echo json_encode($valid);
?>
