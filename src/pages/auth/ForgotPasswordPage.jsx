import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import loginImage from '../../assets/icon.png';
import api from '../../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setStatusMessage(res.data.message || 'Instruções enviadas para o seu email.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Erro ao enviar instruções.');
    } finally {
      setLoading(false);
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
            <img src={loginImage} alt="Logo" style={{ width: '70%', height: '70%', objectFit: 'cover' }} />
          </div>
          <h5 className="mb-4">Recuperar Senha</h5>
        </div>

        {statusMessage && <div className="alert alert-success">{statusMessage}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="btn btn-purple w-100" disabled={loading}>
            {loading ? 'A enviar...' : 'Enviar instruções'}
          </button>
        </form>

        <div className="mt-3 text-center">
          <Link to="/login" className="text-decoration-none link-purple small">
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
