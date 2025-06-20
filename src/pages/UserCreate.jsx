import React from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUser';
import UserForm from '../components/users/UserForm';

const UserCreate = () => {
  const navigate = useNavigate();
  const { createUser, refetch } = useUser();

  const handleSave = async (formData) => {
    try {
      await createUser(formData);
      refetch();
      navigate('/users');
    } catch (err) {
      console.error('Erro ao criar utilizador:', err);
    }
  };

  return (
    <div className="py-5">
      <div className="container">
        <UserForm onSave={handleSave} onCancel={() => navigate('/users')} />
      </div>
    </div>
  );
};

export default UserCreate;
