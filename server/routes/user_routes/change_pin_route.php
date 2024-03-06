<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $headers = getallheaders();
    $token = null;

    $json = file_get_contents('php://input');
    $data = json_decode($json);

    $old_pin = $data->oldPin;
    $new_pin = $data->newPin;

    if (isset($headers['Authorization'])) {
        include '../../controllers/user/user_funcs.php';

        $header = $headers['Authorization'];
        $token = substr($header, 7);

        $userFuncs = new UserFuncs();
        $users = $userFuncs->changeAccountPin($token, $old_pin, $new_pin);

        if ($users === "Success") {
            header('Content-Type: application/json');
            http_response_code(200);
            echo json_encode(array('success' => true, 'message' => "Pin Changed"));
            exit();
        }
    } else {
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode(array('error' => true, 'message' => 'Invalid'));
    }
}
