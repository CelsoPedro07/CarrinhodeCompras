# Carrinho de Compras — Trabalho Prático SGBD II

Este repositório contém o ambiente Docker, scripts de povoamento e consultas para um projeto NoSQL com MongoDB.

## Conteúdo do repositório

- `docker-compose.yml`: define o serviço MongoDB 7 e expõe a porta `27017`.
- `mongo-init/init.js`: cria as coleções iniciais em `ecommerceDB` no primeiro arranque.
- `seed/`: scripts de povoamento para `products`, `users`, `carts` e `sessions`.
- `queries/queries.js`: scripts de consultas com `explain()` e medições de performance.
- `analysis/08-performance-cap.md`: análise de desempenho, índices, CAP/PACELC e proposta de melhorias.
- `RELATORIO_TECNICO.md`: relatório técnico detalhado do projeto.

## Requisitos

- Docker Desktop ou Docker Engine instalado
- Docker Compose disponível (`docker compose` ou `docker-compose`)
- Node.js (recomendado 18.x ou superior)
- Internet apenas para instalar dependências npm

## Passo a passo

1. Abra um terminal na pasta do repositório:

```bash
cd c:\Users\Celso Pedro Mateus\Documents\CarrinhodeCompras
```

2. Instale as dependências Node.js:

```bash
npm install
```

3. Inicie o MongoDB com Docker Compose:

```bash
docker compose up -d
```

Se a sua instalação usar o comando legado, execute:

```bash
docker-compose up -d
```

4. Verifique se o MongoDB está ativo na porta `27017`.

5. Execute os scripts de povoamento na seguinte ordem:

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

6. Execute as consultas e testes de performance:

```bash
node queries/queries.js
```

Este script cria índices e executa várias queries, incluindo:
- busca de carrinho por utilizador
- produtos filtrados e ordenados
- agregações de produtos mais adicionados
- operações de atualização em carrinho
- consulta de carrinhos abandonados
- sessões ativas
- média de preços por categoria
- top de carrinhos por valor total

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
