import { v4 as uuidv4 } from 'uuid';

// Mock database para testes
let tasks = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Tarefa de teste',
    description: 'Descrição da tarefa de teste',
    status: 'pendente',
    priority: 'media',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

describe('Task API', () => {
  beforeEach(() => {
    tasks = [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Tarefa de teste',
        description: 'Descrição da tarefa de teste',
        status: 'pendente',
        priority: 'media',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  });

  describe('GET /api/tasks', () => {
    it('deve retornar lista de tarefas', async () => {
      const response = await fetch('http://localhost:3000/api/tasks');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.tasks).toBeInstanceOf(Array);
      expect(data.tasks.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/tasks', () => {
    it('deve criar uma nova tarefa', async () => {
      const newTask = {
        title: 'Nova tarefa',
        description: 'Descrição da nova tarefa',
        status: 'pendente',
        priority: 'alta',
      };

      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.task.title).toBe('Nova tarefa');
      expect(data.task.status).toBe('pendente');
      expect(data.task.priority).toBe('alta');
      expect(data.task.id).toBeDefined();
    });

    it('deve retornar erro se título estiver vazio', async () => {
      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Title is required');
    });

    it('deve retornar erro se status for inválido', async () => {
      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Teste', status: 'invalido' }),
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid status');
    });
  });

  describe('PUT /api/tasks', () => {
    it('deve atualizar uma tarefa existente', async () => {
      const taskId = uuidv4();
      tasks.push({
        id: taskId,
        title: 'Tarefa original',
        description: 'Descrição original',
        status: 'pendente',
        priority: 'media',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: taskId,
          title: 'Tarefa atualizada',
          status: 'em-andamento',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.task.title).toBe('Tarefa atualizada');
      expect(data.task.status).toBe('em-andamento');
    });

    it('deve retornar erro se tarefa não for encontrada', async () => {
      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'uuid-invalido',
          title: 'Tarefa inexistente',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Task not found');
    });
  });

  describe('DELETE /api/tasks', () => {
    it('deve deletar uma tarefa', async () => {
      const taskId = uuidv4();
      tasks.push({
        id: taskId,
        title: 'Tarefa para deletar',
        description: 'Descrição',
        status: 'pendente',
        priority: 'media',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Task deleted successfully');
    });

    it('deve retornar erro se tarefa não for encontrada', async () => {
      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'uuid-invalido' }),
      });

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Task not found');
    });
  });

  describe('GET /api/health', () => {
    it('deve retornar status health check', async () => {
      const response = await fetch('http://localhost:3000/api/health');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('ok');
      expect(data.service).toBe('task-manager');
      expect(data.timestamp).toBeDefined();
    });
  });
});
