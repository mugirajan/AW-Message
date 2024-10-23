<?php

date_default_timezone_set('Asia/Kolkata');

// Configuration: Store sensitive data securely (consider using environment variables).
$config = [
    'token' => 'EABrZA7KDKk6sBO6MBAblJQnpJzJGOY5zlsS6k8sgZBp7ZCFJOfuWl18iee1n99jHSsrXAbTFYRD377fH1BmNwkX2jgWYGW6je5sruSNgQrOADycxIsqxZAAImmaRGeLW4uFg5LtX04oBuEDz0Wvld7kaCFw1Ynoo9hZA00ZC6PT0dB1FpQroZBYYcufjW11eUirs9wsMpJJ17eJZAt8E',  // Replace with actual token
    'phone_id' => '248510075002931',
    'admin_numbers' => ['919841755020'],
];

$contacts = json_decode(file_get_contents(
    "https://fusion24fitness-iyyappanthangal.blackitechs.in/api_iyp/contacts/getContacts.php"), true
);

if (!$contacts || !isset($contacts['data'])) {
    die("Failed to fetch contacts or no data available.");
}

$contacts = $contacts['data'];
$url = "https://graph.facebook.com/v17.0/{$config['phone_id']}/messages";

foreach ($contacts as $cont) {
    $pno = $cont['t_role'];
    $pname = $cont['t_name'];
    $pdob = $cont['t_marriage'];

    // Check if t_marriage date is valid
    if ($pdob) {
        $dob = new DateTime($pdob);
        $today = new DateTime('today');
        $year = $dob->diff($today)->y;

        if (date('m-d') == date('m-d', strtotime($pdob))) {
            $admmesg = "{$pname} | {$year}th Anniversary | {$pno}";

            sendWACustomTemplateMessage($pno, $pname, $admmesg, $config['token'], $url);

            foreach ($config['admin_numbers'] as $admin_number) {
                sendWAAdminTemplateMessage($admin_number, $admmesg, $config['token'], $url);
            }
        }
    }
}

function sendWACustomTemplateMessage($to, $headerTxt, $msg, $token, $url) {
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

function sendWAAdminTemplateMessage($to, $msg, $token, $url) {
    $data = [
        "messaging_product" => "whatsapp",
        "to" => $to,
        "type" => "template",
        "template" => [
            "name" => "fusion24_fitness_studio",
            "language" => ["code" => "en"],
            "components" => [
                ["type" => "body", "parameters" => [["type" => "text", "text" => $msg]]]
            ]
        ]
    ];

    return sendWhatsAppMessage($data, $token, $url);
}

function sendWhatsAppMessage($data, $token, $url) {
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => $url,
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Accept: application/json",
            "Content-Type: application/json",
            "Authorization: Bearer {$token}",
        ],
        CURLOPT_POSTFIELDS => json_encode($data),
    ]);

    $response = curl_exec($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    if (curl_errno($curl)) {
        echo 'Error: ' . curl_error($curl);
    } elseif ($httpCode != 200) {
        echo "Failed with HTTP code {$httpCode}: " . $response . "\n";
    } else {
        echo "Message sent successfully.\n";
    }

    curl_close($curl);
    return json_decode($response, true);
}
?>
