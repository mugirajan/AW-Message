<?php

date_default_timezone_set('Asia/Kolkata');

// Store configuration and sensitive data
$config = [
    'token' => 'EABrZA7KDKk6sBO6MBAblJQnpJzJGOY5zlsS6k8sgZBp7ZCFJOfuWl18iee1n99jHSsrXAbTFYRD377fH1BmNwkX2jgWYGW6je5sruSNgQrOADycxIsqxZAAImmaRGeLW4uFg5LtX04oBuEDz0Wvld7kaCFw1Ynoo9hZA00ZC6PT0dB1FpQroZBYYcufjW11eUirs9wsMpJJ17eJZAt8E',
    'phone_id' => '248510075002931',
    'admin_numbers' => ['919841755020'],
];

// Fetch contacts
$contacts = json_decode(file_get_contents("https://fusion24fitness-avadi.blackitechs.in/api_avd/contacts/getContacts.php"), true)['data'];
$url = "https://graph.facebook.com/v19.0/{$config['phone_id']}/messages";

// Log the fetched contacts
writeLog("Fetched Contacts: " . print_r($contacts, true));

// Process contacts and send anniversary messages
foreach ($contacts as $cont) {
    $pno = $cont['t_role'];
    $pname = $cont['t_name'];
    $pdob = $cont['t_marriage'];
    $dob = new DateTime($pdob);
    $today = new DateTime('today');
    $year = $dob->diff($today)->y;

    if (date('m-d') == date('m-d', strtotime($pdob))) {
        $admmesg = "{$pname} | {$year}th Anniversary | {$pno}";

        // Send custom template message to user
        $response = sendWACustomTemplateMessage($pno, $pname, $admmesg, $config['token'], $url);
        writeLog("Custom message sent to {$pno}. Response: " . json_encode($response));

        // Send admin notification messages
        foreach ($config['admin_numbers'] as $admin_number) {
            $response = sendWAAdminTemplateMessage($admin_number, $admmesg, $config['token'], $url);
            writeLog("Admin message sent to {$admin_number}. Response: " . json_encode($response));
        }
    }
}

// Send WhatsApp Custom Template Message
function sendWACustomTemplateMessage($to, $headerTxt, $msg, $token, $url)
{
    $data = [
        "messaging_product" => "whatsapp",
        "to" => $to,
        "type" => "template",
        "template" => [
            "name" => "anniversary_fusion",
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

    return sendWhatsAppMessage($data, $token, $url);
}

// Send WhatsApp Admin Template Message
function sendWAAdminTemplateMessage($to, $msg, $token, $url)
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

    return sendWhatsAppMessage($data, $token, $url);
}

// Send WhatsApp Message (Common function)
function sendWhatsAppMessage($data, $token, $url)
{
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $headers = [
        "Accept: application/json",
        "Content-Type: application/json",
        "Authorization: Bearer {$token}",
    ];

    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));

    $response = curl_exec($curl);
    $error = curl_error($curl);
    curl_close($curl);

    if ($error) {
        writeLog("cURL Error: " . $error);
        return ['error' => $error];
    }

    return json_decode($response, true);
}

// Log function to store responses and errors
function writeLog($message)
{
    $logFile = 'anniversary_msg_log.txt'; // Change the filename here
    $time = date('Y-m-d H:i:s');
    $entry = "[$time] $message" . PHP_EOL;
    file_put_contents($logFile, $entry, FILE_APPEND);
}

?>
