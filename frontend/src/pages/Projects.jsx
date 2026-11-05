import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Plus,
  Search,
  FolderKanban,
  CalendarDays,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  Filter,
  LayoutGrid,
} from 'lucide-react'

const initialProjects = [
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Redesign the company website with a modern and responsive interface.',
    status: 'In Progress',
    priority: 'High',
    deadline: '2026-12-15',
    progress: 75,
  },
  {
    id: 2,
    name: 'Mobile Application',
    description: 'Develop a mobile application for customer engagement.',
    status: 'In Progress',
    priority: 'Medium',
    deadline: '2027-01-20',
    progress: 45,
  },
  {
    id: 3,
    name: 'CRM Integration',
    description: 'Integrate CRM services with the existing backend system.',
    status: 'Completed',
    priority: 'High',
    deadline: '2026-11-20',
    progress: 100,
  },
]

const emptyForm = {
  name: '',
  description: '',
  priority: 'Medium',
  status: 'Not Started',
  deadline: '',
  progress: 0,
}

function Projects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState(() => {
    try {
      const savedProjects = localStorage.getItem('teamflow-projects')
      return savedProjects ? JSON.parse(savedProjects) : initialProjects
    } catch {
      return initialProjects
    }
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [activeMenu, setActiveMenu] = useState(null)

  const [formData, setFormData] = useState(emptyForm)

  // Save projects whenever they change
  useEffect(() => {
    localStorage.setItem('teamflow-projects', JSON.stringify(projects))
  }, [projects])

  // Open modal for creating a project
  const openCreateModal = () => {
    setEditingId(null)
    setFormData(emptyForm)
    setIsModalOpen(true)
  }

  // Open modal for editing a project
  const openEditModal = (project) => {
    setEditingId(project.id)
    setFormData({
      name: project.name,
      description: project.description,
      priority: project.priority,
      status: project.status,
      deadline: project.deadline,
      progress: project.progress,
    })
    setActiveMenu(null)
    setIsModalOpen(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((previous) => ({
      ...previous,
      [name]: name === 'progress' ? Number(value) : value,
    }))
  }

  // Create or update project
  const handleSubmit = (e) => {
    e.preventDefault()

    const updatedProject = {
      ...formData,
      progress:
        formData.status === 'Completed'
          ? 100
          : Number(formData.progress),
    }

    if (editingId !== null) {
      setProjects((previous) =>
        previous.map((project) =>
          project.id === editingId
            ? { ...project, ...updatedProject }
            : project
        )
      )
    } else {
      setProjects((previous) => [
        {
          id: Date.now(),
          ...updatedProject,
        },
        ...previous,
      ])
    }

    setIsModalOpen(false)
    setEditingId(null)
    setFormData(emptyForm)
  }

  // Delete project
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?'
    )

    if (confirmed) {
      setProjects((previous) =>
        previous.filter((project) => project.id !== id)
      )
    }

    setActiveMenu(null)
  }

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'All' || project.status === statusFilter

    const matchesPriority =
      priorityFilter === 'All' || project.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'In Progress',
      value: projects.filter((p) => p.status === 'In Progress').length,
      color: 'text-orange-600 bg-orange-100',
    },
    {
      title: 'Completed',
      value: projects.filter((p) => p.status === 'Completed').length,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Not Started',
      value: projects.filter((p) => p.status === 'Not Started').length,
      color: 'text-slate-600 bg-slate-100',
    },
  ]

  const getStatusStyle = (status) => {
    const styles = {
      Completed: 'bg-green-100 text-green-700',
      'In Progress': 'bg-blue-100 text-blue-700',
      'Not Started': 'bg-slate-100 text-slate-600',
    }

    return styles[status] || styles['Not Started']
  }

  const getPriorityStyle = (priority) => {
    const styles = {
      High: 'text-red-600 bg-red-50',
      Medium: 'text-orange-600 bg-orange-50',
      Low: 'text-green-600 bg-green-50',
    }

    return styles[priority] || styles.Medium
  }

  return (
    <div className="space-y-7">

      {/* Page heading */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Projects
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create, organize and track your team's projects.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Create Project
        </button>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{stat.title}</p>

            <div className="mt-3 flex items-center gap-3">
              <span className={`rounded-lg p-2 text-lg font-bold ${stat.color}`}>
                {stat.value}
              </span>
              <span className="text-xs text-slate-400">Projects</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search and filters */}

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 md:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-lg border border-slate-200 px-4">
          <Search size={18} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 text-sm outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={17} className="text-slate-400" />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none"
          >
            <option value="All">All Status</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none"
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Project list heading */}

      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold text-slate-800">
          <LayoutGrid size={19} />
          All Projects
        </h2>

        <span className="text-sm text-slate-500">
          {filteredProjects.length} projects found
        </span>
      </div>

      {/* Project cards */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

       {filteredProjects.map((project) => (
  <div
    key={project.id}
    onClick={() => navigate(`/projects/${project.id}`)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        navigate(`/projects/${project.id}`)
      }
    }}
    role="button"
    tabIndex={0}
    className="relative cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
  >
            <div className="flex items-start justify-between">
              <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                <FolderKanban size={23} />
              </div>

             <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() =>
                    setActiveMenu(
                      activeMenu === project.id ? null : project.id
                    )
                  }
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                >
                  <MoreVertical size={20} />
                </button>

                {activeMenu === project.id && (
                  <div className="absolute right-0 top-10 z-20 w-40 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
                    <button
                      onClick={() => openEditModal(project)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(project.id)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-800">
              {project.name}
            </h3>

            <p className="mt-2 min-h-10 text-sm text-slate-500">
              {project.description || 'No description provided.'}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(project.status)}`}
              >
                {project.status}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(project.priority)}`}
              >
                {project.priority} Priority
              </span>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-slate-500">Project Progress</span>

                <span className="font-semibold text-slate-700">
                  {project.progress}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
              <CalendarDays size={15} />

              Deadline: {project.deadline || 'Not set'}
            </div>
          </div>
        ))}

      </div>

      {/* Empty state */}

      {filteredProjects.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <FolderKanban className="mx-auto text-slate-400" size={35} />

          <h3 className="mt-3 font-semibold text-slate-700">
            No projects found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Try changing your filters or create a new project.
          </p>
        </div>
      )}

      {/* Create / Edit modal */}

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {editingId !== null ? 'Edit Project' : 'Create New Project'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter your project information below.
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
                  Project Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  required
                  maxLength={100}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                  placeholder="Describe your project"
                  rows="3"
                  maxLength={500}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
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
                    className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
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
                    className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Completed</option>
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
                  className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <div className="mb-2 flex justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    Progress
                  </label>

                  <span className="text-sm font-semibold text-blue-600">
                    {formData.status === 'Completed' ? 100 : formData.progress}%
                  </span>
                </div>

                <input
                  type="range"
                  name="progress"
                  min="0"
                  max="100"
                  value={formData.status === 'Completed' ? 100 : formData.progress}
                  onChange={handleChange}
                  disabled={formData.status === 'Completed'}
                  className="w-full accent-blue-600"
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
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {editingId !== null ? 'Save Changes' : 'Create Project'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default Projects