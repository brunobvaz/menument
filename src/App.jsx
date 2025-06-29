import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// 🧭 Navegação e layout
import Navbar from './components/Navbar';

// 🔐 Páginas públicas
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import ActivatePage from './pages/auth/ActivatePage';
import ResendActivationPage from './pages/auth/ResendActivationPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import AccountActivated from './pages/Activatedpage';

// 📘 Receitas
import Dashboard from './pages/Dashboard';
import RecipeCreate from './pages/RecipeCreate';
import RecipeEdit from './pages/RecipeEdit';

// 🥕 Ingredientes
import Ingredients from './pages/IngredientsPage';

// 👤 Utilizadores
import UsersPage from './pages/UsersPage';
import UserCreate from './pages/UserCreate';
import UserEdit from './pages/UserEdit';


// 🔒 Rota protegida
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

// 🔁 Conteúdo principal
function AppContent() {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-5">Carregando sessão...</div>;

  return (
    <>
      {user && <Navbar />}

      <Routes>
        {/* Páginas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/activate" element={<ActivatePage />} />
        <Route path="/resend-activation" element={<ResendActivationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route path="/account-activated" element={<AccountActivated />} />

        {/* Receitas */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><RecipeCreate /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><RecipeEdit /></ProtectedRoute>} />

        {/* Ingredientes */}
        <Route path="/ingredientes" element={<ProtectedRoute><Ingredients /></ProtectedRoute>} />

        {/* Utilizadores */}
        <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
        <Route path="/users/create" element={<ProtectedRoute><UserCreate /></ProtectedRoute>} />
        <Route path="/users/edit/:id" element={<ProtectedRoute><UserEdit /></ProtectedRoute>} />


        {/* Redirecionamento padrão */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

// 🌍 Componente principal
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
