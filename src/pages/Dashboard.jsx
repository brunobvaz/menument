import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useRecipes from '../hooks/useRecipe'; // Ajusta se o caminho estiver diferente
import RecipeList from '../components/recipes/RecipeList'; // Importa o novo componente
import Alert from '../components/Alert';


const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    recipes,
    loading,
    error,
    toggleRecipeStatus,
    deleteRecipe,
    deleteAllRecipes,
    refetch,
  } = useRecipes();

  const [filterText, setFilterText] = useState(() => localStorage.getItem('filterText') || '');
  const [filterStatus, setFilterStatus] = useState(() => localStorage.getItem('filterStatus') || 'all');
  const [selectedRecipes, setSelectedRecipes] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

  const [alert, setAlert] = useState({ message: '', type: '' });

  // ⚙️ Filtros
  useEffect(() => {
    localStorage.setItem('filterText', filterText);
  }, [filterText]);

  useEffect(() => {
    localStorage.setItem('filterStatus', filterStatus);
  }, [filterStatus]);

  // 📘 Mapeamento de categorias
  const categoryMap = JSON.parse(localStorage.getItem('categories') || '[]').reduce((acc, cur) => {
    acc[cur.id] = cur.name;
    return acc;
  }, {});

  // ✏️ Editar receita
  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  // 🧹 Limpar filtros
  const handleClearFilters = () => {
    setFilterText('');
    setFilterStatus('all');
    localStorage.removeItem('filterText');
    localStorage.removeItem('filterStatus');
  };

  // ✅ Seleções
  const handleToggleSelect = (id) => {
    setSelectedRecipes((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = (checked, visibleIds) => {
    if (checked) {
      const newSelection = [...new Set([...selectedRecipes, ...visibleIds])];
      setSelectedRecipes(newSelection);
    } else {
      const newSelection = selectedRecipes.filter((id) => !visibleIds.includes(id));
      setSelectedRecipes(newSelection);
    }
  };

  // 🗑 Eliminar receitas selecionadas
  const handleDeleteSelected = async () => {
    for (const id of selectedRecipes) {
      await deleteRecipe(id);
    }
    setSelectedRecipes([]);
    refetch();
  };

  const handleDeleteClick = (recipe) => {
    setRecipeToDelete(recipe);
    setShowDeleteModal(true);
  };

const handleConfirmDelete = async () => {
  const id = recipeToDelete?._id || recipeToDelete?.id;

  if (id) {
    try {
      await deleteRecipe(id);
      
      setAlert({
        message: `Receita "${recipeToDelete.title}" eliminada com sucesso.`,
        type: 'success',
      });

      // Fecha modal logo após sucesso
      setShowDeleteModal(false);
      setRecipeToDelete(null);

      refetch();
    } catch (err) {
      setAlert({
        message: 'Erro ao eliminar a receita.',
        type: 'danger',
      });
    }
  }
};

  const handleConfirmDeleteAllClick = () => {
    if (selectedRecipes.length === 0) return; // Nada a apagar
    setShowDeleteAllModal(true);
  };

const handleConfirmDeleteAll = async () => {
  try {
    for (const id of selectedRecipes) {
      await deleteRecipe(id);
    }

    setAlert({
      message: `Eliminadas ${selectedRecipes.length} receitas com sucesso.`,
      type: 'success',
    });

    setSelectedRecipes([]);
    setShowDeleteAllModal(false);
    refetch();
  } catch (err) {
    setAlert({
      message: 'Erro ao eliminar receitas selecionadas.',
      type: 'danger',
    });
  }
};


  return (
    <div className="dashboard-bg py-5">
      <div className="container content-box shadow-lg rounded bg-white p-4">
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: '', type: '' })}
        />

        {loading ? (
          <p>A carregar...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <RecipeList
            recipes={recipes}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onToggleStatus={toggleRecipeStatus}
            onNew={() => navigate('/create')}
            filterText={filterText}
            filterStatus={filterStatus}
            onFilterTextChange={setFilterText}
            onFilterStatusChange={setFilterStatus}
            onClearFilters={handleClearFilters}
            selectedRecipes={selectedRecipes}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onDeleteSelected={handleConfirmDeleteAllClick}
            categoryMap={categoryMap}
          />


        )}
      </div>
      {showDeleteModal && recipeToDelete && (
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
                <p>Deseja eliminar a receita <strong>{recipeToDelete.title}</strong>?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                <button className="btn btn-danger" onClick={handleConfirmDelete}>Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <p>Tem a certeza que deseja eliminar <strong>{selectedRecipes.length}</strong> receitas?</p>
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

export default Dashboard;
