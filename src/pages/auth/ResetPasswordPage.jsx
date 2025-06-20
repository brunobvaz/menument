import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import loginImage from '../../assets/icon.png';
import api from '../../services/api';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~|\\:;"',./`]).{8,}$/.test(password)) {
      setError('A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, um número e um símbolo.');
      return;
    }


    setLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setStatusMessage(res.data.message || 'Senha redefinida com sucesso.');
      setTimeout(() => navigate('/login'), 3000); // redireciona após 3s
    } catch (err) {
      setError(err?.response?.data?.message || 'Erro ao redefinir a senha.');
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
          <h5 className="mb-4">Redefinir Senha</h5>
        </div>

        {statusMessage && <div className="alert alert-success">{statusMessage}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nova senha:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirmar senha:</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-purple w-100" disabled={loading}>
            {loading ? 'A redefinir...' : 'Redefinir senha'}
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

export default ResetPasswordPage;
