<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

require __DIR__ . '/../../src/config/db.php';
require __DIR__ . '/../../src/controllers/ProductController.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = resolveResourceId();

switch ($method) {
    case 'GET':
        if ($id !== null) {
            ProductController::show($id);
        } else {
            ProductController::index();
        }
        break;

    case 'POST':
        ProductController::store();
        break;

    case 'PUT':
        if ($id === null) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing product id']);
            break;
        }
        ProductController::update($id);
        break;

    case 'DELETE':
        if ($id === null) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing product id']);
            break;
        }
        ProductController::delete($id);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}

function resolveResourceId(): ?int
{
    if (isset($_GET['id'])) {
        $id = (int) $_GET['id'];
        return $id > 0 ? $id : null;
    }

    $pathInfo = $_SERVER['PATH_INFO'] ?? '';
    if ($pathInfo === '' && isset($_SERVER['REQUEST_URI'], $_SERVER['SCRIPT_NAME'])) {
        $request = strtok($_SERVER['REQUEST_URI'], '?');
        $script = $_SERVER['SCRIPT_NAME'];
        if (strpos($request, $script) === 0) {
            $pathInfo = substr($request, strlen($script));
        }
    }

    $pathInfo = trim($pathInfo, '/');
    if ($pathInfo === '') {
        return null;
    }

    $segments = explode('/', $pathInfo);
    $candidate = (int) ($segments[0] ?? 0);

    return $candidate > 0 ? $candidate : null;
}
