import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUser';
import UserForm from '../components/users/UserForm';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserById, updateUser, refetch } = useUser();

  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      const data = await getUserById(id);
      if (!cancelled) {
        if (data) {
          setSelectedUser(data);
        } else {
          navigate('/users');
        }
        setLoading(false);
      }
    };

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleUpdate = async (updatedData) => {
    try {
      await updateUser(id, updatedData);
      refetch();
      navigate('/users');
    } catch (err) {
      console.error('Erro ao atualizar utilizador:', err);
    }
  };

  return (
    <div className="py-5">
      <div className="container">
        {loading ? (
          <p>A carregar utilizador...</p>
        ) : selectedUser ? (
          <UserForm
            user={selectedUser}
            onSave={handleUpdate}
            onCancel={() => navigate('/users')}
          />
        ) : (
          <p>Utilizador não encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default UserEdit;
