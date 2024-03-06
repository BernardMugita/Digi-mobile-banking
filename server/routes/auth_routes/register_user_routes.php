<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require '../../vendor/autoload.php';

use Ramsey\Uuid\Uuid;


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    include '../../controllers/auth/auth_funcs.php';

    $json = file_get_contents('php://input');
    $data = json_decode($json);

    var_dump($data);

    // Generate a UUID
    $uuid = Uuid::uuid4();

    function generateAccountNumber()
    {
        $min = 100000000000; // Minimum 12-digit number
        $max = 999999999999; // Maximum 12-digit number

        return rand($min, $max);
    }

    $userId = $uuid->toString();
    $firstname = $data->firstname ?? '';
    $lastname = $data->lastname ?? '';
    $username = $data->username ?? '';
    $email = $data->email ?? '';
    $role = 'user';
    $pin = $data->pin ?? '';
    $accountno = generateAccountNumber();

    $authFuncs = new AuthFuncs;

    $result = $authFuncs->RegisterUser($userId, $firstname, $lastname, $username, $email, $role, $pin, $accountno);

    // Handle the result accordingly, e.g., send JSON response
    try {
        if ($result != null) {
            echo json_encode(array('success' => true, 'user' => $result));
        } else {
            // Handle registration failure
            echo json_encode(array('success' => false, 'message' => 'Registration failed'));
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo "Error: " . $e->getMessage();
    }
}
