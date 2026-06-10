# 08 — Testes de Desempenho e Discussão CAP/PACELC

## 8.1 Objetivo dos Testes

O objetivo dos testes é avaliar:
- eficiência das queries;
- tempo de resposta;
- impacto dos índices;
- comportamento com grande volume de dados;
- escalabilidade do sistema.

## 8.2 Implementação dos Testes

O script `queries/queries.js` foi atualizado para:
- medir tempo de execução com `console.time()`;
- gerar `explain("executionStats")` para consultas importantes;
- criar índices relevantes antes dos testes;
- registrar resultados resumidos e amostras de retorno.

## 8.3 Índices Aplicados

Foram criados índices em:
- `carts.userId`
- `carts.status`
- `carts.totalAmount`
- `products.category` e `products.price`
- `products.stock`
- `sessions.status`

### Vantagens dos índices

- reduzem leituras de documentos desnecessárias;
- permitem que consultas retornem resultados mais rapidamente;
- tornam `find()` e `sort()` mais eficientes;
- satisfazem o requisito de analisar o impacto de índices.

## 8.4 Uso de `explain()`

O script usa `explain("executionStats")` para mostrar:
- plano de execução;
- tempo de execução retornado pelo MongoDB;
- número de documentos e chaves examinadas;
- se a consulta usou `COLLSCAN` ou índice.

## 8.5 Resultados de Exemplo

### Consulta 1 — buscar carrinho por utilizador
- tempo relatado: ~25ms
- plano: `LIMIT`
- documentos examinados: 1
- chaves examinadas: 1

### Consulta 2 — produtos filtrados e ordenados
- tempo relatado: ~19ms
- documentos examinados: 10
- chaves examinadas: 10

### Consulta 3 — agregação de produtos mais adicionados
- tempo relatado: ~722ms
- `explain()` mostra `COLLSCAN` seguido de `UNWIND` e `GROUP`
- documentos examinados: 15000

### Consulta 9 — média de preços por categoria
- tempo relatado: ~176ms
- `explain()` mostra `COLLSCAN` e agregação por categoria
- documentos examinados: 30000

## 8.6 Análise dos Índices

### Sem índices

As consultaas de agregação e as buscas por status exigem varredura total (`COLLSCAN`) no conjunto atual de dados.

### Com índices

Consultas de busca por `userId`, `status` e `stock` passam a examinar somente os documentos necessários, reduzindo latência.

## 8.7 Escalabilidade

Se o sistema crescer 100x:
- usar sharding para distribuir dados por múltiplos nós;
- shard key sugerida: `{ userId: 1 }` para distribuir utilizadores e cargas de carrinho;
- adicionar shards e balancear dados melhora throughput e capacidade;
- a aplicação pode ser escalada horizontalmente com novos nós de dados.

## 8.8 Sharding

Shard key recomendada: `{ userId: 1 }`

Por que essa chave?
- distribui utilizadores entre shards;
- evita que um único shard receba todo o tráfego;
- melhora performance para consultas de carrinhos e sessões por utilizador.

## 8.9 Replicação

MongoDB Replica Set oferece:
- tolerância a falhas;
- alta disponibilidade;
- recuperação automática quando um nó falha.

## 8.10 Discussão CAP

MongoDB tende a priorizar *CP* (consistência + partition tolerance) quando configurado com réplicas e escrita de maioria.

### O que isso significa
- em partições de rede, o MongoDB pode sacrificar disponibilidade temporária;
- ele preserva a consistência dos dados, evitando leituras/escritas inconsistentes;
- isso é importante para carrinhos de compras e sessões, onde integridade importa.

### Vantagens
- evita corrupção de dados;
- mantém integridade dos carrinhos;
- protege contra divergências em atualizações concorrentes.

### Desvantagens
- durante partições, algumas operações podem ficar indisponíveis;
- usuários podem experimentar latência ou falha em escrita até o cluster estabilizar.

## 8.11 PACELC

Mesmo sem partição, o sistema enfrenta um trade-off entre latência e consistência.

### PACELC no MongoDB
- P: quando há partição, MongoDB tende a priorizar consistência;
- A/EL: em operação normal, depende da configuração de `readConcern`/`writeConcern`.

MongoDB geralmente aceita uma pequena latência adicional para preservar consistência com `majority`.

## 8.12 Análise Crítica

### Limitações
1. Crescimento do documento
- carrinhos grandes podem criar documentos volumosos e lentos de atualizar.

2. Desnormalização
- aumenta velocidade de consulta;
- mas duplica dados e dificulta updates consistentes.

3. Aggregations pesadas
- operações como `unwind` e `group` podem consumir muita memória quando há centenas de milhões de documentos.

## 8.13 Melhorias Futuras

Possíveis melhorias:
- Redis para cache de carrinhos e sessões ativas;
- Kafka para ingestão e eventos de carrinho/checkout;
- Elasticsearch para pesquisa de produtos rápida;
- Kubernetes para orquestração e escalabilidade do serviço;
- introduzir sharding no MongoDB para escala além do nó único.

## 8.14 Como executar

```bash
node queries/queries.js
```

Isso criará índices, medirá tempos e exibirá `explain()` para as principais consultas.
