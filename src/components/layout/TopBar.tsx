import { useState } from 'react'
import { Bell, Search, ChevronDown, Radio, X } from 'lucide-react'
import { cn } from '../../lib/utils'

interface TopBarProps {
  title: string
  subtitle?: string
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const [showSearch, setShowSearch] = useState(false)

  return (
    <>
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 fixed md:sticky top-0 left-0 right-0 z-40">
      {/* Mobile header */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 h-14">
        {showSearch ? (
          <div className="flex-1 flex items-center gap-2 bg-surface rounded-xl px-3 h-9 border border-gray-100 animate-in slide-in-from-right-2 duration-200">
            <Search size={14} className="text-text3" />
            <input
              autoFocus
              type="text"
              placeholder="Search everything..."
              className="bg-transparent text-sm text-text1 outline-none flex-1 placeholder:text-text3"
            />
            <button onClick={() => setShowSearch(false)} className="text-text3 hover:text-text1">
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center shadow-sm shadow-brand/20">
                <Radio size={13} className="text-accent" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-text1 leading-none">{title}</h1>
                {subtitle && <p className="text-[10px] text-text3 mt-0.5 truncate max-w-[140px] font-medium">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowSearch(true)}
                className="w-8 h-8 rounded-xl bg-surface border border-gray-100 flex items-center justify-center text-text2 active:scale-95 transition-all"
              >
                <Search size={15} />
              </button>
              <button className="relative w-8 h-8 rounded-xl bg-surface border border-gray-100 flex items-center justify-center text-text2 active:scale-95 transition-all">
                <Bell size={15} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-em-red rounded-full border border-white" />
              </button>
              <div className="w-8 h-8 rounded-full bg-brand-mid flex items-center justify-center text-white text-[10px] font-bold shadow-sm">JD</div>
            </div>
          </>
        )}
      </div>


      {/* Desktop header */}
      <div className="hidden md:flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-lg font-semibold text-text1 leading-none">{title}</h1>
          {subtitle && <p className="text-xs text-text3 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2 border border-gray-100">
            <Search size={15} className="text-text3" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-text2 outline-none w-40 placeholder:text-text3"
            />
          </div>
          <button className="relative w-9 h-9 rounded-xl bg-surface border border-gray-100 flex items-center justify-center">
            <Bell size={16} className="text-text2" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-em-red rounded-full border border-white" />
          </button>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-brand-mid flex items-center justify-center text-white text-xs font-semibold">JD</div>
            <ChevronDown size={14} className="text-text3" />
          </div>
        </div>
      </div>
    </header>
    {/* Mobile spacer: pushes content below the fixed header */}
    <div className="h-14 md:hidden" />
    </>
  )
}
