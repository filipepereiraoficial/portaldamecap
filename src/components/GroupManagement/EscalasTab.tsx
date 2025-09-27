import React, { useState } from 'react';
import { Plus, Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { ProtectedComponent } from '../Auth/ProtectedComponent';

interface EscalaEvent {
  id: string;
  title: string;
  date: Date;
  responsibles: string[];
}

const gerarEscalas = (count: number, eventName: string): EscalaEvent[] => 
  Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: `${eventName} de ${faker.lorem.words(2)}`,
    date: faker.date.soon({ days: 30 }),
    responsibles: Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, () => faker.person.firstName()),
  })).sort((a, b) => a.date.getTime() - b.date.getTime());

interface EscalasTabProps {
  canManage: boolean;
  eventName?: string;
}

export const EscalasTab: React.FC<EscalasTabProps> = ({ canManage, eventName = 'Evento' }) => {
  const [escalas, setEscalas] = useState<EscalaEvent[]>(gerarEscalas(5, eventName));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Próximas Escalas</h3>
        <ProtectedComponent permission={canManage}>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Criar Escala</span>
          </button>
        </ProtectedComponent>
      </div>

      <div className="space-y-4">
        {escalas.map(escala => (
          <div key={escala.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-grow">
              <h4 className="font-semibold text-gray-900">{escala.title}</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{escala.date.toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{escala.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                <span className="font-medium">Responsáveis:</span> {escala.responsibles.join(', ')}
              </p>
            </div>
            <ProtectedComponent permission={canManage}>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <button className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-full">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </ProtectedComponent>
          </div>
        ))}
      </div>
    </div>
  );
};
