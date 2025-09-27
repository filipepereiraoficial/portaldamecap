import React, { useState, useMemo } from 'react';
import { Plus, Search, UserPlus, Trash2, Crown, Shield, Clock, CheckCircle, ShieldAlert, ShieldOff, RotateCcw } from 'lucide-react';
import { faker } from '@faker-js/faker';
import { GrupoMembro, Membro, Suspensao } from '../../types';
import { ProtectedComponent } from '../Auth/ProtectedComponent';
import { usePermissions } from '../../hooks/usePermissions';
import { SuspendMemberModal } from '../MemberManagement/SuspendMemberModal';

interface MembrosTabProps {
  canManage: boolean;
  groupMembers: GrupoMembro[];
  congregacaoId: string;
  groupId: string;
  groupName: string;
  groupType: 'ministerio' | 'rede';
}

// Simula uma lista global de todos os membros do sistema
const todosMembrosMock: Membro[] = Array.from({ length: 100 }, () => ({
  id: faker.string.uuid(),
  nome: faker.person.fullName(),
  matricula: faker.string.numeric(8),
  email: faker.internet.email(),
  cpf: faker.string.numeric(11),
  congregacao_id: faker.helpers.arrayElement(['1', '2', '3']),
  congregacao_nome: '',
  data_nascimento: new Date(),
  endereco: '',
  status: 'ATIVO',
  telefone: '',
  createdAt: new Date(),
}));

export const MembrosTab: React.FC<MembrosTabProps> = ({ canManage, groupMembers, congregacaoId, groupId, groupName, groupType }) => {
  const permissions = usePermissions();
  const [membros, setMembros] = useState<GrupoMembro[]>(groupMembers);
  const [suspensions, setSuspensions] = useState<Suspensao[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<GrupoMembro | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenSuspendModal = (membro: GrupoMembro) => {
    setSelectedMember(membro);
    setIsSuspendModalOpen(true);
  };

  const handleSuspensionSuccess = (suspensao: Suspensao) => {
    setMembros(prev => prev.map(m => m.id === suspensao.membro_id ? { ...m, groupStatus: 'SUSPENSO' } : m));
    setSuspensions(prev => [...prev, suspensao]);
    setIsSuspendModalOpen(false);
  };

  const handleCancelSuspension = (membroId: string) => {
    const membro = membros.find(m => m.id === membroId);
    setMembros(prev => prev.map(m => m.id === membroId ? { ...m, groupStatus: 'ATIVO' } : m));
    setSuspensions(prev => prev.map(s => s.membro_id === membroId ? { ...s, status: 'CANCELADA' } : s));
    if (membro) {
      alert(`Suspensão de ${membro.nome} foi cancelada.`);
    }
  };

  const membrosDaCongregacao = useMemo(() => {
    return todosMembrosMock.filter(m => m.congregacao_id === congregacaoId);
  }, [congregacaoId]);

  const membrosDisponiveisParaConvidar = useMemo(() => {
    const idsMembrosAtuais = new Set(membros.map(m => m.id));
    return membrosDaCongregacao.filter(m => 
      !idsMembrosAtuais.has(m.id) &&
      (m.nome.toLowerCase().includes(searchTerm.toLowerCase()) || m.matricula.includes(searchTerm))
    );
  }, [membrosDaCongregacao, membros, searchTerm]);

  const handleInviteMember = (membro: Membro) => {
    const novoMembro: GrupoMembro = {
      ...membro,
      groupStatus: 'PENDENTE',
      role: 'Membro',
    };
    setMembros(prev => [...prev, novoMembro]);
  };

  const getStatusComponent = (status: GrupoMembro['groupStatus']) => {
    if (status === 'PENDENTE') {
      return <div className="flex items-center space-x-1.5 text-xs text-yellow-600"><Clock className="h-3 w-3" /><span>Pendente</span></div>;
    }
    if (status === 'SUSPENSO') {
      return <div className="flex items-center space-x-1.5 text-xs text-red-600"><ShieldAlert className="h-3 w-3" /><span>Suspenso</span></div>;
    }
    return <div className="flex items-center space-x-1.5 text-xs text-green-600"><CheckCircle className="h-3 w-3" /><span>Ativo</span></div>;
  };
  
  const getRoleIcon = (role: GrupoMembro['role']) => {
    switch(role) {
      case 'Líder': return <Crown className="h-4 w-4 text-yellow-500" title="Líder" />;
      case 'Coordenador': return <Shield className="h-4 w-4 text-blue-500" title="Coordenador" />;
      default: return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Membros do Grupo</h3>
        <ProtectedComponent permission={canManage}>
          <button onClick={() => setIsInviteModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center space-x-2">
            <UserPlus className="h-4 w-4" />
            <span>Adicionar Membro</span>
          </button>
        </ProtectedComponent>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {membros.map(membro => (
              <tr key={membro.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(membro.role)}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{membro.nome}</div>
                      <div className="text-sm text-gray-500">{membro.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusComponent(membro.groupStatus)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <ProtectedComponent permission={canManage}>
                    <div className="flex items-center justify-end space-x-1">
                      {membro.groupStatus === 'SUSPENSO' ? (
                        <button onClick={() => handleCancelSuspension(membro.id)} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full" title="Cancelar Suspensão">
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      ) : (
                        <ProtectedComponent permission={permissions.canSuspendMembers}>
                          <button onClick={() => handleOpenSuspendModal(membro)} className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-full" title="Suspender Membro">
                            <ShieldOff className="h-4 w-4" />
                          </button>
                        </ProtectedComponent>
                      )}
                      <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full" title="Remover Membro">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </ProtectedComponent>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">Convidar Membro</h3>
              <p className="text-sm text-gray-500">Busque membros da sua congregação para convidar.</p>
            </div>
            <div className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou matrícula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto border-t">
              {membrosDisponiveisParaConvidar.length > 0 ? (
                membrosDisponiveisParaConvidar.map(membro => (
                  <div key={membro.id} className="flex items-center justify-between p-4 border-b">
                    <div>
                      <p className="font-medium">{membro.nome}</p>
                      <p className="text-sm text-gray-500">Matrícula: {membro.matricula}</p>
                    </div>
                    <button onClick={() => handleInviteMember(membro)} className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-md">Convidar</button>
                  </div>
                ))
              ) : (
                <p className="p-6 text-center text-gray-500">Nenhum membro encontrado ou todos já foram convidados.</p>
              )}
            </div>
            <div className="p-6 border-t flex justify-end">
              <button onClick={() => setIsInviteModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Fechar</button>
            </div>
          </div>
        </div>
      )}

      {isSuspendModalOpen && selectedMember && (
        <SuspendMemberModal
          isOpen={isSuspendModalOpen}
          onClose={() => setIsSuspendModalOpen(false)}
          member={selectedMember}
          group={{ id: groupId, name: groupName, type: groupType }}
          onSuccess={handleSuspensionSuccess}
        />
      )}
    </div>
  );
};
