import React, { useState } from 'react';
import { Upload, Save } from 'lucide-react';
import { ProtectedComponent } from '../Auth/ProtectedComponent';

interface GroupData {
  nome: string;
  descricao: string;
}

interface ConfiguracoesTabProps {
  canManage: boolean;
  groupData: GroupData;
}

export const ConfiguracoesTab: React.FC<ConfiguracoesTabProps> = ({ canManage, groupData }) => {
  const [nome, setNome] = useState(groupData.nome);
  const [descricao, setDescricao] = useState(groupData.descricao);

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Configurações Gerais</h3>
      
      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Grupo</label>
          {canManage ? (
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{nome}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          {canManage ? (
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">{descricao}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logotipo</label>
          <div className="mt-1 flex items-center space-x-4">
            <span className="inline-block h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              <svg className="h-12 w-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.997A14.977 14.977 0 0112.002 15c4.904 0 9.26 2.354 11.998 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
            <ProtectedComponent permission={canManage}>
              <label htmlFor="file-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Alterar</span>
              </label>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" />
            </ProtectedComponent>
          </div>
        </div>

        <ProtectedComponent permission={canManage}>
          <div className="pt-4 border-t border-gray-200">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </ProtectedComponent>
      </div>
    </div>
  );
};
