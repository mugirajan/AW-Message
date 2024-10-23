<?php

date_default_timezone_set('Asia/Kolkata');
// $WABI = "247124335131424";
$version = "v19.0";
$url = "https://graph.facebook.com/";  // /v18.0/214842615044313/messages",
$token = "EABrZA7KDKk6sBO6MBAblJQnpJzJGOY5zlsS6k8sgZBp7ZCFJOfuWl18iee1n99jHSsrXAbTFYRD377fH1BmNwkX2jgWYGW6je5sruSNgQrOADycxIsqxZAAImmaRGeLW4uFg5LtX04oBuEDz0Wvld7kaCFw1Ynoo9hZA00ZC6PT0dB1FpQroZBYYcufjW11eUirs9wsMpJJ17eJZAt8E";
$PhnID = "248510075002931";


$contacts = json_decode(file_get_contents("https://fusion24fitness-iyyappanthangal.blackitechs.in/api_iyp/contacts/getContacts.php"), true)['data'];

$url = $url . $version . "/" . $PhnID . "/messages";

//To display the list of contacts fetched
print_r($contacts);
echo '<br/>';
echo '<br/>';

// To send message to users with subscription end date as today
foreach ($contacts as $cont) {

  $pno = $cont['t_role'];
  $pname = $cont['t_name'];
  $pdob = $cont['t_endsub'];
  $pterm = $cont['t_term'];
  $dob = new DateTime($pdob);
  $today = new DateTime();
  $year = $dob->diff($today)->y;

  $date = new DateTime($pdob);

  $addate = $date->format('Y-m-d');
  $time = strtotime($addate);
  $weektime = strtotime('-7 day', $time);
  $monthtime = strtotime('-1 month', $time);

  $admmesg = $pname . " | Subscription end date " . $date->format('d-m-Y') . " |" . $pno;
  $admno1 = "919841755020";
  // $admno2 = "919600427126";

  if ($today <= $dob && $today >= (new DateTime())->setTimestamp($weektime)) {
    sendWACustomTemplateMessage($pno, $pname, $addate, $token, $url);
    sendWAAdminTemplateMessage($admno1, $admmesg, $token, $url);
    sendWAAdminTemplateMessage($admno2, $admmesg, $token, $url);
  }
  if ($today <= $dob && $today == (new DateTime())->setTimestamp($monthtime)) {
    sendWACustomTemplateMessage($pno, $pname, $addate, $token, $url);
    sendWAAdminTemplateMessage($admno1, $admmesg, $token, $url);
    sendWAAdminTemplateMessage($admno2, $admmesg, $token, $url);
  }

  echo '<br/>';
  echo '<br/>';
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
      "name" => "subscription_fusion",
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
    echo "cURL Error: " . $error;
  } else {
    return json_decode($resp);
  }
}

/* Function to send WhatsApp Admin Template Message */
function sendWAAdminTemplateMessage(string $to, string $msg, string $token, string $url)
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
    echo "cURL Error: " . $error;
  } else {
    return json_decode($resp);
  }
}
?>