import { Search, Bell, Menu } from 'lucide-react'

function Header({ setIsOpen }) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">

      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="text-slate-600 lg:hidden"
        >
          <Menu size={24} />
        </button>

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Dashboard
          </h2>
          <p className="hidden text-sm text-slate-500 sm:block">
            Welcome back! Here's what's happening today.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">

        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 md:flex">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-40 text-sm outline-none"
          />
        </div>

        <button className="relative rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-100">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
          TG
        </div>

      </div>
    </header>
  )
}

export default Header