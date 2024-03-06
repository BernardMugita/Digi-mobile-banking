<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $headers = getallheaders();
    $token = null;

    $json = file_get_contents('php://input');
    $data = json_decode($json);

    if (isset($headers['Authorization'])) {
        include '../../controllers/account/account_funcs.php';

        $header = $headers['Authorization'];
        $token = substr($header, 7);

        $accountFuncs = new AccountFuncs();
        $account = $accountFuncs->getAccountBalance($token);

        if ($account !== null) {
            header('Content-Type: application/json');
            http_response_code(200);
            echo json_encode(array('success' => true, 'account' => $account));
            exit();
        }
    } else {
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode(array('error' => true, 'message' => 'Invalid'));
    }
}
