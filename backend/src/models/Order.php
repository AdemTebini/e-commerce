<?php

namespace App\Models;

use JsonSerializable;

class Order implements JsonSerializable
{
    /** @var OrderItem[] */
    private array $items = [];
    private ?array $address = null;
    private ?string $paymentMethod = null;

    private int $id;
    private int $userId;
    private float $total;
    private string $status;
    private ?int $paymentId;
    private ?int $shippingAddressId;
    private ?string $createdAt;
    private ?string $customerName;

    public function __construct(
        int $id,
        int $userId,
        float $total,
        string $status,
        ?int $paymentId = null,
        ?int $shippingAddressId = null,
        ?string $createdAt = null,
        ?string $customerName = null
    ) {
        $this->id = $id;
        $this->userId = $userId;
        $this->total = $total;
        $this->status = $status;
        $this->paymentId = $paymentId;
        $this->shippingAddressId = $shippingAddressId;
        $this->createdAt = $createdAt;
        $this->customerName = $customerName;
    }

    public static function fromArray(array $row): self
    {
        return new self(
            (int) ($row['id'] ?? 0),
            (int) ($row['user_id'] ?? 0),
            (float) ($row['total'] ?? 0),
            (string) ($row['status'] ?? 'pending'),
            isset($row['payment_id']) ? (int) $row['payment_id'] : null,
            isset($row['shipping_address_id']) ? (int) $row['shipping_address_id'] : null,
            $row['created_at'] ?? null,
            $row['customer_name'] ?? null,
        );
    }

    public function addItem(OrderItem $item): void
    {
        $this->items[] = $item;
    }

    public function setAddress(?array $address): void
    {
        $this->address = $address;
    }

    public function setPaymentMethod(?string $paymentMethod): void
    {
        $this->paymentMethod = $paymentMethod;
    }

    /**
     * @return OrderItem[]
     */
    public function items(): array
    {
        return $this->items;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->userId,
            'total' => $this->total,
            'status' => $this->status,
            'payment_id' => $this->paymentId,
            'payment_method' => $this->paymentMethod,
            'shipping_address_id' => $this->shippingAddressId,
            'address' => $this->address,
            'created_at' => $this->createdAt,
            'customer_name' => $this->customerName,
            'items' => array_map(fn (OrderItem $item) => $item->jsonSerialize(), $this->items),
        ];
    }
}
