# Task Manager - Kubernetes & CI/CD

Este repositório contém o código completo do Task Manager para o curso de Kubernetes e GitHub Actions.

## Estrutura do Projeto

```
task-manager/
├── app/              # App Next.js (App Router)
├── lib/              # Funções de banco de dados
├── tests/            # Testes Jest para API
├── k8s/              # Manifets Kubernetes
├── .github/          # Workflows GitHub Actions
├── Dockerfile        # Build da imagem Docker
├── docker-compose.yml # Ambiente local com Docker Compose
├── next.config.js    # Config Next.js
├── tailwind.config.js # Config Tailwind CSS
└── package.json      # Dependências
```

## Kubernetes Manifests

Os manifests Kubernetes estão em `k8s/`:

- `configmap.yaml`: Variáveis de ambiente
- `app-deployment.yaml`: Deployment da aplicação (2 réplicas)
- `app-service.yaml`: Service NodePort 30080
- `postgres-deployment.yaml`: Deployment PostgreSQL 15
- `postgres-service.yaml`: Service ClusterIP PostgreSQL

## GitHub Actions CI/CD

O workflow `.github/workflows/ci-cd.yml` inclui:

1. **test**: Roda `npm test` para validar a API
2. **build**: Build da imagem Docker
3. **deploy**: Push para Docker Hub (apenas branch `dev_aula`)

## Deploy no K3D

```bash
# Criar cluster
k3d cluster create taskmanager

# Aplicar manifests
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/postgres-service.yaml
kubectl apply -f k8s/app-deployment.yaml
kubectl apply -f k8s/app-service.yaml

# Verificar pods
kubectl get pods
kubectl get services

# Acessar aplicação
open http://localhost:30080
```

## Branches

- **main**: Código completo sem k8s/.github
- **dev_aula**: Código + k8s + CI/CD

## Requisitos

- Docker e Docker Compose
- Node.js 20+
- PostgreSQL 15 (ou usar docker-compose)

## Licença

MIT
