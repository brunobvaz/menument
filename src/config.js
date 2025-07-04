// src/config.js
export const BASE_UPLOAD_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3001/uploads'
    : 'https://menumentapp.com/uploads';
