import React, { useEffect, useState, useCallback } from 'react';
import useIngredients from '../../hooks/useIngredients';

const MAX_IMAGES = 4;

const RecipeForm = ({ onSave, selectedRecipe, clearSelected }) => {
  const { ingredients: availableIngredients } = useIngredients();

  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([{ ingredientId: '', quantity: '', unit: '' }]);
  const [instructions, setInstructions] = useState(['']);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [preparationTime, setPreparationTime] = useState('');
  const [servings, setServings] = useState('');
  const [nutritions, setNutritions] = useState({
    proteins: '', carbohydrates: '', fats: '',
    calories: '', vitaminC: '', calcium: '',
  });

  useEffect(() => {
    const fixedCategories = [
      { id: '1', name: 'Pequeno-almoço' },
      { id: '2', name: 'Almoço' },
      { id: '3', name: 'Jantar' },
      { id: '4', name: 'Snacks' },
      { id: '5', name: 'Sopas' },
      { id: '6', name: 'Sobremesa' },
    ];
    setCategories(fixedCategories);
  }, []);

  useEffect(() => {
    if (selectedRecipe) {
      setTitle(selectedRecipe.title || '');
      setIngredients(selectedRecipe.ingredients || ['']);
      setInstructions(selectedRecipe.instructions || ['']);
      setPreparationTime(selectedRecipe.preparationTime || '');
      setServings(selectedRecipe.servings || '');
      setCategoryId(selectedRecipe.categoryId || '');
      setNutritions(selectedRecipe.nutritions || {
        proteins: '', carbohydrates: '', fats: '',
        calories: '', vitaminC: '', calcium: '',
      });
      const loadedImages = [];

      if (selectedRecipe.image) {
        loadedImages.push(selectedRecipe.image); // imagem principal
      }

      if (Array.isArray(selectedRecipe.extraImages)) {
        loadedImages.push(...selectedRecipe.extraImages); // extras
      }

      setImagePreviews(loadedImages);
      setImages(loadedImages);
    }
  }, [selectedRecipe]);

  const resetForm = useCallback(() => {
    setTitle('');
    setIngredients(['']);
    setInstructions(['']);
    setImages([]);
    setImagePreviews([]);
    setCategoryId('');
    setPreparationTime('');
    setServings('');
    setNutritions({
      proteins: '', carbohydrates: '', fats: '',
      calories: '', vitaminC: '', calcium: '',
    });
    clearSelected();
  }, [clearSelected]);

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const totalFiles = images.length + newFiles.length;

    if (totalFiles > MAX_IMAGES) {
      alert(`Só pode carregar no máximo ${MAX_IMAGES} imagens.`);
      return;
    }

    setImages(prev => [...prev, ...newFiles]);
    setImagePreviews(prev => [...prev, ...newFiles]);
  };



  const removeImage = (i) => {
    setImagePreviews(prev => prev.filter((_, index) => index !== i));
    setImages(prev => prev.filter((_, index) => index !== i));
  };

  //LISTA DE INGREDIENTES
  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index].ingredientId = value;
    setIngredients(updated);
  };
  const handleQuantityChange = (index, value) => {
    const updated = [...ingredients];
    updated[index].quantity = value;
    setIngredients(updated);
  };

  const handleUnitChange = (index, value) => {
    const updated = [...ingredients];
    updated[index].unit = value;
    setIngredients(updated);
  };


  const addIngredient = () => setIngredients(prev => [...prev, { ingredientId: '', quantity: '', unit: '' }]);
  const removeIngredient = (i) => setIngredients(prev => prev.filter((_, index) => index !== i));


  const handleInstructionChange = (index, value) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const addInstruction = () => setInstructions(prev => [...prev, '']);
  const removeInstruction = (i) => setInstructions(prev => prev.filter((_, index) => index !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      alert('Selecione uma categoria');
      return;
    }

    const recipe = {
      title,
      categoryId,
      preparationTime,
      servings,
      nutritions,
      ingredients,
      instructions,
      image: images[0] || null,
      extraImages: images.slice(1, 4), // até 3 imagens extras
    };

    await onSave(recipe);
    resetForm();
  };

  const handleSingleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const updated = [...images];
    updated[index] = file;

    const updatedPreviews = [...imagePreviews];
    updatedPreviews[index] = file;

    setImages(updated);
    setImagePreviews(updatedPreviews);
  };


  return (
    <div className="card p-4 mb-5 shadow-sm rounded bg-light" >
      <h4 className="mb-4">{selectedRecipe ? 'Editar Receita' : 'Nova Receita'}</h4>
      <form onSubmit={handleSubmit}>

        <div className="border rounded shadow-sm p-3 mb-4 bg-white" >
          <h5 className="mb-3">Informações Gerais</h5>
          <div className="mb-3">
            <label className="form-label">Título</label>
            <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>

          {/* Linha com categoria, tempo e porções */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Categoria</label>
              <select className="form-select" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Tempo de Preparação (min)</label>
              <input type="number" className="form-control" value={preparationTime} onChange={e => setPreparationTime(e.target.value)} />
            </div>

            <div className="col-md-4">
              <label className="form-label">Porções</label>
              <input type="number" className="form-control" value={servings} onChange={e => setServings(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="border rounded shadow-sm p-3 mb-4 bg-white">
          <h5 className="mb-3">Informações Nutricionais</h5>
          <div className="row">
            {['proteins', 'carbohydrates', 'fats', 'calories', 'vitaminC', 'calcium'].map((key) => (
              <div className="col-md-4 mb-3" key={key}>
                <label className="form-label">{key}</label>
                <input
                  type="number"
                  className="form-control"
                  value={nutritions[key]}
                  onChange={e => setNutritions(prev => ({ ...prev, [key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        </div>


        {/* INGREDIENTES */}
        <div className="border rounded shadow-sm p-3 mb-4 bg-white">
          <div className="mb-3">
            <h5 className="mt-4 mb-3">Ingredientes</h5>
            {ingredients.map((item, index) => (
              <div className="row align-items-center mb-2" key={index}>
                <div className="col-md-5">
                  <select
                    className="form-select"
                    value={item.ingredientId}
                    onChange={e => handleIngredientChange(index, e.target.value)}
                    required
                  >
                    <option value="">Selecionar ingrediente</option>
                    {availableIngredients.map(ing => (
                      <option key={ing._id} value={ing._id}>
                        {ing.name} ({ing.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Quantidade"
                    value={item.quantity}
                    onChange={e => handleQuantityChange(index, e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-2">
                  <select
                    className="form-select"
                    value={item.unit}
                    onChange={e => handleUnitChange(index, e.target.value)}
                    required
                  >
                    <option value="">Unidade</option>
                    <option value="gr">gr (grama)</option>
                    <option value="ml">ml (mililitro)</option>
                    <option value="un">un (unidade)</option>
                    <option value="cl">cl (colher)</option>
                  </select>
                </div>

                <div className="col-md-2 text-end">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeIngredient(index)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}



            <button type="button" className="btn btn-outline-primary btn-sm" onClick={addIngredient}>
              + Adicionar Ingrediente
            </button>
          </div>
        </div>

        {/* INSTRUÇÕES */}
        <div className="border rounded shadow-sm p-3 mb-4 bg-white">
          <div className="mb-3">
            <h5 className="mt-4 mb-3">Instruções</h5>
            {instructions.map((text, index) => (
              <div className="row align-items-center mb-2" key={index}>
                <div className="col-md-10">
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder={`Passo ${index + 1}`}
                    value={text}
                    onChange={e => handleInstructionChange(index, e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-2 text-end">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeInstruction(index)}
                  >
                    Remover
                  </button>
                </div>
              </div>


            ))}
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={addInstruction}>
              + Adicionar Passo
            </button>
          </div>
        </div>

        {/* IMAGENS */}
        <div className="border rounded shadow-sm p-3 mb-4 bg-white">
          <div className="mb-3">
            <h5 className="mt-4 mb-3">Imagens (máx. 4)</h5>
            <div className="d-flex flex-wrap justify-content-between">
              {Array.from({ length: MAX_IMAGES }).map((_, i) => {
                const file = imagePreviews[i];
                const previewSrc =
                  typeof file === 'string'
                    ? `http://localhost:3001/uploads/${file}`
                    : file
                      ? URL.createObjectURL(file)
                      : null;

                const inputId = `image-input-${i}`;

                return (
                  <div
                    className="image-slot mb-2"
                    key={i}
                    style={previewSrc ? { backgroundImage: `url(${previewSrc})` } : {}}
                  >
                    {!previewSrc && <span className="text-muted">Imagem {i + 1}</span>}

                    <input
                      id={inputId}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleSingleImageChange(i, e)}
                    />

                    <div style={{ position: 'absolute', bottom: 10, display: 'flex', gap: '0.5rem' }}>
                      <label htmlFor={inputId} className="btn btn-sm btn-primary m-0">
                        Carregar
                      </label>

                      {previewSrc && (
                        <button
                          type="button"
                          className="btn btn-sm btn-danger m-0"
                          onClick={() => removeImage(i)}
                        >
                          Remover
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTÕES */}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success">
            {selectedRecipe ? 'Atualizar' : 'Guardar'}
          </button>
          {selectedRecipe && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>

      </form>
    </div>
  );
};

export default RecipeForm;


