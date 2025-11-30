import api from './api';

export interface User {
  id?: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: 'USER' | 'ADMIN' | 'MODERATOR';
  active?: boolean;
  lastLogin?: string;
}

export interface UserRequest {
  username: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  active?: boolean;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  message: string;
}

export const userService = {
  getAll: () => api.get('/user/users'),
  getById: (id: number) => api.get(`/user/users/${id}`),
  register: (user: UserRequest) => api.post('/user/users/register', user),
  login: (credentials: LoginRequest) => api.post('/user/users/login', credentials),
  update: (id: number, user: Partial<UserRequest>) => api.put(`/user/users/${id}`, user),
  delete: (id: number) => api.delete(`/user/users/${id}`),
  getByUsername: (username: string) => api.get(`/user/users/username/${username}`),
  getByEmail: (email: string) => api.get(`/user/users/email/${email}`),
  checkUsername: (username: string) => api.get(`/user/users/exists/username/${username}`),
  checkEmail: (email: string) => api.get(`/user/users/exists/email/${email}`),
  health: () => api.get('/user/users/health'),
};

