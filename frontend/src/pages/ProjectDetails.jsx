
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Circle,
  Plus,
  FolderKanban,
  Trash2,
  Loader2,
} from 'lucide-react'
import { projectService } from '../services/projectService'
import { taskService } from '../services/taskService'
import  TaskComments  from '../components/layout/TaskComments'
import {commentService} from "../services/commentService"

function ProjectDetails() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProjectData()
  }, [projectId])

  async function loadProjectData() {
    setLoading(true)
    setError('')

    try {
      const [projects, projectTasks] = await Promise.all([
        projectService.getAll(),
        taskService.getByProject(projectId),
      ])

      const selectedProject = projects.find(
        (item) => String(item.id) === projectId
      )

      setProject(selectedProject || null)
      setTasks(projectTasks || [])
    } catch (err) {
      setError(err.message || 'Failed to load project data.')
    } finally {
      setLoading(false)
    }
  }

  async function addTask(e) {
    e.preventDefault()

    if (!newTask.trim()) return

    setSaving(true)
    setError('')

    try {
      const createdTask = await taskService.create(projectId, {
        title: newTask.trim(),
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        assignedToEmail: '',
        dueDate: null,
      })

      setTasks((previous) => [...previous, createdTask])
      setNewTask('')
    } catch (err) {
      setError(err.message || 'Failed to create task.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleTask(task) {
    const newStatus =
      task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED'

    setError('')

    try {
      const updatedTask = await taskService.update(task.id, {
        ...task,
        status: newStatus,
      })

      setTasks((previous) =>
        previous.map((item) =>
          item.id === task.id ? updatedTask : item
        )
      )
    } catch (err) {
      setError(err.message || 'Failed to update task.')
    }
  }

  async function deleteTask(taskId) {
    setError('')

    try {
      await taskService.delete(taskId)

      setTasks((previous) =>
        previous.filter((task) => task.id !== taskId)
      )
    } catch (err) {
      setError(err.message || 'Failed to delete task.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={30} />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">
          Project not found
        </h2>
        <button
          onClick={() => navigate('/projects')}
          className="mt-4 text-blue-600 hover:underline"
        >
          Back to Projects
        </button>
      </div>
    )
  }

  const completedTasks = tasks.filter(
    (task) => task.status === 'COMPLETED'
  ).length

  const pendingTasks = tasks.length - completedTasks

  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100)

  return (
    <div className="space-y-6">

      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
      >
        <ArrowLeft size={18} />
        Back to Projects
      </button>

      {/* Project Overview */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-blue-600">
              <FolderKanban size={18} />
              Project Overview
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              {project.name}
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              {project.description || 'No project description available.'}
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            {project.status}
          </span>
        </div>

        <div className="mt-8 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-3">

          <div>
            <p className="text-xs text-slate-400">Priority</p>
            <p className="mt-1 font-semibold text-slate-800">
              {project.priority || 'Not specified'}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Deadline</p>
            <p className="mt-1 flex items-center gap-2 font-semibold text-slate-800">
              <CalendarDays size={16} />
              {project.deadline || 'Not specified'}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Project Progress</p>
            <p className="mt-1 font-semibold text-slate-800">
              {progress}%
            </p>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Tasks</p>
          <p className="mt-2 text-2xl font-bold">{tasks.length}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Completed Tasks</p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {completedTasks}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Pending Tasks</p>
          <p className="mt-2 text-2xl font-bold text-orange-500">
            {pendingTasks}
          </p>
        </div>
      </div>

      {/* Task Management */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900">
            Project Tasks
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage tasks associated with this project.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={addTask} className="mb-6 flex gap-2">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task..."
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={saving || !newTask.trim()}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Plus size={17} />
            )}
            Add Task
          </button>
        </form>

        <div className="space-y-5">
          {tasks.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              No tasks added yet. Create your first task above.
            </div>
          ) : (
            tasks.map((task) => {
              const isCompleted = task.status === 'COMPLETED'

              return (
                <div
                  key={task.id}
                  className="rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
                >
                  {/* Task Header */}
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => toggleTask(task)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="shrink-0 text-green-500" />
                      ) : (
                        <Circle className="shrink-0 text-slate-400" />
                      )}

                      <span
                        className={`break-words text-sm font-medium ${
                          isCompleted
                            ? 'text-slate-400 line-through'
                            : 'text-slate-800'
                        }`}
                      >
                        {task.title}
                      </span>
                    </button>

                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          isCompleted
                            ? 'bg-green-50 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isCompleted ? 'Completed' : 'To Do'}
                      </span>

                      <button
                        onClick={() => deleteTask(task.id)}
                        title="Delete task"
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Task Comments */}
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <TaskComments taskId={task.id} />
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails
