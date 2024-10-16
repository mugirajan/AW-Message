<?php
header('Content-Type: application/json');
$file = '../ams_db/templates.json';
$templateId = $_GET['id']; // Assuming ID is passed as a query parameter

$response = ['success' => false, 'message' => '', 'data' => null];

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

    // Search for the specific template by ID
    foreach ($data as $template) {
        if ($template['id'] === $templateId) {
            $response['success'] = true;
            $response['message'] = "Template retrieved successfully.";
            $response['data'] = $template;
            break;
        }
    }

    if (!$response['success']) {
        throw new Exception("Template not found.");
    }

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
