<?php
$file = 'data.json'; // File name
$valid = array('success' => false, 'message' => "");

// Check if form data is submitted via POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get form data
    $updateId = isset($_POST['id']) ? (int)$_POST['id'] : null;
    $name = isset($_POST['name']) ? trim($_POST['name']) : null;
    $age = isset($_POST['age']) ? (int)$_POST['age'] : null;

    // Check if all form fields are provided
    if ($updateId && $name && $age) {
        try {
            // Read the existing file
            if (!file_exists($file)) {
                throw new Exception("File does not exist.");
            }

            $jsonData = file_get_contents($file);
            if ($jsonData === false) {
                throw new Exception("Failed to read file.");
            }

            // Decode the JSON data
            $data = json_decode($jsonData, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception("Error decoding JSON: " . json_last_error_msg());
            }

            // Update the record
            $updated = false;
            foreach ($data as &$entry) {
                if ($entry['id'] == $updateId) {
                    $entry['name'] = $name;
                    $entry['age'] = $age;
                    $updated = true;
                    break;
                }
            }

            if (!$updated) {
                throw new Exception("Record with ID $updateId not found.");
            }

            // Encode back to JSON and write to the file
            $jsonData = json_encode($data, JSON_PRETTY_PRINT);
            if (file_put_contents($file, $jsonData)) {
                $valid['success'] = true;
                $valid['message'] = "Data updated successfully.";
            } else {
                throw new Exception("Failed to write updated data to file.");
            }
        } catch (Exception $e) {
            $valid['success'] = false;
            $valid['message'] = $e->getMessage();
        }
    } else {
        $valid['success'] = false;
        $valid['message'] = "Incomplete form data. Please provide all the fields.";
    }
} else {
    $valid['success'] = false;
    $valid['message'] = "Invalid request method.";
}

// Return the response
echo json_encode($valid);
?>
