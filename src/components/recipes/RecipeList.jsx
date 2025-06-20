import React, { useState } from 'react';

const RecipeList = ({
  recipes,
  onEdit,
  onDelete,
  onToggleStatus,
  onNew,
  filterText,
  filterStatus,
  onFilterTextChange,
  onFilterStatusChange,
  onClearFilters,
  selectedRecipes,
  onToggleSelect,
  onToggleSelectAll,
  onDeleteSelected,
  categoryMap = {},
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredRecipes = recipes.filter((r) => {
    const matchesName = r.title.toLowerCase().includes(filterText.toLowerCase());
    const status = r.status?? true;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && status) ||
      (filterStatus === 'inactive' && !status);

    return matchesName && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRecipes.length / itemsPerPage));
  const paginatedRecipes = filteredRecipes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const visibleIds = paginatedRecipes.map((r) => r._id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedRecipes.includes(id));

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Receitas</h4>
        <button className="btn btn-success" onClick={onNew}>
          Nova Receita
        </button>
      </div>

      {/* Filtros */}
      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Filtrar por nome..."
            value={filterText}
            onChange={(e) => onFilterTextChange(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => onFilterStatusChange(e.target.value)}
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>
        <div className="col-md-4">
          <button className="btn btn-outline-secondary w-100" onClick={onClearFilters}>
            Limpar filtros
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={(e) => onToggleSelectAll(e.target.checked, visibleIds)}
                />
              </th>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRecipes.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-muted">
                  Nenhuma receita encontrada.
                </td>
              </tr>
            ) : (
              paginatedRecipes.map((recipe) => (
                <tr key={recipe._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRecipes.includes(recipe._id)}
                      onChange={() => onToggleSelect(recipe._id)}
                    />
                  </td>
                  <td>
                    {recipe.image ? (
                      <img
                        src={`http://localhost:3001/uploads/${recipe.image}`}
                        alt={recipe.title}
                        className="rounded"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                    ) : (
                      <span className="text-muted">Sem imagem</span>
                    )}
                  </td>
                  <td>
                    <strong>{recipe.title}</strong>
                    <br />
                    <small>
                      {recipe.servings} dose(s) / {recipe.nutritions?.calories || 0} Kcal
                    </small>
                  </td>
                  <td>{categoryMap[recipe.categoryId] || 'Sem categoria'}</td>
                  <td>
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <div className="form-check form-switch m-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={recipe.status ?? true}
                          onChange={() => onToggleStatus(recipe._id, recipe.status)}
                        />
                      </div>
                      <span
                        className={`badge px-3 py-2 text-white rounded-pill ${
                          recipe.status ? 'bg-success' : 'bg-danger'
                        }`}
                        style={{ fontSize: '0.8rem' }}
                      >
                        {recipe.status ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(recipe._id)}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(recipe)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Eliminar todos */}
        {allVisibleSelected && visibleIds.length > 0 && (
          <div className="text-end mt-3">
            <button className="btn btn-danger" onClick={onDeleteSelected}>
              Eliminar todos ({selectedRecipes.length})
            </button>
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <nav className="d-flex justify-content-center mt-4">
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                  Anterior
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 && 'active'}`}>
                  <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                  Próxima
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
