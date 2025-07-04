import axios from 'axios';

const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

const api = axios.create({
  baseURL: isLocalhost
    ? 'http://localhost:3001/api' // ⬅️ Backend local em dev
    : '/api',                     // ⬅️ Produção (NGINX faz proxy)
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // importante para cookies/session
});

export default api;

