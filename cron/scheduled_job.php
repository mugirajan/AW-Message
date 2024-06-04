<?php
print_r("----------------------------------------------------------------------------------------------------------------------------");
date_default_timezone_set('Asia/Kolkata');

$WABI = "247124335131424";
$version = "v19.0";
$url = "https://graph.facebook.com/";  // /v18.0/214842615044313/messages",
$token = "EABrZA7KDKk6sBOzurAORQ8ZBfFLmYxVK520Xrxe2AZACdobvqbYQgkvh5lSxd3N3vE26ouxXfO8R5Lvx5dZBXZBZAMSVdYLqblDCPVDbCdenMZAOqvB6IfgcgbFOPsZAJDUTlnMCLgyZCcvNZB4unTcp3ydobZBQ1r97rrjwmRp6PfjMGOQMqCKQcc8JZAMJZCoZCBXStyEACVJojkRs2WBiwE";
$PhnID = "248510075002931";


$jobs = json_decode(file_get_contents("http://13.235.132.13/scheduledmsg"), true);

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
  $time = $job['date']." ".$job['time'];
  print_r($cst_list);
  $dob = new DateTime($time);
  $addate = $dob->format('d-m-Y');
  $currentDate = new DateTime();
  echo($dob->format('d-m-Y H:i'));
  echo '<br/>';
  echo '<br/>';
  print_r($addate);
  $timeday = strtotime($addate);
  echo '<br/>';

  if ($currentDate->format('d-m-Y H:i') == $dob->format('d-m-Y H:i')) {
            foreach ($cst_list as $cont) {
      $contact = json_decode(file_get_contents("http://13.235.132.13/contacts?id=" . $cont), true);
      print_r($contact);
      echo '<br/>';
      echo '<br/>';
      if (!(sizeof($contact) == 0)) {
        $pname = $contact[0]['t_name'];
        $pcont = $contact[0]['t_role'];
        print_r("---------------------------------Mail Sending-------------------------------------");
        print_r("Name - ".$pname." ______ Contact".$pcont);
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
?>