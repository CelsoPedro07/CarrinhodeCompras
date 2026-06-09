# Backend - Carrinho de Compras Analytics

Backend Express.js para API REST do sistema de gerenciamento de carrinho de compras e sessões.

## Requisitos

- Node.js 18+
- MongoDB 7.0 (via Docker Compose)

## Instalação

```bash
npm install
```

## Configuração

Certifique-se de que o MongoDB está rodando. Do diretório raiz do projeto, inicie o MongoDB com:

```bash
docker-compose up -d
```

Depois execute os seeders para popular o banco de dados:

```bash
# Criar collections e índices (Mongo init script é executado automaticamente)
# Depois execute os seeders manualmente se necessário:
node ../seed/usersSeeder.js
node ../seed/productsSeeder.js
node ../seed/cartsSeeder.js
node ../seed/sessionsSeeder.js
```

## Execução

### Modo Produção
```bash
npm start
```

### Modo Desenvolvimento (com hot reload)
```bash
npm run dev
```

O servidor estará disponível em: **http://localhost:5000**

## Endpoints da API

### Produtos
- `GET /api/products?page=1&limit=20` - Lista produtos com paginação
- `GET /api/products/stats` - Estatísticas de produtos por categoria

### Usuários
- `GET /api/users?page=1&limit=20` - Lista usuários com paginação

### Carrinhos
- `GET /api/carts?page=1&limit=20&status=active` - Lista carrinhos com filtro opcional de status
- `GET /api/carts/stats` - Estatísticas de carrinhos por status

### Sessões
- `GET /api/sessions?page=1&limit=20&status=active` - Lista sessões com filtro opcional de status
- `GET /api/sessions/stats` - Estatísticas de sessões por status

### Métricas Gerais
- `GET /api/metrics` - Métricas consolidadas do dashboard (totais, faturamento, etc)

### Health Check
- `GET /api/health` - Verifica status da API

## Variáveis de Ambiente

Crie um arquivo `.env` se necessário (ou use valores padrão):

```env
MONGO_URI=mongodb://admin:admin123@localhost:27017
DB_NAME=ecommerceDB
PORT=5000
```

## Estrutura

```
backend/
├── server.js          # Aplicação principal com todos os endpoints
├── package.json       # Dependências do projeto
└── README.md          # Este arquivo
```

## Notas

- MongoDB está acessível em `localhost:27017` com usuário `admin` e senha `admin123`
- O backend assume que os seeders já popularam os dados
- CORS está habilitado para permitir requisições do frontend
- Paginação padrão: 20 itens por página

## Troubleshooting

**Erro: "Failed to connect to MongoDB"**
- Verifique se MongoDB está rodando: `docker-compose ps`
- Reinicie o MongoDB: `docker-compose down && docker-compose up -d`

**Erro: "Cannot find collection"**
- Execute os seeders manualmente para popular as collections
- Verifique se as collections foram criadas: `db.getCollectionNames()`

## Desenvolvimento Futuro

- [ ] Autenticação e autorização
- [ ] POST/PUT/DELETE endpoints para CRUD completo
- [ ] Validação de schemas com Joi ou Zod
- [ ] Rate limiting
- [ ] Logging estruturado
- [ ] Testes unitários e de integração
