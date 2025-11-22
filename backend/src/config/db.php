<?php

$cfg = [];
$envPath = dirname(__DIR__, 2) . '/.env';

if (is_readable($envPath)) {
  $parsed = parse_ini_file($envPath, false, INI_SCANNER_TYPED);
  if (is_array($parsed)) {
    $cfg = $parsed;
  }
}
$host = $cfg['DB_HOST'] ?? '127.0.0.1';
$db   = $cfg['DB_NAME'] ?? 'ecommerce';
$user = $cfg['DB_USER'] ?? 'root';
$pass = $cfg['DB_PASS'] ?? '';
$dsn  = "mysql:host=$host;dbname=$db;charset=utf8mb4";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'DB connection failed',
        'details' => $e->getMessage()
    ]);
    exit;
}
