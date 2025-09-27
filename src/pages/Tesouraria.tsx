import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ArrowUp, ArrowDown, Search, Eye, Edit, Lock, Upload, User } from 'lucide-react';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { MovimentacaoFinanceira, TransparenciaCategoria } from '../types';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { ProtectedComponent } from '../components/Auth/ProtectedComponent';
import { congregacoesMock } from './Congregacoes';

const gerarMovimentacoes = (): MovimentacaoFinanceira[] => {
  const movimentacoes: MovimentacaoFinanceira[] = [];
  for (let i = 0; i < 100; i++) {
    const tipo = faker.helpers.arrayElement<'ENTRADA' | 'SAIDA'>(['ENTRADA', 'SAIDA']);
    const congregacao = faker.helpers.arrayElement(congregacoesMock);
    let categoria: MovimentacaoFinanceira['categoria'];
    if (tipo === 'ENTRADA') {
      categoria = faker.helpers.arrayElement(['DIZIMO', 'OFERTA', 'DOACAO', 'OUTRA_ENTRADA', 'VENDA_CANTINA']);
    } else {
      categoria = faker.helpers.arrayElement(['DESPESA_ADMINISTRATIVA', 'DESPESA_MINISTERIAL', 'OUTRA_DESPESA']);
    }

    movimentacoes.push({
      id: faker.string.uuid(),
      tipo,
      categoria,
      valor: faker.number.float({ min: 10, max: 2000, precision: 0.01 }),
      descricao: categoria === 'VENDA_CANTINA' ? 'Venda realizada na cantina' : faker.lorem.sentence(),
      membro_id: tipo === 'ENTRADA' && categoria === 'DIZIMO' ? faker.string.uuid() : undefined,
      membro_nome: tipo === 'ENTRADA' && categoria === 'DIZIMO' ? faker.person.fullName() : undefined,
      congregacao_id: congregacao.id,
      data: faker.date.recent({ days: 90 }),
      responsavel_nome: faker.person.fullName(),
    });
  }
  return movimentacoes.sort((a, b) => b.data.getTime() - a.data.getTime());
};

export let movimentacoesMock = gerarMovimentacoes();

export const addMovimentacao = (mov: Omit<MovimentacaoFinanceira, 'id'>) => {
  const novaMovimentacao: MovimentacaoFinanceira = {
    id: faker.string.uuid(),
    ...mov
  };
  movimentacoesMock = [novaMovimentacao, ...movimentacoesMock];
};


const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const Tesouraria: React.FC = () => {
  const { usuario } = useAuth();
  const permissions = usePermissions();
  const [tab, setTab] = useState<'movimentacoes' | 'transparencia'>('movimentacoes');
  const [showModal, setShowModal] = useState<'entrada' | 'saida' | 'confirmacao' | null>(null);
  const [senha, setSenha] = useState('');
  const [forceUpdate, setForceUpdate] = useState(0); // Para forçar re-render

  const movimentacoesFiltradas = useMemo(() => {
    if (!usuario) return [];
    const isGeral = permissions.isAdministrador || permissions.isGeralUser;
    if (isGeral) return movimentacoesMock;
    return movimentacoesMock.filter(m => m.congregacao_id === usuario.congregacao_id);
  }, [usuario, permissions, forceUpdate]);

  const { totalEntradas, totalSaidas, saldo } = useMemo(() => {
    const totalEntradas = movimentacoesFiltradas.filter(m => m.tipo === 'ENTRADA').reduce((acc, m) => acc + m.valor, 0);
    const totalSaidas = movimentacoesFiltradas.filter(m => m.tipo === 'SAIDA').reduce((acc, m) => acc + m.valor, 0);
    return { totalEntradas, totalSaidas, saldo: totalEntradas - totalSaidas };
  }, [movimentacoesFiltradas]);

  const dadosTransparenciaEntradas: TransparenciaCategoria[] = useMemo(() => {
    const categorias: { [key: string]: number } = {};
    const entradas = movimentacoesFiltradas.filter(m => m.tipo === 'ENTRADA');
    entradas.forEach(m => {
      categorias[m.categoria] = (categorias[m.categoria] || 0) + m.valor;
    });
    return Object.entries(categorias).map(([categoria, total]) => ({
      categoria,
      total,
      percentual: totalEntradas > 0 ? (total / totalEntradas) * 100 : 0,
    }));
  }, [movimentacoesFiltradas, totalEntradas]);

  const dadosTransparenciaSaidas: TransparenciaCategoria[] = useMemo(() => {
    const categorias: { [key: string]: number } = {};
    const saidas = movimentacoesFiltradas.filter(m => m.tipo === 'SAIDA');
    saidas.forEach(m => {
      categorias[m.categoria] = (categorias[m.categoria] || 0) + m.valor;
    });
    return Object.entries(categorias).map(([categoria, total]) => ({
      categoria,
      total,
      percentual: totalSaidas > 0 ? (total / totalSaidas) * 100 : 0,
    }));
  }, [movimentacoesFiltradas, totalSaidas]);

  const handleConfirmarSenha = (e: React.FormEvent) => {
    e.preventDefault();
    if (senha === '123') { // Simulação de senha correta
      alert('Operação confirmada com sucesso!');
      setShowModal(null);
      setSenha('');
      setForceUpdate(v => v + 1); // Força a atualização dos dados
    } else {
      alert('Senha incorreta!');
    }
  };

  const renderModal = () => {
    if (showModal === 'confirmacao') {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmação de Segurança</h3>
            <p className="text-sm text-gray-600 mb-4">Para concluir esta operação, por favor, insira sua senha.</p>
            <form onSubmit={handleConfirmarSenha}>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" placeholder="Sua senha" required />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowModal(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Confirmar</button>
              </div>
            </form>
          </motion.div>
        </div>
      );
    }

    if (showModal === 'entrada' || showModal === 'saida') {
      const isEntrada = showModal === 'entrada';
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">Registrar {isEntrada ? 'Entrada' : 'Saída'}</h3>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-sm font-medium text-gray-700">Valor</label>
                <input type="number" className="w-full mt-1 p-2 border border-gray-300 rounded-lg" placeholder="0,00" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Categoria</label>
                <select className="w-full mt-1 p-2 border border-gray-300 rounded-lg">
                  {isEntrada ? (
                    <>
                      <option>DIZIMO</option>
                      <option>OFERTA</option>
                      <option>DOACAO</option>
                      <option>OUTRA_ENTRADA</option>
                    </>
                  ) : (
                    <>
                      <option>DESPESA_ADMINISTRATIVA</option>
                      <option>DESPESA_MINISTERIAL</option>
                      <option>OUTRA_DESPESA</option>
                    </>
                  )}
                </select>
              </div>
              {isEntrada && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Membro (Opcional para Dízimos)</label>
                  <div className="relative">
                     <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" className="w-full mt-1 p-2 pl-10 border border-gray-300 rounded-lg" placeholder="Buscar por nome, CPF ou matrícula" />
                  </div>
                </div>
              )}
              {!isEntrada && (
                 <div>
                  <label className="text-sm font-medium text-gray-700">Comprovante (Opcional)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                          <span>Carregar um arquivo</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">ou arraste e solte</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF até 10MB</p>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700">Descrição</label>
                <textarea className="w-full mt-1 p-2 border border-gray-300 rounded-lg" rows={3}></textarea>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end space-x-3">
              <button onClick={() => setShowModal(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Cancelar</button>
              <button onClick={() => setShowModal('confirmacao')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Salvar</button>
            </div>
          </motion.div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <ProtectedComponent permission={permissions.canManageFinances}>
        {renderModal()}
      </ProtectedComponent>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <DollarSign className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tesouraria</h1>
            <p className="text-sm text-gray-500">Visão financeira da {usuario?.congregacao_nome}</p>
          </div>
        </div>
        <ProtectedComponent permission={permissions.canManageFinances}>
          <div className="flex space-x-3">
            <button onClick={() => setShowModal('saida')} className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2">
              <ArrowDown className="h-4 w-4" />
              <span>Registrar Saída</span>
            </button>
            <button onClick={() => setShowModal('entrada')} className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center space-x-2">
              <ArrowUp className="h-4 w-4" />
              <span>Registrar Entrada</span>
            </button>
          </div>
        </ProtectedComponent>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-sm text-gray-600">Total de Entradas</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalEntradas)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-sm text-gray-600">Total de Saídas</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalSaidas)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatCurrency(saldo)}</p>
          <p className="text-sm text-gray-600">Saldo Atual</p>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button onClick={() => setTab('movimentacoes')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${tab === 'movimentacoes' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            Movimentações Recentes
          </button>
          <button onClick={() => setTab('transparencia')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${tab === 'transparencia' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            Portal da Transparência
          </button>
        </nav>
      </div>

      {tab === 'movimentacoes' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Buscar por descrição ou membro..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {movimentacoesFiltradas.slice(0, 10).map(m => (
                    <tr key={m.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{m.data.toLocaleDateString('pt-BR')}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{m.descricao}</div>
                        <div className="text-sm text-gray-500">{m.membro_nome || 'Não identificado'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${m.tipo === 'ENTRADA' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {m.categoria.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${m.tipo === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}`}>
                        {m.tipo === 'SAIDA' && '-'}{formatCurrency(m.valor)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <ProtectedComponent permission={permissions.canManageFinances}>
                          <div className="flex items-center justify-end space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-900"><Eye className="h-4 w-4" /></button>
                            <button className="text-yellow-600 hover:text-yellow-900"><Edit className="h-4 w-4" /></button>
                          </div>
                        </ProtectedComponent>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {tab === 'transparencia' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Composição das Entradas</h3>
            <div className="space-y-4">
              {dadosTransparenciaEntradas.map(d => (
                <div key={d.categoria}>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="font-medium text-gray-700">{d.categoria.replace(/_/g, ' ')}</span>
                    <span className="text-gray-600">{formatCurrency(d.total)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${d.percentual}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Composição das Saídas</h3>
            <div className="space-y-4">
              {dadosTransparenciaSaidas.map(d => (
                <div key={d.categoria}>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="font-medium text-gray-700">{d.categoria.replace(/_/g, ' ')}</span>
                    <span className="text-gray-600">{formatCurrency(d.total)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${d.percentual}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
