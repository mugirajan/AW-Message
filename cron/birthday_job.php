<?php

// Set the timezone
date_default_timezone_set('Asia/Kolkata');

// Configuration variables
$version = "v19.0";
$url = "https://graph.facebook.com/";
$token = "EABrZA7KDKk6sBO6MBAblJQnpJzJGOY5zlsS6k8sgZBp7ZCFJOfuWl18iee1n99jHSsrXAbTFYRD377fH1BmNwkX2jgWYGW6je5sruSNgQrOADycxIsqxZAAImmaRGeLW4uFg5LtX04oBuEDz0Wvld7kaCFw1Ynoo9hZA00ZC6PT0dB1FpQroZBYYcufjW11eUirs9wsMpJJ17eJZAt8E";
$PhnID = "248510075002931";

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

// Function to fetch contacts
$contacts = json_decode(file_get_contents("https://fusion24fitness-iyyappanthangal.blackitechs.in/api_iyp/contacts/getContacts"), true)['data'];

// Check if contacts were fetched successfully
if (!$contacts) {
    logMessage("Error fetching contacts.");
    die("Error fetching contacts.");
}

// URL for sending messages
$url = $url . $version . "/" . $PhnID . "/messages";

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
    $dob = new DateTime($pdob);
    $today = new DateTime('today');
    $year = $dob->diff($today)->y;

    if (date('m-d') == date('m-d', strtotime($pdob))) {
        $admmesg = "$pname | $year th Birthday | $pno";
        $admno1 = "919841755020";
        // $admno2 = "919600427126";

        // Send custom template message to user
        $result1 = sendWACustomTemplateMessage($pno, $pname, $year, $token, $url);
        logMessage("Sent to user $pno: " . json_encode($result1));

        // Send admin messages
        $result2 = sendWAAdminTemplateMessage($admno1, $admmesg, $token, $url);
        logMessage("Sent to admin $admno1: " . json_encode($result2));

        // $result3 = sendWAAdminTemplateMessage($admno2, $admmesg, $token, $url);
        // logMessage("Sent to admin $admno2: " . json_encode($result3));
    }
}

?>
