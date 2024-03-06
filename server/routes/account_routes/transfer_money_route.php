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

        $amount = $data->amount ?? '';
        $transferType = $data->transferType ?? '';
        $recipientAccountNumber = $data->recipientAccountNumber ?? '';

        $accountFuncs = new AccountFuncs();
        $accountMessage = $accountFuncs->transferMoney($token, $amount, $transferType, $recipientAccountNumber);

        if ($accountMessage === "Transfer successful") {
            header('Content-Type: application/json');
            http_response_code(200);
            echo json_encode(array('success' => true, 'message' => "Your transfer was successful"));
            exit();
        } else {
            if ($accountMessage === "Recipient account not found") {
                http_response_code(404);
                echo json_encode(array('error' => true, 'message' => "Recipient account not found"));
                exit();
            } elseif ($accountMessage === "Insufficient balance") {
                http_response_code(400);
                echo json_encode(array('error' => true, 'message' => "Insufficient balance"));
                exit();
            }
        }
    } else {
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode(array('error' => true, 'message' => 'Invalid'));
    }
}
