import React, { useState } from 'react';
import { ShieldOff, User, Hash, Building2, Lock } from 'lucide-react';
import { GrupoMembro, Suspensao, SuspensaoEscopo } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

interface SuspendMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: GrupoMembro;
  group: { id: string; name: string; type: 'ministerio' | 'rede' };
  onSuccess: (suspensao: Suspensao) => void;
}

export const SuspendMemberModal: React.FC<SuspendMemberModalProps> = ({ isOpen, onClose, member, group, onSuccess }) => {
  const { usuario } = useAuth();
  const { addNotification } = useNotifications();
  const [motivo, setMotivo] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [escopos, setEscopos] = useState<SuspensaoEscopo[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleEscopoChange = (escopo: SuspensaoEscopo) => {
    setEscopos(prev => 
      prev.includes(escopo) ? prev.filter(e => e !== escopo) : [...prev, escopo]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (escopos.length === 0 || !motivo || !dataFim) {
      setError('Todos os campos obrigatórios devem ser preenchidos.');
      return;
    }
    
    if (senha !== '123') { // Simulação de confirmação de senha
      setError('Senha de confirmação incorreta.');
      return;
    }
    
    if (!usuario) {
        setError('Usuário não autenticado.');
        return;
    }

    const novaSuspensao: Suspensao = {
      id: Math.random().toString(36).substring(2, 9),
      membro_id: member.id,
      membro_nome: member.nome,
      responsavel_id: usuario.id,
      responsavel_nome: usuario.nome,
      motivo,
      data_inicio: new Date(),
      data_fim: new Date(dataFim),
      escopos: escopos.map(e => ({ tipo: e, id: group.id, nome: group.name })),
      status: 'ATIVA',
      isPrivate,
      createdAt: new Date(),
    };
    
    // Notificação para o membro suspenso
    addNotification({
        tipo: 'SUSPENSAO_MEMBRO',
        titulo: `Aviso de Suspensão`,
        mensagem: isPrivate ? 'Você foi suspenso de algumas atividades. Clique para mais detalhes.' : `Você foi suspenso. Motivo: ${motivo}`,
        dados: { suspensaoId: novaSuspensao.id }
    });

    // Notificação de confirmação para o líder
    addNotification({
        tipo: 'SUSPENSAO_CONFIRMACAO',
        titulo: 'Suspensão Aplicada',
        mensagem: `Você suspendeu ${member.nome} do ${group.name}.`,
        dados: { suspensaoId: novaSuspensao.id }
    });
    
    // Notificação para outros líderes/membros do grupo (simulação)
     addNotification({
        tipo: 'SUSPENSAO_INFO',
        titulo: `Aviso de ${group.name}`,
        mensagem: `${member.nome} foi suspenso das atividades.`,
        dados: { grupoId: group.id, membroNome: member.nome }
    });

    onSuccess(novaSuspensao);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div className="p-6 border-b flex items-center space-x-3">
          <ShieldOff className="h-6 w-6 text-red-600" />
          <div>
            <h3 className="text-lg font-bold text-gray-900">Suspender Membro</h3>
            <p className="text-sm text-gray-500">Defina os detalhes da suspensão para {member.nome}.</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Info do Membro */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-800">{member.nome}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-800">Matrícula: {member.matricula}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-800">{member.congregacao_nome || "Congregação não definida"}</span>
              </div>
            </div>

            {/* Escopo da Suspensão */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Órgãos onde a suspensão será válida</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" onChange={() => handleEscopoChange(group.type.toUpperCase() as SuspensaoEscopo)} />
                  <span className="text-sm">Suspender apenas neste {group.type === 'ministerio' ? 'Ministério' : 'Rede'} ({group.name})</span>
                </label>
                <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" onChange={() => handleEscopoChange('CONGREGACAO')} />
                  <span className="text-sm">Suspender de todas as atividades da Congregação</span>
                </label>
              </div>
            </div>

            {/* Motivo */}
            <div>
              <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">Motivo da Suspensão</label>
              <textarea
                id="motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Duração */}
            <div>
              <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700 mb-1">Data de Término da Suspensão</label>
              <input
                type="date"
                id="dataFim"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Ocultar Informações */}
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <input id="isPrivate" type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" />
                <div>
                    <label htmlFor="isPrivate" className="text-sm font-medium text-gray-800">Ocultar detalhes do motivo para o membro</label>
                    <p className="text-xs text-gray-500">O motivo detalhado ficará visível apenas para a liderança.</p>
                </div>
            </div>

            {/* Confirmação de Senha */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">Confirme sua senha para aplicar</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  id="senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <div className="p-6 border-t flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center space-x-2">
              <ShieldOff className="h-4 w-4" />
              <span>Confirmar Suspensão</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
