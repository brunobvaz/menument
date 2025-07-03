import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // NGINX irá redirecionar para o backend
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // necessário para enviar e receber cookies (sessão)
});

export default api;

