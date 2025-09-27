import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Network, Plus, Users, User, Clock, Settings } from 'lucide-react';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { Rede, GrupoMembro } from '../types';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { ProtectedComponent } from '../components/Auth/ProtectedComponent';
import { useNavigate } from 'react-router-dom';

const congregacoesMock = [
  { id: '1', nome: 'Sede' },
  { id: '2', nome: 'Filial Norte' },
  { id: '3', nome: 'Filial Sul' },
];

const gerarMembrosRede = (total: number): GrupoMembro[] => 
  Array.from({ length: total }, () => ({
    id: faker.string.uuid(),
    nome: faker.person.fullName(),
    matricula: faker.string.numeric(8),
    email: faker.internet.email(),
    telefone: faker.phone.number(),
    status: 'ATIVO',
    cargo: 'Membro',
    cpf: '',
    data_nascimento: new Date(),
    endereco: '',
    congregacao_id: '',
    congregacao_nome: '',
    createdAt: new Date(),
    groupStatus: faker.helpers.arrayElement(['ATIVO', 'PENDENTE']),
    role: 'Membro',
  }));

const gerarRedes = (): Rede[] => {
  const dias = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'];
  return Array.from({ length: 12 }, () => {
    const totalMembros = faker.number.int({ min: 5, max: 15 });
    return {
      id: faker.string.uuid(),
      nome: `Rede ${faker.location.street()}`,
      lider_id: '8', // ID do usuário 'Líder de Rede' para teste
      lider_nome: faker.person.fullName(),
      supervisor_nome: faker.person.fullName(),
      totalMembros,
      dia_semana: faker.helpers.arrayElement(dias),
      horario: '19:30',
      congregacao_id: faker.helpers.arrayElement(congregacoesMock).id,
      ativo: faker.datatype.boolean(),
      createdAt: faker.date.past(),
      membros: gerarMembrosRede(totalMembros),
    };
  });
};

export const redesMock = gerarRedes();

export const Redes: React.FC = () => {
  const { usuario } = useAuth();
  const permissions = usePermissions();
  const navigate = useNavigate();

  const filteredRedes = useMemo(() => {
    if (!usuario) return [];
    const isGeral = permissions.isAdministrador || permissions.isGeralUser;
    if (isGeral) return redesMock;
    return redesMock.filter(r => r.congregacao_id === usuario.congregacao_id);
  }, [usuario, permissions]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Network className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Redes</h1>
        </div>
        <ProtectedComponent permission={permissions.canManageRedes && permissions.canCreate}>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Rede</span>
          </button>
        </ProtectedComponent>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredRedes.map((rede, index) => (
          <motion.div
            key={rede.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col"
          >
            <div className="p-6 flex-grow">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-900 truncate">{rede.nome}</h2>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  rede.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {rede.ativo ? 'Ativa' : 'Inativa'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-700 mt-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>Líder: {rede.lider_nome}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>{rede.totalMembros} membros</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{rede.dia_semana}, {rede.horario}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <ProtectedComponent permission={permissions.canManageRedes}>
                <button 
                  onClick={() => navigate(`/redes/${rede.id}`)}
                  className="w-full text-center text-indigo-600 hover:text-indigo-900 font-medium text-sm flex items-center justify-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Gerenciar Rede</span>
                </button>
              </ProtectedComponent>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
