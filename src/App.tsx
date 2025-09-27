import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, useAuth, useAuthProvider } from './hooks/useAuth';
import { NotificationProvider } from './hooks/useNotifications';
import { LoginForm } from './components/Auth/LoginForm';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { ConfiguracaoInicial } from './pages/ConfiguracaoInicial';
import { Membros } from './pages/Membros';
import { Solicitacoes } from './pages/Solicitacoes';
import { Congregacoes } from './pages/Congregacoes';
import { Tesouraria } from './pages/Tesouraria';
import { Ministerios } from './pages/Ministerios';
import { Redes } from './pages/Redes';
import { Desenvolvimento } from './pages/Desenvolvimento';
import { GerenciarMinisterio } from './pages/GerenciarMinisterio';
import { GerenciarRede } from './pages/GerenciarRede';
import { GerenciarCongregacao } from './pages/GerenciarCongregacao';
import { CantinaPage } from './pages/Cantina';

/**
 * Este componente atua como um "guardião" para as rotas autenticadas.
 * Ele verifica se o usuário está logado. Se estiver, renderiza o componente
 * de Layout (que por sua vez contém um <Outlet /> para as páginas aninhadas).
 * Caso contrário, redireciona para a página de login.
 */
const PrivateRouteWrapper: React.FC = () => {
  const { usuario, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Carregando...</div>;
  }

  return usuario ? <Layout /> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  const authProviderValue = useAuthProvider();

  return (
    <AuthContext.Provider value={authProviderValue}>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Routes>
              <Route
                path="/login"
                element={
                  // Se o usuário já estiver logado, redireciona da página de login para o dashboard.
                  authProviderValue.usuario ? <Navigate to="/dashboard" replace /> : <LoginForm />
                }
              />
              
              {/* Todas as rotas autenticadas são aninhadas sob o "guardião" de rotas. */}
              <Route element={<PrivateRouteWrapper />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cadastro-inicial" element={<ConfiguracaoInicial />} />
                <Route path="/membros" element={<Membros />} />
                <Route path="/solicitacoes" element={<Solicitacoes />} />
                <Route path="/congregacoes" element={<Congregacoes />} />
                <Route path="/congregacoes/:id" element={<GerenciarCongregacao />} />
                <Route path="/tesouraria" element={<Tesouraria />} />
                <Route path="/cantina/:id" element={<CantinaPage />} />
                <Route path="/ministerios" element={<Ministerios />} />
                <Route path="/ministerios/:id" element={<GerenciarMinisterio />} />
                <Route path="/redes" element={<Redes />} />
                <Route path="/redes/:id" element={<GerenciarRede />} />
                <Route path="/desenvolvimento" element={<Desenvolvimento />} />
                <Route path="/configuracoes" element={<div className="p-6">Configurações em desenvolvimento...</div>} />
                
                {/* Redireciona a rota raiz ("/") para o dashboard. */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Route>

              {/* Uma rota "catch-all" final para redirecionar qualquer caminho desconhecido. */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthContext.Provider>
  );
};

export default App;
