<?php
print_r("----------------------------------------------------------------------------------------------------------------------------");

echo '<br/>';
date_default_timezone_set('Asia/Kolkata');

$WABI = "247124335131424";
$version = "v19.0";
$url = "https://graph.facebook.com/";  // /v18.0/214842615044313/messages",
$token = "EABrZA7KDKk6sBO6MBAblJQnpJzJGOY5zlsS6k8sgZBp7ZCFJOfuWl18iee1n99jHSsrXAbTFYRD377fH1BmNwkX2jgWYGW6je5sruSNgQrOADycxIsqxZAAImmaRGeLW4uFg5LtX04oBuEDz0Wvld7kaCFw1Ynoo9hZA00ZC6PT0dB1FpQroZBYYcufjW11eUirs9wsMpJJ17eJZAt8E";
$PhnID = "248510075002931";


$jobs = json_decode(file_get_contents("https://fusion24fitness-iyyappanthangal.blackitechs.in/api_iyp/scheduledmsg/getScheduledmsg.php"), true)['data'];
$url = $url . $version . "/" . $PhnID . "/messages";

//To display the list of contacts fetched
print_r($jobs);
echo '<br/>';
echo '<br/>';



// To send message to users with birthday as today
foreach ($jobs as $job) {

  // check number for testing
  // $pno = '917338908955';
  // $pno = '918056221146';
  $cst_msg = $job['cust_temp'];
  $cst_list = $job['cont_list'];
  $time = $job['date'] . " " . $job['time'];

  echo '<br/>';

  print_r($cst_list);
  $dob = new DateTime($time);
  $addate = $dob->format('d-m-Y');
  $currentDate = new DateTime();
  echo ($dob->format('d-m-Y H:i'));
  echo '<br/>';
  echo '<br/>';
  print_r($currentDate->format('d-m-Y H:i'));
  $timeday = strtotime($addate);
  echo '<br/>';

  if ($currentDate->format('d-m-Y H:i') == $dob->format('d-m-Y H:i')) {
    print_r("true");
    echo '<br/>';
    foreach ($cst_list as $cont) {
      $contact = json_decode(file_get_contents("https://fusion24fitness-iyyappanthangal.blackitechs.in/api_iyp/contacts/getAContact.php?id=" . $cont), true)['data'];
      echo ("Contact list");
      print_r($contact);
      echo '<br/>';
      echo '<br/>';
      if (!(sizeof($contact) == 0)) {
        $pname = $contact[0]['t_name'];
        $pcont = $contact[0]['t_role'];
        print_r("---------------------------------Mail Sending-------------------------------------");
        echo '<br/>';
        print_r("Name - " . $pname . " ______ Contact" . $pcont);
        echo '<br/>';
        print_r(sendWACustomTemplateMessage($pcont, $pname, $cst_msg, $token, $url));
      }
      echo '<br/>';
      echo '<br/>';
    }
  }

  echo '<br/>';
  echo '<br/>';
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