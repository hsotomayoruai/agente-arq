import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({ baseURL: BASE_URL });

export async function findCustomerByQr(qrCode) {
  const res = await api.get(`/customers/qr/${encodeURIComponent(qrCode)}`);
  return res.data.data;
}

export async function classifyWaste(imageFile, customerId) {
  const form = new FormData();
  form.append('image', imageFile);
  if (customerId) form.append('customerId', customerId);
  const res = await api.post('/classify', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
}

export async function getCustomerHistory(customerId) {
  const res = await api.get(`/customers/${customerId}/history`);
  return res.data.data;
}

export default api;
