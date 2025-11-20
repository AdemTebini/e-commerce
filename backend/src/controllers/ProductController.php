<?php
class ProductController {
  public static function index() {
    global $pdo;
    $stmt = $pdo->query('SELECT id,title,slug,short_description,price,stock,main_image,created_at FROM products ORDER BY created_at DESC');
    $products = $stmt->fetchAll();
    echo json_encode($products);
  }

  public static function show($id) {
    global $pdo;
    $stmt = $pdo->prepare('SELECT id,title,slug,description,price,stock,main_image FROM products WHERE id = ?');
    $stmt->execute([$id]);
    $product = $stmt->fetch();
    if (!$product) {
      http_response_code(404);
      echo json_encode(['error'=>'Not found']);
      return;
    }
    echo json_encode($product);
  }

  public static function store() {
    global $pdo;
    $data = json_decode(file_get_contents('php://input'), true);
    $title = trim($data['title'] ?? '');
    $description = trim($data['description'] ?? '');
    $price = $data['price'] ?? 0;
    $stock = $data['stock'] ?? 0;
    $image = $data['image'] ?? null;
    if (!$title || $price === '') {
      http_response_code(422);
      echo json_encode(['error'=>'Title and price required']);
      return;
    }
    if ($image) {
      $image = basename($image);
      $path = __DIR__ . '/../../public/uploads/' . $image;
      if (!file_exists($path)) $image = null;
    }
    $slug = self::makeSlug($title);
    $stmt = $pdo->prepare('INSERT INTO products (title,slug,description,price,stock,main_image) VALUES (?,?,?,?,?,?)');
    try {
      $stmt->execute([$title,$slug,$description,$price,$stock,$image]);
      echo json_encode(['success'=>true,'product_id'=>$pdo->lastInsertId()]);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error'=>$e->getMessage()]);
    }
  }

  public static function update($id) {
    global $pdo;
    $data = json_decode(file_get_contents('php://input'), true);
    $title = trim($data['title'] ?? '');
    $description = trim($data['description'] ?? '');
    $price = $data['price'] ?? null;
    $stock = $data['stock'] ?? null;
    $image = $data['image'] ?? null;

    if (!$title || $price === null) {
      http_response_code(422);
      echo json_encode(['error'=>'Title and price required']);
      return;
    }

    $stmt = $pdo->prepare('SELECT id FROM products WHERE id = ?');
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
      http_response_code(404);
      echo json_encode(['error'=>'Not found']);
      return;
    }

    if ($image) {
      $image = basename($image);
      $path = __DIR__ . '/../../public/uploads/' . $image;
      if (!file_exists($path)) $image = null;
    }

    $stmt = $pdo->prepare('UPDATE products SET title = ?, description = ?, price = ?, stock = ?, main_image = ? WHERE id = ?');
    try {
      $stmt->execute([$title, $description, $price, $stock, $image, $id]);
      echo json_encode(['success'=>true]);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error'=>$e->getMessage()]);
    }
  }

  public static function delete($id) {
    global $pdo;
    $stmt = $pdo->prepare('SELECT main_image FROM products WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
      http_response_code(404);
      echo json_encode(['error'=>'Not found']);
      return;
    }
    $image = $row['main_image'] ?? null;
    $stmt = $pdo->prepare('DELETE FROM products WHERE id = ?');
    try {
      $stmt->execute([$id]);
      if ($image) {
        @unlink(__DIR__ . '/../../public/uploads/' . $image);
      }
      echo json_encode(['success'=>true]);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error'=>$e->getMessage()]);
    }
  }

  private static function makeSlug($str) {
    $str = iconv('utf-8','ascii//TRANSLIT',$str);
    $str = preg_replace('/[^A-Za-z0-9-]+/','-',$str);
    $str = strtolower(trim($str,'-'));
    return $str . '-' . substr(bin2hex(random_bytes(3)),0,6);
  }
}
