import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

const ActivatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // extrai token da query
  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  useEffect(() => {
    const activate = async () => {
      try {
        const res = await api.post('/auth/activate', { token });
        setMessage(res.data.message);
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        const msg = err?.response?.data?.message || 'Erro na ativação.';
        setError(msg);
      }
    };

    if (token) activate();
    else setError('Token de ativação inválido.');
  }, [token, navigate]);

  return (
    <div className="container mt-5 text-center">
      <h3>Ativação de Conta</h3>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default ActivatePage;
