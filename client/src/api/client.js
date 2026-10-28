/**
 * KrishiMitra - API Client Service
 * Centralized fetch client with JWT injection and uniform error handling
 */

const BASE_URL = '/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('krishimitra_token');

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.error || (data.details && data.details.join(', ')) || `HTTP ${response.status}: Request failed`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    if (!error.status) {
      error.message = error.message === 'Failed to fetch' 
        ? 'Cannot connect to KrishiMitra backend server. Please verify backend is running on port 5000.' 
        : error.message;
    }
    throw error;
  }
}
