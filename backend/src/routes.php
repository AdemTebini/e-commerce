<?php
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/ProductController.php';
require_once __DIR__ . '/controllers/UploadController.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:4200");
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$scriptName = str_replace('\\','/', dirname($_SERVER['SCRIPT_NAME']));
$base = rtrim($scriptName, '/');
if ($base === '/') $base = '';
$path = preg_replace('#^' . preg_quote($base) . '#', '', $uri);
if ($path === '') $path = '/';
$method = $_SERVER['REQUEST_METHOD'];

if ($path == '/api/auth/register' && $method == 'POST') { AuthController::register(); exit; }
if ($path == '/api/auth/login' && $method == 'POST') { AuthController::login(); exit; }
if ($path == '/api/uploads' && $method == 'POST') { UploadController::store(); exit; }
if ($path == '/api/products' && $method == 'GET') { ProductController::index(); exit; }
if ($path == '/api/products' && $method == 'POST') { ProductController::store(); exit; }
// existing requires...
if (preg_match('#^/api/products/(\d+)$#', $path, $m) && $method == 'GET') { ProductController::show($m[1]); exit; }
if (preg_match('#^/api/products/(\d+)$#', $path, $m) && $method == 'PUT') { ProductController::update($m[1]); exit; }
if (preg_match('#^/api/products/(\d+)$#', $path, $m) && $method == 'DELETE') { ProductController::delete($m[1]); exit; }

http_response_code(404);
echo json_encode(['error' => 'Not found']);
