import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Package, History, Users, Plus, Trash2, X, CreditCard, Landmark, Banknote, UserCheck, Search } from 'lucide-react';
import { faker } from '@faker-js/faker';
import { Cantina, ProdutoCantina, ItemVenda, VendaCantina, Membro } from '../types';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { addMovimentacao } from './Tesouraria';
import { ProtectedComponent } from '../components/Auth/ProtectedComponent';
import { useNotifications } from '../hooks/useNotifications';
import { membrosMock } from './Membros';

// --- Mock Data ---
const gerarProdutos = (): ProdutoCantina[] => [
  { id: '1', nome: 'Salgado de Carne', valorCusto: 2.50, preco: 5.00, estoque: 50, imagemUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/150x150/f97316/ffffff?text=Salgado' },
  { id: '2', nome: 'Refrigerante Lata', valorCusto: 2.00, preco: 4.00, estoque: 100, imagemUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/150x150/3b82f6/ffffff?text=Refri' },
  { id: '3', nome: 'Água Mineral', valorCusto: 1.50, preco: 3.00, estoque: 120, imagemUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/150x150/0ea5e9/ffffff?text=Água' },
  { id: '4', nome: 'Bolo de Chocolate', valorCusto: 3.50, preco: 6.00, estoque: 20, imagemUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/150x150/7c2d12/ffffff?text=Bolo' },
  { id: '5', nome: 'Suco Natural', valorCusto: 4.00, preco: 7.00, estoque: 30, imagemUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/150x150/f59e0b/ffffff?text=Suco' },
  { id: '6', nome: 'Café Expresso', valorCusto: 1.80, preco: 3.50, estoque: 80, imagemUrl: 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/150x150/44403c/ffffff?text=Café' },
];

const cantinasMock: Cantina[] = [
  {
    id: 'cantina-sede',
    nome: 'Cantina da Sede',
    congregacao_id: '1',
    congregacao_nome: 'Congregação Sede',
    produtos: gerarProdutos(),
    vendas: [],
    membros: [],
  },
  {
    id: 'cantina-filial-norte',
    nome: 'Cantina da Filial Norte',
    congregacao_id: '2',
    congregacao_nome: 'Filial Norte',
    produtos: gerarProdutos(),
    vendas: [],
    membros: [],
  },
];
// --- End Mock Data ---

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const CantinaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const permissions = usePermissions();
  const { addNotification } = useNotifications();

  const [cantina, setCantina] = useState<Cantina | undefined>(cantinasMock.find(c => c.id === id));
  const [activeTab, setActiveTab] = useState<'pdv' | 'produtos' | 'vendas' | 'membros'>('pdv');
  const [carrinho, setCarrinho] = useState<ItemVenda[]>([]);
  
  const [modal, setModal] = useState<'payment' | 'fiado' | 'addProduct' | null>(null);
  const [fiadoSearchTerm, setFiadoSearchTerm] = useState('');

  const totalCarrinho = useMemo(() => carrinho.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0), [carrinho]);

  const addToCart = (produto: ProdutoCantina) => {
    setCarrinho(prev => {
      const itemExistente = prev.find(item => item.produto.id === produto.id);
      if (itemExistente) {
        return prev.map(item => item.produto.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item);
      }
      return [...prev, { produto, quantidade: 1 }];
    });
  };

  const removeFromCart = (produtoId: string) => {
    setCarrinho(prev => prev.filter(item => item.produto.id !== produtoId));
  };

  const updateQuantity = (produtoId: string, quantidade: number) => {
    if (quantidade <= 0) {
      removeFromCart(produtoId);
    } else {
      setCarrinho(prev => prev.map(item => item.produto.id === produtoId ? { ...item, quantidade } : item));
    }
  };

  const processarVenda = (formaPagamento: VendaCantina['formaPagamento'], membroDevedor?: Membro) => {
    if (!usuario || !cantina || carrinho.length === 0) return;

    const novaVenda: VendaCantina = {
      id: faker.string.uuid(),
      itens: carrinho,
      total: totalCarrinho,
      data: new Date(),
      responsavel_id: usuario.id,
      responsavel_nome: usuario.nome,
      formaPagamento,
      membroDevedorId: membroDevedor?.id,
      membroDevedorNome: membroDevedor?.nome,
    };

    addMovimentacao({
      tipo: 'ENTRADA',
      categoria: 'VENDA_CANTINA',
      valor: totalCarrinho,
      descricao: `Venda na ${cantina.nome} (${formaPagamento})`,
      congregacao_id: cantina.congregacao_id,
      data: new Date(),
      responsavel_nome: usuario.nome,
    });

    setCantina(prev => {
      if (!prev) return prev;
      const produtosAtualizados = [...prev.produtos];
      carrinho.forEach(itemVenda => {
        const index = produtosAtualizados.findIndex(p => p.id === itemVenda.produto.id);
        if (index !== -1 && produtosAtualizados[index].estoque) {
          produtosAtualizados[index].estoque! -= itemVenda.quantidade;
        }
      });
      return { ...prev, produtos: produtosAtualizados, vendas: [novaVenda, ...prev.vendas] };
    });

    setCarrinho([]);
    setModal(null);
    alert(`Venda (${formaPagamento}) finalizada com sucesso!`);
  };

  const handleSelectFiadoMember = (membro: Membro) => {
    addNotification({
      tipo: 'CONFIRMACAO_FIADO',
      titulo: 'Confirmação de Compra',
      mensagem: `${usuario?.nome} da cantina deseja registrar uma compra de ${formatCurrency(totalCarrinho)} em seu nome. Você confirma?`,
      dados: { valorFiado: totalCarrinho }
    });
    alert(`Notificação de confirmação enviada para ${membro.nome}. Aguardando aprovação... (Em ambiente real, a venda só seria processada após a confirmação do membro)`);
    // Simulação de confirmação imediata para fins de demonstração
    processarVenda('FIADO', membro);
  };
  
  const handleAddProduct = (produto: Omit<ProdutoCantina, 'id' | 'imagemUrl'>) => {
    setCantina(prev => {
      if (!prev) return prev;
      const novoProduto: ProdutoCantina = {
        ...produto,
        id: faker.string.uuid(),
        imagemUrl: `https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/150x150/cccccc/ffffff?text=${produto.nome.substring(0,3)}`
      };
      return { ...prev, produtos: [novoProduto, ...prev.produtos] };
    });
    setModal(null);
  };


  if (!cantina) {
    return <div className="p-6 text-center">Cantina não encontrada.</div>;
  }

  const tabs = [
    { id: 'pdv', label: 'Ponto de Venda', icon: ShoppingCart },
    { id: 'produtos', label: 'Produtos', icon: Package },
    { id: 'vendas', label: 'Vendas', icon: History },
    { id: 'membros', label: 'Membros', icon: Users },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pdv':
        return (
          <div className="flex flex-col lg:flex-row h-[calc(100vh-250px)]">
            {/* Product Grid */}
            <div className="flex-grow p-4 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {cantina.produtos.map(produto => (
                  <motion.div key={produto.id} whileTap={{ scale: 0.95 }} onClick={() => addToCart(produto)} className="cursor-pointer bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <img src={produto.imagemUrl} alt={produto.nome} className="w-full h-24 object-cover rounded-t-lg" />
                    <div className="p-2 text-center">
                      <p className="text-sm font-semibold text-gray-800">{produto.nome}</p>
                      <p className="text-sm text-indigo-600 font-bold">{formatCurrency(produto.preco)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* Cart */}
            <div className="w-full lg:w-80 xl:w-96 bg-gray-50 border-l flex flex-col">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Carrinho</h3>
              </div>
              <div className="flex-grow overflow-y-auto p-4 space-y-3">
                {carrinho.map(item => (
                  <div key={item.produto.id} className="flex items-center space-x-3">
                    <img src={item.produto.imagemUrl} alt={item.produto.nome} className="w-12 h-12 rounded-md object-cover" />
                    <div className="flex-grow">
                      <p className="text-sm font-medium">{item.produto.nome}</p>
                      <p className="text-xs text-gray-500">{formatCurrency(item.produto.preco)}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <input type="number" value={item.quantidade} onChange={e => updateQuantity(item.produto.id, parseInt(e.target.value))} className="w-12 text-center border rounded-md" />
                      <button onClick={() => removeFromCart(item.produto.id)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><X className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
                {carrinho.length === 0 && <p className="text-sm text-gray-500 text-center py-10">Carrinho vazio.</p>}
              </div>
              <div className="p-4 border-t bg-white space-y-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(totalCarrinho)}</span>
                </div>
                 <button onClick={() => setModal('payment')} disabled={carrinho.length === 0} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400">
                  Finalizar Venda
                </button>
                <button onClick={() => setModal('fiado')} disabled={carrinho.length === 0} className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-400">
                  Vender Fiado
                </button>
              </div>
            </div>
          </div>
        );
      case 'produtos':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Gestão de Produtos</h3>
              <ProtectedComponent permission={permissions.canManageCantina}>
                <button onClick={() => setModal('addProduct')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"><Plus className="h-4 w-4"/><span>Novo Produto</span></button>
              </ProtectedComponent>
            </div>
            <div className="bg-white rounded-lg border">
              <table className="min-w-full divide-y">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Produto</th>
                    <th className="px-4 py-2 text-left">Custo</th>
                    <th className="px-4 py-2 text-left">Venda</th>
                    <th className="px-4 py-2 text-left">Estoque</th>
                    <th className="px-4 py-2 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cantina.produtos.map(p => (
                    <tr key={p.id}>
                      <td className="px-4 py-2 font-medium">{p.nome}</td>
                      <td className="px-4 py-2">{formatCurrency(p.valorCusto)}</td>
                      <td className="px-4 py-2">{formatCurrency(p.preco)}</td>
                      <td className="px-4 py-2">{p.estoque ?? 'N/A'}</td>
                      <td className="px-4 py-2 text-right">
                        <ProtectedComponent permission={permissions.canManageCantina}>
                          <button className="text-red-500"><Trash2 className="h-4 w-4"/></button>
                        </ProtectedComponent>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'vendas':
         return (
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Histórico de Vendas</h3>
            <div className="bg-white rounded-lg border">
              <table className="min-w-full divide-y">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Data</th>
                    <th className="px-4 py-2 text-left">Pagamento</th>
                    <th className="px-4 py-2 text-left">Responsável</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cantina.vendas.map(v => (
                    <tr key={v.id}>
                      <td className="px-4 py-2">{v.data.toLocaleString('pt-BR')}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${v.formaPagamento === 'FIADO' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
                          {v.formaPagamento.replace('_', ' ')}
                        </span>
                        {v.formaPagamento === 'FIADO' && <div className="text-xs text-gray-500">{v.membroDevedorNome}</div>}
                      </td>
                      <td className="px-4 py-2">{v.responsavel_nome}</td>
                      <td className="px-4 py-2 text-right font-semibold">{formatCurrency(v.total)}</td>
                    </tr>
                  ))}
                  {cantina.vendas.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-gray-500">Nenhuma venda registrada.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return <div className="p-6">Em desenvolvimento...</div>;
    }
  };

  const renderModals = () => (
    <>
      {modal === 'payment' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-lg font-semibold">Forma de Pagamento</h3>
            <button onClick={() => processarVenda('PIX')} className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"><Landmark/><span>PIX</span></button>
            <button onClick={() => processarVenda('CARTAO_CREDITO')} className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"><CreditCard/><span>Cartão de Crédito</span></button>
            <button onClick={() => processarVenda('CARTAO_DEBITO')} className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"><CreditCard/><span>Cartão de Débito</span></button>
            <button onClick={() => processarVenda('DINHEIRO')} className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"><Banknote/><span>Dinheiro</span></button>
            <button onClick={() => setModal(null)} className="w-full mt-4 p-2 bg-gray-200 rounded-lg">Cancelar</button>
          </div>
        </div>
      )}
      {modal === 'fiado' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-4 border-b"><h3 className="font-semibold">Selecionar Membro para Venda Fiado</h3></div>
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Buscar membro..." value={fiadoSearchTerm} onChange={e => setFiadoSearchTerm(e.target.value)} className="w-full pl-10 p-2 border rounded-lg" />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto border-t">
              {membrosMock.filter(m => m.congregacao_id === cantina.congregacao_id && m.nome.toLowerCase().includes(fiadoSearchTerm.toLowerCase())).map(membro => (
                <button key={membro.id} onClick={() => handleSelectFiadoMember(membro)} className="w-full text-left p-3 hover:bg-gray-100 border-b">
                  <p className="font-medium">{membro.nome}</p>
                  <p className="text-sm text-gray-500">Matrícula: {membro.matricula}</p>
                </button>
              ))}
            </div>
            <div className="p-4 border-t flex justify-end">
              <button onClick={() => setModal(null)} className="p-2 bg-gray-200 rounded-lg">Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {modal === 'addProduct' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <form onSubmit={(e) => {
              e.preventDefault();
              const target = e.target as typeof e.target & {
                nome: { value: string };
                valorCusto: { value: string };
                preco: { value: string };
                estoque: { value: string };
              };
              handleAddProduct({
                nome: target.nome.value,
                valorCusto: parseFloat(target.valorCusto.value),
                preco: parseFloat(target.preco.value),
                estoque: target.estoque.value ? parseInt(target.estoque.value) : undefined,
              });
            }} className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-semibold">Adicionar Novo Produto</h3>
            <div><label>Nome do Produto</label><input name="nome" required className="w-full p-2 border rounded-lg mt-1"/></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label>Valor de Custo</label><input name="valorCusto" type="number" step="0.01" required className="w-full p-2 border rounded-lg mt-1"/></div>
              <div><label>Valor de Venda</label><input name="preco" type="number" step="0.01" required className="w-full p-2 border rounded-lg mt-1"/></div>
            </div>
            <div><label>Quantidade em Estoque (Opcional)</label><input name="estoque" type="number" className="w-full p-2 border rounded-lg mt-1"/></div>
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={() => setModal(null)} className="p-2 bg-gray-200 rounded-lg">Cancelar</button>
              <button type="submit" className="p-2 px-4 bg-indigo-600 text-white rounded-lg">Salvar</button>
            </div>
          </form>
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(`/congregacoes/${cantina.congregacao_id}`)} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" />
        <span>Voltar para Congregação</span>
      </button>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h1 className="text-3xl font-bold text-gray-900">{cantina.nome}</h1>
        <p className="text-gray-500">Ponto de Venda da {cantina.congregacao_nome}</p>
      </div>

      <div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center space-x-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="bg-white rounded-b-xl shadow-sm border border-t-0">
          {renderTabContent()}
        </div>
      </div>
      {renderModals()}
    </div>
  );
};
