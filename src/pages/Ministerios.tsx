import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus, Users, User, Settings } from 'lucide-react';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { Ministerio, GrupoMembro } from '../types';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { ProtectedComponent } from '../components/Auth/ProtectedComponent';
import { useNavigate } from 'react-router-dom';

const congregacoesMock = [
  { id: '1', nome: 'Sede' },
  { id: '2', nome: 'Filial Norte' },
  { id: '3', nome: 'Filial Sul' },
];

const gerarMembrosMinisterio = (total: number): GrupoMembro[] => 
  Array.from({ length: total }, () => ({
    id: faker.string.uuid(),
    nome: faker.person.fullName(),
    matricula: faker.string.numeric(8),
    email: faker.internet.email(),
    telefone: faker.phone.number(),
    status: 'ATIVO',
    cargo: faker.helpers.arrayElement(['Membro', 'Coordenador', 'Apoio']),
    cpf: '',
    data_nascimento: new Date(),
    endereco: '',
    congregacao_id: '',
    congregacao_nome: '',
    createdAt: new Date(),
    groupStatus: faker.helpers.arrayElement(['ATIVO', 'PENDENTE']),
    role: faker.helpers.arrayElement(['Membro', 'Líder']),
  }));

const gerarMinisterios = (): Ministerio[] => {
  const nomesMinisterios = [
    'Louvor', 'Ação Social', 'Infantil', 'Jovens', 'Casais', 'Evangelismo', 'Mídia', 'Recepção'
  ];
  return nomesMinisterios.map(nome => {
    const totalMembros = faker.number.int({ min: 10, max: 50 });
    return {
      id: faker.string.uuid(),
      nome: `Ministério de ${nome}`,
      descricao: faker.lorem.sentence(),
      lider_id: '7', // ID do usuário 'Líder de Ministério' para teste
      lider_nome: faker.person.fullName(),
      totalMembros,
      congregacao_id: faker.helpers.arrayElement(congregacoesMock).id,
      ativo: faker.datatype.boolean(),
      createdAt: faker.date.past(),
      membros: gerarMembrosMinisterio(totalMembros),
    };
  });
};

export const ministeriosMock = gerarMinisterios();

export const Ministerios: React.FC = () => {
  const { usuario } = useAuth();
  const permissions = usePermissions();
  const navigate = useNavigate();

  const filteredMinisterios = useMemo(() => {
    if (!usuario) return [];
    const isGeral = permissions.isAdministrador || permissions.isGeralUser;
    if (isGeral) return ministeriosMock;
    return ministeriosMock.filter(m => m.congregacao_id === usuario.congregacao_id);
  }, [usuario, permissions]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Heart className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Ministérios</h1>
        </div>
        <ProtectedComponent permission={permissions.canManageMinistries && permissions.canCreate}>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Ministério</span>
          </button>
        </ProtectedComponent>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredMinisterios.map((ministerio, index) => (
          <motion.div
            key={ministerio.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col"
          >
            <div className="p-6 flex-grow">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-900 truncate">{ministerio.nome}</h2>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  ministerio.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {ministerio.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{ministerio.descricao}</p>
              
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <User className="h-4 w-4 text-gray-400" />
                <span>Líder: {ministerio.lider_nome}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-700 mt-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span>{ministerio.totalMembros} membros</span>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <ProtectedComponent permission={permissions.canManageMinistries}>
                <button 
                  onClick={() => navigate(`/ministerios/${ministerio.id}`)}
                  className="w-full text-center text-indigo-600 hover:text-indigo-900 font-medium text-sm flex items-center justify-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Gerenciar Ministério</span>
                </button>
              </ProtectedComponent>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
