<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $headers = getallheaders();
    $token = null;

    $json = file_get_contents('php://input');
    $data = json_decode($json);

    var_dump($data);

    if (isset($headers['authorization'])) {
        include '../../controllers/user/user_funcs.php';

        $header = $headers['authorization'];
        $token = substr($header, 7);

        $userFuncs = new UserFuncs();
        $users = $userFuncs->editUserAccount($token, $data);

        if ($users !== null) {
            header('Content-Type: application/json');
            http_response_code(200);
            echo json_encode(array('success' => true, 'users' => $users));
            exit();
        }
    } else {
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode(array('error' => true, 'message' => 'Invalid'));
    }
}
