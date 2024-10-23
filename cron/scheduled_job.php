<?php
// Set up initial configurations
print_r("----------------------------------------------------------------------------------------------------------------------------");
echo '<br/>';
date_default_timezone_set('Asia/Kolkata');

// Configuration variables
$WABI = "247124335131424";
$version = "v19.0";
$baseUrl = "https://graph.facebook.com/";
$token = "EABrZA7KDKk6sBO6MBAblJQnpJzJGOY5zlsS6k8sgZBp7ZCFJOfuWl18iee1n99jHSsrXAbTFYRD377fH1BmNwkX2jgWYGW6je5sruSNgQrOADycxIsqxZAAImmaRGeLW4uFg5LtX04oBuEDz0Wvld7kaCFw1Ynoo9hZA00ZC6PT0dB1FpQroZBYYcufjW11eUirs9wsMpJJ17eJZAt8E";
$phoneId = "248510075002931";

$logFile = "scheduled_msg_log.txt"; // Define log file
$messageUrl = $baseUrl . $version . "/" . $phoneId . "/messages"; // URL for sending messages

// Fetch scheduled messages
$jobsJson = file_get_contents("https://fusion24fitness-avadi.blackitechs.in/api_avd/scheduledmsg/getScheduledmsg.php");
$jobsData = json_decode($jobsJson, true)['data'];

// Log fetched jobs
logMessage($logFile, "Fetched Jobs: " . json_encode($jobsData));

// Current date and time
$currentDateTime = new DateTime();

// To send messages to users with birthdays as today
foreach ($jobsData as $job) {
    $cstMsg = $job['cust_temp'];
    $cstList = $job['cont_list'];
    $scheduledTime = new DateTime($job['date'] . " " . $job['time']);

    // Check if the current date matches the scheduled time
    if ($currentDateTime->format('d-m-Y H:i') == $scheduledTime->format('d-m-Y H:i')) {
        logMessage($logFile, "Message scheduled for: " . $scheduledTime->format('d-m-Y H:i'));

        // Send messages to each contact
        foreach ($cstList as $contId) {
            $contactJson = file_get_contents("https://fusion24fitness-avadi.blackitechs.in/api_avd/contacts/getAContact.php?id=" . $contId);
            $contactData = json_decode($contactJson, true)['data'];

            if (!empty($contactData)) {
                $pname = $contactData[0]['t_name'];
                $pcont = $contactData[0]['t_role'];

                $response = sendWACustomTemplateMessage($pcont, $pname, $cstMsg, $token, $messageUrl);
                logMessage($logFile, "Sent to $pname ($pcont): " . json_encode($response));
            } else {
                logMessage($logFile, "Contact ID $contId not found.");
            }
        }
    }
}

/* Function to send WhatsApp Custom Template Message */
function sendWACustomTemplateMessage(string $to, string $headerTxt, string $msg, string $token, string $url)
{
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $data = [
        "messaging_product" => "whatsapp",
        "to" => $to,
        "type" => "template",
        "template" => [
            "name" => "custom_template",
            "language" => [
                "code" => "en"
            ],
            "components" => [
                [
                    "type" => "header",
                    "parameters" => [
                        ["type" => "text", "text" => $headerTxt]
                    ]
                ],
                [
                    "type" => "body",
                    "parameters" => [
                        ["type" => "text", "text" => $msg]
                    ]
                ]
            ]
        ]
    ];

    $headers = [
        "Accept: application/json",
        "Content-Type: application/json",
        "Authorization: Bearer " . $token,
    ];

    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));

    $response = curl_exec($curl);
    $error = curl_error($curl);
    curl_close($curl);

    if ($error) {
        logMessage("Error sending message to $to: $error");
        return ["success" => false, "error" => $error];
    }

    return json_decode($response, true);
}

/* Logging Function */
function logMessage($file, $message)
{
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($file, "[$timestamp] $message" . PHP_EOL, FILE_APPEND);
}
?>
