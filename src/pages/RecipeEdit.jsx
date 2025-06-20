import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeForm from '../components/recipes/RecipeForm';
import useRecipes from '../hooks/useRecipe';

const RecipeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, updateRecipe } = useRecipes(); // ✅ corrigido
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchRecipe = async () => {
      const data = await getById(id);
      if (!cancelled) {
        if (data) {
          setSelectedRecipe(data);
        } else {
          navigate('/dashboard');
        }
        setLoading(false);
      }
    };

    fetchRecipe();

    return () => {
      cancelled = true;
    };
  }, [id]); // ✅ remove dependências desnecessárias

  const handleUpdate = async (updatedRecipe) => {
    await updateRecipe(id, updatedRecipe); // ✅ usa função correta
    navigate('/dashboard');
  };

  return (
    <div className="recipe-form-bg py-5">
      <div className="container">
        {loading ? (
          <p>Carregando receita...</p>
        ) : selectedRecipe ? (
          <RecipeForm
            onSave={handleUpdate}
            selectedRecipe={selectedRecipe}
            clearSelected={() => { }}
          />
        ) : (
          <p>Receita não encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default RecipeEdit;
