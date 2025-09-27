import React, { useState } from 'react';
import { Plus, MessageSquare, User, Calendar } from 'lucide-react';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { ProtectedComponent } from '../Auth/ProtectedComponent';

interface Comunicado {
  id: string;
  title: string;
  content: string;
  author: string;
  date: Date;
}

const gerarComunicados = (count: number): Comunicado[] => 
  Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.lorem.sentence(5),
    content: faker.lorem.paragraphs(2),
    author: faker.person.fullName(),
    date: faker.date.recent({ days: 15 }),
  })).sort((a, b) => b.date.getTime() - a.date.getTime());

interface ComunicacaoTabProps {
  canManage: boolean;
}

export const ComunicacaoTab: React.FC<ComunicacaoTabProps> = ({ canManage }) => {
  const [comunicados] = useState<Comunicado[]>(gerarComunicados(3));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Últimos Comunicados</h3>
        <ProtectedComponent permission={canManage}>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Novo Comunicado</span>
          </button>
        </ProtectedComponent>
      </div>

      <div className="space-y-6">
        {comunicados.map(comunicado => (
          <div key={comunicado.id} className="border-b border-gray-200 pb-6 last:border-b-0">
            <h4 className="text-lg font-semibold text-gray-900">{comunicado.title}</h4>
            <div className="flex items-center space-x-4 text-xs text-gray-500 my-2">
              <div className="flex items-center space-x-1.5">
                <User className="h-3 w-3" />
                <span>{comunicado.author}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="h-3 w-3" />
                <span>{comunicado.date.toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{comunicado.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
