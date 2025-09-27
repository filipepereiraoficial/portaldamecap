# Descrição do Sistema de Gestão e Comunicação para Igrejas (SGCI)

## 1. Propósito

O SGCI é uma plataforma web centralizada, projetada para otimizar a administração de igrejas e suas congregações. O sistema visa modernizar e simplificar a gestão de membros, finanças, grupos internos (ministérios e redes) e a comunicação, fornecendo ferramentas específicas para cada nível de liderança e para os membros em geral.

## 2. Perfis de Usuário

O sistema implementa um robusto controle de acesso baseado em perfis (Role-Based Access Control - RBAC), garantindo que cada usuário tenha acesso apenas às funcionalidades pertinentes à sua função.

- **Administrador:** Gestão global do sistema. Possui acesso a todas as funcionalidades e congregações. Único perfil que pode personificar outros usuários para fins de teste e suporte.
- **Secretário Geral:** Gerencia membros, solicitações e grupos de todas as congregações.
- **Tesoureiro Geral:** Supervisiona as finanças de todas as congregações, com acesso consolidado.
- **Secretário Local:** Gerencia membros e solicitações exclusivamente de sua própria congregação. Pode encaminhar certas solicitações para a Secretaria Geral.
- **Tesoureiro Local:** Gerencia as finanças e a cantina de sua própria congregação.
- **Líder de Ministério/Rede:** Gerencia os membros, escalas e comunicados de seu grupo específico.
- **Gerente da Cantina:** Opera o ponto de venda e gerencia produtos da cantina.
- **Membro:** Acessa o portal da sua congregação, faz solicitações e interage com seus grupos.

## 3. Módulos Principais

### 3.1. Dashboard
- **Visão Geral Contextual:** Exibe métricas (total de membros, receita, etc.) filtradas de acordo com a congregação e o perfil do usuário.
- **Atividades Recentes e Próximos Eventos:** Mantém o usuário informado sobre as últimas novidades e compromissos.

### 3.2. Gestão de Membros
- Listagem completa de membros com filtros por congregação e status.
- Geração automática de matrícula.
- Funcionalidade de suspensão de membros com fluxo de notificação e controle de acesso.

### 3.3. Secretaria (Solicitações)
- **Máquina de Estados:** Gerencia o ciclo de vida das solicitações (Pendente, Em Análise, Aprovado, Rejeitado).
- **Fluxo de Encaminhamento:** Permite que secretários locais enviem solicitações específicas (ex: registro de obreiro) para aprovação da Secretaria Geral.
- **Tipos Diversos:** Suporta solicitações como transferência, batismo, alteração cadastral, etc.

### 3.4. Gestão de Congregações
- Visualização de todas as congregações (Sede e Filiais).
- Página de gerenciamento individual para cada congregação, com abas para visão geral, membros, finanças e configurações.

### 3.5. Gestão de Grupos (Ministérios e Redes)
- Criação e gestão de Ministérios e Redes.
- **Portal do Grupo:** Página dedicada para cada grupo com abas para gestão de membros, escalas/encontros, comunicação e configurações.
- **Fluxo de Convite:** Líderes podem convidar membros para seus grupos, que recebem uma notificação para aceitar ou recusar.

### 3.6. Tesouraria
- Registro de entradas (dízimos, ofertas) e saídas (despesas).
- **Confirmação por Senha:** Todas as operações financeiras exigem a senha do tesoureiro.
- **Portal da Transparência:** Gráficos anônimos sobre a composição das finanças.
- Integração direta com o módulo de Cantina.

### 3.7. Cantina (Ponto de Venda)
- **PDV Intuitivo:** Interface de ponto de venda com grid de produtos e carrinho de compras.
- **Gestão de Produtos:** Cadastro de produtos com nome, valor de custo, valor de venda e estoque.
- **Múltiplas Formas de Pagamento:** Suporte para PIX, Cartão, Dinheiro e "Fiado".
- **Venda Fiado:** Sistema integrado com notificações para que o membro confirme a compra em seu nome, registrando a dívida.
- **Integração Financeira:** As vendas são automaticamente registradas como entradas na tesouraria da congregação.

## 4. Funcionalidades Chave

- **Personificação de Usuário:** Administradores podem "visualizar o sistema como" outros perfis para suporte e verificação de permissões.
- **Sistema de Notificações:** Um centro de notificações no cabeçalho informa os usuários sobre convites para grupos, suspensões, confirmações de compras, etc.
- **Design Responsivo:** A interface é projetada para ser funcional e esteticamente agradável em desktops, tablets e celulares.
- **Componentização:** O código é estruturado em componentes reutilizáveis (React) para garantir manutenibilidade e consistência.

## 5. Tecnologias Utilizadas

- **Frontend:** React, TypeScript
- **Estilização:** Tailwind CSS
- **Animações:** Framer Motion
- **Roteamento:** React Router
- **Ícones:** Lucide React
