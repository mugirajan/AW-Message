<?php

// Set the timezone
date_default_timezone_set('Asia/Kolkata');

// Configuration variables
$version = "v19.0";
$baseUrl = "https://graph.facebook.com/";
$token = "EABrZA7KDKk6sBO6MBAblJQnpJzJGOY5zlsS6k8sgZBp7ZCFJOfuWl18iee1n99jHSsrXAbTFYRD377fH1BmNwkX2jgWYGW6je5sruSNgQrOADycxIsqxZAAImmaRGeLW4uFg5LtX04oBuEDz0Wvld7kaCFw1Ynoo9hZA00ZC6PT0dB1FpQroZBYYcufjW11eUirs9wsMpJJ17eJZAt8E";
$phoneId = "248510075002931";

// Fetch contacts
$contactsJson = file_get_contents("https://fusion24fitness-iyyappanthangal.blackitechs.in/api_iyp/contacts/getContacts.php");
$contactsData = json_decode($contactsJson, true);

// Check if contacts were fetched successfully
if (empty($contactsData['data'])) {
    writeLog("Error fetching contacts.");
    die("Error fetching contacts.");
}

$contacts = $contactsData['data'];

// URL for sending messages
$messageUrl = "{$baseUrl}{$version}/{$phoneId}/messages";

// Log the list of contacts fetched
writeLog("Fetched Contacts: " . print_r($contacts, true));

// Current date
$today = new DateTime();

foreach ($contacts as $cont) {
    $pno = $cont['t_role'];
    $pname = $cont['t_name'];
    $pdob = $cont['t_endsub'];

    // Skip if the subscription end date is invalid
    if (!$pdob) {
        writeLog("Invalid subscription end date for contact: $pname");
        continue;
    }

    $dob = new DateTime($pdob);
    
    // Calculate date ranges
    $weektime = (clone $dob)->modify('-7 days');
    $monthtime = (clone $dob)->modify('-1 month');

    $admmesg = "$pname | Subscription end date: " . $dob->format('d-m-Y') . " | $pno";
    $adminNumber = "919841755020"; // Add admin numbers as needed

    // Check if today is within one week or one month of the subscription end date
    if ($today >= $weektime && $today < $dob) {
        sendWACustomTemplateMessage($pno, $pname, $dob->format('d-m-Y'), $token, $messageUrl);
        sendWAAdminTemplateMessage($adminNumber, $admmesg, $token, $messageUrl);
    }

    if ($today >= $monthtime && $today < $dob && $today->format('d') == $dob->format('d')) {
        sendWACustomTemplateMessage($pno, $pname, $dob->format('d-m-Y'), $token, $messageUrl);
        sendWAAdminTemplateMessage($adminNumber, $admmesg, $token, $messageUrl);
    }
}

/* Function to send WhatsApp Custom Template Message */
function sendWACustomTemplateMessage(string $to, string $headerTxt, string $msg, string $token, string $url)
{
    $data = [
        "messaging_product" => "whatsapp",
        "to" => $to,
        "type" => "template",
        "template" => [
            "name" => "subscription_fusion",
            "language" => ["code" => "en"],
            "components" => [
                [
                    "type" => "header",
                    "parameters" => [["type" => "text", "text" => $headerTxt]]
                ],
                [
                    "type" => "body",
                    "parameters" => [["type" => "text", "text" => $msg]]
                ]
            ]
        ]
    ];

    $response = sendMessage($data, $token, $url, $to);
}

/* Function to send WhatsApp Admin Template Message */
function sendWAAdminTemplateMessage(string $to, string $msg, string $token, string $url)
{
    $data = [
        "messaging_product" => "whatsapp",
        "to" => $to,
        "type" => "template",
        "template" => [
            "name" => "fusion24_fitness_studio",
            "language" => ["code" => "en"],
            "components" => [
                [
                    "type" => "body",
                    "parameters" => [["type" => "text", "text" => $msg]]
                ]
            ]
        ]
    ];

    $response = sendMessage($data, $token, $url, $to);
}

/* Function to send a message using cURL */
function sendMessage(array $data, string $token, string $url, string $recipient)
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

    $resp = curl_exec($curl);
    $error = curl_error($curl);
    curl_close($curl);

    if ($error) {
        writeLog("Error sending message to $recipient: $error");
    } else {
        writeLog("Message sent to $recipient: " . print_r(json_decode($resp), true));
    }
}

/* Function to Write Logs to a File */
function writeLog($message)
{
    $logFile = 'subscription_msg_avd.txt';  // Set the log file to .txt format
    $time = date('Y-m-d H:i:s');
    $entry = "[$time] $message" . PHP_EOL;

    // Create log file if it doesn't exist
    if (!file_exists($logFile)) {
        file_put_contents($logFile, "Log file created on $time" . PHP_EOL, FILE_APPEND);
    }

    file_put_contents($logFile, $entry, FILE_APPEND);
}

?>
