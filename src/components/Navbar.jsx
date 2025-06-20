import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

// Caminho da imagem do ícone à esquerda (ajuste conforme seu projeto)
import logoIcon from '../assets/icon.png'; // Ex: imagem 32x32

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-purple shadow-sm px-3">
      <div className="container-fluid px-md-5">
        {/* Branding com imagem à esquerda */}
        <span className="navbar-brand d-flex align-items-center">
          <img
            src={logoIcon}
            alt="Logo"
            width={32}
            height={32}
            className="me-2"
            style={{ objectFit: 'contain' }}
          />
          Backoffice
        </span>

        {/* Toggle mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Conteúdo da Navbar */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Menus centralizados */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item px-2">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active fw-bold text-white text-decoration-underline' : ''}`
                }
              >
                Receitas
              </NavLink>
            </li>
            <li className="nav-item px-2">
              <NavLink
                to="/ingredientes"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active fw-bold text-white text-decoration-underline' : ''}`
                }
              >
                Ingredientes
              </NavLink>
            </li>
            <li className="nav-item px-2">
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active fw-bold text-white text-decoration-underline' : ''}`
                }
              >
                Utilizadores
              </NavLink>
            </li>
          </ul>

          {/* Mensagem + botão logout */}
          <div className="d-flex align-items-center gap-3">
            {user?.email && (
              <span className="text-white small">
                <i className="bi bi-person-circle me-1"></i>
                Welcome, <strong>{user.name}</strong>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="btn btn-outline-light btn-sm"
              title="Terminar sessão"
            >
              <i className="bi bi-box-arrow-right me-1"></i> Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

