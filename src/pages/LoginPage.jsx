import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import loginImage from '../assets/icon.png';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const result = await login({ email: form.email, password: form.password });

    if (!result.success) {
      if (result.message && result.message.includes('não foi ativada')) {
        setFormError(
          <>
            A conta ainda não foi ativada.
            <br />
            <Link to="/resend-activation">Reenviar link de ativação</Link>
          </>
        );
      } else {
        setFormError(result.message);
      }
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center login-bg">
      <div className="card shadow p-4" style={{ maxWidth: 400, width: '100%' }}>
        <div className="text-center">
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
            style={{ width: 150, height: 150, backgroundColor: '#6f42c1', overflow: 'hidden' }}
          >
            <img src={loginImage} alt="Avatar" style={{ width: '70%', height: '70%', objectFit: 'cover' }} />
          </div>
          <h5 className="mb-4">Entrar</h5>
        </div>

        {formError && <div className="alert alert-danger">{formError}</div>}

        <form onSubmit={handleSubmit}>
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
            <div className="d-flex justify-content-end mt-1">
              <Link to="/forgot-password" className="text-decoration-none" style={{ color: '#6f42c1', fontSize: '0.9rem' }}>
                Esqueceu a senha?
              </Link>
            </div>
          </div>


          <button type="submit" className="btn btn-purple w-100" disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-3 text-center">
          <span className="small">Ainda não tem conta?</span>{' '}
          <Link to="/register" className="text-decoration-none link-purple small">
            Criar Conta
          </Link>
        </div>

        <div className="mt-2 text-center">
          <Link to="/resend-activation" className="text-decoration-none small">
            Reenviar link de ativação
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
