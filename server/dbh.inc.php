<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// require_once realpath(__DIR__ . "/server/vendor/autoload.php");

// use Dotenv\Dotenv;
//
// $dotenv = Dotenv::createImmutable(__DIR__);
// $dotenv->load();

$host = 'localhost';
$user = 'root';
$password = 'Rom3$Ward';
$database = 'digisoft';

$dsn = "mysql:host=$host;dbname=$database";

try {
    $pdo = new PDO($dsn, $user, $password);

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    exit;
}
