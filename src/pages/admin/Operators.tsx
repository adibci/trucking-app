import { Search, Filter, Download, Star, Check, X, Eye } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'

const OPERATORS = [
  { id: 'OP-001', name: 'BC Transport Pty Ltd', contact: 'Brad Chen', trucks: 12, status: 'Active', rating: 4.8, location: 'Sydney, NSW', joined: '12 Jan 2024' },
  { id: 'OP-002', name: 'Outback Freight Co.', contact: 'Sarah Miller', trucks: 6, status: 'Pending', rating: 0, location: 'Perth, WA', joined: '20 Apr 2024' },
  { id: 'OP-003', name: 'Pacific Logistics', contact: 'Tom Wright', trucks: 31, status: 'Active', rating: 4.6, location: 'Melbourne, VIC', joined: '5 Mar 2023' },
  { id: 'OP-004', name: 'Desert Run Haulage', contact: 'Alan Ross', trucks: 4, status: 'Suspended', rating: 3.2, location: 'Darwin, NT', joined: '8 Aug 2023' },
  { id: 'OP-005', name: 'Blue Mountains Freight', contact: 'Lisa Park', trucks: 8, status: 'Pending', rating: 0, location: 'Katoomba, NSW', joined: '19 Apr 2024' },
]

const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Suspended: 'bg-red-50 text-red-700 border-red-200',
  'In Transit': 'bg-blue-50 text-blue-700 border-blue-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export default function Operators() {
  return (
    <>
      <TopBar title="Manage Operators" subtitle="View and approve operator accounts" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-200 flex-1">
            <Search size={14} className="text-slate-400" />
            <input className="text-xs text-slate-700 outline-none bg-transparent flex-1 placeholder:text-slate-400" placeholder="Search operators…" />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-600 hover:border-gray-300 transition">
              <Filter size={13} /> Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-600 hover:border-gray-300 transition">
              <Download size={13} /> Export
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-[10px] text-slate-400 font-black uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Company</th>
                  <th className="text-left px-3 py-3 hidden sm:table-cell">Location</th>
                  <th className="text-center px-3 py-3">Trucks</th>
                  <th className="text-center px-3 py-3">Rating</th>
                  <th className="text-center px-3 py-3">Status</th>
                  <th className="text-center px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {OPERATORS.map(op => (
                  <tr key={op.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-black text-slate-900 text-xs">{op.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{op.contact} · {op.id}</div>
                    </td>
                    <td className="px-3 py-3.5 hidden sm:table-cell text-xs text-slate-600 font-medium">{op.location}</td>
                    <td className="px-3 py-3.5 text-center">
                      <span className="text-xs font-black text-slate-800">{op.trucks}</span>
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      {op.rating > 0 ? (
                        <div className="flex items-center justify-center gap-0.5">
                          <Star size={11} className="text-amber-400 fill-amber-400" />
                          <span className="text-xs font-black text-slate-700">{op.rating}</span>
                        </div>
                      ) : <span className="text-[10px] text-slate-300 font-bold">—</span>}
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${STATUS_COLORS[op.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {op.status}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        {op.status === 'Pending' && (
                          <>
                            <button className="w-7 h-7 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center justify-center transition" title="Approve">
                              <Check size={11} className="text-emerald-600" strokeWidth={3} />
                            </button>
                            <button className="w-7 h-7 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center justify-center transition" title="Reject">
                              <X size={11} className="text-red-500" strokeWidth={3} />
                            </button>
                          </>
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
