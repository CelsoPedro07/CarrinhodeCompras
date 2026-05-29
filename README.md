# 🛒 Redis Cluster — Carrinho de Compras & Gestão de Sessões
**Disciplina:** SGBD II | **Tema:** Arquitetura NoSQL para E-commerce de Alta Escala

---

## 📐 Arquitetura

```
┌─────────────────────────────────────────────────┐
│              Redis Cluster (6 nós)              │
│                                                  │
│  Master 1 (:6379) ◄──► Replica 1 (:6382)       │
│  Master 2 (:6380) ◄──► Replica 2 (:6383)       │
│  Master 3 (:6381) ◄──► Replica 3 (:6384)       │
│                                                  │
│  16384 hash slots divididos pelos 3 masters     │
└─────────────────────────────────────────────────┘
         │
         ▼
  RedisInsight GUI (:5540)
```

- **3 Masters** — recebem escritas, cada um responsável por ~5461 hash slots
- **3 Replicas** — leituras e failover automático se um master cair
- **Política de memória:** `allkeys-lru` — expira chaves menos usadas quando memória enche
- **Persistência:** AOF (Append-Only File) para durabilidade

---

## 🚀 Como levantar o ambiente

### Pré-requisitos
- Docker Desktop instalado e em execução
- Docker Compose v2+

```bash
# Verificar versões
docker --version
docker compose version
```

### Passo 1 — Clonar o repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd redis-cluster
```

### Passo 2 — Iniciar o cluster
```bash
docker compose up -d
```

> O serviço `redis-cluster-init` executa automaticamente e cria o cluster.
> Aguarde ~15 segundos após o `up` para o cluster estar totalmente inicializado.

### Passo 3 — Verificar o estado do cluster
```bash
# Ver logs da inicialização
docker logs redis-cluster-init

# Verificar info do cluster
docker exec redis-master-1 redis-cli -p 6379 cluster info

# Ver todos os nós
docker exec redis-master-1 redis-cli -p 6379 cluster nodes
```

**Saída esperada em `cluster info`:**
```
cluster_enabled:1
cluster_state:ok
cluster_slots_assigned:16384
cluster_known_nodes:6
cluster_size:3
```

### Passo 4 — Aceder à GUI (RedisInsight)
Abrir no browser: **http://localhost:5540**

Adicionar conexão:
- Host: `172.20.0.11`
- Port: `6379`

---

## 📊 Importar os dados de teste

```bash
# Instalar dependências Python
pip install redis faker tqdm

# Executar script de seeding (gera 100.000+ registos)
python scripts/seed_data.py

# Verificar contagem de chaves inseridas
docker exec redis-master-1 redis-cli -p 6379 dbsize
```

---

## 🔍 Executar as consultas

```bash
# Executar todas as consultas demonstrativas
python scripts/queries.py

# Ou executar consulta específica
python scripts/queries.py --query 1
```

---

## 🛑 Parar o ambiente

```bash
# Parar sem apagar dados
docker compose stop

# Parar e remover tudo (incluindo volumes)
docker compose down -v
```

---

## 🧪 Simular falha de nó (para o relatório)

```bash
# Parar um master para testar failover
docker compose stop redis-master-1

# Verificar que o cluster elegeu nova liderança
docker exec redis-master-2 redis-cli -p 6380 cluster nodes

# Restaurar o nó
docker compose start redis-master-1
```

---

## 📁 Estrutura do Repositório

```
redis-cluster/
├── docker-compose.yml       # Definição do cluster
├── README.md                # Este ficheiro
├── scripts/
│   ├── seed_data.py         # Geração de 100k+ registos
│   └── queries.py           # 5+ consultas avançadas
└── docs/
    └── relatorio.pdf        # Relatório técnico
```
