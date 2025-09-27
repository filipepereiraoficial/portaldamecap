import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  DollarSign, 
  Heart, 
  Settings, 
  ChevronLeft,
  Building2,
  UserPlus,
  Network,
  TrendingUp,
  ShoppingCart
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { usuario } = useAuth();
  const permissions = usePermissions();

  const menuItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard', perfis: ['ADMINISTRADOR', 'SECRETARIO_GERAL', 'SECRETARIO_LOCAL', 'TESOUREIRO_GERAL', 'TESOUREIRO_LOCAL', 'LIDER_MINISTERIO', 'LIDER_REDE', 'MEMBRO', 'GERENTE_CANTINA'] },
    { to: '/membros', icon: Users, label: 'Membros', perfis: ['ADMINISTRADOR', 'SECRETARIO_GERAL', 'SECRETARIO_LOCAL'] },
    { to: '/congregacoes', icon: Building2, label: 'Congregações', perfis: ['ADMINISTRADOR', 'SECRETARIO_GERAL'] },
    { to: '/solicitacoes', icon: FileText, label: 'Secretaria', perfis: ['ADMINISTRADOR', 'SECRETARIO_GERAL', 'SECRETARIO_LOCAL'] },
    { to: '/tesouraria', icon: DollarSign, label: 'Tesouraria', perfis: ['ADMINISTRADOR', 'TESOUREIRO_GERAL', 'TESOUREIRO_LOCAL'] },
    { to: '/cantina/1', icon: ShoppingCart, label: 'Cantina', perfis: ['ADMINISTRADOR', 'TESOUREIRO_GERAL', 'TESOUREIRO_LOCAL', 'GERENTE_CANTINA'], permission: permissions.canAccessCantina },
    { to: '/ministerios', icon: Heart, label: 'Ministérios', perfis: ['ADMINISTRADOR', 'SECRETARIO_GERAL', 'SECRETARIO_LOCAL', 'LIDER_MINISTERIO'] },
    { to: '/redes', icon: Network, label: 'Redes', perfis: ['ADMINISTRADOR', 'SECRETARIO_GERAL', 'SECRETARIO_LOCAL', 'LIDER_REDE'] },
    { to: '/desenvolvimento', icon: TrendingUp, label: 'Desenvolvimento', perfis: ['ADMINISTRADOR', 'SECRETARIO_GERAL', 'LIDER_MINISTERIO', 'LIDER_REDE'] },
    { to: '/cadastro-inicial', icon: UserPlus, label: 'Config. Inicial', perfis: ['ADMINISTRADOR'] },
    { to: '/configuracoes', icon: Settings, label: 'Configurações', perfis: ['ADMINISTRADOR'] },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!usuario) return false;
    if (item.permission !== undefined && !item.permission) return false;
    return item.perfis.includes(usuario.perfil);
  });

  return (
    <div className={`bg-sidebar-bg text-white flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-end p-4 h-[73px]">
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className={`h-6 w-6 transition-transform ${isOpen ? '' : 'rotate-180'}`} />
        </button>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2 px-4">
          {filteredMenuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                title={isOpen ? '' : item.label}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isOpen ? '' : 'justify-center'
                  } ${
                    isActive
                      ? 'bg-sidebar-active text-white'
                      : 'text-indigo-100 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {isOpen && <span className="ml-4 font-medium">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
