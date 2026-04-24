import { Truck, Users, Package, TrendingUp, ArrowUpRight, ArrowDownRight, Check, X, FileText } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'

const RECENT_ORDERS = [
  { id: 'ORD-440', route: 'Sydney → Melbourne', operator: 'Pacific Logistics', driver: 'Sam Wilson', status: 'In Transit', value: '$2,800', date: 'Today' },
  { id: 'ORD-439', route: 'Brisbane → Sydney', operator: 'BC Transport', driver: 'Marcus Lee', status: 'Delivered', value: '$1,920', date: 'Yesterday' },
  { id: 'ORD-438', route: 'Perth → Adelaide', operator: 'Outback Freight', driver: '—', status: 'Pending', value: '$4,500', date: '20 Apr' },
  { id: 'ORD-437', route: 'Melbourne → Adelaide', operator: 'Pacific Logistics', driver: 'Anna Chen', status: 'Delivered', value: '$1,340', date: '19 Apr' },
]

const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Suspended: 'bg-red-50 text-red-700 border-red-200',
  'In Transit': 'bg-blue-50 text-blue-700 border-blue-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export default function Overview() {
  return (
    <>
      <TopBar title="Admin Overview" subtitle="System KPI & Pending Actions" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total Operators', value: '48', change: '+3', up: true, icon: Truck, color: 'bg-blue-500' },
            { label: 'Active Drivers', value: '213', change: '+12', up: true, icon: Users, color: 'bg-emerald-500' },
            { label: 'Orders This Month', value: '1,204', change: '+8%', up: true, icon: Package, color: 'bg-violet-500' },
            { label: 'Platform Revenue', value: '$84.2K', change: '-2%', up: false, icon: TrendingUp, color: 'bg-amber-500' },
          ].map(({ label, value, change, up, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center shadow-sm`}>
                  <Icon size={16} className="text-white" />
                </div>
                <div className={`flex items-center gap-0.5 text-[10px] font-black ${up ? 'text-emerald-600' : 'text-red-500'}`}>
                  {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {change}
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 leading-none mb-1">{value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</div>
            </div>
          ))}
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Pending Approvals</h3>
              <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-200">5 Items</span>
            </div>
            <button className="text-[10px] font-black text-blue-600 hover:underline">View All</button>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { type: 'Operator', name: 'Outback Freight Co.', sub: 'Perth, WA · 6 trucks · Submitted 20 Apr', icon: Truck, color: 'bg-blue-100 text-blue-600' },
              { type: 'Operator', name: 'Blue Mountains Freight', sub: 'Katoomba, NSW · 8 trucks · Submitted 19 Apr', icon: Truck, color: 'bg-blue-100 text-blue-600' },
              { type: 'Driver', name: 'James Park', sub: 'HC Licence · 1 yr exp · NSW · Submitted 18 Apr', icon: Users, color: 'bg-slate-100 text-slate-600' },
              { type: 'Driver', name: 'Kevin Murphy', sub: 'MC Licence · 4 yr exp · QLD · Submitted 17 Apr', icon: Users, color: 'bg-slate-100 text-slate-600' },
              { type: 'Document', name: 'BC Transport — Insurance Renewal', sub: 'Certificate expires 30 Apr 2024 · Action required', icon: FileText, color: 'bg-amber-100 text-amber-600' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                  <item.icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-800">{item.name}</span>
                    <span className="text-[9px] font-bold text-slate-400 border border-slate-200 px-1.5 rounded uppercase">{item.type}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium truncate">{item.sub}</div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button className="w-7 h-7 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center justify-center transition active:scale-95">
                    <Check size={12} className="text-emerald-600" strokeWidth={3} />
                  </button>
                  <button className="w-7 h-7 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center justify-center transition active:scale-95">
                    <X size={12} className="text-red-500" strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Recent Orders</h3>
            <button className="text-[10px] font-black text-blue-600 hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] text-slate-400 font-black uppercase tracking-wider">
                  <th className="text-left px-5 py-2.5">Order</th>
                  <th className="text-left px-3 py-2.5 hidden sm:table-cell">Route</th>
                  <th className="text-left px-3 py-2.5 hidden md:table-cell">Operator</th>
                  <th className="text-left px-3 py-2.5">Status</th>
                  <th className="text-right px-5 py-2.5">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {RECENT_ORDERS.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition cursor-pointer">
                    <td className="px-5 py-3">
                      <div className="font-black text-slate-900 font-mono">{order.id}</div>
                      <div className="text-[10px] text-slate-400">{order.date}</div>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <div className="font-bold text-slate-700">{order.route}</div>
                      <div className="text-[10px] text-slate-400">{order.driver}</div>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell font-bold text-slate-600">{order.operator}</td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${STATUS_COLORS[order.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-black text-slate-800">{order.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  )
}
