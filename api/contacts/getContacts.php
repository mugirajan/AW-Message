<?php
$file = 'data.json'; // File name
$valid = array('success' => false, 'message' => "");

try {
    // Check if file exists
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

    // Check for JSON decoding errors
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Error decoding JSON: " . json_last_error_msg());
    }

    // Return success message and data
    $valid['success'] = true;
    $valid['message'] = "File read successfully.";
    $valid['data'] = $data;  // Add data for debugging or response
} catch (Exception $e) {
    $valid['success'] = false;
    $valid['message'] = $e->getMessage();
}

echo json_encode($valid);
?>
