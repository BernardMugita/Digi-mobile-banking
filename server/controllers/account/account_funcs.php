<?php

require '../../vendor/autoload.php';

use \Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AccountFuncs

{

    public function activateAccount($token, $accountId, $balance)
    {
        include '../../dbh.inc.php';

        $user = null;

        $secretKey = '9784df715bd96b48816d99791b65d8d7a5ba820a95a790104dbf7c4ebb7dbc2f21ea8cf297f7280943aa42b16bd47633fbf1a3935a9a462aaef5a32f07d40278';

        try {
            $decodedToken = JWT::decode($token, new Key($secretKey, 'HS256'));

            $userId = $decodedToken->user_id;

            $stmt = $pdo->prepare("SELECT * FROM Users WHERE user_id = :userId");
            $stmt->execute([':userId' => $userId]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user != null) {
                $accountNumber = $user['accountno']; // Access array elements using []

                // Initialize transactions as an empty array
                $transactions = [];

                $stmt = $pdo->prepare("INSERT INTO Accounts (account_id, accountno, balance, transactions) VALUES (?, ?, ?, ?)");
                $stmt->execute([$accountId, $accountNumber, $balance, json_encode($transactions)]);

                $activatedAccount = array(
                    "account_id" => $accountId,
                    "accountno" => $accountNumber,
                    "balance" => $balance,
                    "transactions" => $transactions
                );

                http_response_code(200);
                return $activatedAccount;
            } else {
                http_response_code(404);
                echo "User not Found!";
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo "Error decoding token: " . $e->getMessage();
        }
    }

    public function depositMoney($token, $amount, $depositType)
    {
        include '../../dbh.inc.php';

        $user = null;

        $secretKey = '9784df715bd96b48816d99791b65d8d7a5ba820a95a790104dbf7c4ebb7dbc2f21ea8cf297f7280943aa42b16bd47633fbf1a3935a9a462aaef5a32f07d40278';

        try {
            $decodedToken = JWT::decode($token, new Key($secretKey, 'HS256'));

            $userId = $decodedToken->user_id;

            $stmt = $pdo->prepare("SELECT * FROM Users WHERE user_id = :userId");
            $stmt->execute([':userId' => $userId]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user != null) {
                $accountNumber = $user['accountno']; // Access array elements using []

                $stmt = $pdo->prepare("SELECT * FROM Accounts WHERE accountno = :accountNumber");
                $stmt->execute([':accountNumber' => $accountNumber]);
                $account = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($account != null) {

                    // Decode existing transactions array
                    $existingTransactions = json_decode($account['transactions'], true);

                    // Generate new transaction code
                    function generateTransactionCode()
                    {
                        $pattern = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';

                        $code = '';
                        $patternLength = strlen($pattern);
                        for ($i = 0; $i < 6; $i++) {
                            $randomIndex = mt_rand(0, $patternLength - 1);
                            $code .= $pattern[$randomIndex];
                        }

                        return $code;
                    }
                    $transactionCode = generateTransactionCode();

                    // Determine status based on deposit type
                    $status = ($depositType == 'cash') ? 'complete' : (($depositType == 'check') ? 'pending' : '');

                    // Create new transaction
                    $newTransaction = [
                        "transaction_code" => $transactionCode,
                        "deposit_type" => $depositType,
                        "status" => $status,
                        "amount" => $amount
                    ];

                    // Append new transaction to existing transactions array
                    $existingTransactions[] = $newTransaction;

                    // Encode updated transactions array to JSON
                    $transactions = json_encode($existingTransactions);

                    // Update balance and transactions in the database
                    $stmt = $pdo->prepare("UPDATE Accounts SET balance = balance + :amount, transactions = :transactions WHERE accountno = :accountNumber");
                    $stmt->execute([':amount' => $amount, ':transactions' => $transactions, ':accountNumber' => $accountNumber]);

                    if ($stmt->rowCount() > 0) {
                        return "Success";
                    }
                } else {
                    http_response_code(404);
                    echo "Account does not exist";
                }
            } else {
                http_response_code(404);
                echo "User not found";
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo "Error decoding token: " . $e->getMessage();
        }
    }



    public function getAccountBalance($token)
    {
        include '../../dbh.inc.php';

        $secretKey = '9784df715bd96b48816d99791b65d8d7a5ba820a95a790104dbf7c4ebb7dbc2f21ea8cf297f7280943aa42b16bd47633fbf1a3935a9a462aaef5a32f07d40278';

        try {
            $decodedToken = JWT::decode($token, new Key($secretKey, 'HS256'));

            $userId = $decodedToken->user_id;

            $stmt = $pdo->prepare("SELECT u.firstname, u.lastname, a.accountno, a.balance, a.transactions, a.transfers
                               FROM Users u
                               JOIN Accounts a ON u.accountno = a.accountno
                               WHERE u.user_id = :userId");
            $stmt->execute([':userId' => $userId]);
            $account = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($account != null) {
                // Return the account information
                return $account;
            } else {
                http_response_code(404);
                echo json_encode(array('success' => false, 'message' => "Account not found"));
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo "Error executing SQL query: " . $e->getMessage();
        } catch (Exception $e) {
            http_response_code(500);
            echo "Error decoding token: " . $e->getMessage();
        }
    }

    public function transferMoney($token, $amount, $transferType, $recipientAccountNumber)
    {
        include '../../dbh.inc.php';

        $user = null;

        $secretKey = '9784df715bd96b48816d99791b65d8d7a5ba820a95a790104dbf7c4ebb7dbc2f21ea8cf297f7280943aa42b16bd47633fbf1a3935a9a462aaef5a32f07d40278';

        try {
            $decodedToken = JWT::decode($token, new Key($secretKey, 'HS256'));

            $userId = $decodedToken->user_id;

            $stmt = $pdo->prepare("SELECT * FROM Users WHERE user_id = :userId");
            $stmt->execute([':userId' => $userId]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user != null) {
                $senderAccountNumber = $user['accountno'];

                // Fetch sender account details
                $stmt = $pdo->prepare("SELECT * FROM Accounts WHERE accountno = :accountNumber");
                $stmt->execute([':accountNumber' => $senderAccountNumber]);
                $senderAccount = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($senderAccount != null) {
                    // Check sender account balance
                    $senderBalance = $senderAccount['balance'];
                    if ($senderBalance >= $amount) {
                        // Determine transfer type (cash or check)
                        $transferType = ($transferType == 'cash') ? 'cash' : 'check';

                        // Generate unique transaction code
                        function generateTransactionCode()
                        {
                            $pattern = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';

                            $code = '';
                            $patternLength = strlen($pattern);
                            for ($i = 0; $i < 6; $i++) {
                                $randomIndex = mt_rand(0, $patternLength - 1);
                                $code .= $pattern[$randomIndex];
                            }

                            return $code;
                        }

                        // Generate unique check number for check transfers
                        function generateCheckNumber()
                        {
                            $pattern = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

                            $checkNumber = '';
                            $patternLength = strlen($pattern);
                            for ($i = 0; $i < 8; $i++) {
                                $randomIndex = mt_rand(0, $patternLength - 1);
                                $checkNumber .= $pattern[$randomIndex];
                            }

                            return $checkNumber;
                        }

                        $transactionCode = generateTransactionCode();
                        $checkNumber = ($transferType == 'check') ? generateCheckNumber() : null;

                        // Create transfer data
                        $transferData = [
                            "transaction_code" => $transactionCode,
                            "transaction_type" => $transferType,
                            "amount" => $amount,
                            "check_number" => $checkNumber,
                            "status" => 'pending' // Add status field
                        ];

                        $stmt = $pdo->prepare("SELECT * FROM Accounts WHERE accountno = :accountNumber");
                        $stmt->execute([':accountNumber' => $recipientAccountNumber]);
                        $recipientAccount = $stmt->fetch(PDO::FETCH_ASSOC);

                        if ($recipientAccount != null) {
                            // Update sender's balance
                            $newSenderBalance = $senderBalance - $amount;
                            $stmt = $pdo->prepare("UPDATE Accounts SET balance = :balance WHERE accountno = :accountNumber");
                            $stmt->execute([':balance' => $newSenderBalance, ':accountNumber' => $senderAccountNumber]);

                            // Update recipient's balance
                            $recipientBalance = $recipientAccount['balance'];
                            $newRecipientBalance = $recipientBalance + $amount;
                            $stmt = $pdo->prepare("UPDATE Accounts SET balance = :balance WHERE accountno = :accountNumber");
                            $stmt->execute([':balance' => $newRecipientBalance, ':accountNumber' => $recipientAccountNumber]);

                            // Append transfer to sender's transfers array
                            $existingTransfers = json_decode($senderAccount['transfers'], true);
                            $existingTransfers[] = $transferData;
                            $updatedTransfers = json_encode($existingTransfers);
                            $stmt = $pdo->prepare("UPDATE Accounts SET transfers = :transfers WHERE accountno = :accountNumber");
                            $stmt->execute([':transfers' => $updatedTransfers, ':accountNumber' => $senderAccountNumber]);

                            // Log the transaction (optional)

                            // Return success message or updated account details
                            return "Transfer successful";
                        } else {
                            http_response_code(404);
                            echo "Recipient account not found";
                        }
                    } else {
                        http_response_code(400);
                        echo "Insufficient balance";
                    }
                } else {
                    http_response_code(404);
                    echo "Sender account not found";
                }
            } else {
                http_response_code(404);
                echo "User not found";
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo "Error executing SQL query: " . $e->getMessage();
        } catch (Exception $e) {
            http_response_code(500);
            echo "Error decoding token: " . $e->getMessage();
        }
    }


    public function stopCheque($token, $checkNumber)
    {
        include '../../dbh.inc.php';

        $user = null;

        $secretKey = '9784df715bd96b48816d99791b65d8d7a5ba820a95a790104dbf7c4ebb7dbc2f21ea8cf297f7280943aa42b16bd47633fbf1a3935a9a462aaef5a32f07d40278';

        try {
            $decodedToken = JWT::decode($token, new Key($secretKey, 'HS256'));

            $userId = $decodedToken->user_id;

            $stmt = $pdo->prepare("SELECT * FROM Users WHERE user_id = :userId");
            $stmt->execute([':userId' => $userId]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user != null) {
                $accountNumber = $user['accountno'];

                $stmt = $pdo->prepare("SELECT * FROM Accounts WHERE accountno = :accountNumber");
                $stmt->execute([':accountNumber' => $accountNumber]);
                $account = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($account != null) {
                    // Decode existing transfers array
                    $transfers = json_decode($account['transfers'], true);

                    echo $transfers;

                    // Check if transfers array is not empty
                    if (!empty($transfers)) {
                        // Iterate through transfers and find the cheque with the given cheque number
                        foreach ($transfers as &$transfer) {
                            if ($transfer['transaction_type'] === 'check' && $transfer['check_number'] === $checkNumber) {
                                // Update the status of the found cheque to 'cancelled'
                                $transfer['status'] = 'cancelled';
                                break;
                            }
                        }

                        // Encode updated transfers array to JSON
                        $updatedTransfers = json_encode($transfers);

                        // Update transfers in the database
                        $stmt = $pdo->prepare("UPDATE Accounts SET transfers = :transfers WHERE accountno = :accountNumber");
                        $stmt->execute([':transfers' => $updatedTransfers, ':accountNumber' => $accountNumber]);

                        // Check if the update was successful
                        if ($stmt->rowCount() > 0) {
                            return "Cheque stopped successfully";
                        } else {
                            return "Failed to stop cheque";
                        }
                    } else {
                        // If transfers array is empty, return appropriate message
                        return "No transfers found";
                    }
                } else {
                    http_response_code(404);
                    return "Account does not exist";
                }
            } else {
                http_response_code(404);
                return "User not found";
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return "Error executing SQL query: " . $e->getMessage();
        } catch (Exception $e) {
            http_response_code(500);
            return "Error decoding token: " . $e->getMessage();
        }
    }
}
