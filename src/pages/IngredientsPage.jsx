import React, { useState, lazy, Suspense } from 'react';
import useIngredients from '../hooks/useIngredients';

const IngredientForm = lazy(() => import('../components/ingredients/IngredientForm'));
const IngredientList = lazy(() => import('../components/ingredients/IngredientList'));

const IngredientsPage = () => {
  const {
    ingredients,
    loading,
    error,
    createIngredient,
    updateIngredient,
    deleteIngredient,
    deleteAllIngredients,
    refetch,
    toggleIngredientStatus,
  } = useIngredients();

  const [editingIngredient, setEditingIngredient] = useState(null);
  const [view, setView] = useState('list');
  const [filterText, setFilterText] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const handleEdit = (ingredient) => {
    setEditingIngredient(ingredient);
    setView('form');
  };

  const handleSave = async (ingredient) => {
    const isEditing = !!editingIngredient;
    const action = isEditing ? updateIngredient : createIngredient;
    const result = await action(isEditing ? editingIngredient._id : ingredient, ingredient, refetch);

    if (result.success) {
      setAlert({
        message: `Ingrediente "${result.data.name}" ${isEditing ? 'atualizado' : 'criado'} com sucesso.`,
        type: 'success',
      });
    } else {
      setAlert({
        message: result.error || `Erro ao ${isEditing ? 'atualizar' : 'criar'} ingrediente.`,
        type: 'danger',
      });
    }

    setTimeout(() => setAlert({ message: '', type: '' }), 3000);
    setEditingIngredient(null);
    setView('list');
  };

  const confirmDelete = (ingredient) => {
    setIngredientToDelete(ingredient);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!ingredientToDelete) return;
    const { success, error: deleteError } = await deleteIngredient(ingredientToDelete._id, refetch);

    setAlert({
      message: success
        ? `Ingrediente "${ingredientToDelete.name}" eliminado com sucesso.`
        : deleteError || 'Erro ao eliminar ingrediente.',
      type: success ? 'success' : 'danger',
    });

    setShowDeleteModal(false);
    setIngredientToDelete(null);
    setTimeout(() => setAlert({ message: '', type: '' }), 3000);
  };

  const handleDeleteSelected = () => {
    setShowDeleteAllModal(true);
  };

  const handleConfirmDeleteAll = async () => {
    const { success, error: deleteError } = await deleteAllIngredients();
    setAlert({
      message: success
        ? 'Todos os ingredientes foram eliminados com sucesso.'
        : deleteError || 'Erro ao eliminar todos os ingredientes.',
      type: success ? 'success' : 'danger',
    });

    setShowDeleteAllModal(false);
    setTimeout(() => setAlert({ message: '', type: '' }), 3000);
  };

  const handleClearFilters = () => {
    setFilterText('');
    setFilterType('');
    setFilterStatus('');
  };

  const handleToggleSelect = (id) => {
    setSelectedIngredients((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = (selectAll, visibleIds) => {
    setSelectedIngredients(selectAll ? visibleIds : []);
  };

const handleToggleStatus = (id) => {
  const target = ingredients.find((i) => i._id === id);
  if (target) {
    toggleIngredientStatus(id, target.status);
  }
};



  return (
    <div style={{ backgroundColor: '#eee5f7', minHeight: '100vh', padding: '2rem' }}>
      <div className="container p-4 shadow-lg rounded bg-white">
        {alert.message && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
            {alert.message}
            <button
              type="button"
              className="btn-close"
              onClick={() => setAlert({ message: '', type: '' })}
            ></button>
          </div>
        )}

        {loading && <p>A carregar ingredientes...</p>}
        {error && <p className="text-danger">Erro: {error}</p>}

        <Suspense fallback={<div>A carregar...</div>}>
          {view === 'form' ? (
            <IngredientForm
              ingredient={editingIngredient}
              onSave={handleSave}
              onCancel={() => {
                setEditingIngredient(null);
                setView('list');
              }}
            />
          ) : (
            <IngredientList
              ingredients={ingredients}
              onEdit={handleEdit}
              onDelete={confirmDelete}
              onNew={() => {
                setEditingIngredient(null);
                setView('form');
              }}
              filterText={filterText}
              filterType={filterType}
              filterStatus={filterStatus}
              onFilterTextChange={setFilterText}
              onFilterTypeChange={setFilterType}
              onFilterStatusChange={setFilterStatus}
              onClearFilters={handleClearFilters}
              onToggleStatus={handleToggleStatus}
              selectedIngredients={selectedIngredients}
              onToggleSelect={handleToggleSelect}
              onToggleSelectAll={handleToggleSelectAll}
              onDeleteSelected={handleDeleteSelected}
            />
          )}
        </Suspense>
      </div>

      {/* Modal de Eliminação Individual */}
      {showDeleteModal && ingredientToDelete && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmação</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Deseja eliminar o ingrediente <strong>{ingredientToDelete.name}</strong>?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                <button className="btn btn-danger" onClick={handleConfirmDelete}>Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Eliminação de Todos */}
      {showDeleteAllModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Eliminação</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteAllModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Tem a certeza que deseja eliminar <strong>todos os ingredientes</strong>?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteAllModal(false)}>Cancelar</button>
                <button className="btn btn-danger" onClick={handleConfirmDeleteAll}>Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientsPage;
