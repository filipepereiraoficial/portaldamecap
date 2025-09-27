import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Search, Filter, Clock, CheckCircle, XCircle, AlertTriangle, Eye, User, Building2, Send } from 'lucide-react';
import { faker } from '@faker-js/faker';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { ProtectedComponent } from '../components/Auth/ProtectedComponent';
import { Solicitacao, SolicitacaoTipo, SolicitacaoStatus } from '../types';
import { congregacoesMock } from './Congregacoes';

const tiposSolicitacao: SolicitacaoTipo[] = [
  'TRANSFERENCIA', 'BATISMO', 'ALTERACAO_CADASTRAL', 'CASAMENTO', 'APRESENTACAO_CRIANCA',
  'REGISTRO_BATISMO', 'ALTERACAO_CONGREGACAO', 'REGISTRO_OBREIRO', 'REGISTRO_TESOUREIRO_LOCAL'
];

const statusSolicitacao: SolicitacaoStatus[] = [
  'PENDENTE', 'APROVADO', 'REJEITADO', 'REVISAO_PENDENTE', 'EM_ANALISE', 'AGUARDANDO_APROVACAO_GERAL'
];

const gerarSolicitacoes = (): Solicitacao[] => Array.from({ length: 30 }, () => {
    const tipo = faker.helpers.arrayElement(tiposSolicitacao);
    const status = faker.helpers.arrayElement(statusSolicitacao);
    const congregacao = faker.helpers.arrayElement(congregacoesMock);
    
    return {
      id: faker.string.uuid(),
      tipo: tipo,
      membro_id: faker.string.uuid(),
      membro_nome: faker.person.fullName(),
      status: status,
      descricao: `Solicitação de ${tipo.toLowerCase().replace(/_/g, ' ')}`,
      congregacao_id: congregacao.id,
      congregacao_origem_id: tipo === 'TRANSFERENCIA' ? congregacao.id : undefined,
      congregacao_destino_id: tipo === 'TRANSFERENCIA' ? faker.helpers.arrayElement(congregacoesMock.filter(c => c.id !== congregacao.id)).id : undefined,
      createdAt: faker.date.recent({ days: 30 }),
      dados_adicionais: {
        nomeCongregacao: congregacao.nome
      }
    };
});

export const solicitacoesMock = gerarSolicitacoes();

const tiposParaEncaminhar: SolicitacaoTipo[] = [
  'REGISTRO_BATISMO', 'ALTERACAO_CONGREGACAO', 'REGISTRO_OBREIRO', 'REGISTRO_TESOUREIRO_LOCAL'
];

export const Solicitacoes: React.FC = () => {
  const { usuario } = useAuth();
  const permissions = usePermissions();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');
  const [filterTipo, setFilterTipo] = useState('TODOS');
  const [solicitacoes, setSolicitacoes] = useState(solicitacoesMock);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<Solicitacao | null>(null);

  const filteredSolicitacoes = useMemo(() => {
    return solicitacoes.filter(solicitacao => {
      if (!usuario) return false;

      const isGeral = permissions.isAdministrador || permissions.isSecretarioGeral;
      // Secretário Geral vê solicitações de sua congregação (Sede) e as que foram encaminhadas
      if (isGeral) {
        if (solicitacao.congregacao_id !== '1' && solicitacao.status !== 'AGUARDANDO_APROVACAO_GERAL') {
          return false;
        }
      } else { // Usuários locais só veem sua congregação
        if (solicitacao.congregacao_id !== usuario.congregacao_id) {
          return false;
        }
      }

      const matchSearch = solicitacao.membro_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solicitacao.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = filterStatus === 'TODOS' || solicitacao.status === filterStatus;
      const matchTipo = filterTipo === 'TODOS' || solicitacao.tipo === filterTipo;
      
      return matchSearch && matchStatus && matchTipo;
    });
  }, [searchTerm, filterStatus, filterTipo, usuario, permissions, solicitacoes]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDENTE': return <Clock className="h-4 w-4" />;
      case 'APROVADO': return <CheckCircle className="h-4 w-4" />;
      case 'REJEITADO': return <XCircle className="h-4 w-4" />;
      case 'REVISAO_PENDENTE': return <AlertTriangle className="h-4 w-4" />;
      case 'EM_ANALISE': return <Eye className="h-4 w-4" />;
      case 'AGUARDANDO_APROVACAO_GERAL': return <Send className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE': return 'bg-yellow-100 text-yellow-800';
      case 'APROVADO': return 'bg-green-100 text-green-800';
      case 'REJEITADO': return 'bg-red-100 text-red-800';
      case 'REVISAO_PENDENTE': return 'bg-orange-100 text-orange-800';
      case 'EM_ANALISE': return 'bg-blue-100 text-blue-800';
      case 'AGUARDANDO_APROVACAO_GERAL': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAction = (solicitacaoId: string, novoStatus: SolicitacaoStatus) => {
    setSolicitacoes(prev => prev.map(s => s.id === solicitacaoId ? { ...s, status: novoStatus } : s));
    setSelectedSolicitacao(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Solicitações</h1>
        </div>
        <ProtectedComponent permission={permissions.canCreate}>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nova Solicitação</span>
          </button>
        </ProtectedComponent>
      </div>

      {/* Filters and Table remain the same */}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitação</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membro/Origem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSolicitacoes.map((solicitacao) => (
                <tr key={solicitacao.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                     <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">{solicitacao.tipo.replace(/_/g, ' ')}</div>
                      <div className="text-sm text-gray-500">{solicitacao.descricao}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{solicitacao.membro_nome}</div>
                    <div className="text-sm text-gray-500">{solicitacao.dados_adicionais?.nomeCongregacao}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(solicitacao.status)}`}>
                      {getStatusIcon(solicitacao.status)}
                      <span>{solicitacao.status.replace(/_/g, ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {solicitacao.createdAt.toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <ProtectedComponent permission={permissions.canApprove}>
                      <button onClick={() => setSelectedSolicitacao(solicitacao)} className="text-indigo-600 hover:text-indigo-900 font-medium">
                        Analisar
                      </button>
                    </ProtectedComponent>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {selectedSolicitacao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Análise de Solicitação</h2>
              <p className="text-sm text-gray-500">{selectedSolicitacao.tipo.replace(/_/g, ' ')}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <p><span className="font-semibold">Solicitante:</span> {selectedSolicitacao.membro_nome}</p>
              <p><span className="font-semibold">Descrição:</span> {selectedSolicitacao.descricao}</p>
              <p><span className="font-semibold">Data:</span> {selectedSolicitacao.createdAt.toLocaleDateString('pt-BR')}</p>
            </div>

            <div className="p-6 border-t flex flex-wrap gap-3 justify-between items-center">
              <div className="flex flex-wrap gap-3">
                <button onClick={() => handleAction(selectedSolicitacao.id, 'APROVADO')} className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center space-x-2"><CheckCircle className="h-4 w-4"/><span>Aprovar</span></button>
                <button onClick={() => handleAction(selectedSolicitacao.id, 'REJEITADO')} className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 flex items-center space-x-2"><XCircle className="h-4 w-4"/><span>Rejeitar</span></button>
                <ProtectedComponent permission={permissions.canForwardRequests && tiposParaEncaminhar.includes(selectedSolicitacao.tipo)}>
                   <button onClick={() => handleAction(selectedSolicitacao.id, 'AGUARDANDO_APROVACAO_GERAL')} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 flex items-center space-x-2"><Send className="h-4 w-4"/><span>Encaminhar p/ Geral</span></button>
                </ProtectedComponent>
              </div>
              <button onClick={() => setSelectedSolicitacao(null)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200">
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
