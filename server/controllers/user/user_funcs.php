<?php

require '../../vendor/autoload.php';

use \Firebase\JWT\JWT;
use Firebase\JWT\Key;

class UserFuncs

{

    public function getUser($token)
    {
        include '../../dbh.inc.php';

        $user = null;

        $secretKey = '9784df715bd96b48816d99791b65d8d7a5ba820a95a790104dbf7c4ebb7dbc2f21ea8cf297f7280943aa42b16bd47633fbf1a3935a9a462aaef5a32f07d40278';

        try {
            $decodedToken = JWT::decode($token, new Key($secretKey, 'HS256'));

            if (is_object($decodedToken)) {
                $userId = $decodedToken->user_id;

                $stmt = $pdo->prepare("SELECT * FROM Users WHERE user_id = :userId");
                $stmt->execute([':userId' => $userId]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($user != null) {
                    http_response_code(200);
                    return $user;
                } else {
                    http_response_code(404);
                    echo "User not Found!";
                }
            } else {
                http_response_code(400);
                echo "Invalid token format";
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo "Error decoding token: " . $e->getMessage();
        }
    }



    public function getAllUsers($token)
    {
        include '../../dbh.inc.php';

        $secretKey = '9784df715bd96b48816d99791b65d8d7a5ba820a95a790104dbf7c4ebb7dbc2f21ea8cf297f7280943aa42b16bd47633fbf1a3935a9a462aaef5a32f07d40278';

        try {
            $decodedToken = JWT::decode($token, new Key($secretKey, 'HS256'));

            $userId = $decodedToken->user_id;

            $stmt = $pdo->prepare("SELECT * FROM Users WHERE user_id = :userId");
            $stmt->execute([':userId' => $userId]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            $role = $user['role'];

            if ($role == 'admin') {
                $stmt2 = $pdo->prepare("SELECT * FROM Users");
                $stmt2->execute();
                $users = $stmt2->fetchAll(PDO::FETCH_ASSOC);

                if ($users != null) {
                    http_response_code(200);
                    return $users;
                } else {
                    http_response_code(404);
                    echo "No users found!";
                }
            } else {
                http_response_code(403);
                echo "Unauthorized";
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo "Error: " . $e->getMessage();
        }
    }

    public function editUserAccount($token, $data)
    {
        include '../../dbh.inc.php';

        $secretKey = '9784df715bd96b48816d99791b65d8d7a5ba820a95a790104dbf7c4ebb7dbc2f21ea8cf297f7280943aa42b16bd47633fbf1a3935a9a462aaef5a32f07d40278';

        try {
            $decodedToken = JWT::decode($token, new Key($secretKey, 'HS256'));

            $userId = $decodedToken->user_id;

            $stmt = $pdo->prepare("SELECT * FROM Users WHERE user_id = :userId");
            $stmt->execute([':userId' => $userId]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user != null) {
                // Update user account with new data
                $firstname = $data->firstname ?? $user['firstname'];
                $lastname = $data->lastname ?? $user['lastname'];
                $email = $data->email ?? $user['email'];

                $stmt = $pdo->prepare("UPDATE Users SET firstname = :firstname, lastname = :lastname, email = :email WHERE user_id = :userId");
                $stmt->execute([':firstname' => $firstname, ':lastname' => $lastname, ':email' => $email, ':userId' => $userId]);

                // Check if update was successful
                if ($stmt->rowCount() > 0) {
                    $updatedUser = $this->getUser($token);

                    if ($updatedUser !== null) {
                        http_response_code(200);
                        echo json_encode(array('success' => true, 'message' => 'User account updated successfully', 'user' => $updatedUser));
                    } else {
                        http_response_code(200);
                        echo json_encode(array('success' => true, 'message' => 'User account updated successfully'));
                    }
                } else {
                    http_response_code(500);
                    echo "Failed to update user account";
                }
            } else {
                http_response_code(404);
                echo "User not found";
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo "Error: " . $e->getMessage();
        }
    }

    public function deleteUserAccount($token)
    {
        include '../../dbh.inc.php';

        $secretKey = '9784df715bd96b48816d99791b65d8d7a5ba820a95a790104dbf7c4ebb7dbc2f21ea8cf297f7280943aa42b16bd47633fbf1a3935a9a462aaef5a32f07d40278';

        try {
            $decodedToken = JWT::decode($token, new Key($secretKey, 'HS256'));

            $userId = $decodedToken->user_id;

            $stmt = $pdo->prepare("SELECT * FROM Users WHERE user_id = :userId");
            $stmt->execute([':userId' => $userId]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user != null) {
                $stmt = $pdo->prepare("DELETE FROM Users WHERE user_id = :userId");
                $stmt->execute([':userId' => $userId]);

                // Check if deletion was successful
                if ($stmt->rowCount() > 0) {
                    http_response_code(200);
                    echo "User account deleted successfully";
                } else {
                    http_response_code(500);
                    echo "Failed to delete user account";
                }
            } else {
                http_response_code(404);
                echo "User not found";
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo "Error: " . $e->getMessage();
        }
    }

    public function changeAccountPin($token, $old_pin, $new_pin)
    {
        include '../../dbh.inc.php';

        $secretKey = '9784df715bd96b48816d99791b65d8d7a5ba820a95a790104dbf7c4ebb7dbc2f21ea8cf297f7280943aa42b16bd47633fbf1a3935a9a462aaef5a32f07d40278';

        try {
            $decodedToken = JWT::decode($token, new Key($secretKey, 'HS256'));

            $userId = $decodedToken->user_id;

            $stmt = $pdo->prepare("SELECT * FROM Users WHERE user_id = :userId");
            $stmt->execute([':userId' => $userId]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user != null && $old_pin == $user['pin']) {
                $stmt = $pdo->prepare("UPDATE Users SET pin = :newPin WHERE user_id = :userId");
                $stmt->execute([':newPin' => $new_pin, ':userId' => $userId]);
                $affectedRows = $stmt->rowCount();

                if ($affectedRows > 0) {
                    http_response_code(200);
                    return "Success";
                } else {
                    http_response_code(404);
                    echo json_encode(array('error' => true, 'message' => 'No users found!'));
                }
            } else {
                http_response_code(503);
                echo json_encode(array('error' => true, 'message' => 'Your old pin is wrong'));
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(array('error' => true, 'message' => 'Error: ' . $e->getMessage()));
        }
    }
}
