import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Plus, Download, Edit, Trash2, Eye } from 'lucide-react';
import { faker } from '@faker-js/faker';
import { Membro } from '../types';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { ProtectedComponent } from '../components/Auth/ProtectedComponent';
import { congregacoesMock } from './Congregacoes';

const gerarMembros = (): Membro[] => Array.from({ length: 50 }, (_, i) => {
  const congregacao = faker.helpers.arrayElement(congregacoesMock);
  return {
    id: faker.string.uuid(),
    matricula: `${faker.date.birthdate().getMonth().toString().padStart(2, '0')}${(i + 1).toString().padStart(4, '0')}${faker.string.numeric(4)}`,
    nome: faker.person.fullName(),
    cpf: faker.string.numeric(11),
    data_nascimento: faker.date.birthdate(),
    telefone: faker.phone.number(),
    email: faker.internet.email(),
    status: faker.helpers.arrayElement(['ATIVO', 'INATIVO', 'TRANSFERIDO']),
    congregacao_id: congregacao.id,
    congregacao_nome: congregacao.nome,
    endereco: faker.location.streetAddress(),
    createdAt: faker.date.past(),
  };
});

export const membrosMock = gerarMembros();

export const Membros: React.FC = () => {
  const { usuario } = useAuth();
  const permissions = usePermissions();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');

  const filteredMembros = useMemo(() => {
    return membrosMock.filter(membro => {
      if (!usuario) return false;

      // Filtro por congregação (usuários não-gerais só veem sua congregação)
      const isGeral = permissions.isAdministrador || permissions.isGeralUser;
      if (!isGeral && membro.congregacao_id !== usuario.congregacao_id) {
        return false;
      }

      // Filtro por busca
      const matchSearch = membro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         membro.cpf.includes(searchTerm) ||
                         membro.matricula.includes(searchTerm);
      
      // Filtro por status
      const matchStatus = filterStatus === 'TODOS' || membro.status === filterStatus;
      
      return matchSearch && matchStatus;
    });
  }, [searchTerm, filterStatus, usuario, permissions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVO': return 'bg-green-100 text-green-800';
      case 'INATIVO': return 'bg-red-100 text-red-800';
      case 'TRANSFERIDO': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Membros</h1>
        </div>
        <ProtectedComponent permission={permissions.canCreate}>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Membro</span>
          </button>
        </ProtectedComponent>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, CPF ou matrícula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-80"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
              <option value="TRANSFERIDO">Transferido</option>
            </select>
          </div>

          <ProtectedComponent permission={permissions.canExport}>
            <div className="flex space-x-2">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </button>
            </div>
          </ProtectedComponent>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matrícula</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Congregação</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembros.slice(0, 15).map((membro) => (
                <tr key={membro.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{membro.nome}</div>
                      <div className="text-sm text-gray-500">{membro.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{membro.matricula}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{membro.congregacao_nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(membro.status)}`}>
                      {membro.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900"><Eye className="h-4 w-4" /></button>
                      <ProtectedComponent permission={permissions.canEdit}>
                        <button className="text-yellow-600 hover:text-yellow-900"><Edit className="h-4 w-4" /></button>
                      </ProtectedComponent>
                      <ProtectedComponent permission={permissions.canDelete}>
                        <button className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                      </ProtectedComponent>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
