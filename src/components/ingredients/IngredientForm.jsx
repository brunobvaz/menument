import React, { useEffect, useState } from 'react';
import './ingredient.css';

const getEmptyForm = () => ({
  id: Date.now(),
  name: '',
  unit: '',
  quantity: '',
  color: '#000000',
  textColor: '#000000', // Novo campo adicionado
  type: '',
  nutritions: {
    proteins: '',
    calories: '',
    fats: '',
    carbohydrates: '',
    fiber: '',
  },
  image: null,
  preview: null,
  imageFile: null,
});

const IngredientForm = ({ ingredient, onSave, onCancel }) => {
  const [form, setForm] = useState(getEmptyForm());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (ingredient) {
      setForm({
        ...ingredient,
        textColor: ingredient.textColor || '#000000',
        preview: ingredient.image
          ? `https://menumentapp.com/uploads/${ingredient.image}`
          : null,
        imageFile: null,
      });
    } else {
      setForm(getEmptyForm());
    }
  }, [ingredient]);

  const handleChange = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleNutritionChange = (key, value) =>
    setForm(prev => ({
      ...prev,
      nutritions: { ...prev.nutritions, [key]: value },
    }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({
        ...prev,
        imageFile: file,
        preview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;

    setIsSaving(true);
    await onSave({ ...form });

    setTimeout(() => {
      setIsSaving(false);
      onCancel();
    }, 1500);
  };

  return (
    <div className={`container mt-4 ${isSaving ? 'saving' : ''}`}>
      <h4>{ingredient ? 'Editar Ingrediente' : 'Novo Ingrediente'}</h4>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-8">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nome</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Unidade</label>
                <select
                  className="form-select"
                  value={form.unit}
                  onChange={e => handleChange('unit', e.target.value)}
                  required
                >
                  <option value="">Selecionar unidade</option>
                  <option value="g">Grama (g)</option>
                  <option value="ml">Mililitro (ml)</option>
                  <option value="un">Unidade (un)</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Quantidade</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.quantity}
                  onChange={e => handleChange('quantity', e.target.value)}
                />
              </div>

              {/* Cor, Cor de Letra e Tipo */}
              <div className="col-md-4">
                <label className="form-label">Cor</label>
                <input
                  type="color"
                  className="form-control form-control-color w-100"
                  value={form.color}
                  onChange={e => handleChange('color', e.target.value)}
                  title="Escolher cor"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Cor de Letra</label>
                <input
                  type="color"
                  className="form-control form-control-color w-100"
                  value={form.textColor}
                  onChange={e => handleChange('textColor', e.target.value)}
                  title="Escolher cor da letra"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Tipo</label>
                <select
                  className="form-select"
                  value={form.type}
                  onChange={e => handleChange('type', e.target.value)}
                  required
                >
                  <option value="">Selecionar tipo</option>
                  <option>Cereais e derivados</option>
                  <option>Tubérculos</option>
                  <option>Hortícolas</option>
                  <option>Frutas</option>
                  <option>Lacticínios</option>
                  <option>Carnes, peixe e ovos</option>
                  <option>Leguminosas</option>
                  <option>Gorduras e óleos</option>
                </select>
              </div>

              {/* Nutrição */}
              <div className="col-md-4">
                <label className="form-label">Calorias (kcal)</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.nutritions.calories}
                  onChange={e => handleNutritionChange('calories', e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Proteínas (g)</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.nutritions.proteins}
                  onChange={e => handleNutritionChange('proteins', e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Carboidratos (g)</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.nutritions.carbohydrates}
                  onChange={e => handleNutritionChange('carbohydrates', e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Gordura (g)</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.nutritions.fats}
                  onChange={e => handleNutritionChange('fats', e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Fibras (g)</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.nutritions.fiber}
                  onChange={e => handleNutritionChange('fiber', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Imagem */}
          <div className="col-md-4">
            <label className="form-label">Imagem</label>
            <input
              type="file"
              className="form-control mb-3"
              accept="image/*"
              onChange={handleImageChange}
            />

            <div
              className="border border-2 rounded d-flex align-items-center justify-content-center"
              style={{
                borderStyle: 'dashed',
                height: '250px',
                backgroundColor: '#f9f9f9',
              }}
            >
              {form.preview ? (
                <img
                  src={form.preview}
                  alt="Pré-visualização"
                  className="img-fluid"
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
              ) : (
                <span className="text-muted">Pré-visualização da imagem</span>
              )}
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="mt-4">
          <button type="submit" className="btn btn-primary me-2" disabled={isSaving}>
            {isSaving ? 'A guardar...' : ingredient ? 'Atualizar' : 'Adicionar'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setForm(getEmptyForm());
              onCancel();
            }}
            disabled={isSaving}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default IngredientForm;


