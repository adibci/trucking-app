import { Search, Filter, Star, Check, X, UserCheck, Eye } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'

const DRIVERS = [
  { id: 'DRV-001', name: 'Marcus Lee', license: 'MC', exp: '8 years', status: 'Active', trips: 142, rating: 4.9, operator: 'BC Transport', verified: true },
  { id: 'DRV-002', name: 'Anna Chen', license: 'HC', exp: '3 years', status: 'Active', trips: 67, rating: 4.7, operator: 'Pacific Logistics', verified: true },
  { id: 'DRV-003', name: 'James Park', license: 'HR', exp: '1 year', status: 'Pending', trips: 0, rating: 0, operator: 'Unassigned', verified: false },
  { id: 'DRV-004', name: 'Sam Wilson', license: 'MC', exp: '12 years', status: 'Active', trips: 289, rating: 4.8, operator: 'Pacific Logistics', verified: true },
  { id: 'DRV-005', name: 'Elena Rodriguez', license: 'HC', exp: '5 years', status: 'Suspended', trips: 93, rating: 3.1, operator: 'Desert Run', verified: false },
]

const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Suspended: 'bg-red-50 text-red-700 border-red-200',
  'In Transit': 'bg-blue-50 text-blue-700 border-blue-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export default function Drivers() {
  return (
    <>
      <TopBar title="Manage Drivers" subtitle="View and approve driver accounts" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-200 flex-1">
            <Search size={14} className="text-slate-400" />
            <input className="text-xs text-slate-700 outline-none bg-transparent flex-1 placeholder:text-slate-400" placeholder="Search drivers…" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-600">
            <Filter size={13} /> Filter
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-[10px] text-slate-400 font-black uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Driver</th>
                  <th className="text-center px-3 py-3 hidden sm:table-cell">Licence</th>
                  <th className="text-center px-3 py-3 hidden md:table-cell">Trips</th>
                  <th className="text-center px-3 py-3">Rating</th>
                  <th className="text-center px-3 py-3">Verified</th>
                  <th className="text-center px-3 py-3">Status</th>
                  <th className="text-center px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {DRIVERS.map(drv => (
                  <tr key={drv.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-black text-slate-900 text-xs">{drv.name}</div>
                      <div className="text-[10px] text-slate-400">{drv.operator} · {drv.id}</div>
                    </td>
                    <td className="px-3 py-3.5 hidden sm:table-cell text-center">
                      <span className="text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">{drv.license}</span>
                    </td>
                    <td className="px-3 py-3.5 hidden md:table-cell text-center text-xs font-black text-slate-700">{drv.trips}</td>
                    <td className="px-3 py-3.5 text-center">
                      {drv.rating > 0 ? (
                        <div className="flex items-center justify-center gap-0.5">
                          <Star size={11} className="text-amber-400 fill-amber-400" />
                          <span className="text-xs font-black text-slate-700">{drv.rating}</span>
                        </div>
                      ) : <span className="text-[10px] text-slate-300">—</span>}
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      {drv.verified
                        ? <div className="flex justify-center"><Check size={14} className="text-emerald-500" strokeWidth={3} /></div>
                        : <div className="flex justify-center"><X size={14} className="text-red-400" strokeWidth={3} /></div>
                      }
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${STATUS_COLORS[drv.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {drv.status}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        {!drv.verified && (
                          <button className="w-7 h-7 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center justify-center transition" title="Verify">
                            <UserCheck size={11} className="text-emerald-600" />
                          </button>
                        )}
                        <button className="w-7 h-7 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center transition" title="View">
                          <Eye size={11} className="text-slate-500" />
                        </button>
                      </div>
                    </td>
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
