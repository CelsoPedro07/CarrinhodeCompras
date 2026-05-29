# 🛒 Carrinho de Compras & Gestão de Sessões — MongoDB

**SGBD II — Trabalho Prático NoSQL**
**Subdomínio:** Carrinho de Compras e Gestão de Sessões
**SGBD:** MongoDB 7.0 (Replica Set — 3 nós)

---

## Pré-requisitos

| Ferramenta | Versão mínima |
|---|---|
| Docker Desktop | 24+ |
| Docker Compose | v2+ |
| Python | 3.10+ |
| pip | 23+ |

---

## 1 — Levantar o Ambiente (Cluster MongoDB)

```bash
# Clonar o repositório
git clone <URL_DO_REPO>
cd <PASTA_DO_REPO>

# Iniciar os 3 nós MongoDB + Mongo Express
docker compose up -d

# Verificar que os containers estão em execução
docker compose ps
```

Aguardar ~15 segundos para o Replica Set ser iniciado automaticamente pelo serviço `mongo-init`.

**Verificar o estado do Replica Set:**
```bash
docker exec -it mongo1 mongosh --eval "rs.status()"
```

**Mongo Express (UI Web):** Abrir http://localhost:8081 no browser.

---

## 2 — Instalar Dependências Python

```bash
pip install pymongo faker
```

---

## 3 — Executar o Script de Povoamento

> Insere **330 000+ documentos** distribuídos por 5 coleções.

```bash
python seed_data.py
```

Saída esperada:
```
============================================================
  SGBD NoSQL — Seed Script — E-commerce Sessions
============================================================
[1/5] Inserindo 10000 produtos...
   ✓ 10000 produtos inseridos.
[2/5] Inserindo 50000 utilizadores...
   ✓ 50000 utilizadores inseridos.
[3/5] Inserindo 100000 sessões/carrinhos...
   ✓ 100000 sessões inseridas.
[4/5] Inserindo 150000 eventos de carrinho...
   ✓ 150000 eventos inseridos.
[5/5] Inserindo 20000 registos de abandono...
   ✓ 20000 registos inseridos.
============================================================
  Total de documentos inseridos: 330,000
  Seed concluído com sucesso!
============================================================
```

---

## 4 — Executar as Queries Avançadas

```bash
python queries.py
```

As 7 queries executadas e os seus tempos de latência serão impressos no terminal.

---

## 5 — Estrutura do Repositório

```
.
├── docker-compose.yml    # Cluster MongoDB 3 nós + Mongo Express
├── seed_data.py          # Script de geração e inserção de dados
├── queries.py            # 7 queries avançadas com medição de latência
├── relatorio.pdf         # Relatório técnico completo
└── README.md             # Este ficheiro
```

---

## 6 — Coleções e Volumes de Dados

| Coleção | Documentos | Descrição |
|---|---|---|
| `sessions` | 100 000 | Carrinhos/Sessões (coleção principal) |
| `users` | 50 000 | Perfis de utilizadores |
| `products` | 10 000 | Catálogo de produtos |
| `cart_events` | 150 000 | Log de eventos (add/remove/checkout) |
| `abandoned_carts` | 20 000 | Carrinhos para remarketing |

---

## 7 — String de Conexão

```
mongodb://localhost:27017,localhost:27018,localhost:27019/?replicaSet=rs0
```

---

## 8 — Parar o Ambiente

```bash
docker compose down          # Para os containers (dados preservados)
docker compose down -v       # Para e apaga os volumes de dados
```

---

## Referências

- MongoDB Documentation: https://www.mongodb.com/docs/
- MongoDB Aggregation Pipeline: https://www.mongodb.com/docs/manual/aggregation/
- Faker (Python): https://faker.readthedocs.io/
