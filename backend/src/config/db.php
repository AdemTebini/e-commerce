<?php
$env = __DIR__ . '/../../.env';
if (!file_exists($env)) {
    http_response_code(500);
    echo json_encode(['error' => '.env not found']);
    exit;
}
$cfg = parse_ini_file($env);
$host = $cfg['DB_HOST'] ?? '127.0.0.1';
$db   = $cfg['DB_NAME'] ?? 'ecommerce';
$user = $cfg['DB_USER'] ?? 'root';
$pass = $cfg['DB_PASS'] ?? '';
$dsn  = "mysql:host=$host;dbname=$db;charset=utf8mb4";
$options = [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];
try {
  $pdo = new PDO($dsn, $user, $pass, $options);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
  exit;
}
