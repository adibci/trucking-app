import { Search } from 'lucide-react'
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

export default function Orders() {
  return (
    <>
      <TopBar title="Manage Orders" subtitle="System-wide order monitoring" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-4">
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-200">
          <Search size={14} className="text-slate-400" />
          <input className="text-xs text-slate-700 outline-none bg-transparent flex-1 placeholder:text-slate-400" placeholder="Search orders by ID, operator, driver…" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-[10px] text-slate-400 font-black uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Order ID</th>
                  <th className="text-left px-3 py-3">Route</th>
                  <th className="text-left px-3 py-3 hidden sm:table-cell">Operator</th>
                  <th className="text-left px-3 py-3 hidden md:table-cell">Driver</th>
                  <th className="text-center px-3 py-3">Status</th>
                  <th className="text-right px-5 py-3">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {RECENT_ORDERS.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition cursor-pointer">
                    <td className="px-5 py-3.5">
                      <div className="font-black text-slate-900 text-xs font-mono">{order.id}</div>
                      <div className="text-[10px] text-slate-400">{order.date}</div>
                    </td>
                    <td className="px-3 py-3.5 text-xs font-bold text-slate-700">{order.route}</td>
                    <td className="px-3 py-3.5 hidden sm:table-cell text-xs text-slate-600">{order.operator}</td>
                    <td className="px-3 py-3.5 hidden md:table-cell text-xs text-slate-600">{order.driver}</td>
                    <td className="px-3 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${STATUS_COLORS[order.status] || ''}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-black text-slate-800 text-xs">{order.value}</td>
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
