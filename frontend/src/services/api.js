import axios from 'axios';

const API_BASE_URL = '/api'; // Relative to the same host

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const farmerService = {
    createProfile: (data) => api.post('/farmer/create', data).then(res => res.data),
    getProfile: (farmerId) => api.get(`/farmer/${farmerId}`).then(res => res.data),
    updateProfile: (farmerId, data) => api.put(`/farmer/${farmerId}`, data).then(res => res.data)
};

export const cropService = {
    getRecommendations: (farmerId, location, waterSource) => 
        api.get(`/crops/recommendations`, { params: { farmerId, location, waterSource } }).then(res => res.data),
    getForecast: (cropId, location) => 
        api.get(`/crops/${cropId}/forecast`, { params: { location } }).then(res => res.data)
};

export const alertService = {
    createAlert: (data) => api.post('/alerts/create', data).then(res => res.data),
    getActiveAlerts: (farmerId) => api.get('/alerts/active', { params: { farmerId } }).then(res => res.data),
    dismissAlert: (alertId) => api.post(`/alerts/${alertId}/dismiss`).then(res => res.data)
};
