import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'
import {
  LayoutDashboard, Package, Brain, ShoppingCart, Truck, Users,
  Map, FileText, Star, BarChart3, Settings, ChevronRight, Radio
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Package, label: 'Orders', href: '/orders' },
  { icon: Brain, label: 'Decision Center', href: '/decision' },
  { icon: ShoppingCart, label: 'Marketplace', href: '/marketplace' },
  { icon: Truck, label: 'Fleet', href: '/fleet' },
  { icon: Users, label: 'Drivers', href: '/drivers' },
  { icon: Map, label: 'Live Map', href: '/live-map' },
  { icon: FileText, label: 'Billing', href: '/billing' },
  { icon: Star, label: 'Trust', href: '/trust' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-60 bg-brand min-h-screen flex flex-col fixed left-0 top-0 z-20">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Radio size={16} className="text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-lg leading-none tracking-tight">EmptyMiles</div>
            <div className="text-white/50 text-xs mt-0.5">B2B Logistics Network</div>
          </div>
        </div>
      </div>

      {/* Company badge */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="bg-white/10 rounded-xl p-3">
          <div className="text-white/60 text-xs mb-1">Company</div>
          <div className="text-white font-medium text-sm">BC Transport Pty Ltd</div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
            <span className="text-green-400 text-xs font-medium">Active</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = location.pathname.startsWith(href)
          return (
            <NavLink
              key={href}
              to={href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-sm font-medium transition-all group',
                active
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon size={17} className={active ? 'text-accent' : 'text-current'} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} className="text-white/40" />}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-semibold">JD</div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">James Doe</div>
            <div className="text-white/50 text-xs">Owner</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
