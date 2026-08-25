# Task Manager

Gerenciador de Tarefas (Task Manager) com Next.js 14, PostgreSQL e Docker.

## Demonstração

![Task Manager UI](https://via.placeholder.com/800x500?text=Task+Manager+UI)

## Funcionalidades

- **CRUD completo** de tarefas (Create, Read, Update, Delete)
- **Status das tarefas**: pendente, em-andamento, concluída
- **Prioridades**: baixa, média, alta
- **Dashboard**: estatísticas e filtros
- **API REST**: endpoints para integração
- **Health check**: endpoint para monitoramento

## Stack Tecnológica

- **Frontend**: Next.js 14 (App Router), Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de dados**: PostgreSQL 15
- **Containerização**: Docker, Docker Compose
- **Testes**: Jest

## Estrutura do Projeto

```
task-manager/
├── app/              # App Next.js (App Router)
│   ├── api/          # API Routes
│   ├── layout.js     # Layout raiz
│   ├── page.js       # Página principal (UI)
│   └── globals.css   # Estilos globais Tailwind
├── lib/              # Funções de banco de dados
│   ├── db.js         # Pool PostgreSQL
│   └── dbConfig.js   # Configuração de conexão
├── tests/            # Testes Jest para API
├── Dockerfile        # Build da imagem Docker
├── docker-compose.yml # Ambiente local com Docker Compose
├── next.config.js    # Config Next.js
├── tailwind.config.js # Config Tailwind CSS
└── package.json      # Dependências
```

## Instalação e Execução Local

### Pré-requisitos

- Docker e Docker Compose
- Node.js 20+ (opcional, para desenvolvimento local sem Docker)

### Com Docker Compose (Recomendado)

```bash
# Iniciar containers
docker-compose up -d

# Acessar a aplicação
open http://localhost:3000
```

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Criar arquivo .env (baseado em .env.example)
cp .env.example .env

# Executar migrations e iniciar servidor
npm run dev
```

## API REST

### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/tasks` | Listar todas as tarefas |
| GET | `/api/tasks/:id` | Buscar tarefa por ID |
| POST | `/api/tasks` | Criar nova tarefa |
| PUT | `/api/tasks/:id` | Atualizar tarefa |
| DELETE | `/api/tasks/:id` | Deletar tarefa |
| GET | `/api/health` | Health check |

### Exemplo de Request

```bash
# Criar tarefa
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Minha tarefa","description":"Descrição","priority":"alta","status":"pendente"}'

# Listar tarefas
curl http://localhost:3000/api/tasks
```

## Testes

```bash
# Rodar testes
npm test

# Rodar testes com cobertura
npm test -- --coverage
```

## Docker

### Build da Imagem

```bash
docker build -t task-manager .
```

### Executar com Docker

```bash
docker run -p 3000:3000 task-manager
```

## Kubernetes

Para deploy em Kubernetes, veja a branch `dev_aula` com manifests e CI/CD.

## Branches

- **main**: Código completo (Next.js + API + Docker) - sem k8s/.github
- **dev_aula**: Código + k8s + CI/CD (para aula)

## Licença

MIT
