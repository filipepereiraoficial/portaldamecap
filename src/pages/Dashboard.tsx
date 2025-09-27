import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, FileText, Bell, Calendar, Building2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { membrosMock } from './Membros';
import { movimentacoesMock } from './Tesouraria';
import { solicitacoesMock } from './Solicitacoes';
import { congregacoesMock } from './Congregacoes';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const Dashboard: React.FC = () => {
  const { usuario } = useAuth();
  const permissions = usePermissions();

  const dashboardData = useMemo(() => {
    if (!usuario) {
      return { totalMembros: 0, receitaMensal: 0, solicitacoesPendentes: 0, totalCongregacoes: 0 };
    }

    const isGeral = permissions.isAdministrador || permissions.isGeralUser;
    
    const membrosFiltrados = isGeral ? membrosMock : membrosMock.filter(m => m.congregacao_id === usuario.congregacao_id);
    const movimentacoesFiltradas = isGeral ? movimentacoesMock : movimentacoesMock.filter(m => m.congregacao_id === usuario.congregacao_id);
    const solicitacoesFiltradas = isGeral ? solicitacoesMock : solicitacoesMock.filter(s => s.congregacao_id === usuario.congregacao_id || s.status === 'AGUARDANDO_APROVACAO_GERAL');

    const receitaMensal = movimentacoesFiltradas
      .filter(m => m.tipo === 'ENTRADA' && new Date(m.data) > new Date(new Date().setMonth(new Date().getMonth() - 1)))
      .reduce((acc, m) => acc + m.valor, 0);

    return {
      totalMembros: membrosFiltrados.length,
      receitaMensal: receitaMensal,
      solicitacoesPendentes: solicitacoesFiltradas.filter(s => s.status === 'PENDENTE' || s.status === 'AGUARDANDO_APROVACAO_GERAL').length,
      totalCongregacoes: congregacoesMock.length,
    };
  }, [usuario, permissions]);


  const stats = [
    { title: 'Total de Membros', value: dashboardData.totalMembros.toString(), icon: Users, color: 'bg-blue-500', change: '+12%' },
    { title: 'Receita do Mês', value: formatCurrency(dashboardData.receitaMensal), icon: DollarSign, color: 'bg-green-500', change: '+8%' },
    { title: 'Solicitações Pendentes', value: dashboardData.solicitacoesPendentes.toString(), icon: FileText, color: 'bg-yellow-500', change: '-5%' },
    { title: 'Congregações Ativas', value: dashboardData.totalCongregacoes.toString(), icon: Building2, color: 'bg-purple-500', change: '+2' },
  ];

  const recentActivities = [
    { action: 'Novo membro cadastrado', member: 'Maria Silva', time: '2 horas atrás', type: 'member' },
    { action: 'Solicitação de transferência', member: 'João Santos', time: '3 horas atrás', type: 'request' },
    { action: 'Dízimo registrado', member: 'Pedro Oliveira', time: '5 horas atrás', type: 'finance' },
    { action: 'Ministério criado', member: 'Ministério de Louvor Jovem', time: '1 dia atrás', type: 'ministry' },
  ];

  const upcomingEvents = [
    { title: 'Culto de Oração', date: '2025-01-15', time: '19:00', congregation: 'Sede' },
    { title: 'Reunião de Ministério', date: '2025-01-16', time: '14:00', congregation: 'Filial Norte' },
    { title: 'Estudo Bíblico', date: '2025-01-17', time: '20:00', congregation: 'Sede' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-md text-gray-500">Visão geral da {usuario?.congregacao_nome}</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm mt-1 ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Atividades Recentes</h2>
            <Bell className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'member' ? 'bg-blue-500' :
                  activity.type === 'request' ? 'bg-yellow-500' :
                  activity.type === 'finance' ? 'bg-green-500' : 'bg-purple-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.member}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Próximos Eventos</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="border-l-4 border-indigo-500 pl-4">
                <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.congregation}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-400">
                    {new Date(event.date).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">{event.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
