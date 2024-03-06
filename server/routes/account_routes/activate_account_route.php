<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require '../../vendor/autoload.php';

use Ramsey\Uuid\Uuid;


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    include '../../controllers/account/account_funcs.php';

    $headers = getallheaders();
    $token = null;

    $uuid = Uuid::uuid4();

    if (isset($headers['Authorization'])) {
        include '../../controllers/user/user_funcs.php';

        $header = $headers['Authorization'];
        $token = substr($header, 7);

        $accountId = $uuid->toString();

        $balance = 0;

        $accountFuncs = new AccountFuncs();
        $account = $accountFuncs->activateAccount($token, $accountId, $balance);

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
