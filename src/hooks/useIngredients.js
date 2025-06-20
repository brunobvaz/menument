import { useState, useEffect } from 'react';
import axios from 'axios';

const useIngredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3001/api/ingredients';

  // 🔄 GET
  const fetchIngredients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL);
      setIngredients(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Erro ao carregar ingredientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  // ➕ POST
  const createIngredient = async (ingredient) => {
    try {
      setLoading(true);
      setError(null);

      const formData = buildFormData(ingredient);
      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await fetchIngredients();
      return { success: true, data: response.data };
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Erro ao criar ingrediente');
      return { success: false, error: err.response?.data?.message || 'Erro ao criar ingrediente' };
    } finally {
      setLoading(false);
    }
  };

  // ✏️ PUT (editar)
  const updateIngredient = async (id, ingredient) => {
    try {
      setLoading(true);
      setError(null);

      const formData = buildFormData(ingredient);
      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await fetchIngredients();
      return { success: true, data: response.data };
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Erro ao atualizar ingrediente');
      return { success: false, error: err.response?.data?.message || 'Erro ao atualizar ingrediente' };
    } finally {
      setLoading(false);
    }
  };

  // 🗑 DELETE
  const deleteIngredient = async (id) => {
    try {
      setLoading(true);
      setError(null);

      await axios.delete(`${API_URL}/${id}`);
      await fetchIngredients();
      return { success: true };
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Erro ao eliminar ingrediente');
      return { success: false, error: err.response?.data?.message || 'Erro ao eliminar ingrediente' };
    } finally {
      setLoading(false);
    }
  };

  //DELETE ALL
  const deleteAllIngredients = async () => {
  try {
    setLoading(true);
    setError(null);

    await axios.delete(`${API_URL}/all`); // <--- criaremos essa rota no backend
    await fetchIngredients();
    return { success: true };
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || 'Erro ao eliminar todos os ingredientes');
    return { success: false, error: err.response?.data?.message || 'Erro ao eliminar todos os ingredientes' };
  } finally {
    setLoading(false);
  }
};

// ✅ TOGGLE STATUS
const toggleIngredientStatus = async (id, currentStatus) => {
  try {
    setError(null);
    await axios.put(`${API_URL}/${id}`, { status: !currentStatus });

    // Atualiza localmente o estado da lista
    setIngredients((prev) =>
      prev.map((ingredient) =>
        ingredient._id === id
          ? { ...ingredient, status: !currentStatus }
          : ingredient
      )
    );

    return { success: true };
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || 'Erro ao atualizar status');
    return { success: false };
  }
};



  // 🔧 Utilitário para criar o FormData
  const buildFormData = (ingredient) => {
    const formData = new FormData();
    formData.append('name', ingredient.name);
    formData.append('unit', ingredient.unit);
    formData.append('quantity', ingredient.quantity);
    formData.append('color', ingredient.color);
    formData.append('type', ingredient.type);

    Object.entries(ingredient.nutritions).forEach(([key, value]) => {
      formData.append(`nutritions.${key}`, value);
    });

    if (ingredient.imageFile) {
      formData.append('image', ingredient.imageFile);
    }

    if (ingredient.status !== undefined) {
      formData.append('status', ingredient.status);
    }

    return formData;
  };

  return {
    ingredients,
    loading,
    error,
    refetch: fetchIngredients,
    createIngredient,
    updateIngredient,
    deleteIngredient,
    deleteAllIngredients,
    toggleIngredientStatus,
  };
};

export default useIngredients;

