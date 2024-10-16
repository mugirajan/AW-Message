<?php
header('Content-Type: application/json');
$file = '../ams_db/templates.json';
$data = json_decode(file_get_contents('php://input'), true); // Get JSON input

$response = ['success' => false, 'message' => ''];

try {
    if (!isset($data['id'])) {
        throw new Exception("Template ID is required.");
    }

    if (!file_exists($file)) {
        throw new Exception("File does not exist.");
    }

    $templates = json_decode(file_get_contents($file), true);
    $found = false;

    // Update the specific template
    foreach ($templates as &$template) {
        if ($template['id'] === $data['id']) {
            $template['temp_name'] = $data['temp_name'] ?? $template['temp_name'];
            $template['temp_body'] = $data['temp_body'] ?? $template['temp_body'];
            $template['active_status'] = $data['active_status'] ?? $template['active_status'];
            $found = true;
            break;
        }
    }

    if (!$found) {
        throw new Exception("Template not found.");
    }

    // Write the updated templates back to the JSON file
    file_put_contents($file, json_encode($templates, JSON_PRETTY_PRINT));

    $response['success'] = true;
    $response['message'] = "Template updated successfully.";

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
