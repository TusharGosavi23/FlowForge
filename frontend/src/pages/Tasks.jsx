
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Search, Filter, CheckCircle2, Clock, Circle,
  Pencil, Trash2, X, ListTodo, Loader2,
} from 'lucide-react'
import { projectService } from '../services/projectService'
import { taskService } from '../services/taskService'

const statuses = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED']
const priorities = ['LOW', 'MEDIUM', 'HIGH']

const emptyForm = {
  title: '',
  description: '',
  projectId: '',
  priority: 'MEDIUM',
  status: 'TODO',
  deadline: '',
}

function Tasks() {
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [projectFilter, setProjectFilter] = useState('All')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setError('')

    try {
      const projectData = await projectService.getAll()
      setProjects(projectData || [])

      const taskResults = await Promise.all(
        (projectData || []).map((project) =>
          taskService.getByProject(project.id)
        )
      )

      const allTasks = taskResults.flat()
      setTasks(allTasks || [])
    } catch (err) {
      setError(err.message || 'Failed to load tasks.')
    } finally {
      setLoading(false)
    }
  }

  const getProjectName = (projectId) =>
    projects.find(
      (project) => String(project.id) === String(projectId)
    )?.name || 'Unknown Project'

  const openCreateModal = () => {
    setEditingId(null)
    setFormData({
      ...emptyForm,
      projectId: projects.length ? String(projects[0].id) : '',
    })
    setIsModalOpen(true)
  }

  const openEditModal = (task) => {
    setEditingId(task.id)
    setFormData({
      title: task.title || '',
      description: task.description || '',
      projectId: String(task.projectId || ''),
      priority: task.priority || 'MEDIUM',
      status: task.status || 'TODO',
      deadline: task.dueDate || '',
    })
    setIsModalOpen(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!formData.projectId) {
      setError('Please select a project.')
      return
    }

    setSaving(true)
    setError('')

    const payload = {
      title: formData.title.trim(),
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      assignedToEmail: '',
      dueDate: formData.deadline || null,
    }

    try {
      if (editingId !== null) {
        const updatedTask = await taskService.update(editingId, payload)

        setTasks((previous) =>
          previous.map((task) =>
            String(task.id) === String(editingId)
              ? updatedTask
              : task
          )
        )
      } else {
        const createdTask = await taskService.create(
          formData.projectId,
          payload
        )

        setTasks((previous) => [createdTask, ...previous])
      }

      setIsModalOpen(false)
      setEditingId(null)
      setFormData(emptyForm)
    } catch (err) {
      setError(err.message || 'Failed to save task.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }

    setError('')

    try {
      await taskService.delete(id)
      setTasks((previous) =>
        previous.filter((task) => String(task.id) !== String(id))
      )
    } catch (err) {
      setError(err.message || 'Failed to delete task.')
    }
  }

  async function updateStatus(id, status) {
    setError('')

    const task = tasks.find(
      (item) => String(item.id) === String(id)
    )

    if (!task) return

    try {
      const updatedTask = await taskService.update(id, {
        title: task.title,
        description: task.description || '',
        status,
        priority: task.priority || 'MEDIUM',
        assignedToEmail: task.assignedToEmail || '',
        dueDate: task.dueDate || null,
      })

      setTasks((previous) =>
        previous.map((item) =>
          String(item.id) === String(id) ? updatedTask : item
        )
      )
    } catch (err) {
      setError(err.message || 'Failed to update task status.')
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      (task.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (task.description || '').toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'All' || task.status === statusFilter

    const matchesPriority =
      priorityFilter === 'All' || task.priority === priorityFilter

    const matchesProject =
      projectFilter === 'All' ||
      String(task.projectId) === projectFilter

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesProject
    )
  })

  const stats = [
    {
      label: 'Total Tasks',
      value: tasks.length,
      icon: ListTodo,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'To Do',
      value: tasks.filter((t) => t.status === 'TODO').length,
      icon: Circle,
      color: 'bg-slate-100 text-slate-600',
    },
    {
      label: 'In Progress',
      value: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      icon: Clock,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      label: 'Completed',
      value: tasks.filter((t) => t.status === 'COMPLETED').length,
      icon: CheckCircle2,
      color: 'bg-green-100 text-green-600',
    },
  ]

  const priorityStyle = {
    HIGH: 'bg-red-50 text-red-600',
    MEDIUM: 'bg-orange-50 text-orange-600',
    LOW: 'bg-green-50 text-green-600',
  }

  const statusStyle = {
    TODO: 'bg-slate-100 text-slate-600',
    IN_PROGRESS: 'bg-blue-50 text-blue-600',
    IN_REVIEW: 'bg-purple-50 text-purple-600',
    COMPLETED: 'bg-green-50 text-green-600',
  }

  const statusLabel = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    IN_REVIEW: 'In Review',
    COMPLETED: 'Completed',
  }

  const priorityLabel = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-7">

      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            My Tasks
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Organize, prioritize and track your work.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          disabled={projects.length === 0}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus size={18} />
          Create Task
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-slate-500">{stat.label}</p>

              <div className="mt-3 flex items-center gap-3">
                <span className={`rounded-lg p-2 ${stat.color}`}>
                  <Icon size={21} />
                </span>

                <span className="text-2xl font-bold text-slate-800">
                  {stat.value}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 lg:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-lg border border-slate-200 px-4">
          <Search size={18} className="text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full py-3 text-sm outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter size={17} className="text-slate-400" />

          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm"
          >
            <option value="All">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={String(project.id)}>
                {project.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm"
          >
            <option value="All">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {statusLabel[status]}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm"
          >
            <option value="All">All Priority</option>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priorityLabel[priority]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task list */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h2 className="font-semibold text-slate-800">All Tasks</h2>

          <span className="text-sm text-slate-500">
            {filteredTasks.length} tasks found
          </span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center">
            <ListTodo size={36} className="mx-auto text-slate-300" />
            <h3 className="mt-3 font-semibold text-slate-700">
              No tasks found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Create a task or change your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">Task</th>
                  <th className="px-5 py-4">Project</th>
                  <th className="px-5 py-4">Priority</th>
                  <th className="px-5 py-4">Deadline</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">
                        {task.title}
                      </p>

                      {task.description && (
                        <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                          {task.description}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() =>
                          navigate(`/projects/${task.projectId}`)
                        }
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {getProjectName(task.projectId)}
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyle[task.priority] || priorityStyle.MEDIUM}`}>
                        {priorityLabel[task.priority] || 'Medium'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {task.dueDate || 'Not set'}
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={task.status || 'TODO'}
                        onChange={(e) =>
                          updateStatus(task.id, e.target.value)
                        }
                        className={`rounded-full border-0 px-3 py-2 text-xs font-semibold outline-none ${statusStyle[task.status] || statusStyle.TODO}`}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {statusLabel[status]}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(task)}
                          title="Edit task"
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(task.id)}
                          title="Delete task"
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {editingId !== null ? 'Edit Task' : 'Create New Task'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the task information below.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Task Title *
                </label>

                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  placeholder="Enter task title"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  maxLength={500}
                  placeholder="Describe the task"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Project *
                </label>

                <select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  required
                  disabled={editingId !== null}
                  className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm"
                >
                  <option value="">Select Project</option>

                  {projects.map((project) => (
                    <option key={project.id} value={String(project.id)}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm"
                  >
                    {priorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priorityLabel[priority]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {statusLabel[status]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Deadline
                </label>

                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {editingId !== null ? 'Save Changes' : 'Create Task'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default Tasks
