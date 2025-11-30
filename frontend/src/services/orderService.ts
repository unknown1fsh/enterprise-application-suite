import api from './api';

export interface Order {
  id?: number;
  userId: number;
  orderDate?: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  totalAmount: number;
  shippingAddress?: string;
  billingAddress?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id?: number;
  orderId?: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderRequest {
  userId: number;
  shippingAddress?: string;
  billingAddress?: string;
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export const orderService = {
  getAll: () => api.get('/order/orders'),
  getById: (id: number) => api.get(`/order/orders/${id}`),
  create: (order: OrderRequest) => api.post('/order/orders', order),
  updateStatus: (id: number, status: string) => api.put(`/order/orders/${id}/status?status=${status}`),
  getByUserId: (userId: number) => api.get(`/order/orders/user/${userId}`),
  getByStatus: (status: string) => api.get(`/order/orders/status/${status}`),
  health: () => api.get('/order/orders/health'),
};

