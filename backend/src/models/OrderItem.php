<?php

namespace App\Models;

use JsonSerializable;

class OrderItem implements JsonSerializable
{
    public int $orderId;
    public int $productId;
    public string $productTitle;
    public float $price;
    public int $quantity;

    public function __construct(int $orderId, int $productId, string $productTitle, float $price, int $quantity)
    {
        $this->orderId = $orderId;
        $this->productId = $productId;
        $this->productTitle = $productTitle;
        $this->price = $price;
        $this->quantity = $quantity;
    }

    public static function fromArray(array $row): self
    {
        return new self(
            (int) ($row['order_id'] ?? 0),
            (int) ($row['product_id'] ?? 0),
            (string) ($row['product_title'] ?? ''),
            (float) ($row['price'] ?? 0),
            (int) ($row['quantity'] ?? 0),
        );
    }

    public function jsonSerialize(): array
    {
        return [
            'order_id' => $this->orderId,
            'product_id' => $this->productId,
            'product_title' => $this->productTitle,
            'title' => $this->productTitle, // Alias for frontend
            'price' => $this->price,
            'quantity' => $this->quantity,
        ];
    }
}
