import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import loginImage from '../assets/icon.png';
import useUser from '../hooks/useUser';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useUser();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~|\\:;"',./`]).{8,}$/;


    if (form.password !== form.confirmPassword) {
      setFormError('As senhas não coincidem.');
      return;
    }

    if (!passwordRegex.test(form.password)) {
      setFormError('A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, um número e um símbolo.');
      return;
    }


    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      status: 'inactive',
      perfil: 'user',
    });

    if (!result.success) {
      setFormError(result.message);
      return;
    }

    setSuccessMessage('Conta criada com sucesso! Verifique o seu email para ativar a conta.');
    setTimeout(() => navigate('/login'), 3000);
  };

  useEffect(() => {
    return () => {
      setFormError('');
      setSuccessMessage('');
    };
  }, []);

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center login-bg">
      <div className="card shadow p-4" style={{ maxWidth: 400, width: '100%' }}>
        <div className="text-center">
          <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
            style={{ width: 150, height: 150, backgroundColor: '#6f42c1', overflow: 'hidden' }}>
            <img src={loginImage} alt="Avatar" style={{ width: '70%', height: '70%', objectFit: 'cover' }} />
          </div>
          <h5 className="mb-4">Criar Conta</h5>
        </div>

        {formError && <div className="alert alert-danger">{formError}</div>}
        {error && !formError && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nome:</label>
            <input
              type="text"
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Senha:</label>
            <input
              type="password"
              className="form-control"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirmar Senha:</label>
            <input
              type="password"
              className="form-control"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-purple w-100" disabled={loading}>
            {loading ? 'A registar...' : 'Registar'}
          </button>
        </form>

        <div className="mt-3 text-center">
          <span className="small">Já tem conta?</span>{' '}
          <Link to="/login" className="text-decoration-none link-purple small">
            Entrar
          </Link>
        </div>

        <div className="mt-2 text-center">
          <span className="small">Não recebeu o email?</span>{' '}
          <Link to="/resend-activation" className="text-decoration-none link-purple small">
            Reenviar ativação
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
