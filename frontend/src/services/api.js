import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000
});

export async function createSession(qrToken = null) {
  const body = qrToken ? { qr_token: qrToken } : {};
  const res = await api.post('/sessions', body);
  return res.data;
}

export async function getSession(token) {
  const res = await api.get(`/sessions/${token}`);
  return res.data;
}

export async function getSessionSummary(token) {
  const res = await api.get(`/sessions/${token}/summary`);
  return res.data;
}

export async function createCustomer(name, email) {
  const res = await api.post('/customers', { name, email });
  return res.data;
}

export async function getCustomerByQr(token) {
  const res = await api.get(`/customers/qr/${token}`);
  return res.data;
}

export async function classifyImage(imageFile, sessionToken) {
  const formData = new FormData();
  formData.append('image', imageFile);

  const res = await api.post('/classify', formData, {
    headers: {
      'X-Session-Token': sessionToken,
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
}

export default api;
