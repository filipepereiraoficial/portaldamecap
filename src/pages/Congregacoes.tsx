import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, Users, MapPin, Star } from 'lucide-react';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { Congregacao } from '../types';
import { usePermissions } from '../hooks/usePermissions';
import { ProtectedComponent } from '../components/Auth/ProtectedComponent';
import { useNavigate } from 'react-router-dom';

const gerarCongregacoes = (): Congregacao[] => {
  const congregacoes: Congregacao[] = [
    {
      id: '1',
      nome: 'Congregação Sede',
      endereco: faker.location.streetAddress(true),
      responsavel: faker.person.fullName(),
      totalMembros: faker.number.int({ min: 150, max: 500 }),
      igreja_id: '1',
      isSede: true,
      createdAt: faker.date.past(),
      cantina_id: 'cantina-sede',
    },
  ];

  for (let i = 0; i < 7; i++) {
    congregacoes.push({
      id: (i + 2).toString(),
      nome: `Filial ${faker.location.city()}`,
      endereco: faker.location.streetAddress(true),
      responsavel: faker.person.fullName(),
      totalMembros: faker.number.int({ min: 50, max: 200 }),
      igreja_id: '1',
      isSede: false,
      createdAt: faker.date.past(),
      cantina_id: i === 0 ? 'cantina-filial-norte' : undefined // Adiciona cantina a uma filial
    });
  }
  return congregacoes;
};

export const congregacoesMock = gerarCongregacoes();

export const Congregacoes: React.FC = () => {
  const permissions = usePermissions();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Congregações</h1>
        </div>
        <ProtectedComponent permission={permissions.canManageCongregations}>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Congregação</span>
          </button>
        </ProtectedComponent>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {congregacoesMock.map((congregacao, index) => (
          <motion.div
            key={congregacao.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-xl shadow-sm border ${congregacao.isSede ? 'border-indigo-500' : 'border-gray-200'} overflow-hidden relative`}
          >
            {congregacao.isSede && (
              <div className="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg flex items-center space-x-1">
                <Star className="h-3 w-3" />
                <span>SEDE</span>
              </div>
            )}
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2 truncate">{congregacao.nome}</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                  <span>{congregacao.endereco}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>{congregacao.totalMembros} membros</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Responsável</p>
                  <p className="text-sm font-medium text-gray-800">{congregacao.responsavel}</p>
                </div>
                <ProtectedComponent permission={permissions.canManageCongregations}>
                  <button onClick={() => navigate(`/congregacoes/${congregacao.id}`)} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">
                    Gerenciar
                  </button>
                </ProtectedComponent>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
