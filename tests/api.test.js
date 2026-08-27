describe('Task API', () => {
  describe('GET /api/tasks', () => {
    it('deve retornar lista de tarefas', async () => {
      // Garante ao menos uma tarefa, sem depender de estado pré-existente no banco
      await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Tarefa para listagem', status: 'pendente', priority: 'media' }),
      });

      const response = await fetch('http://localhost:3000/api/tasks');
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data.tasks)).toBe(true);
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
      const createResponse = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Tarefa original', status: 'pendente', priority: 'media' }),
      });
      const { task: createdTask } = await createResponse.json();

      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: createdTask.id,
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
      const createResponse = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Tarefa para deletar', status: 'pendente', priority: 'media' }),
      });
      const { task: createdTask } = await createResponse.json();

      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: createdTask.id }),
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
