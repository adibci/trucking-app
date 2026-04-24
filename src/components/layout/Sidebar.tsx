import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'
import {
  LayoutDashboard, Package, Brain, ShoppingCart, Truck, Users,
  Map, FileText, Star, BarChart3, Settings, ChevronRight, Radio, Share2, LogOut, Shield
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

// Nav items for approved operators
const operatorNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard',      href: '/dashboard' },
  { icon: Package,         label: 'Orders',         href: '/orders' },
  { icon: Brain,           label: 'Decision Center', href: '/decision' },
  { icon: ShoppingCart,    label: 'Network',        href: '/marketplace' },
  { icon: Share2,          label: 'Network Map',    href: '/network-map' },
  { icon: Truck,           label: 'Fleet',          href: '/fleet' },
  { icon: Users,           label: 'Drivers',        href: '/drivers' },
  { icon: Map,             label: 'Live Map',       href: '/live-map' },
  { icon: FileText,        label: 'Billing',        href: '/billing' },
  { icon: Star,            label: 'Trust',          href: '/trust' },
  { icon: BarChart3,       label: 'Analytics',      href: '/analytics' },
  { icon: Settings,        label: 'Settings',       href: '/settings', hasChildren: true },
]

// Nav items for pending/rejected operators
const restrictedNavItems = [
  { icon: LayoutDashboard, label: 'Document Status', href: '/dashboard' },
  { icon: FileText,        label: 'Documents',       href: '/documents' },
  { icon: Settings,        label: 'Profile',         href: '/settings' },
]

// Nav items for admin (same full menu + admin section)
const adminNavItems = operatorNavItems

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isAdminOpen, setIsAdminOpen] = useState(true) // open by default for admin

  const role           = user?.role ?? 'operator'
  const approvalStatus = user?.approvalStatus ?? 'approved'
  const isRestricted   = role === 'operator' && (approvalStatus === 'pending' || approvalStatus === 'rejected')
  const isAdmin        = role === 'admin'

  const navItems = isRestricted ? restrictedNavItems : (isAdmin ? adminNavItems : operatorNavItems)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Badge color for approval status
  const badgeDot = approvalStatus === 'approved' || isAdmin
    ? 'bg-green-400'
    : approvalStatus === 'rejected'
      ? 'bg-red-400'
      : 'bg-amber-400'

  const badgeText = approvalStatus === 'approved' || isAdmin
    ? 'text-green-400'
    : approvalStatus === 'rejected'
      ? 'text-red-400'
      : 'text-amber-400'

  return (
    <aside className="w-60 bg-brand h-screen flex flex-col fixed left-0 top-0 z-20">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Radio size={16} className="text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-lg leading-none tracking-tight">Truck Apps</div>
            <div className="text-white/50 text-xs mt-0.5">B2B Logistics Network</div>
          </div>
        </div>
      </div>

      {/* Company badge */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="bg-white/10 rounded-xl p-3">
          <div className="text-white/60 text-xs mb-1">{isAdmin ? 'Administrator' : 'Company'}</div>
          <div className="text-white font-medium text-sm">{isAdmin ? 'System Admin' : 'BC Transport Pty Ltd'}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className={`w-1.5 h-1.5 rounded-full ${badgeDot}`} />
            <span className={`${badgeText} text-xs font-medium capitalize`}>
              {isAdmin ? 'Active' : approvalStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map((item) => {
          const { icon: Icon, label, href } = item
          const active = location.pathname === href || (href !== '/dashboard' && location.pathname.startsWith(href))

          // Settings with sub-items (approved operator)
          if (!isRestricted && !isAdmin && label === 'Settings') {
            return (
              <div key={label} className="px-2 mb-1">
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Icon size={17} />
                  <span className="flex-1 text-left">Settings</span>
                  <ChevronRight size={14} className={`transition-transform ${isSettingsOpen ? 'rotate-90' : ''}`} />
                </button>
                {isSettingsOpen && (
                  <div className="pl-11 pr-2 space-y-1 mt-1">
                    {[
                      { label: 'Documents', href: '/documents' },
                      { label: 'Profile',   href: '/settings'  },
                    ].map(sub => {
                      const subActive = location.pathname === sub.href
                      return (
                        <NavLink
                          key={sub.label}
                          to={sub.href}
                          className={cn(
                            'block px-3 py-2 rounded-lg text-xs font-medium transition-all',
                            subActive ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
                          )}
                        >
                          {sub.label}
                        </NavLink>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          // Settings with sub-items (admin)
          if (isAdmin && label === 'Settings') {
            return (
              <div key={label} className="px-2 mb-1">
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Icon size={17} />
                  <span className="flex-1 text-left">Settings</span>
                  <ChevronRight size={14} className={`transition-transform ${isSettingsOpen ? 'rotate-90' : ''}`} />
                </button>
                {isSettingsOpen && (
                  <div className="pl-11 pr-2 space-y-1 mt-1">
                    {[
                      { label: 'Documents', href: '/documents' },
                      { label: 'Profile',   href: '/settings'  },
                    ].map(sub => {
                      const subActive = location.pathname === sub.href
                      return (
                        <NavLink key={sub.label} to={sub.href}
                          className={cn('block px-3 py-2 rounded-lg text-xs font-medium transition-all',
                            subActive ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
                          )}
                        >
                          {sub.label}
                        </NavLink>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          return (
            <NavLink
              key={href}
              to={href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-sm font-medium transition-all group',
                active ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon size={17} className={active ? 'text-accent' : 'text-current'} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} className="text-white/40" />}
            </NavLink>
          )
        })}

        {/* Admin sub-menu */}
        {isAdmin && (
          <div className="px-2 mt-6 mb-2">
            <div className="text-[10px] font-black text-white/30 uppercase tracking-widest px-4 mb-2">Administration</div>
            <button
              onClick={() => setIsAdminOpen(!isAdminOpen)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-emerald-400/80 hover:text-emerald-400 hover:bg-emerald-400/10 transition-all"
            >
              <Shield size={17} />
              <span className="flex-1 text-left">Admin</span>
              <ChevronRight size={14} className={`transition-transform ${isAdminOpen ? 'rotate-90' : ''}`} />
            </button>
            {isAdminOpen && (
              <div className="pl-11 pr-2 space-y-1 mt-1">
                {[
                  { label: 'Overview',  href: '/admin' },
                  { label: 'Operators', href: '/admin/operators' },
                  { label: 'Drivers',   href: '/admin/drivers' },
                  { label: 'Orders',    href: '/admin/orders' },
                  { label: 'Reports',   href: '/admin/reports' },
                  { label: 'Settings',  href: '/admin/settings' },
                ].map(sub => {
                  const subActive = sub.href === '/admin'
                    ? location.pathname === '/admin'
                    : location.pathname.startsWith(sub.href)
                  return (
                    <NavLink key={sub.label} to={sub.href}
                      className={cn('block px-3 py-2 rounded-lg text-xs font-medium transition-all',
                        subActive
                          ? 'bg-emerald-400/20 text-emerald-400'
                          : 'text-white/50 hover:text-emerald-400/80 hover:bg-emerald-400/10'
                      )}
                    >
                      {sub.label}
                    </NavLink>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-semibold">
            {isAdmin ? 'SA' : 'JD'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">{isAdmin ? 'System Admin' : 'James Doe'}</div>
            <div className="text-white/50 text-xs capitalize">{isAdmin ? 'Admin' : 'Operator'}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
