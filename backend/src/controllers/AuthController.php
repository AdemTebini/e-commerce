<?php
class AuthController {
  public static function register() {
    global $pdo;
    $data = json_decode(file_get_contents('php://input'), true);
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    if (!$name || !$email || !$password) { http_response_code(422); echo json_encode(['error'=>'Missing fields']); return; }
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?'); $stmt->execute([$email]); if ($stmt->fetch()) { http_response_code(409); echo json_encode(['error'=>'Email exists']); return; }
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare('INSERT INTO users (name,email,password) VALUES (?,?,?)');
    $stmt->execute([$name,$email,$hash]);
    echo json_encode(['success'=>true,'user_id'=>$pdo->lastInsertId()]);
  }

  public static function login() {
    global $pdo;
    $data = json_decode(file_get_contents('php://input'), true);
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    if (!$email || !$password) { http_response_code(422); echo json_encode(['error'=>'Missing fields']); return; }
    $stmt = $pdo->prepare('SELECT id,password,name,email FROM users WHERE email = ?');
    $stmt->execute([$email]); $user = $stmt->fetch();
    if (!$user || !password_verify($password, $user['password'])) { http_response_code(401); echo json_encode(['error'=>'Invalid credentials']); return; }
    session_start(); $_SESSION['user_id'] = $user['id'];
    echo json_encode(['success'=>true,'user'=>['id'=>$user['id'],'name'=>$user['name'],'email'=>$user['email']]]);
  }
}
