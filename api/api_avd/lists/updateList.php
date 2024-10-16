<?php

$file = '../ams_db/lists.json'; // JSON file path
$valid = ['success' => false, 'message' => ''];

try {
    $input = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON input: " . json_last_error_msg());
    }

    if (!isset($input['id'])) {
        throw new Exception("ID is required.");
    }

    $lists = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Error decoding JSON: " . json_last_error_msg());
    }

    $found = false;
    foreach ($lists as &$list) {
        if ($list['id'] === $input['id']) {
            $list = array_merge($list, $input); // Update the list
            $found = true;
            break;
        }
    }

    if (!$found) {
        throw new Exception("List not found.");
    }

    if (file_put_contents($file, json_encode($lists, JSON_PRETTY_PRINT)) === false) {
        throw new Exception("Failed to save the updated list.");
    }

    $valid['success'] = true;
    $valid['message'] = "List updated successfully.";
} catch (Exception $e) {
    $valid['message'] = $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($valid);
?>
