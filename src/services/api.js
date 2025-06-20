import axios from 'axios';

const api = axios.create({
<<<<<<< HEAD
  //baseURL: 'http://localhost:3001/api',
=======
>>>>>>> 19ae19f91d83edc1807f173a0f84ac75b44be0b9
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
