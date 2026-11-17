<?php
require __DIR__.'/../vendor/autoload.php';

try {
    $pdo = new PDO("mysql:host=localhost;port=3306;dbname=asiancon_managecore", "managecore", "Aleem1125513\$!");
    echo "DB CONNECTION OK";
} catch (Exception $e) {
    echo "DB FAILED: " . $e->getMessage();
}