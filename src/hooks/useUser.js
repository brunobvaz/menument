import { useState, useEffect } from 'react';
import api from '../services/api';

const API_URL = '/users';

const useUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Validações
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // ✅ Registo de utilizador com validação
  const register = async ({ name, email, password, confirmPassword, status, perfil }) => {
    setLoading(true);
    setError(null);

    if (!name || !email || !password || !confirmPassword || !status || !perfil) {
      setLoading(false);
      const msg = 'Todos os campos são obrigatórios.';
      setError(msg);
      return { success: false, message: msg };
    }

    if (!isValidEmail(email)) {
      setLoading(false);
      const msg = 'Email inválido.';
      setError(msg);
      return { success: false, message: msg };
    }

    if (password !== confirmPassword) {
      setLoading(false);
      const msg = 'As senhas não coincidem.';
      setError(msg);
      return { success: false, message: msg };
    }

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        status,
        perfil,
      });
      setLoading(false);
      return { success: true, message: res.data.message };
    } catch (err) {
      setLoading(false);
      const msg = err?.response?.data?.message || 'Erro ao registar.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // 🔄 Obter todos os utilizadores
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      setError('Erro ao carregar utilizadores');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Obter um utilizador por ID
  const getUserById = async (id) => {
    try {
      const res = await api.get(`${API_URL}/${id}`);
      return res.data;
    } catch (err) {
      console.error('Erro ao obter utilizador:', err);
      return null;
    }
  };

  // 📝 Atualizar utilizador
  const updateUser = async (id, data) => {
    const formData = buildFormData(data);
    const res = await api.put(`${API_URL}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  };

  // 🗑️ Eliminar utilizador
  const deleteUser = async (id) => {
    await api.delete(`${API_URL}/${id}`);
  };

  // 🔁 Ativar/desativar utilizador
  const toggleUserStatus = async (id) => {
    await api.patch(`${API_URL}/${id}/toggle-status`);
    fetchUsers(); // atualizar lista após alteração
  };

  // 🔁 Refetch manual
  const refetch = () => fetchUsers();

  // 🔁 Inicial
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    register,
    fetchUsers,
    getUserById,
    updateUser,
    deleteUser,
    toggleUserStatus,
    refetch,
  };
};

// 🔧 Constrói FormData com ou sem imagem
const buildFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'photo' && typeof value === 'object') {
        formData.append('photo', value);
      } else {
        formData.append(key, value);
      }
    }
  });
  return formData;
};

export default useUser;
