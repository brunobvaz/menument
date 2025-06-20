import React from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeForm from '../components/recipes/RecipeForm';
import useRecipe from '../hooks/useRecipe';

const RecipeCreate = () => {
  const navigate = useNavigate();
  const { createRecipe } = useRecipe(); // importa o hook

  const handleSave = async (recipe) => {
    console.log("recipe", recipe)
    await createRecipe({ ...recipe, active: true }); // cria receita na API
    navigate('/dashboard'); // redireciona após salvar
  };

  return (
    <div className="recipe-form-bg py-5">
      <div className="container">
        <RecipeForm onSave={handleSave} selectedRecipe={null} clearSelected={() => { }} />
      </div>
    </div>
  );
};

export default RecipeCreate;
