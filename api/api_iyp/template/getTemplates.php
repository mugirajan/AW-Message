<?php
header('Content-Type: application/json');
$file = '../ams_db/templates.json';

$response = ['success' => false, 'message' => '', 'data' => []];

try {
    if (!file_exists($file)) {
        throw new Exception("File does not exist.");
    }

    $jsonData = file_get_contents($file);
    if ($jsonData === false) {
        throw new Exception("Failed to read file.");
    }

    $data = json_decode($jsonData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Error decoding JSON: " . json_last_error_msg());
    }

    $response['success'] = true;
    $response['message'] = "Templates retrieved successfully.";
    $response['data'] = $data; // Return the templates

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
