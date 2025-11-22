export interface Product {
  id: number;
  title: string;
  description?: string;
  price: number;
  stock: number;
  main_image?: string | null;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export interface OrderAddress {
  full_name: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  postal_code?: string;
  country?: string;
}

export interface OrderLineItem {
  product_id: number;
  quantity: number;
  price?: number;
  title?: string;
}

export interface Order {
  id: number;
  status: string;
  total: number;
  items: OrderLineItem[];
  address?: OrderAddress;
  created_at?: string;
  payment_method?: string;
}

export interface CreateOrderPayload {
  address: OrderAddress;
  payment_method: 'cod' | 'card';
  items: Array<Pick<OrderLineItem, 'product_id' | 'quantity'>>;
}

export interface CreateOrderResponse {
  order_id: number;
  status?: string;
}
