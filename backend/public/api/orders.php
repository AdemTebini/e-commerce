<?php

use App\Controllers\OrderController;

session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../src/config/db.php';
require_once __DIR__ . '/../../src/models/Order.php';
require_once __DIR__ . '/../../src/models/OrderItem.php';
require_once __DIR__ . '/../../src/controllers/OrderController.php';

$controller = new OrderController($pdo);
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'POST':
            ensureLoggedIn();
            $payload = json_decode(file_get_contents('php://input'), true) ?? [];
            $result = $controller->createOrder(
                (int) $_SESSION['user_id'],
                $payload['address'] ?? [],
                $payload['payment_method'] ?? 'cod',
                $payload['items'] ?? [],
            );

            http_response_code(201);
            echo json_encode($result);
            break;

        case 'GET':
            ensureLoggedIn();
            $role = $_SESSION['role'] ?? 'customer';
            $orders = $role === 'admin'
                ? $controller->getAllOrdersForAdmin()
                : $controller->getOrdersForUser((int) $_SESSION['user_id']);

            echo json_encode($orders);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
} catch (Throwable $e) {
    $status = $e instanceof InvalidArgumentException ? 400 : 500;
    http_response_code($status);
    echo json_encode(['error' => $e->getMessage()]);
}

function ensureLoggedIn(): void
{
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Not logged in']);
        exit;
    }
}
