<?php
$file = 'data.json'; // File name
$valid = array('success' => false, 'message' => "");
$deleteId = 1; // ID of the record to delete

try {
    // Check if the file exists
    if (!file_exists($file)) {
        throw new Exception("File does not exist.");
    }

    // Read the JSON file
    $jsonData = file_get_contents($file);
    if ($jsonData === false) {
        throw new Exception("Failed to read file.");
    }

    // Decode the JSON data
    $data = json_decode($jsonData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Error decoding JSON: " . json_last_error_msg());
    }

    // Find and delete the record
    $found = false;
    foreach ($data as $key => $entry) {
        if ($entry['id'] == $deleteId) {
            unset($data[$key]);
            $found = true;
            break;
        }
    }

    if (!$found) {
        throw new Exception("Record with ID $deleteId not found.");
    }

    // Re-index array
    $data = array_values($data);

    // Encode and write back to the file
    $jsonData = json_encode($data, JSON_PRETTY_PRINT);
    if (file_put_contents($file, $jsonData)) {
        $valid['success'] = true;
        $valid['message'] = "Record deleted successfully.";
    } else {
        throw new Exception("Failed to write updated data to file.");
    }
} catch (Exception $e) {
    $valid['success'] = false;
    $valid['message'] = $e->getMessage();
}

echo json_encode($valid);
?>
