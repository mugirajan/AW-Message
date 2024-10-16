<?php

$file = '../ams_db/lists.json';
$valid = ['success' => false, 'message' => '', 'data' => []];

try {
    $lists = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Error decoding JSON: " . json_last_error_msg());
    }

    $valid['success'] = true;
    $valid['data'] = $lists;
} catch (Exception $e) {
    $valid['message'] = $e->getMessage();   
}

header('Content-Type: application/json');
echo json_encode($valid);
?>
