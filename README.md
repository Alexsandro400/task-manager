# Task Manager - Next.js + PostgreSQL

## Descrição

Aplicação web de gerenciamento de tarefas construída com **Next.js 14**, **Tailwind CSS** e **PostgreSQL**.

Demonstra:
- CRUD completo de tarefas (Create, Read, Update, Delete)
- Status: `pendente`, `em-andamento`, `concluida`
- Prioridade: `baixa`, `media`, `alta` (com cores distintas)
- UI moderna e responsiva
- API REST com validações
- Conexão com banco de dados PostgreSQL

## Pré-requisitos

- **Node.js** 18+ e **npm**
- **Docker** e **Docker Compose** (para rodar PostgreSQL localmente)
- **PostgreSQL** 15+ (opcional, se rodar localmente)

## Rodando Localmente

### Opção 1: Com Docker Compose (Recomendado)

```bash
# Subir PostgreSQL
docker-compose up -d postgres

# Instalar dependências
npm install

# Rodar app
npm run dev
```

Acessar: http://localhost:3000

### Opção 2: Diretamente (PostgreSQL instalado)

```bash
# Criar banco
createdb task_manager

# Rodar app
npm run dev
```

Configurar variável de ambiente `DATABASE_URL` se necessário.

## Estrutura do Projeto

```
task-manager/
├── app/
│   ├── layout.js          # Layout raiz com Provider
│   ├── page.js            # Página principal (UI do Task Manager)
│   └── globals.css        # Estilos globais Tailwind
├── lib/
│   └── db.js              # Utilitários de conexão PostgreSQL
├── api/
│   └── tasks/
│       └── route.js       # API REST CRUD
├── public/                # Arquivos estáticos
├── tests/
│   └── api.test.js        # Testes da API
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── docker-compose.yml     # PostgreSQL local
└── Dockerfile             # Imagem Docker
```

## Funcionalidades

### ✅ API
- **GET** `/api/tasks` - Listar todas as tarefas
- **POST** `/api/tasks` - Criar nova tarefa
- **PUT** `/api/tasks/[id]` - Atualizar tarefa
- **DELETE** `/api/tasks/[id]` - Deletar tarefa
- **GET** `/api/health` - Health check

### ✅ UI
- Lista de tarefas com filtros por status e prioridade
- Formulário para criar/editar tarefas
- Cards coloridos por prioridade:
  - 🟢 Baixa (verde)
  - 🟡 Média (amarelo)
  - 🔴 Alta (vermelho)
- Status visual:
  - ⏳ Pendente (cinza)
  - 🔄 Em andamento (azul)
  - ✅ Concluído (verde)

### ✅ Testes
- Testes unitários da API com Jest
- Cobertura: endpoints CRUD, validações, erros

## Docker

### Build da imagem

```bash
docker build -t task-manager:latest .
```

### Rodar com Docker Compose

```bash
docker-compose up --build
```

### Rodar sozinho (com banco)

```bash
# Criar network
docker network create task-network

# Subir PostgreSQL
docker run -d \
  --name postgres \
  --network task-network \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=task_manager \
  -p 5432:5432 \
  postgres:15

# Rodar app
docker run -d \
  --name task-manager \
  --network task-network \
  -p 3000:3000 \
  -e DATABASE_URL=postgres://admin:admin@postgres:5432/task_manager \
  task-manager:latest
```

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | `3000` |
| `DATABASE_URL` | URL de conexão PostgreSQL | `postgres://admin:admin@localhost:5432/task_manager` |

## API Reference

### Criar Tarefa

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Minha tarefa",
    "description": "Descrição detalhada",
    "status": "pendente",
    "priority": "alta"
  }'
```

### Resposta

```json
{
  "id": "uuid-gerado",
  "title": "Minha tarefa",
  "description": "Descrição detalhada",
  "status": "pendente",
  "priority": "alta",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

## Testes

```bash
# Rodar testes
npm test

# Rodar testes com cobertura
npm test -- --coverage
```

## Deployment

### Kubernetes

Ver branch `dev_aula` para manifests Kubernetes e CI/CD.

### Docker Hub

```bash
docker build -t profdiegoluispires/task-manager:latest .
docker push profdiegoluispires/task-manager:latest
```

## License

MIT
