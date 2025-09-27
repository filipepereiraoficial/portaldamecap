import React, { useState } from 'react';
import { Bell, User, LogOut, Check, X, Users as ViewAsIcon, Eye as EyeIcon, XCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { Usuario } from '../../types';

export const Header: React.FC = () => {
  const { usuario, logout, originalUser, impersonate, stopImpersonating } = useAuth();
  const { notificacoes, handleNotificationAction, markAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showViewAs, setShowViewAs] = useState(false);

  const unreadCount = notificacoes.filter(n => !n.lida).length;

  const perfisParaPersonificar: Usuario['perfil'][] = [
    'SECRETARIO_GERAL',
    'TESOUREIRO_GERAL',
    'SECRETARIO_LOCAL',
    'TESOUREIRO_LOCAL',
    'LIDER_MINISTERIO',
    'LIDER_REDE',
    'MEMBRO',
  ];

  const handleImpersonate = (perfil: Usuario['perfil']) => {
    impersonate(perfil);
    setShowViewAs(false);
  };

  return (
    <header className="bg-white shadow-sm z-10">
      {/* Impersonation Banner */}
      {originalUser && (
        <div className="bg-yellow-400 text-yellow-900 text-sm font-semibold py-2 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <EyeIcon className="h-4 w-4" />
            <span>
              Visualizando como <strong className="capitalize">{usuario?.perfil.replace(/_/g, ' ').toLowerCase()}</strong>
            </span>
          </div>
          <button onClick={stopImpersonating} className="flex items-center space-x-1 hover:bg-yellow-500 rounded-md px-2 py-1 transition-colors">
            <XCircle className="h-4 w-4" />
            <span>Voltar para visão de Administrador</span>
          </button>
        </div>
      )}

      <div className="flex items-center justify-between px-6 h-[73px]">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Bem-vindo, {usuario?.nome?.split(' ')[0]}
          </h2>
          <span className="px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-full capitalize">
            {usuario?.perfil.replace(/_/g, ' ').toLowerCase()}
          </span>
        </div>

        <div className="flex items-center space-x-6">
          {/* View As Dropdown (only for admin when not impersonating) */}
          {originalUser === null && usuario?.perfil === 'ADMINISTRADOR' && (
            <div className="relative">
              <button
                onClick={() => setShowViewAs(!showViewAs)}
                className="p-2 text-gray-500 hover:text-gray-700 relative rounded-full hover:bg-gray-100 flex items-center space-x-2"
              >
                <ViewAsIcon className="h-5 w-5" />
                <span className="text-sm hidden md:inline">Visualizar como</span>
              </button>
              {showViewAs && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-20">
                  <div className="p-3 font-semibold border-b">Personificar Perfil</div>
                  <div className="max-h-96 overflow-y-auto">
                    {perfisParaPersonificar.map(perfil => (
                      <button
                        key={perfil}
                        onClick={() => handleImpersonate(perfil)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize"
                      >
                        {perfil.replace(/_/g, ' ').toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-500 hover:text-gray-700 relative rounded-full hover:bg-gray-100"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">{unreadCount}</span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border z-20">
                <div className="p-3 font-semibold border-b">Notificações</div>
                <div className="max-h-96 overflow-y-auto">
                  {notificacoes.map(n => (
                    <div key={n.id} className={`p-3 border-b last:border-b-0 ${!n.lida ? 'bg-indigo-50' : ''}`}>
                      <p className="font-semibold text-sm">{n.titulo}</p>
                      <p className="text-sm text-gray-600">{n.mensagem}</p>
                      {n.tipo.startsWith('CONVITE') && !n.lida && (
                        <div className="flex items-center space-x-2 mt-2">
                          <button onClick={() => handleNotificationAction(n.id, true)} className="flex-1 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md flex items-center justify-center space-x-1"><Check className="h-3 w-3" /><span>Aceitar</span></button>
                          <button onClick={() => handleNotificationAction(n.id, false)} className="flex-1 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-md flex items-center justify-center space-x-1"><X className="h-3 w-3" /><span>Recusar</span></button>
                        </div>
                      )}
                      {n.tipo === 'SUSPENSAO_MEMBRO' && !n.lida && (
                        <div className="mt-2">
                           <button onClick={() => markAsRead(n.id)} className="w-full bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md">Ver Detalhes</button>
                        </div>
                      )}
                    </div>
                  ))}
                  {notificacoes.length === 0 && <p className="p-4 text-center text-sm text-gray-500">Nenhuma notificação.</p>}
                </div>
              </div>
            )}
          </div>

          <div className="relative group">
            <button className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              {usuario && (
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-800">{usuario.nome}</p>
                  <p className="text-sm text-gray-500">{usuario.email}</p>
                </div>
              )}
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible">
               <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Meu Perfil</a>
               <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Configurações</a>
               <div className="border-t border-gray-100 my-1"></div>
               <button
                onClick={logout}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
               >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
