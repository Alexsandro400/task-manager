'use client'

import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const STATUS_COLORS = {
  pendente: 'bg-gray-100 text-gray-800 border-gray-300',
  'em-andamento': 'bg-blue-100 text-blue-800 border-blue-300',
  concluida: 'bg-green-100 text-green-800 border-green-300',
}

const PRIORITY_COLORS = {
  baixa: 'bg-green-500',
  media: 'bg-yellow-500',
  alta: 'bg-red-500',
}

export default function TaskManager() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pendente',
    priority: 'media',
  })
  const [editingTask, setEditingTask] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      const response = await fetch('/api/tasks')
      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!newTask.title.trim()) return

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      })
      const data = await response.json()
      
      if (response.ok) {
        setTasks([data.task, ...tasks])
        setNewTask({ title: '', description: '', status: 'pendente', priority: 'media' })
      } else {
        alert(data.error || 'Erro ao criar tarefa')
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor')
    }
  }

  async function handleUpdate(e) {
    e.preventDefault()
    if (!editingTask.title.trim()) return

    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTask),
      })
      const data = await response.json()

      if (response.ok) {
        setTasks(tasks.map(t => t.id === editingTask.id ? data.task : t))
        setEditingTask(null)
      } else {
        alert(data.error || 'Erro ao atualizar tarefa')
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Tem certeza que deseja deletar esta tarefa?')) return

    try {
      const response = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setTasks(tasks.filter(t => t.id !== id))
      } else {
        alert('Erro ao deletar tarefa')
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor')
    }
  }

  function startEdit(task) {
    setEditingTask({ ...task })
  }

  function cancelEdit() {
    setEditingTask(null)
  }

  function filteredTasks() {
    if (filter === 'all') return tasks
    return tasks.filter(t => t.status === filter)
  }

  function getPriorityBadge(priority) {
    return PRIORITY_COLORS[priority] || PRIORITY_COLORS.media
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center text-indigo-600 mb-2">
            📝 Task Manager
          </h1>
          <p className="text-center text-gray-600">
            Gerencie suas tarefas com facilidade e estilo
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {editingTask ? '✏️ Editar Tarefa' : '➕ Nova Tarefa'}
              </h2>

              <form onSubmit={editingTask ? handleUpdate : handleCreate}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={editingTask ? editingTask.title : newTask.title}
                    onChange={(e) => {
                      const field = editingTask ? 'editingTask' : 'newTask'
                      if (field === 'editingTask') {
                        setEditingTask({ ...editingTask, title: e.target.value })
                      } else {
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    placeholder="Digite o título da tarefa"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={editingTask ? editingTask.description : newTask.description}
                    onChange={(e) => {
                      const field = editingTask ? 'editingTask' : 'newTask'
                      if (field === 'editingTask') {
                        setEditingTask({ ...editingTask, description: e.target.value })
                      } else {
                        setNewTask({ ...newTask, description: e.target.value })
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    placeholder="Digite a descrição da tarefa"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Status
                    </label>
                    <select
                      value={editingTask ? editingTask.status : newTask.status}
                      onChange={(e) => {
                        const field = editingTask ? 'editingTask' : 'newTask'
                        if (field === 'editingTask') {
                          setEditingTask({ ...editingTask, status: e.target.value })
                        } else {
                          setNewTask({ ...newTask, status: e.target.value })
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    >
                      <option value="pendente">⏳ Pendente</option>
                      <option value="em-andamento">🔄 Em Andamento</option>
                      <option value="concluida">✅ Concluído</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Prioridade
                    </label>
                    <select
                      value={editingTask ? editingTask.priority : newTask.priority}
                      onChange={(e) => {
                        const field = editingTask ? 'editingTask' : 'newTask'
                        if (field === 'editingTask') {
                          setEditingTask({ ...editingTask, priority: e.target.value })
                        } else {
                          setNewTask({ ...newTask, priority: e.target.value })
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    >
                      <option value="baixa">🟢 Baixa</option>
                      <option value="media">🟡 Média</option>
                      <option value="alta">🔴 Alta</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  {editingTask && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    className={`flex-1 px-4 py-2 ${
                      editingTask ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'
                    } text-white rounded-lg transition-colors font-semibold`}
                  >
                    {editingTask ? '💾 Salvar' : '➕ Criar'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Lista de Tarefas */}
          <div className="lg:col-span-2">
            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h3>
              <div className="flex gap-2 flex-wrap">
                {['all', 'pendente', 'em-andamento', 'concluida'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                      filter === f
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {f === 'all' ? 'Todas' : f === 'pendente' ? 'Pendentes' : f === 'em-andamento' ? 'Em Andamento' : 'Concluídas'}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-4">
              {filteredTasks().length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-xl">Nenhuma tarefa encontrada</p>
                  <p className="text-sm">Crie uma nova tarefa ou ajuste os filtros</p>
                </div>
              ) : (
                filteredTasks().map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 flex-1">
                            {task.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityBadge(task.priority)}`}
                          >
                            {task.priority === 'baixa' ? 'Baixa' : task.priority === 'media' ? 'Média' : 'Alta'}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-gray-600 text-sm">{task.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${STATUS_COLORS[task.status]}`}
                        >
                          {task.status === 'pendente' ? '⏳ Pendente' : task.status === 'em-andamento' ? '🔄 Em Andamento' : '✅ Concluído'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(task.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(task)}
                          className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                          🗑️ Deletar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Estatísticas</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-800">{tasks.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {tasks.filter(t => t.status === 'pendente').length}
              </div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">
                {tasks.filter(t => t.status === 'em-andamento').length}
              </div>
              <div className="text-sm text-gray-600">Em Andamento</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {tasks.filter(t => t.status === 'concluida').length}
              </div>
              <div className="text-sm text-gray-600">Concluídas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
