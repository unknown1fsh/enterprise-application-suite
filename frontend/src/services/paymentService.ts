import api from './api';

export interface Payment {
  id?: number;
  orderId: number;
  userId: number;
  amount: number;
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  transactionDate?: string;
  transactionId?: string;
  paymentGatewayResponse?: string;
}

export interface PaymentRequest {
  orderId: number;
  userId: number;
  amount: number;
  paymentMethod: string;
}

export const paymentService = {
  getAll: () => api.get('/payment/payments'),
  getById: (id: number) => api.get(`/payment/payments/${id}`),
  process: (payment: PaymentRequest) => api.post('/payment/payments/process', payment),
  updateStatus: (id: number, status: string) => api.put(`/payment/payments/${id}/status?status=${status}`),
  getByOrderId: (orderId: number) => api.get(`/payment/payments/order/${orderId}`),
  getByUserId: (userId: number) => api.get(`/payment/payments/user/${userId}`),
  getByStatus: (status: string) => api.get(`/payment/payments/status/${status}`),
  getByTransactionId: (transactionId: string) => api.get(`/payment/payments/transaction/${transactionId}`),
  health: () => api.get('/payment/payments/health'),
};

