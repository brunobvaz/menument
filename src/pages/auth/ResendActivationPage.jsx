import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import loginImage from '../../assets/icon.png';
import api from '../../services/api';

const ResendActivationPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResend = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await api.post('/auth/resend-activation', { email });
      setMessage(res.data.message);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Erro ao reenviar link.';
      setError(msg);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center login-bg">
      <div className="card shadow p-4" style={{ maxWidth: 400, width: '100%' }}>
        <div className="text-center">
          <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
            style={{ width: 150, height: 150, backgroundColor: '#6f42c1', overflow: 'hidden' }}>
            <img src={loginImage} alt="Avatar" style={{ width: '70%', height: '70%', objectFit: 'cover' }} />
          </div>
          <h5 className="mb-4">Reenviar Ativação</h5>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleResend}>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-purple w-100">
            Reenviar Link
          </button>
        </form>

        <div className="mt-3 text-center">
          <span className="small">Lembrou-se da senha?</span>{' '}
          <Link to="/login" className="text-decoration-none link-purple small">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResendActivationPage;

