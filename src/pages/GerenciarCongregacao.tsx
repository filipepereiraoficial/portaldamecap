import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Users, DollarSign, Settings, ArrowLeft, MapPin, ShoppingCart } from 'lucide-react';
import { congregacoesMock } from './Congregacoes';
import { usePermissions } from '../hooks/usePermissions';
import { ProtectedComponent } from '../components/Auth/ProtectedComponent';
import { membrosMock } from './Membros';
import { movimentacoesMock } from './Tesouraria';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const GerenciarCongregacao: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const [activeTab, setActiveTab] = useState<'visão geral' | 'membros' | 'finanças' | 'cantina' | 'configurações'>('visão geral');

  const congregacao = useMemo(() => congregacoesMock.find(c => c.id === id), [id]);

  if (!congregacao) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold">Congregação não encontrada.</h2>
        <button onClick={() => navigate('/congregacoes')} className="mt-4 text-indigo-600">Voltar para a lista</button>
      </div>
    );
  }

  const tabs = [
    { id: 'visão geral', label: 'Visão Geral', icon: Building2 },
    { id: 'membros', label: 'Membros', icon: Users },
    { id: 'finanças', label: 'Finanças', icon: DollarSign },
    { id: 'cantina', label: 'Cantina', icon: ShoppingCart },
    { id: 'configurações', label: 'Configurações', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'visão geral':
        return (
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Detalhes</h3>
                <div className="space-y-3">
                    <p><span className="font-semibold">Responsável:</span> {congregacao.responsavel}</p>
                    <p><span className="font-semibold">Endereço:</span> {congregacao.endereco}</p>
                    <p><span className="font-semibold">Total de Membros:</span> {congregacao.totalMembros}</p>
                    <p><span className="font-semibold">Data de Criação:</span> {new Date(congregacao.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
            </div>
        );
      case 'membros':
        const membrosDaCongregacao = membrosMock.filter(m => m.congregacao_id === congregacao.id);
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'ATIVO': return 'bg-green-100 text-green-800';
            case 'INATIVO': return 'bg-red-100 text-red-800';
            case 'TRANSFERIDO': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
          }
        };
        return (
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Membros de {congregacao.nome} ({membrosDaCongregacao.length})</h3>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matrícula</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {membrosDaCongregacao.slice(0, 10).map(membro => (
                      <tr key={membro.id}>
                        <td className="px-6 py-4">{membro.nome}</td>
                        <td className="px-6 py-4">{membro.matricula}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(membro.status)}`}>
                            {membro.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'finanças':
        const movimentacoesDaCongregacao = movimentacoesMock.filter(m => m.congregacao_id === congregacao.id);
        const totalEntradas = movimentacoesDaCongregacao.filter(m => m.tipo === 'ENTRADA').reduce((acc, m) => acc + m.valor, 0);
        const totalSaidas = movimentacoesDaCongregacao.filter(m => m.tipo === 'SAIDA').reduce((acc, m) => acc + m.valor, 0);
        return (
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Finanças de {congregacao.nome}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="text-sm text-green-700">Entradas</p>
                    <p className="text-xl font-bold text-green-800">{formatCurrency(totalEntradas)}</p>
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-sm text-red-700">Saídas</p>
                    <p className="text-xl font-bold text-red-800">{formatCurrency(totalSaidas)}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="text-sm text-blue-700">Saldo</p>
                    <p className="text-xl font-bold text-blue-800">{formatCurrency(totalEntradas - totalSaidas)}</p>
                </div>
            </div>
             <p className="text-gray-600">Uma tabela detalhada com as últimas movimentações financeiras desta congregação pode ser adicionada aqui.</p>
          </div>
        );
      case 'cantina':
        return (
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Cantina de {congregacao.nome}</h3>
            {congregacao.cantina_id ? (
              <div>
                <p className="text-gray-700 mb-4">Esta congregação possui uma cantina ativa.</p>
                <ProtectedComponent permission={permissions.canAccessCantina}>
                  <button onClick={() => navigate(`/cantina/${congregacao.cantina_id}`)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">
                    Acessar Ponto de Venda
                  </button>
                </ProtectedComponent>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 mb-4">Esta congregação ainda não possui uma cantina.</p>
                <ProtectedComponent permission={permissions.canManageCantina}>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700">
                    Criar Cantina
                  </button>
                </ProtectedComponent>
              </div>
            )}
          </div>
        );
      case 'configurações':
        return (
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Configurações da Congregação</h3>
                 <ProtectedComponent permission={permissions.canManageCongregations}>
                    <div className="space-y-4 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nome da Congregação</label>
                            <input type="text" defaultValue={congregacao.nome} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Endereço</label>
                            <textarea defaultValue={congregacao.endereco} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Responsável</label>
                            <input type="text" defaultValue={congregacao.responsavel} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium">Salvar Alterações</button>
                    </div>
                </ProtectedComponent>
                 <ProtectedComponent permission={!permissions.canManageCongregations}>
                    <p>Você não tem permissão para editar estas informações.</p>
                </ProtectedComponent>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/congregacoes')} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" />
        <span>Voltar para Congregações</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{congregacao.nome}</h1>
              <div className="flex items-center space-x-2 text-gray-500 mt-1">
                <MapPin className="h-4 w-4" />
                <span>{congregacao.endereco}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-6 text-sm">
            <div className="text-center">
              <p className="font-bold text-lg text-gray-800">{congregacao.totalMembros}</p>
              <p className="text-gray-500">Membros</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-800">{congregacao.responsavel}</p>
              <p className="text-gray-500">Responsável</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-b-xl shadow-sm border border-t-0 border-gray-200"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};
