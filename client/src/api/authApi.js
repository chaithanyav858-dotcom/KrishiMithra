import { apiRequest } from './client';

export const authApi = {
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (farmerData) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(farmerData) }),
  demoLogin: () => apiRequest('/auth/demo-login', { method: 'POST' }),
  getMe: () => apiRequest('/auth/me'),
};
