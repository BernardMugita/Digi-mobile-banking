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

        $checkNumber = $data->checkNumber ?? '';

        $accountFuncs = new AccountFuncs();
        $message = $accountFuncs->stopCheque($token, $checkNumber);

        if ($message === "Cheque stopped successfully") {
            header('Content-Type: application/json');
            http_response_code(200);
            echo json_encode(array('success' => true, 'message' => "Cheque stopped successfully"));
            exit();
        } else {
            header('Content-Type: application/json');
            http_response_code(400);
            echo json_encode(array('error' => true, 'message' => $message));
            exit();
        }
    } else {
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode(array('error' => true, 'message' => 'Invalid'));
    }
}

