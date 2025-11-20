<?php
class UploadController {
  public static function store() {
    if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) { http_response_code(400); echo json_encode(['error'=>'No file']); return; }
    $file = $_FILES['file'];
    if ($file['size'] > 5 * 1024 * 1024) { http_response_code(413); echo json_encode(['error'=>'File too large']); return; }
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);
    $allowed = ['image/jpeg'=>'jpg','image/pjpeg'=>'jpg','image/png'=>'png','image/gif'=>'gif'];
    if (!isset($allowed[$mime])) { http_response_code(415); echo json_encode(['error'=>'Invalid image type']); return; }
    $ext = $allowed[$mime]; $name = bin2hex(random_bytes(12)) . '.' . $ext;
    $uploadDir = __DIR__ . '/../../public/uploads/'; if (!is_dir($uploadDir)) mkdir($uploadDir,0755,true);
    $dest = $uploadDir . $name; if (!move_uploaded_file($file['tmp_name'],$dest)) { http_response_code(500); echo json_encode(['error'=>'Failed save']); return; }
    $publicUrl = '/ecommerce/backend/public/uploads/' . $name;
    echo json_encode(['success'=>true,'filename'=>$name,'url'=>$publicUrl]);
  }
}
