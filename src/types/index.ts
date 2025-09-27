export interface Igreja {
  id: string;
  nome: string;
  endereco: string;
  createdAt: Date;
}

export interface Congregacao {
  id: string;
  nome: string;
  endereco: string;
  responsavel: string;
  totalMembros: number;
  igreja_id: string;
  isSede: boolean;
  createdAt: Date;
  cantina_id?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: 'ADMINISTRADOR' | 'SECRETARIO_GERAL' | 'SECRETARIO_LOCAL' | 'TESOUREIRO_GERAL' | 'TESOUREIRO_LOCAL' | 'LIDER_MINISTERIO' | 'LIDER_REDE' | 'MEMBRO' | 'GERENTE_CANTINA';
  congregacao_id: string;
  congregacao_nome: string;
  igreja_id: string;
  ativo: boolean;
  createdAt: Date;
}

export interface Membro {
  id: string;
  matricula: string;
  nome: string;
  cpf: string;
  data_nascimento: Date;
  telefone: string;
  email: string;
  endereco: string;
  congregacao_id: string;
  congregacao_nome: string;
  status: 'ATIVO' | 'INATIVO' | 'TRANSFERIDO' | 'SUSPENSO';
  senha_provisoria?: string;
  createdAt: Date;
  cargo?: string;
  dividas?: { cantinaId: string; valor: number }[];
}

export interface GrupoMembro extends Membro {
  groupStatus: 'ATIVO' | 'PENDENTE' | 'SUSPENSO';
  role: 'Membro' | 'Líder' | 'Coordenador';
}

export type SolicitacaoTipo = 
  | 'TRANSFERENCIA' 
  | 'BATISMO' 
  | 'ALTERACAO_CADASTRAL' 
  | 'CASAMENTO' 
  | 'APRESENTACAO_CRIANCA'
  | 'REGISTRO_BATISMO'
  | 'ALTERACAO_CONGREGACAO'
  | 'REGISTRO_OBREIRO'
  | 'REGISTRO_TESOUREIRO_LOCAL';

export type SolicitacaoStatus = 
  | 'PENDENTE' 
  | 'APROVADO' 
  | 'REJEITADO' 
  | 'REVISAO_PENDENTE' 
  | 'EM_ANALISE'
  | 'AGUARDANDO_APROVACAO_GERAL';

export interface Solicitacao {
  id: string;
  tipo: SolicitacaoTipo;
  membro_id: string;
  membro_nome: string;
  status: SolicitacaoStatus;
  descricao: string;
  congregacao_id: string;
  congregacao_origem_id?: string;
  congregacao_destino_id?: string;
  createdAt: Date;
  dados_adicionais?: Record<string, any>;
}

export interface MovimentacaoFinanceira {
  id: string;
  tipo: 'ENTRADA' | 'SAIDA';
  categoria: 'DIZIMO' | 'OFERTA' | 'DOACAO' | 'DESPESA_ADMINISTRATIVA' | 'DESPESA_MINISTERIAL' | 'OUTRA_DESPESA' | 'OUTRA_ENTRADA' | 'VENDA_CANTINA';
  valor: number;
  descricao: string;
  membro_id?: string;
  membro_nome?: string;
  congregacao_id: string;
  comprovativo_url?: string;
  data: Date;
  responsavel_nome: string;
}

export interface Ministerio {
  id: string;
  nome: string;
  descricao: string;
  lider_id: string;
  lider_nome: string;
  totalMembros: number;
  congregacao_id: string;
  ativo: boolean;
  createdAt: Date;
  membros: GrupoMembro[];
}

export interface Rede {
  id: string;
  nome: string;
  lider_id: string;
  lider_nome: string;
  supervisor_nome: string;
  totalMembros: number;
  dia_semana: string;
  horario: string;
  congregacao_id: string;
  ativo: boolean;
  createdAt: Date;
  membros: GrupoMembro[];
}

export interface MembroMinisterio {
  membro_id: string;
  ministerio_id: string;
  data_ingresso: Date;
}

export interface TransparenciaCategoria {
  categoria: string;
  total: number;
  percentual: number;
}

export type SuspensaoEscopo = 'MINISTERIO' | 'REDE' | 'CONGREGACAO';

export interface Suspensao {
  id: string;
  membro_id: string;
  membro_nome: string;
  responsavel_id: string;
  responsavel_nome: string;
  motivo: string;
  data_inicio: Date;
  data_fim: Date;
  escopos: { tipo: SuspensaoEscopo, id: string, nome: string }[];
  status: 'ATIVA' | 'CONCLUIDA' | 'RECORRIDA' | 'CANCELADA';
  isPrivate: boolean;
  createdAt: Date;
}

export interface Notificacao {
  id: string;
  tipo: 'CONVITE_MINISTERIO' | 'CONVITE_REDE' | 'AVISO_GERAL' | 'SUSPENSAO_MEMBRO' | 'SUSPENSAO_CONFIRMACAO' | 'SUSPENSAO_INFO' | 'CONFIRMACAO_FIADO';
  titulo: string;
  mensagem: string;
  lida: boolean;
  createdAt: Date;
  dados?: {
    grupoId?: string;
    grupoNome?: string;
    suspensaoId?: string;
    membroNome?: string;
    valorFiado?: number;
  }
}

// Tipos para o Módulo de Cantina
export interface Cantina {
  id: string;
  nome: string;
  congregacao_id: string;
  congregacao_nome: string;
  produtos: ProdutoCantina[];
  vendas: VendaCantina[];
  membros: GrupoMembro[];
}

export interface ProdutoCantina {
  id: string;
  nome: string;
  valorCusto: number;
  preco: number; // Valor de Venda
  estoque?: number; // Opcional
  imagemUrl: string;
}

export interface ItemVenda {
  produto: ProdutoCantina;
  quantidade: number;
}

export interface VendaCantina {
  id: string;
  itens: ItemVenda[];
  total: number;
  data: Date;
  responsavel_id: string;
  responsavel_nome: string;
  formaPagamento: 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'DINHEIRO' | 'FIADO';
  membroDevedorId?: string;
  membroDevedorNome?: string;
}
