<?php

// Set the timezone
date_default_timezone_set('Asia/Kolkata');

// Configuration variables
$version = "v19.0";
$baseUrl = "https://graph.facebook.com/";
$token = "EABrZA7KDKk6sBO6MBAblJQnpJzJGOY5zlsS6k8sgZBp7ZCFJOfuWl18iee1n99jHSsrXAbTFYRD377fH1BmNwkX2jgWYGW6je5sruSNgQrOADycxIsqxZAAImmaRGeLW4uFg5LtX04oBuEDz0Wvld7kaCFw1Ynoo9hZA00ZC6PT0dB1FpQroZBYYcufjW11eUirs9wsMpJJ17eJZAt8E";
$phoneId = "248510075002931";

// Log file path
$logFile = 'birthday_msg_log_avd.txt';

// Function to write logs
function logMessage($message)
{
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] $message" . PHP_EOL;
    file_put_contents($logFile, $logEntry, FILE_APPEND);
}

// Fetch contacts
$contactsJson = file_get_contents("https://fusion24fitness-avadi.blackitechs.in/api_avd/contacts/getContacts");
$contactsData = json_decode($contactsJson, true);

// Check if contacts were fetched successfully
if (empty($contactsData['data'])) {
    logMessage("Error fetching contacts.");
    die("Error fetching contacts.");
}

$contacts = $contactsData['data'];

// URL for sending messages
$messageUrl = "{$baseUrl}{$version}/{$phoneId}/messages";

// Function to send WhatsApp message using a custom template
function sendWACustomTemplateMessage(string $to, string $headerTxt, string $msg, string $token, string $url)
{
    $data = [
        "messaging_product" => "whatsapp",
        "to" => $to,
        "type" => "template",
        "template" => [
            "name" => "birthday_fusion_original",
            "language" => ["code" => "en"],
            "components" => [
                ["type" => "header", "parameters" => [["type" => "text", "text" => $headerTxt]]],
                ["type" => "body", "parameters" => [["type" => "text", "text" => $msg]]]
            ]
        ]
    ];

    return sendMessage($data, $token, $url);
}

// Function to send WhatsApp message to admin
function sendWAAdminTemplateMessage(string $to, string $msg, string $token, string $url)
{
    $data = [
        "messaging_product" => "whatsapp",
        "to" => $to,
        "type" => "template",
        "template" => [
            "name" => "fusion24_fitness_studio",
            "language" => ["code" => "en"],
            "components" => [["type" => "body", "parameters" => [["type" => "text", "text" => $msg]]]]
        ]
    ];

    return sendMessage($data, $token, $url);
}

// Function to send message using cURL
function sendMessage(array $data, string $token, string $url)
{
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    
    $headers = [
        "Accept: application/json",
        "Content-Type: application/json",
        "Authorization: Bearer " . $token,
    ];
    
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));

    $response = curl_exec($curl);

    if ($response === false) {
        $error = curl_error($curl);
        logMessage("cURL Error: $error");
        curl_close($curl);
        return false;
    }

    curl_close($curl);
    $result = json_decode($response, true);
    logMessage("Message sent: " . json_encode($result));
    return $result;
}

// Main logic to send birthday wishes
foreach ($contacts as $cont) {
    $pno = $cont['t_role'];
    $pname = $cont['t_name'];
    $pdob = $cont['t_dob'];
    
    // Skip if the date of birth is invalid
    if (!$pdob) {
        logMessage("Invalid date of birth for contact: $pname");
        continue;
    }

    $dob = new DateTime($pdob);
    $today = new DateTime('today');
    $year = $dob->diff($today)->y;

    // Check if today is the birthday
    if (date('m-d') == date('m-d', strtotime($pdob))) {
        $admmesg = "$pname | $year th Birthday | $pno";
        $admno1 = "919841755020"; // Add admin numbers as needed

        // Send custom template message to user
        $result1 = sendWACustomTemplateMessage($pno, $pname, "Happy $year th Birthday!", $token, $messageUrl);
        logMessage("Sent to user $pno: " . json_encode($result1));

        // Send admin messages
        $result2 = sendWAAdminTemplateMessage($admno1, $admmesg, $token, $messageUrl);
        logMessage("Sent to admin $admno1: " . json_encode($result2));
    }
}

?>
