<?php
header('Content-Type: application/json');
$file = '../ams_db/templates.json';
$data = json_decode(file_get_contents('php://input'), true); // Get JSON input

$response = ['success' => false, 'message' => ''];

// Function to generate the next available numeric ID
function getNextId($templates)
{
    if (empty($templates)) return 1;
    $ids = array_column($templates, 'id');
    $maxId = max(array_map('intval', $ids));
    return $maxId + 1;
}


try {
    if (!isset($data['temp_name'])) {
        throw new Exception("Template ID is required.");
    }

    // Check if the file exists
    $templates = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

    // Check for unique ID
    foreach ($templates as $template) {
        if ($template['temp_name'] === $data['temp_name']) {
            throw new Exception("Template ID already exists.");
        }
    }

    // Generate the next available ID
    $data['id'] = (string) getNextId($templates);

    // Add the new template
    $templates[] = $data;

    // Write the updated templates back to the JSON file
    file_put_contents($file, json_encode($templates, JSON_PRETTY_PRINT));

    $response['success'] = true;
    $response['message'] = "Template created successfully.";
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
