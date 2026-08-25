# Task Manager - Next.js + PostgreSQL + Kubernetes

## Descrição

Aplicação web de gerenciamento de tarefas construída com **Next.js 14**, **Tailwind CSS** e **PostgreSQL**.

Demonstra:
- CRUD completo de tarefas (Create, Read, Update, Delete)
- Status: `pendente`, `em-andamento`, `concluida`
- Prioridade: `baixa`, `media`, `alta` (com cores distintas)
- UI moderna e responsiva
- API REST com validações
- Conexão com banco de dados PostgreSQL
- **Deployment no Kubernetes**
- **CI/CD com GitHub Actions**

## 🚀 Quick Deploy no Kubernetes (K3D)

### 1. Criar cluster K3D

```bash
k3d cluster create task-manager-cluster
```

### 2. Aplicar manifests Kubernetes

```bash
# Criar ConfigMap
kubectl apply -f k8s/configmap.yaml

# Criar PostgreSQL
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/postgres-service.yaml

# Criar Task Manager
kubectl apply -f k8s/app-deployment.yaml
kubectl apply -f k8s/app-service.yaml
```

### 3. Acessar a aplicação

```bash
# NodePort (K3D)
http://localhost:30080

# Verificar status
kubectl get pods -l app=task-manager
kubectl get pods -l app=postgres
kubectl get svc task-manager
```

### 4. Testar Load Balancing

Acesse `http://localhost:30080` múltiplas vezes. Você verá diferentes pods respondendo!

---

## Setup Local (Docker Compose)

### 1. Subir containers

```bash
docker-compose up -d
```

### 2. Acessar

http://localhost:3000

---

## Pré-requisitos

- **Node.js** 18+ e **npm** (para desenvolvimento local)
- **Docker** e **Docker Compose** (para rodar localmente)
- **Kubernetes** (k3d, minikube, ou cluster remoto)
- **kubectl** (para gerenciar o cluster)
- **GitHub Actions** (para CI/CD)

---

## Estrutura do Projeto

```
task-manager/
├── app/
│   ├── layout.js          # Layout raiz
│   ├── page.js            # Página principal (UI)
│   └── globals.css        # Estilos Tailwind
├── lib/
│   └── db.js              # Conexão PostgreSQL
├── api/
│   └── tasks/
│       └── route.js       # API REST CRUD
│   └── health/
│       └── route.js       # Health check
├── tests/
│   └── api.test.js        # Testes da API
├── k8s/
│   ├── configmap.yaml     # Configuração do app
│   ├── app-deployment.yaml    # Deployment do app
│   ├── app-service.yaml       # Service do app (NodePort 30080)
│   ├── postgres-deployment.yaml  # Deployment do DB
│   └── postgres-service.yaml     # Service do DB
├── .github/workflows/
│   └── ci-cd.yml          # CI/CD Pipeline
├── docker-compose.yml     # App + PostgreSQL local
├── Dockerfile             # Imagem Docker
└── README.md              # Este arquivo
```

---

## Funcionalidades

### ✅ API
- **GET** `/api/tasks` - Listar todas as tarefas
- **POST** `/api/tasks` - Criar nova tarefa
- **PUT** `/api/tasks/[id]` - Atualizar tarefa
- **DELETE** `/api/tasks/[id]` - Deletar tarefa
- **GET** `/api/health` - Health check

### ✅ UI
- Lista de tarefas com filtros por status
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

### ✅ Kubernetes
- Deployment com 2 réplicas
- Service NodePort 30080
- PostgreSQL em pod separado
- ConfigMaps para configuração
- Health checks integrados
- Resource requests/limits

---

## GitHub Actions CI/CD

### Pipeline
1. **Test job** - Roda testes com Jest
2. **Build job** - Build Docker image
3. **Deploy job** - Push para Docker Hub (apenas branch `dev_aula`)

### Secrets necessários
- `DOCKER_USERNAME` - Seu Docker Hub username
- `DOCKER_PASSWORD` - Token de acesso do Docker Hub

### Configuração
1. Acesse **Settings** → **Secrets and variables** → **Actions**
2. Adicione os secrets acima
3. Push para `dev_aula` dispara o pipeline

---

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | `3000` |
| `DATABASE_HOST` | Host do PostgreSQL | `postgres` (K8s) |
| `DATABASE_PORT` | Porta do PostgreSQL | `5432` |
| `DATABASE_NAME` | Nome do banco | `task_manager` |
| `DATABASE_USER` | Usuário do DB | `admin` |
| `DATABASE_PASSWORD` | Senha do DB | `admin` |

---

## Kubernetes Manifests

### ConfigMap
Configuração do ambiente do Task Manager (variáveis de DB).

### App Deployment
- 2 réplicas do Task Manager
- Health checks (liveness + readiness)
- Resource limits: 256Mi memory, 200m CPU
- Pull da imagem `profdiegoluispires/task-manager:latest`

### App Service
- Type: NodePort
- Port: 80 → 30080 (K3D)
- Load balance entre pods

### PostgreSQL Deployment
- 1 réplica do PostgreSQL 15
- Volume temporário (emptyDir) para dados
- Resource limits: 512Mi memory, 200m CPU

### PostgreSQL Service
- Type: ClusterIP
- Port: 5432

---

## Deploy Manual no Kubernetes

```bash
# Criar cluster
k3d cluster create task-manager-cluster

# Aplicar manifests
kubectl apply -f k8s/

# Verificar status
kubectl get all

# Acessar
http://localhost:30080
```

---

## Testes

```bash
# Rodar local
npm test

# Com cobertura
npm test -- --coverage
```

---

## Docker

### Build

```bash
docker build -t task-manager:latest .
```

### Rodar com Docker Compose

```bash
docker-compose up -d
```

### Push para Docker Hub

```bash
docker tag task-manager:latest profdiegoluispires/task-manager:latest
docker push profdiegoluispires/task-manager:latest
```

---

## Branches

| Branch | Conteúdo |
|--------|----------|
| `main` | Código-fonte completo (Next.js + PostgreSQL + Docker + Testes) |
| `dev_aula` | Tudo da main + k8s manifests + CI/CD |

---

## License

MIT
