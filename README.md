# Carrinho de Compras — Trabalho Prático SGBD II

Este repositório contém o ambiente Docker, scripts de povoamento, consultas para o projeto NoSQL com MongoDB, além de um **Backend Express** e **Frontend React** modernos.

## Conteúdo do repositório

- `docker-compose.yml`: define o serviço MongoDB 7 e expõe a porta `27017`.
- `mongo-init/init.js`: cria as coleções iniciais em `ecommerceDB` no primeiro arranque.
- `seed/`: scripts de povoamento para `products`, `users`, `carts` e `sessions`.
- `queries/`: scripts de consultas com `explain()` e medições de performance.
- `analysis/`: análise de desempenho, índices e propostas de melhorias.
- `backend/`: servidor Express.js com endpoints REST para a API.
- `frontend/`: aplicação React 19 com TypeScript, Vite, TailwindCSS e componentes moderna.

## Requisitos

- Docker Desktop ou Docker Engine instalado
- Node.js 18+ instalado
- Internet apenas para instalar dependências npm

## Configuração e Execução

### 1. Preparação Inicial

```bash
# Instale as dependências do projeto raiz
npm install

# Instale as dependências do backend
cd backend
npm install
cd ..

# Instale as dependências do frontend
cd frontend
npm install
cd ..
```

### 2. Iniciar MongoDB com Docker

```bash
docker compose up -d
```

Se sua instalação usar o comando legado:
```bash
docker-compose up -d
```

Verifique se o MongoDB está ativo na porta `27017`.

### 3. Popular o Banco de Dados

Execute os scripts de povoamento na seguinte ordem:

```bash
node seed/productsSeeder.js
node seed/usersSeeder.js
node seed/cartsSeeder.js
node seed/sessionsSeeder.js
```

Isso irá gerar e inserir dados nas coleções:
- `products` → 30.000 produtos
- `users` → 50.000 utilizadores
- `carts` → 15.000 carrinhos
- `sessions` → 5.000 sessões

### 4. Iniciar o Backend (Express API)

Em um novo terminal, na pasta `backend/`:

```bash
cd backend
npm start
```

O backend estará disponível em: **http://localhost:5000**

Endpoints disponíveis:
- `GET /api/products` - Lista produtos
- `GET /api/users` - Lista usuários
- `GET /api/carts` - Lista carrinhos
- `GET /api/sessions` - Lista sessões
- `GET /api/metrics` - Métricas consolidadas
- `GET /api/health` - Health check

Ver [backend/README.md](backend/README.md) para documentação completa.

### 5. Iniciar o Frontend (React Dashboard)

Em um novo terminal, na pasta `frontend/`:

```bash
cd frontend
npm run dev
```

O frontend estará disponível em: **http://localhost:5173** (ou porta seguinte se ocupada)

#### Recursos do Frontend

- 🎨 **Design System**: shadcn/ui + Radix UI + TailwindCSS v4
- 📊 **Dashboards**: Gráficos com Recharts, tabelas com TanStack Table
- 🌓 **Dark Mode**: suporte completo com persistência
- 📱 **Responsive**: layout adaptativo (desktop, tablet, mobile)
- 🔄 **Data Fetching**: TanStack Query para cache inteligente
- 🧭 **Roteamento**: React Router v6
- 🎯 **Sidebar Fixo**: navegação lateral não rola com conteúdo
- ✨ **Componentes**: botões, cards, dialogs, drawers, badges, etc

Páginas:
- **Dashboard** - Visão geral de métricas e KPIs
- **Produtos** - Lista completa com paginação
- **Carrinhos** - Análise de carrinhos ativos/abandonados
- **Sessões** - Monitoramento de sessões de usuários
- **Performance** - Análise de queries e índices

### 6. Executar Análises de Performance (Opcional)

```bash
node queries/queries.js
```

Este script executa várias queries de teste com `explain()` para análise de performance.

## 📁 Estrutura do Projeto

```
CarrinhodeCompras/
├── backend/                    # Express.js API
│   ├── server.js              # Aplicação principal
│   ├── package.json           # Dependências
│   └── README.md              # Documentação do backend
├── frontend/                  # React 19 Dashboard
│   ├── src/
│   │   ├── pages/            # Páginas do app
│   │   ├── components/       # Componentes React
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API client
│   │   ├── mocks/            # Dados mock (fallback)
│   │   ├── types/            # TypeScript types
│   │   └── App.tsx           # Root component
│   ├── index.html            # Entry point
│   ├── vite.config.js        # Configuração Vite
│   └── package.json          # Dependências
├── seed/                      # Scripts de povoamento
├── queries/                   # Scripts de análise
├── docker-compose.yml        # Configuração MongoDB
└── README.md                 # Este arquivo
```

## 🚀 Fluxo de Execução Rápido

Em 3 terminais diferentes, execute na seguinte ordem:

**Terminal 1** (MongoDB):
```bash
docker compose up -d
```

**Terminal 2** (Backend):
```bash
cd backend && npm start
```

**Terminal 3** (Frontend):
```bash
cd frontend && npm run dev
```

Depois acesse: **http://localhost:5173** 🎉

## 📋 Stack de Tecnologias

### Backend
- **Express.js** - Framework web minimalista
- **MongoDB** - Base de dados NoSQL
- **CORS** - Compartilhamento de recursos entre origens

### Frontend
- **React 19** - Biblioteca de UI
- **TypeScript** - Type safety
- **Vite** - Build tool rápido
- **TailwindCSS v4** - Utility-first CSS
- **shadcn/ui** - Componentes sem estilo customizáveis
- **React Router** - Roteamento SPA
- **TanStack Query** - Gerenciamento de estado assíncrono
- **TanStack Table** - Tabelas avançadas
- **Recharts** - Gráficos React
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones SVG

## 🔧 Variáveis de Ambiente

### Frontend (`.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Veja [frontend/.env.example](frontend/.env.example) para mais detalhes.

### Backend
Usa variáveis padrão do MongoDB local. Para customizar:
```bash
# Criar backend/.env se necessário
MONGO_URI=mongodb://admin:admin123@localhost:27017
DB_NAME=ecommerceDB
PORT=5000
```

## 📚 Documentação Adicional

- [Backend README](backend/README.md) - Detalhes da API e endpoints
- [Frontend README](frontend/README.md) - Guia de componentes e hooks
- [Análise de Performance](analysis/08-performance-cap.md) - Índices, CAP/PACELC e otimizações
- [Relatório Técnico](RELATORIO_TECNICO.md) - Análise completa do projeto

## 🐛 Troubleshooting

**Porta 5000 já em uso?**
- Altere a porta no `backend/server.js` e configure no `.env` do frontend

**MongoDB não conecta?**
- Verifique: `docker compose ps`
- Reinicie: `docker compose down && docker compose up -d`

**Frontend não consegue conectar ao backend?**
- Certifique-se de que o backend está rodando
- Verifique a URL em `frontend/.env`
- Tente acessar `http://localhost:5000/api/health` no navegador

## 📝 Licença

ISC

### 📊 Funcionalidades

- **Dashboard:** Estatísticas gerais do sistema
- **Produtos:** Análise por categoria, preços e stock
- **Carrinhos:** Detalhes, estatísticas e carrinhos abandonados
- **Sessões:** Informações de sessões ativas
- **Performance:** Medição de desempenho das queries
- **Sobre:** Informações técnicas do projeto

### 📚 Documentação da Interface

- [Guia Rápido](GUIA_RAPIDO_INTERFACE.md)
- [README Completo](README_INTERFACE.md)
- [Guia de Extensão](interface/EXTENSAO.md)

## Acesso ao MongoDB

As conexões usam as seguintes credenciais:

- host: `localhost`
- porta: `27017`
- utilizador: `admin`
- password: `admin123`
- base de dados: `ecommerceDB`

## Observações

- O `docker-compose.yml` já inclui o volume `mongodb_data` para persistência entre execuções.
- O script `mongo-init/init.js` cria as coleções automaticamente no primeiro arranque do container.

## Como parar o ambiente

```bash
docker compose down
```

ou

```bash
docker-compose down
```

## Entrega

Envie ao docente o link do repositório GitHub, incluindo:
- Relatório técnico em PDF (`RELATORIO_TECNICO.pdf`)
- Scripts de povoamento (`seed/*.js`)
- Scripts de consultas (`queries/queries.js`)
- `README.md` com instruções de reprodução
