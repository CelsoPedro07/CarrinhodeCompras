# 📊 Resumo do Projeto — Carrinho de Compras NoSQL

## 🎯 Objetivo

Demonstração de arquitetura e modelação avançada em bases de dados NoSQL, utilizando MongoDB com um caso de uso prático: **Carrinho de Compras e Gestão de Sessões**.

## 📁 Estrutura Completa do Projeto

```
CarrinhodeCompras/
│
├── 🐳 INFRAESTRUTURA
│   ├── docker-compose.yml          # MongoDB 7.0 com Replica Set
│   └── mongo-init/
│       └── init.js                 # Criação de coleções
│
├── 🌱 DADOS
│   ├── seed/
│   │   ├── productsSeeder.js       # 30.000 produtos
│   │   ├── usersSeeder.js          # 50.000 utilizadores
│   │   ├── cartsSeeder.js          # 15.000 carrinhos
│   │   └── sessionsSeeder.js       # 5.000 sessões
│   └── queries/
│       ├── queries.js              # Queries principais (Node.js)
│       ├── cartsQueries.js         # Queries de carrinhos
│       ├── productsQueries.js      # Queries de produtos
│       ├── sessionsQueries.js      # Queries de sessões
│       └── helpers.js              # Funções auxiliares
│
├── 🎨 INTERFACE (Nova!)
│   ├── streamlit_app.py            # Aplicação principal
│   ├── config.py                   # Configurações
│   ├── database.py                 # Conexão MongoDB
│   ├── utils.py                    # Componentes UI
│   ├── README.md                   # Documentação
│   ├── EXTENSAO.md                 # Guia de extensão
│   └── .streamlit/
│       └── config.toml             # Tema visual
│
├── 📈 ANÁLISE
│   └── analysis/
│       └── 08-performance-cap.md   # Análise de desempenho
│
├── 📚 DOCUMENTAÇÃO
│   ├── README.md                   # Principal
│   ├── README_INTERFACE.md         # Interface
│   ├── GUIA_RAPIDO_INTERFACE.md    # Guia rápido
│   ├── CHECKLIST_APRESENTACAO.md   # Checklist (este arquivo)
│   ├── RELATORIO_TECNICO.pdf       # Relatório completo
│   └── requirements-interface.txt   # Dependências
│
├── 🚀 SETUP
│   ├── setup_interface.bat         # Instalação automática (Windows)
│   ├── setup_interface.sh          # Instalação automática (Linux/Mac)
│   ├── package.json                # Dependências Node.js
│   └── requirements-dev.txt        # Dependências desenvolvimento
│
└── .git/                           # Repositório Git
```

## 📊 Dados do Projeto

| Coleção | Documentos | Descrição |
|---------|-----------|-----------|
| **products** | 30.000 | Catálogo com preços, categorias, stock |
| **users** | 50.000 | Utilizadores registados |
| **carts** | 15.000 | Carrinhos com itens e totais |
| **sessions** | 5.000 | Sessões de utilizadores |

## 🔧 Tecnologias Utilizadas

```
┌─────────────────────────────────────┐
│         TECNOLOGIAS                 │
├─────────────────────────────────────┤
│ 🗄️  SGBD: MongoDB 7.0 (Replica Set) │
│ 📱 Backend: Node.js + Express       │
│ 🐍 Python 3.8+                      │
│ 🎨 Interface: Streamlit             │
│ 🐳 Containerização: Docker          │
│ 📊 Análise: Pandas                  │
│ 🔗 Drive de dados: Faker.js         │
└─────────────────────────────────────┘
```

## 🚀 Quick Start

### Windows
```batch
.\setup_interface.bat
```

### Linux/Mac
```bash
chmod +x setup_interface.sh
./setup_interface.sh
```

### Manual
```bash
# 1. Iniciar MongoDB
docker compose up -d

# 2. Instalar dependências
pip install -r requirements-interface.txt

# 3. Executar interface
streamlit run interface/streamlit_app.py
```

## 📊 Interface Gráfica

### 🎨 Secções Principais

```
┌──────────────────────────────────────┐
│  📊 Dashboard                        │
│  └─ Estatísticas gerais              │
│                                      │
│  📦 Produtos                         │
│  ├─ Por Categoria                    │
│  ├─ Stock Baixo                      │
│  └─ Preços Médios                    │
│                                      │
│  🛍️ Carrinhos                        │
│  ├─ Estatísticas                     │
│  ├─ Carrinhos Abandonados            │
│  ├─ Top Carrinhos                    │
│  └─ Produtos Populares               │
│                                      │
│  👥 Sessões                          │
│  ├─ Estatísticas                     │
│  └─ Sessões Ativas                   │
│                                      │
│  ⚡ Performance                      │
│  └─ Medição de queries               │
│                                      │
│  ℹ️ Sobre                            │
│  └─ Informações técnicas             │
└──────────────────────────────────────┘
```

## 🎯 Funcionalidades Principais

### ✅ Análise de Dados
- Estatísticas por categoria
- Distribuição de preços
- Análise de carrinhos
- Sessões ativas e inativas

### ✅ Performance
- Medição de tempo de execução
- Análise de Execution Plans
- Estatísticas de índices
- Comparação de queries

### ✅ Visualização
- Gráficos interativos
- Tabelas formatadas
- Cards de métricas
- Expansíveis com detalhes

## 📈 Queries Principais

| Query | Descrição | Tempo |
|-------|-----------|-------|
| Cart by User | Buscar carrinho do utilizador | ~2ms |
| Filtered Products | Produtos com filtros | ~5ms |
| Top Products | Mais adicionados | ~10ms |
| Abandoned Carts | Carrinhos abandonados | ~3ms |
| Active Sessions | Sessões ativas | ~2ms |
| Avg Prices | Preço médio por categoria | ~8ms |
| Top Carts | Carrinhos com maior valor | ~4ms |
| Low Stock | Stock baixo | ~2ms |
| Session Stats | Estatísticas de sessões | ~1ms |

## 🔒 Importância Destacada

### ✅ Interface é READ-ONLY
- Nenhuma operação de escrita
- Dados originais intocados
- Seguro para demonstração
- Preserva integridade

### ✅ Independente do Backend
- Funciona com dados existentes
- Não altera scripts Node.js
- Não altera seeds
- Não altera models

## 🎓 Conceitos NoSQL Demonstrados

### 1. **Flexibilidade de Schema**
- Documentos com estrutura variável
- Arrays embutidos em documentos
- Subcampos aninhados

### 2. **Agregação Complexa**
- Pipeline de agregação
- `$unwind`, `$group`, `$sort`
- Múltiplas etapas de processamento

### 3. **Indexação**
- Índices simples
- Índices compostos
- Impact na performance

### 4. **Escalabilidade**
- Replica Set para redundância
- Distribuição de dados
- Failover automático

### 5. **Análise de Performance**
- Execution Plans
- Documentos examinados vs retornados
- Tuning de queries

## 📊 Estatísticas de Performance

### Sem Índices
- Tempo: ~50-100ms
- Docs examinados: 15.000+
- Taxa: Muito lenta

### Com Índices
- Tempo: ~2-10ms
- Docs examinados: 10-100
- Taxa: Muito rápida

### Melhoria
- **80-95%** mais rápido
- **99%** menos documentos examinados

## 🎯 Caso de Uso Real

### E-commerce Carrinho de Compras

```
Utilizador → Navega produtos → Adiciona ao carrinho → Checkout

┌─────────────┐
│   User      │ MongoDB
│   Temp      │ ─────────┐
│   Session   │          │
└─────────────┘          │
                         ├─→ products (30K)
┌─────────────┐          │
│   Product   │──────→ MongoDB
│   Category  │          │
│   Price     │          ├─→ carts (15K)
└─────────────┘          │
                         └─→ sessions (5K)
```

## 🏆 Vantagens NoSQL (Demonstradas)

| Vantagem | Exemplo |
|----------|---------|
| **Flexibilidade** | Array de items no carrinho |
| **Performance** | Queries em ~5ms com índices |
| **Escalabilidade** | 100K+ documentos facilmente |
| **Simplicidade** | Sem JOINs, dados denormalizados |
| **Durabilidade** | Replica Set com 3 nós |

## 🎬 Sequência de Apresentação

```
1. Introdução (2 min)
2. Dashboard (1 min)
3. Produtos (3 min)
4. Carrinhos (4 min)
5. Sessões (2 min)
6. Performance (5 min)
7. Conclusão (3 min)
──────────────────
Total: ~20 minutos
```

## 📞 Contato & Suporte

### Documentação
- [README Principal](README.md)
- [Guia Rápido](GUIA_RAPIDO_INTERFACE.md)
- [Interface Detalhada](README_INTERFACE.md)
- [Checklist Apresentação](CHECKLIST_APRESENTACAO.md)

### Recursos Online
- [MongoDB Docs](https://docs.mongodb.com/)
- [Streamlit Docs](https://docs.streamlit.io/)
- [NoSQL Design](https://www.mongodb.com/developer/patterns/)

## ✅ Status do Projeto

- ✅ Backend Node.js + MongoDB
- ✅ Dados gerados e populados
- ✅ Queries de performance
- ✅ **Interface Streamlit (NOVA!)**
- ✅ Documentação completa
- ✅ Pronto para apresentação

## 🎉 Conclusão

Este projeto demonstra com sucesso:
- Arquitetura NoSQL prática e real
- Modelação flexível de dados
- Análise de performance
- Interface moderna e profissional

**Tudo pronto para uma apresentação memorável! 🚀**

---

**Versão:** 1.0.0  
**Data:** Junho 2024  
**Disciplina:** Sistemas de Gestão de Bases de Dados II  
**Projeto:** Carrinho de Compras NoSQL
