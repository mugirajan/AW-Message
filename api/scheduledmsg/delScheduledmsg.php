getFile.php

<?php

    $json = file_get_contents('php://input');
    $array = json_decode($json, true);
    $f = "file.txt";
   

    file_put_contents($f, print_r("Request came in", true), FILE_APPEND | LOCK_EX);
    

    $valid = array('success' => false, 'message' => "");
    if($array) {
        $valid['success'] = true;
        $valid['message'] = "We can do it...!";
    } else {
        $valid['success'] = false;
        $valid['message'] = "Try harder...!";
    }
    
    echo json_encode($valid);

?>