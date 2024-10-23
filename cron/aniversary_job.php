<?php

date_default_timezone_set('Asia/Kolkata');

// Example of storing sensitive data securely
$config = [
    'token' => 'EABrZA7KDKk6sBO6MBAblJQnpJzJGOY5zlsS6k8sgZBp7ZCFJOfuWl18iee1n99jHSsrXAbTFYRD377fH1BmNwkX2jgWYGW6je5sruSNgQrOADycxIsqxZAAImmaRGeLW4uFg5LtX04oBuEDz0Wvld7kaCFw1Ynoo9hZA00ZC6PT0dB1FpQroZBYYcufjW11eUirs9wsMpJJ17eJZAt8E',
    'phone_id' => '248510075002931',
    'admin_numbers' => ['919841755020'],
];

$contacts = json_decode(file_get_contents("https://fusion24fitness-iyyappanthangal.blackitechs.in/api_iyp/contacts/getContacts.php"), true);
$contacts = $contacts['data'];
$url = "https://graph.facebook.com/{$version}/{$config['phone_id']}/messages";

foreach ($contacts as $cont) {
    $pno = $cont['t_role'];
    $pname = $cont['t_name'];
    $pdob = $cont['t_marriage'];
    $dob = new DateTime($pdob);
    $today   = new DateTime('today');
    $year = $dob->diff($today)->y;

    if (date('m-d') == date('m-d', strtotime($pdob))) {
        $admmesg = "{$pname} | {$year}th Anniversary | {$pno}";

        sendWACustomTemplateMessage($pno, $pname, $admmesg, $config['token'], $url);

        foreach ($config['admin_numbers'] as $admin_number) {
            sendWAAdminTemplateMessage($admin_number, $admmesg, $config['token'], $url);
        }
    }
}

function sendWACustomTemplateMessage($to, $headerTxt, $msg, $token, $url)
{
    $data = [
        "messaging_product" => "whatsapp",
        "to" => $to,
        "type" => "template",
        "template" => [
            "name" => "anniversary_fusion",
            "language" => [
                "code" => "en"
            ],
            "components" => [
                [
                    "type" => "header",
                    "parameters" => [
                        [
                            "type" => "text",
                            "text" => $headerTxt
                        ]
                    ]
                ],
                [
                    "type" => "body",
                    "parameters" => [
                        [
                            "type" => "text",
                            "text" => $msg
                        ]
                    ]
                ]
            ]
        ]
    ];

    return sendWhatsAppMessage($data, $token, $url);
}

function sendWAAdminTemplateMessage($to, $msg, $token, $url)
{
    $data = [
        "messaging_product" => "whatsapp",
        "to" => $to,
        "type" => "template",
        "template" => [
            "name" => "fusion24_fitness_studio",
            "language" => [
                "code" => "en"
            ],
            "components" => [
                [
                    "type" => "body",
                    "parameters" => [
                        [
                            "type" => "text",
                            "text" => $msg
                        ]
                    ]
                ]
            ]
        ]
    ];

    return sendWhatsAppMessage($data, $token, $url);
}

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

    if (curl_errno($curl)) {
        echo 'Error:' . curl_error($curl);
    }

    curl_close($curl);

    return json_decode($response);
}
?>