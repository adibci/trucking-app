import { Bell, Search, ChevronDown } from 'lucide-react'

interface TopBarProps {
  title: string
  subtitle?: string
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10">
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
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-em-red rounded-full border border-white"></span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-brand-mid flex items-center justify-center text-white text-xs font-semibold">JD</div>
          <ChevronDown size={14} className="text-text3" />
        </div>
      </div>
    </header>
  )
}
