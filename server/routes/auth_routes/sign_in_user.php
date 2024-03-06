<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    include '../../controllers/auth/auth_funcs.php';

    $json = file_get_contents('php://input');
    $data = json_decode($json);

    // var_dump($data);

    $username = $data->username;
    $pin = $data->pin;

    $authFuncs = new AuthFuncs();

    $jwtToken = $authFuncs->Login($username, $pin);

    // Handle the JWT token and send response accordingly
    if ($jwtToken) {
        // Authentication successful
        echo json_encode(array('success' => true, 'token' => $jwtToken));
    } else {
        // Authentication failed
        echo json_encode(array('success' => false, 'message' => 'Invalid credentials'));
    }
}
