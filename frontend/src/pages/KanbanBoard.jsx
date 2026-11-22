
import { useEffect, useState } from 'react'
import { CalendarDays, GripVertical } from 'lucide-react'

const columns = [
  { title: 'To Do', color: 'bg-slate-400' },
  { title: 'In Progress', color: 'bg-blue-500' },
  { title: 'In Review', color: 'bg-purple-500' },
  { title: 'Completed', color: 'bg-green-500' },
]

function KanbanBoard() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('teamflow-tasks')) || []
    } catch {
      return []
    }
  })

  const [projects, setProjects] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('teamflow-projects')) || []
    } catch {
      return []
    }
  })

  const [draggedTask, setDraggedTask] = useState(null)

  useEffect(() => {
    localStorage.setItem('teamflow-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    const handleStorage = () => {
      try {
        setTasks(JSON.parse(localStorage.getItem('teamflow-tasks')) || [])
        setProjects(JSON.parse(localStorage.getItem('teamflow-projects')) || [])
      } catch {
        setTasks([])
        setProjects([])
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const getProjectName = (projectId) => {
    const project = projects.find(
      (item) => String(item.id) === String(projectId)
    )
    return project?.name || 'No Project'
  }

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700'
      case 'Low':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const handleDragStart = (e, task) => {
    setDraggedTask(task.id)
    e.dataTransfer.setData('text/plain', String(task.id))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDrop = (e, newStatus) => {
    e.preventDefault()

    const taskId = e.dataTransfer.getData('text/plain')

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        String(task.id) === String(taskId)
          ? { ...task, status: newStatus }
          : task
      )
    )

    setDraggedTask(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your tasks visually with drag and drop.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => {
          const columnTasks = tasks.filter(
            (task) => task.status === column.title
          )

          return (
            <div
              key={column.title}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, column.title)}
              className="min-h-[420px] rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
                  <h2 className="font-semibold text-gray-800">
                    {column.title}
                  </h2>
                </div>

                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-600">
                  {columnTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={() => setDraggedTask(null)}
                    className={`cursor-grab rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md active:cursor-grabbing ${
                      draggedTask === task.id ? 'opacity-40' : ''
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-medium ${getPriorityStyle(task.priority)}`}
                      >
                        {task.priority || 'Medium'}
                      </span>
                      <GripVertical size={17} className="text-gray-400" />
                    </div>

                    <h3 className="font-semibold text-gray-800">
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-4 border-t border-gray-100 pt-3">
                      <p className="truncate text-xs text-gray-500">
                        {getProjectName(task.projectId)}
                      </p>

                      {task.deadline && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                          <CalendarDays size={14} />
                          {task.deadline}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {columnTasks.length === 0 && (
                  <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default KanbanBoard
