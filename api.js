import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const testApi = async () => {
  const response = await api.get('/');
  return response.data;
};

export const predictImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await api.post('/predict', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    responseType: 'blob', // <--- THIS IS CRITICAL
  });

  return response.data;
};

export const classifyImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await api.post('/classify', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data; // Returns { classe: "...", probabilidade: ... }
};

export default api;
