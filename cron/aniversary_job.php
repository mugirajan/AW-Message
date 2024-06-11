<?php

date_default_timezone_set('Asia/Kolkata');
$WABI = "247124335131424";
$version = "v19.0";
$url = "https://graph.facebook.com/";  // /v18.0/214842615044313/messages",
$token = "EABrZA7KDKk6sBO6MBAblJQnpJzJGOY5zlsS6k8sgZBp7ZCFJOfuWl18iee1n99jHSsrXAbTFYRD377fH1BmNwkX2jgWYGW6je5sruSNgQrOADycxIsqxZAAImmaRGeLW4uFg5LtX04oBuEDz0Wvld7kaCFw1Ynoo9hZA00ZC6PT0dB1FpQroZBYYcufjW11eUirs9wsMpJJ17eJZAt8E";
$PhnID = "248510075002931";


$contacts = json_decode(file_get_contents("http://localhost:3000/contacts"), true);

$url = $url . $version . "/" . $PhnID . "/messages";

//To display the list of contacts fetched
print_r($contacts);
echo '<br/>';
echo '<br/>';

// To send message to users with birthday as today
foreach ($contacts as $cont) {

  $pno = $cont['t_role'];
  $pname = $cont['t_name'];
  $pdob = $cont['t_marriage'];
  $dob = new DateTime($pdob);
  $today   = new DateTime('today');
  $year = $dob->diff($today)->y;

  $time = strtotime($pdob);
  if (date('m-d') == date('m-d', $time)) {

    $admmesg = $pname." | ".$year."th Aniversary | ".$pno;
    $admno = "917338908955";

    print_r(sendWACustomTemplateMessage($pno, $pname, $year, $token, $url));
    echo '<br/>';
    echo '<br/>';
    print_r(sendWAAdminTemplateMessage($admno, $admmesg , $token, $url));
    echo '<br/>';
    echo '<br/>';
  }
}


/* Birthday wishes */
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

  $headers = array(
    "Accept: application/json",
    "Content-Type: application/json",
    "Authorization: Bearer " . $token,
  );

  curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
  curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
  $resp = curl_exec($curl);
  curl_close($curl);

  return json_decode($resp);
}



/* Admin message */
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

  $headers = array(
    "Accept: application/json",
    "Content-Type: application/json",
    "Authorization: Bearer " . $token,
  );

  curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
  curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
  $resp = curl_exec($curl);
  curl_close($curl);

  return json_decode($resp);
}
