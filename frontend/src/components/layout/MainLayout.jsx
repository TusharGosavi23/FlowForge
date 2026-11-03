import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

function MainLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <main className="min-w-0 flex-1">
        <Header setIsOpen={setIsOpen} />

        <div className="p-5 md:p-8">
          {children}
        </div>
      </main>

    </div>
  )
}

export default MainLayout