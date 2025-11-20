// File: backend/src/models/Product.php
<?php
class Product {
public $id; public $title; public $slug; public $price; public $stock; public $main_image; public function __construct($data=[]) { foreach($data as $k=>$v) $this->$k=$v; }
}