<?php

$WABI = "231667113353605";
$version = "v19.0";
$url = "https://graph.facebook.com/";  // /v18.0/214842615044313/messages",
$token = "EAANBTnz5WGwBOygYs2iMCE8NQolyrqFNR2q1NfTOEpMytfm0tmmmZB0f7p8IZCVx7mZBOjnhvWkXcDKpbrBZCmA8kLg8T8gEbQNXnajFHN4pighvbrVfmUqPsiO0ZA73jx13oNcLp9xuPZCI5PAj0buVr2LtiDuAAUpI7CAwO94YlJio6iXXtLnWqYZBC1tNv8ZCjuLsSLkGBuDSZB16jE2GfI1rw6iIZD";
$PhnID = "214842615044313";


$contacts = json_decode(file_get_contents("http://localhost:3000/contacts"), true);

$url = $url . $version . "/" . $PhnID . "/messages";

//To display the list of contacts fetched
print_r($contacts);
echo '<br/>';
echo '<br/>';

// To send message to users with birthday as today
foreach ($contacts as $cont) {

  // check number for testing
  // $pno = '917338908955';
  // $pno = '918056221146';
  $pno = $cont['t_role'];
  $pname = $cont['t_name'];
  $pdob = $cont['t_date'];
  $pterm = $cont['t_term'];
  $dob = new DateTime($pdob);
  $today   = new DateTime('today');
  $year = $dob->diff($today)->y;

  $date =  new DateTime($pdob);

  // if ($pterm == 'One Year') {
  //   $date->modify('+1 Year');
  // } elseif ($pterm == 'Six Month') {
  //   $date->modify('+6 months');
  // }
  $addate = $date->format('Y-m-d');
  print_r($addate);
  $time = strtotime($addate);
  echo '<br/>';
  $weektime = strtotime('-7 day', $time);
  $monthtime = strtotime('-1 month', $time);
  print_r($time);

  if (date('m-d') == date('m-d', $weektime)) {
    print_r(sendWACustomTemplateMessage($pno, $pname, $addate, $token, $url));
  }
  if(date('m-d') == date('m-d', $monthtime)){
    print_r(sendWACustomTemplateMessage($pno, $pname, $addate, $token, $url));
  }

  // if (date('m-d') == date('m-d', $time)) {
  //   print_r(sendWACustomTemplateMessage($pno, $pname, $year, $token, $url));
  echo '<br/>';
  echo '<br/>';
  // }

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
