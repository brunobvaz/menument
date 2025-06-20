import React, { useState, useEffect } from 'react';
import useUser from '../hooks/useUser'; // ← Criamos já a seguir
import UserList from '../components/users/UserList';
import Alert from '../components/Alert';
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
  const {
    users,
    loading,
    error,
    toggleUserStatus,
    deleteUser,
    refetch,
  } = useUser();

  const navigate = useNavigate();

  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

  const [alert, setAlert] = useState({ message: '', type: '' });

  const handleEdit = (id) => {
    navigate(`/users/edit/${id}`);
  };

  const handleClearFilters = () => {
    setFilterText('');
    setFilterStatus('all');
  };

  const handleToggleSelect = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = (checked, visibleIds) => {
    if (checked) {
      const newSelection = [...new Set([...selectedUsers, ...visibleIds])];
      setSelectedUsers(newSelection);
    } else {
      const newSelection = selectedUsers.filter((id) => !visibleIds.includes(id));
      setSelectedUsers(newSelection);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedUsers.length > 0) {
      setShowDeleteAllModal(true);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const id = userToDelete?._id || userToDelete?.id;
    if (id) {
      try {
        await deleteUser(id);
        setAlert({ message: `Utilizador "${userToDelete.name}" eliminado com sucesso.`, type: 'success' });
        setShowDeleteModal(false);
        setUserToDelete(null);
        refetch();
      } catch {
        setAlert({ message: 'Erro ao eliminar utilizador.', type: 'danger' });
      }
    }
  };

  const handleConfirmDeleteAll = async () => {
    try {
      for (const id of selectedUsers) {
        await deleteUser(id);
      }
      setAlert({ message: `Eliminados ${selectedUsers.length} utilizadores com sucesso.`, type: 'success' });
      setSelectedUsers([]);
      setShowDeleteAllModal(false);
      refetch();
    } catch {
      setAlert({ message: 'Erro ao eliminar utilizadores selecionados.', type: 'danger' });
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
          <p>A carregar utilizadores...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <UserList
            users={users}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onToggleStatus={toggleUserStatus}
            onNew={() => navigate('/users/create')}
            filterText={filterText}
            filterStatus={filterStatus}
            onFilterTextChange={setFilterText}
            onFilterStatusChange={setFilterStatus}
            onClearFilters={handleClearFilters}
            selectedUsers={selectedUsers}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onDeleteSelected={handleDeleteSelected}
          />
        )}
      </div>

      {/* Modal eliminar 1 */}
      {showDeleteModal && userToDelete && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmação</h5>
                <button className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Deseja eliminar o utilizador <strong>{userToDelete.name}</strong>?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                <button className="btn btn-danger" onClick={handleConfirmDelete}>Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal eliminar múltiplos */}
      {showDeleteAllModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Eliminar Selecionados</h5>
                <button className="btn-close" onClick={() => setShowDeleteAllModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Tem a certeza que deseja eliminar <strong>{selectedUsers.length}</strong> utilizadores?</p>
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

export default UsersPage;

