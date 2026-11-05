
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  FolderKanban,
} from 'lucide-react'

const TASKS_KEY = 'teamflow-tasks'

function ProjectDetails() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    const savedProjects = JSON.parse(
      localStorage.getItem('teamflow-projects') || '[]'
    )

    const selectedProject = savedProjects.find(
      (item) => String(item.id) === projectId
    )

    setProject(selectedProject || null)

    const savedTasks = JSON.parse(
      localStorage.getItem(TASKS_KEY) || '[]'
    )

    setTasks(
      savedTasks.filter(
        (task) => String(task.projectId) === projectId
      )
    )
  }, [projectId])

  function addTask(e) {
    e.preventDefault()

    if (!newTask.trim()) return

    const task = {
      id: Date.now(),
      projectId,
      title: newTask.trim(),
      status: 'To Do',
      priority: 'Medium',
    }

    const allTasks = JSON.parse(
      localStorage.getItem(TASKS_KEY) || '[]'
    )

    const updatedTasks = [...allTasks, task]

    localStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks))
    setTasks((previous) => [...previous, task])
    setNewTask('')
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
    (task) => task.status === 'Completed'
  ).length

  return (
    <div className="space-y-6">

      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
      >
        <ArrowLeft size={18} />
        Back to Projects
      </button>

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
              {project.progress || 0}%
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

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
            {tasks.length - completedTasks}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Project Tasks
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage tasks associated with this project.
            </p>
          </div>
        </div>

        <form onSubmit={addTask} className="mb-6 flex gap-2">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task..."
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            Add Task
          </button>
        </form>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              No tasks added yet. Create your first task above.
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {task.status === 'Completed' ? (
                    <CheckCircle2 className="shrink-0 text-green-500" />
                  ) : (
                    <Circle className="shrink-0 text-slate-400" />
                  )}

                  <span className="truncate text-sm font-medium text-slate-800">
                    {task.title}
                  </span>
                </div>

                <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                  {task.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails
