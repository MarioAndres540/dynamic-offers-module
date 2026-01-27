import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const getSeparatas = () => api.get('/separatas');
export const getProducts = () => api.get('/products');
export const createSeparata = (data: any) => api.post('/separatas', data);
export const updateSeparata = (id: string, data: any) => api.put(`/separatas/${id}`, data);

export default api;
