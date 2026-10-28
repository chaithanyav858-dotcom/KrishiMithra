import { apiRequest } from './client';

export const metaApi = {
  getConfig: () => apiRequest('/meta/config'),
};

export const farmApi = {
  getFarms: () => apiRequest('/farms'),
  createFarm: (farm) => apiRequest('/farms', { method: 'POST', body: JSON.stringify(farm) }),
  updateFarm: (id, farm) => apiRequest(`/farms/${id}`, { method: 'PUT', body: JSON.stringify(farm) }),
  deleteFarm: (id) => apiRequest(`/farms/${id}`, { method: 'DELETE' }),
};

export const predictionApi = {
  predictCrop: (inputs) => apiRequest('/predict/crop', { method: 'POST', body: JSON.stringify(inputs) }),
};

export const weatherApi = {
  getWeather: (location, lat = null, lon = null) => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (lat != null) params.append('lat', lat);
    if (lon != null) params.append('lon', lon);
    return apiRequest(`/weather?${params.toString()}`);
  },
};

export const irrigationApi = {
  getAdvice: (inputs) => apiRequest('/irrigation/advice', { method: 'POST', body: JSON.stringify(inputs) }),
};

export const historyApi = {
  getHistory: () => apiRequest('/history'),
  getById: (id) => apiRequest(`/history/${id}`),
  saveRecommendation: (data) => apiRequest('/history/save', { method: 'POST', body: JSON.stringify(data) }),
  deleteRecord: (id) => apiRequest(`/history/${id}`, { method: 'DELETE' }),
};

export const profileApi = {
  getProfile: () => apiRequest('/profile'),
  updateProfile: (data) => apiRequest('/profile', { method: 'PUT', body: JSON.stringify(data) }),
};
