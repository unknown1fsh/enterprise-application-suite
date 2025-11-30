import api from './api';

export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  category?: string;
  sku?: string;
  imageUrl?: string;
  active?: boolean;
}

export interface ProductRequest {
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  category?: string;
  sku?: string;
  imageUrl?: string;
  active?: boolean;
}

export const inventoryService = {
  getAll: () => api.get('/inventory/products'),
  getById: (id: number) => api.get(`/inventory/products/${id}`),
  create: (product: ProductRequest) => api.post('/inventory/products', product),
  update: (id: number, product: ProductRequest) => api.put(`/inventory/products/${id}`, product),
  delete: (id: number) => api.delete(`/inventory/products/${id}`),
  updateStock: (id: number, quantity: number) => api.put(`/inventory/products/${id}/stock?quantity=${quantity}`),
  getByCategory: (category: string) => api.get(`/inventory/products/category/${category}`),
  search: (name: string) => api.get(`/inventory/products/search?name=${name}`),
  getActive: () => api.get('/inventory/products/active'),
  health: () => api.get('/inventory/products/health'),
};

