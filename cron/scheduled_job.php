<?php
print_r("----------------------------------------------------------------------------------------------------------------------------");

echo '<br/>';
date_default_timezone_set('Asia/Kolkata');

$WABI = "247124335131424";
$version = "v19.0";
$url = "https://graph.facebook.com/";
$token = "EABrZA7KDKk6sBO6MBAblJQnpJzJGOY5zlsS6k8sgZBp7ZCFJOfuWl18iee1n99jHSsrXAbTFYRD377fH1BmNwkX2jgWYGW6je5sruSNgQrOADycxIsqxZAAImmaRGeLW4uFg5LtX04oBuEDz0Wvld7kaCFw1Ynoo9hZA00ZC6PT0dB1FpQroZBYYcufjW11eUirs9wsMpJJ17eJZAt8E";
$PhnID = "248510075002931";

$log_file = "scheduled_msg_log.txt"; // Define log file

$jobs = json_decode(file_get_contents("https://fusion24fitness-iyyappanthangal.blackitechs.in/api_iyp/scheduledmsg/getScheduledmsg.php"), true)['data'];
$url = $url . $version . "/" . $PhnID . "/messages";

// Log fetched jobs
logMessage($log_file, "Fetched Jobs: " . json_encode($jobs));

// To send message to users with birthday as today
foreach ($jobs as $job) {
    $cst_msg = $job['cust_temp'];
    $cst_list = $job['cont_list'];
    $time = $job['date'] . " " . $job['time'];

    $dob = new DateTime($time);
    $currentDate = new DateTime();
    
    if ($currentDate->format('d-m-Y H:i') == $dob->format('d-m-Y H:i')) {
        logMessage($log_file, "Message scheduled for: " . $dob->format('d-m-Y H:i'));

        foreach ($cst_list as $cont) {
            $contact = json_decode(file_get_contents("https://fusion24fitness-iyyappanthangal.blackitechs.in/api_iyp/contacts/getAContact.php?id=" . $cont), true)['data'];

            if (!empty($contact)) {
                $pname = $contact[0]['t_name'];
                $pcont = $contact[0]['t_role'];

                $response = sendWACustomTemplateMessage($pcont, $pname, $cst_msg, $token, $url);
                logMessage($log_file, "Sent to $pname ($pcont): " . json_encode($response));
            } else {
                logMessage($log_file, "Contact ID $cont not found.");
            }
        }
    }
}

/* Custom template */
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

    $resp = curl_exec($curl);
    curl_close($curl);

    return json_decode($resp, true);
}

/* Logging Function */
function logMessage($file, $message)
{
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($file, "[$timestamp] $message" . PHP_EOL, FILE_APPEND);
}
?>
