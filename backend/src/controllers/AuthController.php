<?php
class AuthController {

  private static function ensureSession(): void {
    if (session_status() !== PHP_SESSION_ACTIVE) {
      session_start();
    }
  }

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
    $stmt = $pdo->prepare('SELECT id,password,name,email,role FROM users WHERE email = ?');
    $stmt->execute([$email]); $user = $stmt->fetch();
    if (!$user || !password_verify($password, $user['password'])) { http_response_code(401); echo json_encode(['error'=>'Invalid credentials']); return; }
    self::ensureSession();
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role'] = $user['role'] ?? 'customer';
    echo json_encode(['success'=>true,'user'=>[
      'id'=>$user['id'],
      'name'=>$user['name'],
      'email'=>$user['email'],
      'role'=>$user['role'] ?? 'customer'
    ]]);
  }

  public static function logout() {
    self::ensureSession();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
      $params = session_get_cookie_params();
      setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
    echo json_encode(['success' => true]);
  }

  public static function me() {
    global $pdo;
    self::ensureSession();
    if (empty($_SESSION['user_id'])) {
      http_response_code(401);
      echo json_encode(['error' => 'Not logged in']);
      return;
    }
    $stmt = $pdo->prepare('SELECT id,name,email,role FROM users WHERE id = ?');
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();
    if (!$user) {
      http_response_code(404);
      echo json_encode(['error' => 'User not found']);
      return;
    }
    echo json_encode($user);
  }
}
