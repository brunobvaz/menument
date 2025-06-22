import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

//const API_URL = 'http://localhost:3001/api/recipes';
const API_URL = '/api/recipes';

const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL);
      setRecipes(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar receitas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const getById = useCallback(async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (err) {
      console.error('Erro em getById:', err);
      return null;
    }
  }, []);

  const createRecipe = useCallback(async (recipe) => {
    try {
      setLoading(true);
      setError(null);
      const formData = buildFormData(recipe);

      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await fetchRecipes();
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar receita');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  }, [fetchRecipes]);

  const updateRecipe = useCallback(async (id, recipe) => {
    try {
      setLoading(true);
      setError(null);
      const formData = buildFormData(recipe);

      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await fetchRecipes();
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar receita');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  }, [fetchRecipes]);

  const deleteRecipe = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`${API_URL}/${id}`);
      await fetchRecipes();
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao eliminar receita');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  }, [fetchRecipes]);

  const deleteAllRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`${API_URL}/all`);
      await fetchRecipes();
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao eliminar todas as receitas');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  }, [fetchRecipes]);

  const toggleRecipeStatus = useCallback(async (id, currentStatus) => {
    try {
      setError(null);
      await axios.put(`${API_URL}/${id}`, { status: !currentStatus });
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe._id === id ? { ...recipe, status: !currentStatus } : recipe
        )
      );
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar status');
      return { success: false };
    }
  }, []);

  const buildFormData = (recipe) => {
    const formData = new FormData();

    if (recipe.title) formData.append('title', recipe.title);
    if (recipe.categoryId) formData.append('categoryId', recipe.categoryId);
    if (recipe.preparationTime) formData.append('preparationTime', recipe.preparationTime);
    if (recipe.servings) formData.append('servings', recipe.servings);

    formData.append('nutritions', JSON.stringify(recipe.nutritions || {}));
    formData.append('ingredients', JSON.stringify(recipe.ingredients || []));
    formData.append('instructions', JSON.stringify(recipe.instructions || []));

    if (recipe.image && typeof recipe.image !== 'string') {
      formData.append('image', recipe.image);
    }

    if (Array.isArray(recipe.extraImages)) {
      recipe.extraImages.forEach((img) => {
        if (img instanceof File) {
          formData.append('extraImages', img);
        }
      });
    }

    if (typeof recipe.status !== 'undefined') {
      formData.append('status', recipe.status);
    }

    return formData;
  };

  return {
    recipes,
    loading,
    error,
    refetch: fetchRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    deleteAllRecipes,
    toggleRecipeStatus,
    getById,
  };
};

export default useRecipes;

