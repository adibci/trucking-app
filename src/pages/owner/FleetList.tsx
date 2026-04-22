import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Truck, Plus, Search, MapPin, Clock, AlertTriangle, Filter, ChevronRight, Zap } from 'lucide-react'

const trucks = [
  { id: 'TRK-001', plate: 'CA-0001', type: '13.6m Semi', driver: 'Marcus Lee', status: 'On Trip', location: 'Hume Hwy, NSW', eta: '2h 15m', fuel: 68, lastService: '28 Mar', nextService: '28 Jun', compliance: 'ok' },
  { id: 'TRK-002', plate: 'CA-0002', type: 'B-Double', driver: 'Anna Chen', status: 'Available', location: 'Parramatta Depot', eta: 'Ready', fuel: 92, lastService: '1 Apr', nextService: '1 Jul', compliance: 'ok' },
  { id: 'TRK-003', plate: 'CA-0003', type: 'Curtainsider', driver: 'James Park', status: 'Returning', location: '45 km from base', eta: '45 min', fuel: 41, lastService: '15 Mar', nextService: '15 Jun', compliance: 'ok' },
  { id: 'TRK-004', plate: 'CA-0004', type: 'B-Double', driver: 'Sam Wilson', status: 'On Trip', location: 'Newell Hwy, NSW', eta: '4h', fuel: 55, lastService: '20 Mar', nextService: '20 Jun', compliance: 'ok' },
  { id: 'TRK-005', plate: 'CA-0005', type: 'Refrigerated', driver: 'Unassigned', status: 'Maintenance', location: 'Service Centre', eta: 'Back tomorrow', fuel: 100, lastService: 'Today', nextService: '6 Jul', compliance: 'warn' },
  { id: 'TRK-006', plate: 'CA-0006', type: 'Flatbed', driver: 'Tony Nguyen', status: 'Available', location: 'Sydney Base', eta: 'Ready', fuel: 87, lastService: '2 Apr', nextService: '2 Jul', compliance: 'ok' },
]

const statusColors: Record<string, string> = {
  'On Trip': 'default',
  'Available': 'success',
  'Returning': 'warning',
  'Maintenance': 'danger',
}

export default function FleetList() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filters = ['All', 'Available', 'On Trip', 'Returning', 'Maintenance']
  const filtered = filter === 'All' ? trucks : trucks.filter(t => t.status === filter)

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <TopBar title="Fleet Management" subtitle={`${trucks.length} vehicles registered`} />
      
      {/* Sticky Combined Controls */}
      <div className="sticky top-14 md:top-16 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-3 py-2 sm:px-6 sm:py-3 transition-all duration-200">
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-3">
          {/* Stats row - Scrollable on mobile */}
          {/* <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 sm:grid sm:grid-cols-4 sm:gap-4">
            {[
              { label: 'Total Fleet', value: trucks.length, icon: Truck, color: 'bg-brand/5', iconColor: 'text-brand' },
              { label: 'Available', value: trucks.filter(t => t.status === 'Available').length, icon: Clock, color: 'bg-em-green/5', iconColor: 'text-em-green' },
              { label: 'On Trip', value: trucks.filter(t => t.status === 'On Trip').length, icon: MapPin, color: 'bg-brand/5', iconColor: 'text-brand-mid' },
              { label: 'Attention', value: trucks.filter(t => t.status === 'Maintenance').length, icon: AlertTriangle, color: 'bg-em-red/5', iconColor: 'text-em-red' },
            ].map(({ label, value, icon: Icon, color, iconColor }) => (
              <div key={label} className={`${color} border border-transparent rounded-2xl p-3 shrink-0 min-w-[120px] sm:min-w-0 flex flex-col justify-between shadow-sm`}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-7 h-7 ${color.replace('/5', '/10')} rounded-lg flex items-center justify-center`}>
                    <Icon size={14} className={iconColor} />
                  </div>
                  <div className="text-xl font-black font-mono text-slate-800">{value}</div>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div> */}

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1 shadow-sm focus-within:border-brand-mid transition-colors h-10">
                <Search size={16} className="text-text3 shrink-0" />
                <input className="text-xs outline-none bg-transparent placeholder:text-text3 w-full font-bold" placeholder="Search fleet..." />
              </div>
              <Button onClick={() => navigate('/fleet/add')} className="h-10 px-3 shadow-lg shadow-brand/10 shrink-0">
                <Plus size={18} /> <span className="hidden xs:inline ml-1 text-xs">Add</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="sm:hidden relative flex-1">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 shadow-sm h-10"
                >
                  <span>{filter} Status</span>
                  <ChevronRight size={14} className={`transition-transform ${isFilterOpen ? '-rotate-90' : 'rotate-90'}`} />
                </button>
                
                {isFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                    <div className="absolute top-11 left-0 right-0 z-50 bg-white border border-gray-100 rounded-2xl shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                      {filters.map(f => (
                        <button 
                          key={f}
                          onClick={() => { setFilter(f); setIsFilterOpen(false); }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${filter === f ? 'bg-brand/5 text-brand' : 'text-text3 hover:bg-gray-50'}`}
                        >
                          {f} Fleet
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              <div className="hidden sm:flex bg-gray-100 p-1 rounded-xl gap-1 border border-gray-200/50">
                {filters.map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${filter === f ? 'bg-white text-brand shadow-sm' : 'text-text3 hover:text-text2'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full">

        {/* Fleet grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(truck => (
            <Card
              key={truck.id}
              className="group cursor-pointer hover:shadow-lg transition-all border-l-4 overflow-hidden"
              style={{ borderLeftColor: truck.status === 'Available' ? '#10b981' : truck.status === 'On Trip' ? '#2563eb' : truck.status === 'Maintenance' ? '#ef4444' : '#f59e0b' }}
              padding="none"
              onClick={() => navigate(`/fleet/${truck.id}`)}
            >
              <div className="p-3 flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      truck.status === 'Available' ? 'bg-em-green/5' :
                      truck.status === 'On Trip' ? 'bg-brand/5' :
                      truck.status === 'Maintenance' ? 'bg-em-red/5' : 'bg-accent/5'
                    }`}>
                      <Truck size={18} className={
                        truck.status === 'Available' ? 'text-em-green' :
                        truck.status === 'On Trip' ? 'text-brand-mid' :
                        truck.status === 'Maintenance' ? 'text-em-red' : 'text-accent'
                      } />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-black text-slate-800 text-base leading-tight">{truck.id}</h3>
                        <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 px-1 py-0.5 rounded border border-slate-100">{truck.plate}</span>
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{truck.type}</p>
                    </div>
                  </div>
                  <Badge variant={statusColors[truck.status] as any} className="font-black text-[8px] border-0 px-2 py-0.5 tracking-widest shadow-sm">
                    {truck.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 bg-brand/10 rounded-lg flex items-center justify-center text-brand text-[9px] font-black shrink-0">
                      {truck.driver !== 'Unassigned' ? truck.driver.split(' ').map(n => n[0]).join('') : '—'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Driver</div>
                      <div className="text-[10px] font-bold text-slate-700 truncate">{truck.driver}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                      <MapPin size={12} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Location</div>
                      <div className="text-[10px] font-bold text-slate-700 truncate">{truck.location.split(',')[0]}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-2 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} className="text-slate-300" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Service: {truck.nextService}</span>
                  </div>
                  <div className="text-slate-300 group-hover:text-brand transition-colors">
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
