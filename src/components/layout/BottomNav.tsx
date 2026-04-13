import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Brain, Truck, Settings } from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Package, label: 'Orders', href: '/orders' },
  { icon: Brain, label: 'Decision', href: '/decision' },
  { icon: Truck, label: 'Fleet', href: '/fleet' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 flex md:hidden">
      {navItems.map(({ icon: Icon, label, href }) => (
        <NavLink
          key={href}
          to={href}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-2.5 gap-1 transition-colors ${
              isActive ? 'text-brand-mid' : 'text-text3'
            }`
          }
        >
          <Icon size={20} />
          <span className="text-[10px] font-medium">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
