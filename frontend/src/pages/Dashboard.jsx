import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  AlertCircle,
  ArrowUpRight,
  MoreHorizontal,
} from 'lucide-react'

const stats = [
  {
    title: 'Total Projects',
    value: '12',
    change: '+2 this month',
    icon: FolderKanban,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Total Tasks',
    value: '148',
    change: '+12 this week',
    icon: CheckCircle2,
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'In Progress',
    value: '36',
    change: '24% of all tasks',
    icon: Clock3,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    title: 'Overdue Tasks',
    value: '08',
    change: 'Needs attention',
    icon: AlertCircle,
    color: 'bg-red-100 text-red-600',
  },
]

const projects = [
  {
    name: 'Website Redesign',
    category: 'Design & Development',
    progress: 75,
    color: 'bg-blue-600',
    status: 'In Progress',
  },
  {
    name: 'Mobile Application',
    category: 'Product Development',
    progress: 45,
    color: 'bg-purple-600',
    status: 'In Progress',
  },
  {
    name: 'CRM Integration',
    category: 'Backend Development',
    progress: 90,
    color: 'bg-green-600',
    status: 'Almost Done',
  },
]

function Dashboard() {
  return (
    <div className="space-y-8">

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track your projects and team performance.
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
          + Create Project
        </button>
      </div>

      {/* Statistics */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <Icon size={22} />
                </div>

                <button className="text-slate-400">
                  <MoreHorizontal size={22} />
                </button>
              </div>

              <p className="mt-5 text-sm text-slate-500">
                {stat.title}
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-800">
                {stat.value}
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                {stat.change}
              </p>
            </div>
          )
        })}
      </div>

      {/* Projects */}

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Recent Projects
            </h2>
            <p className="text-sm text-slate-500">
              Overview of your active projects
            </p>
          </div>

          <button className="flex items-center gap-1 text-sm font-semibold text-blue-600">
            View All <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.name}>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {project.category}
                  </p>
                </div>

                <span className="text-sm font-semibold text-slate-700">
                  {project.progress}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${project.color}`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                {project.status}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default Dashboard