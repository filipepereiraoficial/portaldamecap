import { useState, useEffect, createContext, useContext } from 'react';
import { Usuario } from '../types';

interface AuthContextType {
  usuario: Usuario | null;
  originalUser: Usuario | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasAccess: (perfis: Usuario['perfil'][]) => boolean;
  impersonate: (perfil: Usuario['perfil']) => void;
  stopImpersonating: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [impersonatedUser, setImpersonatedUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const usuario = impersonatedUser || currentUser;
  const originalUser = impersonatedUser ? currentUser : null;

  useEffect(() => {
    const storedUser = localStorage.getItem('sgci_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      let usuarioLogado: Usuario | null = null;

      if (email.includes('admin')) {
        usuarioLogado = {
          id: '1', nome: 'Admin Geral', email, perfil: 'ADMINISTRADOR',
          congregacao_id: '1', congregacao_nome: 'Sede', igreja_id: '1', ativo: true, createdAt: new Date()
        };
      } else if (email.includes('secretario.geral')) {
        usuarioLogado = {
          id: '2', nome: 'Secretário Geral', email, perfil: 'SECRETARIO_GERAL',
          congregacao_id: '1', congregacao_nome: 'Sede', igreja_id: '1', ativo: true, createdAt: new Date()
        };
      } else if (email.includes('tesoureiro.geral')) {
        usuarioLogado = {
          id: '6', nome: 'Tesoureiro Geral', email, perfil: 'TESOUREIRO_GERAL',
          congregacao_id: '1', congregacao_nome: 'Sede', igreja_id: '1', ativo: true, createdAt: new Date()
        };
      } else if (email.includes('tesoureiro.local')) {
         usuarioLogado = {
          id: '3', nome: 'Tesoureiro Local', email, perfil: 'TESOUREIRO_LOCAL',
          congregacao_id: '2', congregacao_nome: 'Filial Norte', igreja_id: '1', ativo: true, createdAt: new Date()
        };
      } else if (email.includes('secretario.local')) {
         usuarioLogado = {
          id: '4', nome: 'Secretário Local', email, perfil: 'SECRETARIO_LOCAL',
          congregacao_id: '3', congregacao_nome: 'Filial Sul', igreja_id: '1', ativo: true, createdAt: new Date()
        };
      } else if (email.includes('lider.ministerio')) {
         usuarioLogado = {
          id: '7', nome: 'Líder de Ministério', email, perfil: 'LIDER_MINISTERIO',
          congregacao_id: '2', congregacao_nome: 'Filial Norte', igreja_id: '1', ativo: true, createdAt: new Date()
        };
      } else if (email.includes('lider.rede')) {
         usuarioLogado = {
          id: '8', nome: 'Líder de Rede', email, perfil: 'LIDER_REDE',
          congregacao_id: '3', congregacao_nome: 'Filial Sul', igreja_id: '1', ativo: true, createdAt: new Date()
        };
      } else if (email.includes('membro')) {
         usuarioLogado = {
          id: '5', nome: 'Membro Comum', email, perfil: 'MEMBRO',
          congregacao_id: '2', congregacao_nome: 'Filial Norte', igreja_id: '1', ativo: true, createdAt: new Date()
        };
      } else if (email.includes('gerente.cantina')) {
         usuarioLogado = {
          id: '9', nome: 'Gerente Cantina', email, perfil: 'GERENTE_CANTINA',
          congregacao_id: '1', congregacao_nome: 'Sede', igreja_id: '1', ativo: true, createdAt: new Date()
        };
      }

      if (usuarioLogado) {
        setCurrentUser(usuarioLogado);
        localStorage.setItem('sgci_user', JSON.stringify(usuarioLogado));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setImpersonatedUser(null);
    localStorage.removeItem('sgci_user');
  };

  const impersonate = (perfil: Usuario['perfil']) => {
    if (currentUser && currentUser.perfil === 'ADMINISTRADOR') {
      const isLocalProfile = perfil.includes('LOCAL') || perfil === 'MEMBRO' || perfil.includes('LIDER') || perfil === 'GERENTE_CANTINA';
      const congregacao_id = isLocalProfile ? '2' : '1';
      const congregacao_nome = isLocalProfile ? 'Filial Norte' : 'Sede';

      setImpersonatedUser({
        ...currentUser,
        perfil: perfil,
        congregacao_id: congregacao_id,
        congregacao_nome: congregacao_nome,
      });
    }
  };

  const stopImpersonating = () => {
    setImpersonatedUser(null);
  };

  const hasAccess = (perfis: Usuario['perfil'][]) => {
    if (!usuario) return false;
    return perfis.includes(usuario.perfil);
  };

  return {
    usuario,
    originalUser,
    login,
    logout,
    isLoading,
    hasAccess,
    impersonate,
    stopImpersonating,
  };
};

export { AuthContext };
