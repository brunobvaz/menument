import React, { useMemo, useState } from 'react';

const UserList = ({
  users,
  onEdit,
  onDelete,
  onToggleStatus,
  onNew,
  filterText,
  filterStatus,
  onFilterTextChange,
  onFilterStatusChange,
  onClearFilters,
  selectedUsers,
  onToggleSelect,
  onToggleSelectAll,
  onDeleteSelected,
}) => {
  const [filterPerfil, setFilterPerfil] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🔍 Filtragem, ordenação
  const filteredUsers = useMemo(() => {
    const searchLower = filterText.toLowerCase();
    let result = users.filter((user) => {
      const matchesText =
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower);

      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && user.status === 'active') ||
        (filterStatus === 'inactive' && user.status !== 'active');

      const matchesPerfil = filterPerfil === 'all' || user.perfil === filterPerfil;

      return matchesText && matchesStatus && matchesPerfil;
    });

    result.sort((a, b) => {
      const fieldA = a[sortField]?.toLowerCase?.() || '';
      const fieldB = b[sortField]?.toLowerCase?.() || '';
      return sortOrder === 'asc'
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    });

    return result;
  }, [users, filterText, filterStatus, filterPerfil, sortField, sortOrder]);

  // 📄 Paginação
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const visibleIds = paginatedUsers.map((u) => u._id || u.id);
  const allVisibleSelected = visibleIds.every((id) => selectedUsers.includes(id));

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Utilizadores</h4>
        <button className="btn btn-success" onClick={onNew}>
          Novo Utilizador
        </button>
      </div>

      {/* Filtros */}
      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Filtrar por nome ou email"
            value={filterText}
            onChange={(e) => onFilterTextChange(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => onFilterStatusChange(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={filterPerfil}
            onChange={(e) => setFilterPerfil(e.target.value)}
          >
            <option value="all">Todos Perfis</option>
            <option value="admin">Admin</option>
            <option value="user">Utilizador</option>
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortField(field);
              setSortOrder(order);
            }}
          >
            <option value="name-asc">Nome A-Z</option>
            <option value="name-desc">Nome Z-A</option>
            <option value="email-asc">Email A-Z</option>
            <option value="email-desc">Email Z-A</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-secondary w-100" onClick={onClearFilters}>
            Limpar Filtros
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
              <th>Utilizador</th>
              <th>Perfil</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-muted">
                  Nenhum utilizador encontrado.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user._id || user.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id || user.id)}
                      onChange={() => onToggleSelect(user._id || user.id)}
                    />
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={user.photo ? `http://localhost:3001/uploads/${user.photo}` : '/default-avatar.png'}
                        alt="Avatar"
                        className="rounded-circle"
                        width={40}
                        height={40}
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="text-start">
                        <strong>{user.name}</strong>
                        <br />
                        <span className="text-muted small">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{user.perfil}</td>
                  <td>
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <div className="form-check form-switch m-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={user.status === 'active'}
                          onChange={() => onToggleStatus(user._id || user.id)}
                        />
                      </div>
                      <span
                        className={`badge px-3 py-2 text-white rounded-pill ${
                          user.status === 'active' ? 'bg-success' : 'bg-danger'
                        }`}
                        style={{ fontSize: '0.8rem' }}
                      >
                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit(user._id || user.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(user)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Eliminar Todos */}
      {visibleIds.filter((id) => selectedUsers.includes(id)).length > 1 && (
        <div className="text-end mt-3">
          <button className="btn btn-danger" onClick={onDeleteSelected}>
            Eliminar todos ({selectedUsers.length})
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
  );
};

export default UserList;
