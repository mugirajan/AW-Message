<?php

$file = '../ams_db/contacts.json'; // File name
$valid = array('success' => false, 'message' => "");

try {
    // Check if the file exists
    if (!file_exists($file)) {
        throw new Exception("File does not exist.");
    }

    // Read the file contents
    $jsonData = file_get_contents($file);
    if ($jsonData === false) {
        throw new Exception("Failed to read file.");
    }

    // Decode the JSON data
    $data = json_decode($jsonData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Error decoding JSON: " . json_last_error_msg());
    }

    // Check if a specific contact is requested (via GET parameter)
    if (isset($_GET['id'])) {
        $id = $_GET['id'];

        // Filter the data to find the contact by 'id'
        $contact = array_filter($data, function($item) use ($id) {
            return isset($item['id']) && $item['id'] == $id;
        });

        if (empty($contact)) {
            throw new Exception("Contact not found.");
        }

        // Return success message with the specific contact
        $valid['success'] = true;
        $valid['message'] = "Contact found.";
        $valid['data'] = array_values($contact); // Re-index the array
    } else {
        // Return all contacts if no specific ID is requested
        $valid['success'] = true;
        $valid['message'] = "All contacts retrieved successfully.";
        $valid['data'] = $data;
    }
} catch (Exception $e) {
    $valid['success'] = false;
    $valid['message'] = $e->getMessage();
}

// Output the JSON response
header('Content-Type: application/json');
echo json_encode($valid);
?>
