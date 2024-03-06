<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $headers = getallheaders();
    $token = null;

    if (isset($headers['Authorization'])) { // Note the capitalization of Authorization
        include '../../controllers/user/user_funcs.php';

        $header = $headers['Authorization'];
        $token = substr($header, 7);

        $userFuncs = new UserFuncs();
        $user = $userFuncs->getUser($token);

        if ($user !== null) {
            header('Content-Type: application/json');
            http_response_code(200);
            echo json_encode(array('success' => true, 'user' => $user));
            exit();
        }
    } else {
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode(array('error' => true, 'message' => 'Invalid'));
    }
}
