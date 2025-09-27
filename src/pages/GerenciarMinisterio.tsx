import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Users, Calendar, MessageSquare, Settings, ArrowLeft } from 'lucide-react';
import { ministeriosMock } from './Ministerios';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { EscalasTab } from '../components/GroupManagement/EscalasTab';
import { ComunicacaoTab } from '../components/GroupManagement/ComunicacaoTab';
import { ConfiguracoesTab } from '../components/GroupManagement/ConfiguracoesTab';
import { MembrosTab } from '../components/GroupManagement/MembrosTab';

export const GerenciarMinisterio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const permissions = usePermissions();

  const [activeTab, setActiveTab] = useState<'membros' | 'escalas' | 'comunicacao' | 'configuracoes'>('membros');

  const ministerio = useMemo(() => ministeriosMock.find(m => m.id === id), [id]);

  const canManageThisGroup = useMemo(() => {
    if (!usuario || !ministerio) return false;
    return permissions.isAdministrador || permissions.isSecretarioGeral || usuario.id === ministerio.lider_id;
  }, [usuario, ministerio, permissions]);

  if (!ministerio) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold">Ministério não encontrado.</h2>
        <button onClick={() => navigate('/ministerios')} className="mt-4 text-indigo-600">Voltar para a lista</button>
      </div>
    );
  }

  const tabs = [
    { id: 'membros', label: 'Membros', icon: Users },
    { id: 'escalas', label: 'Escalas', icon: Calendar },
    { id: 'comunicacao', label: 'Comunicação', icon: MessageSquare },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'membros':
        return <MembrosTab 
                  canManage={canManageThisGroup} 
                  groupMembers={ministerio.membros} 
                  congregacaoId={ministerio.congregacao_id}
                  groupId={ministerio.id}
                  groupName={ministerio.nome}
                  groupType="ministerio"
                />;
      case 'escalas':
        return <EscalasTab canManage={canManageThisGroup} />;
      case 'comunicacao':
        return <ComunicacaoTab canManage={canManageThisGroup} />;
      case 'configuracoes':
        return <ConfiguracoesTab canManage={canManageThisGroup} groupData={ministerio} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/ministerios')} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" />
        <span>Voltar para Ministérios</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Heart className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{ministerio.nome}</h1>
              <p className="text-gray-500">{ministerio.descricao}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-6 text-sm">
            <div className="text-center">
              <p className="font-bold text-lg text-gray-800">{ministerio.totalMembros}</p>
              <p className="text-gray-500">Membros</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-800">{ministerio.lider_nome}</p>
              <p className="text-gray-500">Líder</p>
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

        {/* Tab Content */}
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
