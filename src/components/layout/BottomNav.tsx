import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, Package, Brain, Truck, Settings, Menu, X, 
  ShoppingCart, Share2, Users, Map, FileText, Star, BarChart3 
} from 'lucide-react'
import { cn } from '../../lib/utils'

const mainNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Package, label: 'Orders', href: '/orders' },
  { icon: Share2, label: 'Network', href: '/marketplace' },
  { icon: Truck, label: 'Fleet', href: '/fleet' },
]

const moreNavItems = [
  { icon: Brain, label: 'Decision', href: '/decision' },
  { icon: Share2, label: 'Network Map', href: '/network-map' },
  { icon: Users, label: 'Drivers', href: '/drivers' },
  { icon: Map, label: 'Live Map', href: '/live-map' },
  { icon: FileText, label: 'Billing', href: '/billing' },
  { icon: Star, label: 'Trust', href: '/trust' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function BottomNav() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  return (
    <>
      {/* More Menu Overlay */}
      <div className={cn(
        "fixed inset-0 z-40 bg-brand/95 backdrop-blur-md transition-all duration-300 md:hidden flex flex-col",
        isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      )}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-white font-bold tracking-tight">Navigation Center</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-4">
          {moreNavItems.map(({ icon: Icon, label, href }) => {
            const active = location.pathname.startsWith(href)
            return (
              <NavLink
                key={href}
                to={href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all",
                  active 
                    ? "bg-accent border-accent text-white shadow-lg shadow-accent/20" 
                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                )}
              >
                <Icon size={24} className="mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
              </NavLink>
            )
          })}
        </div>
      </div>

      {/* Main Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex md:hidden safe-area-pb">
        {mainNavItems.map(({ icon: Icon, label, href }) => (
          <NavLink
            key={href}
            to={href}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${
                isActive ? 'text-brand-mid' : 'text-text3'
              }`
            }
          >
            <Icon size={20} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
          </NavLink>
        ))}
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex-1 flex flex-col items-center py-3 gap-1 transition-colors",
            isOpen ? "text-brand-mid" : "text-text3"
          )}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
          <span className="text-[10px] font-bold uppercase tracking-tighter">More</span>
        </button>
      </nav>
    </>
  )
}

