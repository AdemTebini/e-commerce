// File: backend/src/models/User.php
<?php
class User {
public $id; public $name; public $email; public $avatar; public $created_at;
public function __construct($data=[]) { foreach($data as $k=>$v) $this->$k=$v; }
}