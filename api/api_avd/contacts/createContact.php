<?php

$file = '../ams_db/contacts.json'; // File path
$valid = array('success' => false, 'message' => "");

// Function to generate the next available numeric ID
function getNextId($contacts) {
    if (empty($contacts)) return 1;
    $ids = array_column($contacts, 'id');
    $maxId = max(array_map('intval', $ids));
    return $maxId + 1;
}

try {
    if (!file_exists($file)) {
        file_put_contents($file, json_encode([])); // Initialize with empty array
    }

    $jsonData = file_get_contents($file);
    if ($jsonData === false) {
        throw new Exception("Failed to read the file.");
    }

    $contacts = json_decode($jsonData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Error decoding JSON: " . json_last_error_msg());
    }

    $input = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON input: " . json_last_error_msg());
    }

    // Generate the next available ID
    $input['id'] = (string) getNextId($contacts);

    // Add the new contact to the contacts array
    $contacts[] = $input;

    if (file_put_contents($file, json_encode($contacts, JSON_PRETTY_PRINT)) === false) {
        throw new Exception("Failed to save the contact.");
    }

    $valid['success'] = true;
    $valid['message'] = "Contact created successfully.";
    $valid['data'] = $input;

} catch (Exception $e) {
    $valid['success'] = false;
    $valid['message'] = $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($valid);
?>
