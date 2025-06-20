import { useState } from 'react';
import api from '../services/api';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const post = async (url, data) => {
    try {
      setLoading(true);
      const res = await api.post(url, data);
      setLoading(false);
      return { success: true, data: res.data };
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Erro inesperado');
      return { success: false, error: err.response?.data?.message || 'Erro inesperado' };
    }
  };

  const validateAndRegister = async (form) => {
    setError(null);
    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      return { success: false, error: 'Por favor preencha todos os campos' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Email inválido' };
    }

    if (password.length < 6) {
      return { success: false, error: 'A senha deve ter pelo menos 6 caracteres' };
    }

    if (password !== confirmPassword) {
      return { success: false, error: 'As passwords não coincidem' };
    }

    return await post('/auth/register', { name, email, password });
  };

  return { post, validateAndRegister, loading, error, setError };
};

export default useAuth;
