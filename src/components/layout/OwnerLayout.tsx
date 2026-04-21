import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'

export function OwnerLayout() {
  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar: visible only on md+ */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content: full width on mobile, offset on desktop */}
      <main className="flex-1 md:ml-60 min-h-screen flex flex-col pb-16 md:pb-0 overflow-x-hidden">
        <Outlet />
      </main>

      {/* Bottom nav: visible only on mobile */}
      <BottomNav />
    </div>
  )
}
