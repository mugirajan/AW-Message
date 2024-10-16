<?php

$file = '../ams_db/contacts.json'; // Path to the contacts file
$valid = array('success' => false, 'message' => "");

// Function to delete a contact by ID
function deleteContactById($contacts, $id) {
    foreach ($contacts as $key => $contact) {
        if ($contact['id'] === $id) {
            unset($contacts[$key]); // Delete the contact
            return array_values($contacts); // Reindex the array
        }
    }
    throw new Exception("Contact with ID $id not found.");
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
        throw new Exception("Invalid request method.");
    }

    // Extract ID from query parameters
    if (!isset($_GET['id'])) {
        throw new Exception("Contact ID is required.");
    }

    $id = $_GET['id'];

    // Check if file exists
    if (!file_exists($file)) {
        throw new Exception("Contacts file not found.");
    }

    // Read contacts data from JSON file
    $jsonData = file_get_contents($file);
    if ($jsonData === false) {
        throw new Exception("Failed to read the contacts file.");
    }

    // Decode JSON data
    $contacts = json_decode($jsonData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Error decoding JSON: " . json_last_error_msg());
    }

    // Delete the contact and update the contacts array
    $updatedContacts = deleteContactById($contacts, $id);

    // Save the updated contacts back to the JSON file
    if (file_put_contents($file, json_encode($updatedContacts, JSON_PRETTY_PRINT)) === false) {
        throw new Exception("Failed to save the updated contacts.");
    }

    $valid['success'] = true;
    $valid['message'] = "Contact deleted successfully.";
} catch (Exception $e) {
    $valid['success'] = false;
    $valid['message'] = $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($valid);
?>
