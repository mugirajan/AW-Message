<?php

$file = '../ams_db/lists.json';
$valid = ['success' => false, 'message' => ''];

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
        throw new Exception("Invalid request method.");
    }

    if (!isset($_GET['id'])) {
        throw new Exception("ID is required.");
    }

    $id = $_GET['id'];
    $lists = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Error decoding JSON: " . json_last_error_msg());
    }

    $lists = array_filter($lists, fn($list) => $list['id'] !== $id);

    if (file_put_contents($file, json_encode(array_values($lists), JSON_PRETTY_PRINT)) === false) {
        throw new Exception("Failed to save the updated lists.");
    }

    $valid['success'] = true;
    $valid['message'] = "List deleted successfully.";
} catch (Exception $e) {
    $valid['message'] = $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($valid);
?>
