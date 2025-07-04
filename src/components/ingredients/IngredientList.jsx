import React, { useState } from 'react';
import './ingredient.css'; // Crie esse ficheiro CSS ou copie o estilo abaixo

const IngredientList = ({
  ingredients,
  onEdit,
  onDelete,
  onNew,
  filterText,
  filterType,
  filterStatus,
  onFilterTextChange,
  onFilterTypeChange,
  onFilterStatusChange,
  onClearFilters,
  onToggleStatus,
  selectedIngredients,
  onToggleSelect,
  onToggleSelectAll,
  onDeleteSelected,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredIngredients = ingredients.filter((ing) => {
    const matchesName = ing.name.toLowerCase().includes(filterText.toLowerCase());
    const matchesType = !filterType || ing.type === filterType;
    const matchesStatus =
      filterStatus === ''
        ? true
        : filterStatus === 'ativo'
        ? ing.status === true
        : ing.status === false;

    return matchesName && matchesType && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredIngredients.length / itemsPerPage));
  const paginatedIngredients = filteredIngredients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const visibleIds = paginatedIngredients.map((ing) => ing._id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIngredients.includes(id));

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Ingredientes</h3>
        <button className="btn btn-primary" onClick={onNew}>Novo Ingrediente</button>
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
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterType}
            onChange={(e) => onFilterTypeChange(e.target.value)}
          >
            <option value="">Filtrar por tipo</option>
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
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => onFilterStatusChange(e.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-secondary w-100" onClick={onClearFilters}>Limpar</button>
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
              <th>Cor</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedIngredients.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-muted">Nenhum ingrediente encontrado.</td>
              </tr>
            ) : (
              paginatedIngredients.map((ing) => (
                <tr key={ing._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIngredients.includes(ing._id)}
                      onChange={() => onToggleSelect(ing._id)}
                    />
                  </td>
                  <td>
                    {ing.image ? (
                      <img
                        src={`https://menumentapp.com/uploads/${ing.image}`}
                        alt={ing.name}
                        className="rounded"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                    ) : (
                      <span className="text-muted">Sem imagem</span>
                    )}
                  </td>
                  <td>
                    <strong>{ing.name}</strong><br />
                    <small>{ing.nutritions.calories} Kcal / {ing.quantity} {ing.unit}</small>
                  </td>
                  <td>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: ing.color,
                        borderRadius: '50%',
                        border: '1px solid #ccc',
                        display: 'inline-block',
                      }}
                      title={`Cor: ${ing.color}`}
                    />
                  </td>
                  <td>{ing.type}</td>
                  <td>
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <div className="form-check form-switch m-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={ing.status ?? true}
                          onChange={() => onToggleStatus(ing._id)}
                        />
                      </div>
                      <div
                        className={`badge px-3 py-2 text-white rounded-pill ${ing.status ? 'bg-success' : 'bg-danger'}`}
                        style={{ fontSize: '0.8rem', minWidth: '70px' }}
                      >
                        {ing.status ? 'Ativo' : 'Inativo'}
                      </div>
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(ing)}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(ing)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Botão Eliminar Todos com animação */}
        <div
          className={`text-end mt-3 transition-container ${allVisibleSelected && visibleIds.length > 0 ? 'show' : ''}`}
        >
          <button
            className="btn btn-danger"
            onClick={onDeleteSelected}
            style={{ pointerEvents: allVisibleSelected && visibleIds.length > 0 ? 'auto' : 'none' }}
          >
            Eliminar todos ({selectedIngredients.length})
          </button>
        </div>

        {/* Paginação com animação */}
        <div className={`transition-container show`}>
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
        </div>
      </div>
    </div>
  );
};

export default IngredientList;
