import { BarChart3, Activity, Star, Shield, Globe, TrendingUp, Download, ChevronRight } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'

export default function Reports() {
  return (
    <>
      <TopBar title="System Reports" subtitle="Analytics and platform insights" />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Monthly Revenue Report', sub: 'Platform commissions, operator payments', icon: BarChart3, color: 'text-violet-600 bg-violet-50' },
            { title: 'Fleet Activity Summary', sub: 'Trips, idle time, route efficiency', icon: Activity, color: 'text-blue-600 bg-blue-50' },
            { title: 'Driver Performance', sub: 'Ratings, on-time delivery, incidents', icon: Star, color: 'text-amber-600 bg-amber-50' },
            { title: 'Compliance Report', sub: 'Licences, insurance, accreditation status', icon: Shield, color: 'text-emerald-600 bg-emerald-50' },
            { title: 'Network Coverage Map', sub: 'Routes covered, regional demand heatmap', icon: Globe, color: 'text-cyan-600 bg-cyan-50' },
            { title: 'Order Volume Trends', sub: 'Weekly/monthly order breakdown by region', icon: TrendingUp, color: 'text-rose-600 bg-rose-50' },
          ].map(({ title, sub, icon: Icon, color }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition cursor-pointer group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} shrink-0`}>
                <Icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-slate-800 text-sm">{title}</div>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5">{sub}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="w-7 h-7 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center transition">
                  <Download size={12} className="text-slate-500" />
                </button>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
