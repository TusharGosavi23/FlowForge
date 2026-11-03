import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  LogOut,
  X,
} from 'lucide-react'

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Projects', icon: FolderKanban },
  { name: 'My Tasks', icon: CheckSquare },
  { name: 'Team', icon: Users },
]

function Sidebar({ isOpen, setIsOpen }) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-950 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>

      <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
        <h1 className="text-2xl font-bold text-blue-500">
          TeamFlow<span className="text-white">.</span>
        </h1>

        <button onClick={() => setIsOpen(false)} className="lg:hidden">
          <X size={22} />
        </button>
      </div>

      <div className="px-4 py-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Workspace
        </p>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.name}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  item.name === 'Dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={19} />
                {item.name}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto space-y-2 border-t border-slate-800 p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white">
          <Settings size={19} />
          Settings
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white">
          <LogOut size={19} />
          Logout
        </button>

        <div className="mt-4 flex items-center gap-3 rounded-lg bg-slate-900 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold">
            TG
          </div>

          <div>
            <p className="text-sm font-semibold">Tushar Gosavi</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar