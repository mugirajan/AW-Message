<?php

$file = '../ams_db/lists.json';
$valid = ['success' => false, 'message' => '', 'data' => null];

try {
    if (!isset($_GET['id'])) {
        throw new Exception("ID is required.");
    }

    $id = $_GET['id'];
    $lists = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Error decoding JSON: " . json_last_error_msg());
    }

    $list = current(array_filter($lists, fn($list) => $list['id'] === $id));
    if (!$list) {
        throw new Exception("List not found.");
    }

    $valid['success'] = true;
    $valid['data'] = $list;
} catch (Exception $e) {
    $valid['message'] = $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($valid);
?>
