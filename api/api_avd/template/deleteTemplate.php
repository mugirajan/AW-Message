<?php
header('Content-Type: application/json');
$file = '../ams_db/templates.json';
$templateId = $_GET['id']; // Assuming ID is passed as a query parameter

$response = ['success' => false, 'message' => ''];

try {
    if (!file_exists($file)) {
        throw new Exception("File does not exist.");
    }

    $templates = json_decode(file_get_contents($file), true);
    $updatedTemplates = [];
    $found = false;

    // Filter out the template to delete
    foreach ($templates as $template) {
        if ($template['id'] !== $templateId) {
            $updatedTemplates[] = $template;
        } else {
            $found = true;
        }
    }

    if (!$found) {
        throw new Exception("Template not found.");
    }

    // Write the updated templates back to the JSON file
    file_put_contents($file, json_encode($updatedTemplates, JSON_PRETTY_PRINT));

    $response['success'] = true;
    $response['message'] = "Template deleted successfully.";

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
