<?php

require '../../vendor/autoload.php';

use \Firebase\JWT\JWT;

class AuthFuncs
{
    public function RegisterUser($userId, $firstname, $lastname, $username, $email, $role, $pin, $accountno)
    {
        include '../../dbh.inc.php';

        try {
            // Code to insert user data into the database
            $query = "INSERT INTO Users (user_id, firstname, lastname, username, email, role, pin, accountno) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            $stmt = $pdo->prepare($query);
            $stmt->execute([$userId, $firstname, $lastname, $username, $email, $role, $pin, $accountno]);

            // If query success, create user array to encode into JWT
            $user = array(
                "user_id" => $userId,
                "firstname" => $firstname,
                "lastname" => $lastname,
                "username" => $username,
                "email" => $email,
                "role" => $role,
                "pin" => $pin,
                "accountno" => $accountno
            );

            http_response_code(200);
            return $user;
        } catch (PDOException $e) {
            http_response_code(500);
            echo "Registration failed: " . $e->getMessage();
        }
    }

    public function Login($username, $pin)
    {
        $user = null;
        include '../../dbh.inc.php';

        try {
            $stmt = $pdo->prepare("SELECT * FROM Users WHERE username = :username");
            $stmt->execute(['username' => $username]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                if ($user['pin'] == $pin) {
                    // User authentication successful
                    http_response_code(200);
                    $jwtToken = $this->generateJWT($user);
                    return $jwtToken;
                } else {
                    http_response_code(503);
                    echo "Invalid Credentials";
                }
            } else {
                http_response_code(404);
                echo "User account does not exist!";
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo "Error: " . $e->getMessage();
        }
    }




    private function generateJWT($user)
    {

        try {
            // Load JWT class

            // Set up payload
            $jwtPayload = array(
                'user_id' => $user['user_id'],
                'username' => $user['username'],
                // Add more user data as needed
            );

            // Set your secret key
            $secretKey = '9784df715bd96b48816d99791b65d8d7a5ba820a95a790104dbf7c4ebb7dbc2f21ea8cf297f7280943aa42b16bd47633fbf1a3935a9a462aaef5a32f07d40278';

            // Encode the JWT token
            $jwtToken = JWT::encode($jwtPayload, $secretKey, 'HS256');

            return $jwtToken;
        } catch (Exception $e) {
            // Log or handle the error appropriately
            error_log('Error generating JWT: ' . $e->getMessage());
            // You can also re-throw the exception if needed
            throw $e;
        }
    }
};
