<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use PDO;
use Throwable;

class OrderController
{
	public function __construct(private readonly PDO $pdo)
	{
		$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}

	/**
	 * @param int   $userId        Authenticated user id
	 * @param array $address       ['full_name'=>?, 'line1'=>?, 'city'=>?, ...]
	 * @param string $paymentMethod Expected values: 'cod' | 'card'
	 * @param array $items         [['product_id'=>int, 'quantity'=>int], ...]
	 */
	public function createOrder(int $userId, array $address, string $paymentMethod, array $items): array
	{
		if (empty($items)) {
			throw new \InvalidArgumentException('Cart is empty');
		}

		$this->pdo->beginTransaction();

		try {
			$addressId = $this->insertAddress($userId, $address);

			$products = $this->validateAndEnrichItems($items);
			$total = array_reduce($products, fn (float $carry, array $row) => $carry + $row['line_total'], 0.0);

			$orderId = $this->insertOrder($userId, $addressId, $total);

			$this->insertOrderItemsAndDecreaseStock($orderId, $products);

			$paymentId = $this->insertPayment($orderId, $paymentMethod, $total);
			$this->linkPaymentToOrder($orderId, $paymentId);

			$this->pdo->commit();

			return [
				'order_id' => (int) $orderId,
				'total'    => (float) $total,
				'status'   => 'pending',
			];
		} catch (Throwable $e) {
			$this->pdo->rollBack();
			throw $e;
		}
	}

	public function getOrdersForUser(int $userId): array
	{
		$stmt = $this->pdo->prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC');
		$stmt->execute([$userId]);
		$orders = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

		return array_map(
			fn (Order $order) => $order->jsonSerialize(),
			$this->hydrateOrdersWithItems($orders)
		);
	}

	public function getAllOrdersForAdmin(): array
	{
		$stmt = $this->pdo->query('SELECT o.*, u.name AS customer_name FROM orders o LEFT JOIN users u ON u.id = o.user_id ORDER BY o.created_at DESC');
		$orders = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

		return array_map(
			fn (Order $order) => $order->jsonSerialize(),
			$this->hydrateOrdersWithItems($orders)
		);
	}

	private function insertAddress(int $userId, array $address): int
	{
		$fullName = trim($address['full_name'] ?? '');
		$line1    = trim($address['line1'] ?? '');
		$city     = trim($address['city'] ?? '');

		if ($fullName === '' || $line1 === '' || $city === '') {
			throw new \InvalidArgumentException('Missing required address fields');
		}

		$stmt = $this->pdo->prepare(
			'INSERT INTO addresses (user_id, full_name, phone, line1, line2, city, postal_code, country)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?)' 
		);

		$stmt->execute([
			$userId,
			$fullName,
			trim($address['phone'] ?? ''),
			$line1,
			trim($address['line2'] ?? ''),
			$city,
			trim($address['postal_code'] ?? ''),
			trim($address['country'] ?? 'Tunisia'),
		]);

		return (int) $this->pdo->lastInsertId();
	}

	private function validateAndEnrichItems(array $items): array
	{
		$productStmt = $this->pdo->prepare('SELECT id, title, price, stock FROM products WHERE id = ?');
		$enriched = [];

		foreach ($items as $item) {
			$productId = (int) ($item['product_id'] ?? 0);
			$quantity  = max(1, (int) ($item['quantity'] ?? 1));

			$productStmt->execute([$productId]);
			$product = $productStmt->fetch(PDO::FETCH_ASSOC);

			if (!$product) {
				throw new \RuntimeException('Product not found: ' . $productId);
			}
			if ((int) $product['stock'] < $quantity) {
				throw new \RuntimeException('Insufficient stock for ' . $product['title']);
			}

			$enriched[] = [
				'product_id' => (int) $product['id'],
				'title'      => $product['title'],
				'price'      => (float) $product['price'],
				'quantity'   => $quantity,
				'line_total' => (float) $product['price'] * $quantity,
			];
		}

		return $enriched;
	}

	private function insertOrder(int $userId, int $addressId, float $total): int
	{
		$stmt = $this->pdo->prepare('INSERT INTO orders (user_id, total, status, shipping_address_id) VALUES (?, ?, ?, ?)');
		$stmt->execute([$userId, $total, 'pending', $addressId]);

		return (int) $this->pdo->lastInsertId();
	}

	private function insertOrderItemsAndDecreaseStock(int $orderId, array $items): void
	{
		$itemInsert = $this->pdo->prepare('INSERT INTO order_items (order_id, product_id, product_title, price, quantity) VALUES (?, ?, ?, ?, ?)');
		$stockUpdate = $this->pdo->prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

		foreach ($items as $item) {
			$itemInsert->execute([$orderId, $item['product_id'], $item['title'], $item['price'], $item['quantity']]);
			$stockUpdate->execute([$item['quantity'], $item['product_id']]);
		}
	}

	private function insertPayment(int $orderId, string $paymentMethod, float $total): int
	{
		$stmt = $this->pdo->prepare('INSERT INTO payments (order_id, provider, amount, status) VALUES (?, ?, ?, ?)');
		$stmt->execute([$orderId, $paymentMethod, $total, 'pending']);

		return (int) $this->pdo->lastInsertId();
	}

	private function linkPaymentToOrder(int $orderId, int $paymentId): void
	{
		$stmt = $this->pdo->prepare('UPDATE orders SET payment_id = ? WHERE id = ?');
		$stmt->execute([$paymentId, $orderId]);
	}

	/**
	 * @return Order[]
	 */
	private function hydrateOrdersWithItems(array $orders): array
	{
		if (!$orders) {
			return [];
		}

		$orderMap = [];
		foreach ($orders as $row) {
			$orderMap[$row['id']] = Order::fromArray($row);
		}

		$orderIds = array_keys($orderMap);
		$placeholders = implode(',', array_fill(0, count($orderIds), '?'));

		// Fetch order items
		$itemStmt = $this->pdo->prepare("SELECT * FROM order_items WHERE order_id IN ($placeholders)");
		$itemStmt->execute($orderIds);
		$items = $itemStmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

		foreach ($items as $itemRow) {
			$orderId = (int) ($itemRow['order_id'] ?? 0);
			if (!isset($orderMap[$orderId])) {
				continue;
			}
			$orderMap[$orderId]->addItem(OrderItem::fromArray($itemRow));
		}

		// Fetch addresses
		$addressIds = array_filter(array_map(fn($order) => $order->jsonSerialize()['shipping_address_id'] ?? null, array_values($orderMap)));
		if (!empty($addressIds)) {
			$addressPlaceholders = implode(',', array_fill(0, count($addressIds), '?'));
			$addressStmt = $this->pdo->prepare("SELECT * FROM addresses WHERE id IN ($addressPlaceholders)");
			$addressStmt->execute(array_values($addressIds));
			$addresses = $addressStmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
			
			$addressMap = [];
			foreach ($addresses as $addr) {
				$addressMap[(int)$addr['id']] = $addr;
			}
			
			foreach ($orderMap as $order) {
				$orderData = $order->jsonSerialize();
				if (isset($orderData['shipping_address_id']) && isset($addressMap[$orderData['shipping_address_id']])) {
					$order->setAddress($addressMap[$orderData['shipping_address_id']]);
				}
			}
		}

		// Fetch payment methods
		$paymentIds = array_filter(array_map(fn($order) => $order->jsonSerialize()['payment_id'] ?? null, array_values($orderMap)));
		if (!empty($paymentIds)) {
			$paymentPlaceholders = implode(',', array_fill(0, count($paymentIds), '?'));
			$paymentStmt = $this->pdo->prepare("SELECT id, order_id, provider FROM payments WHERE id IN ($paymentPlaceholders)");
			$paymentStmt->execute(array_values($paymentIds));
			$payments = $paymentStmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
			
			$paymentMap = [];
			foreach ($payments as $payment) {
				$paymentMap[(int)$payment['id']] = $payment['provider'];
			}
			
			foreach ($orderMap as $order) {
				$orderData = $order->jsonSerialize();
				if (isset($orderData['payment_id']) && isset($paymentMap[$orderData['payment_id']])) {
					$order->setPaymentMethod($paymentMap[$orderData['payment_id']]);
				}
			}
		}

		return array_values($orderMap);
	}
}

