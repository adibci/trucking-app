import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Truck, Plus, Search, MapPin, Clock, AlertTriangle, Filter, ChevronRight } from 'lucide-react'

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
    <div className="flex flex-col min-h-screen">
      <TopBar title="Fleet Management" subtitle={`${trucks.length} vehicles registered`} />
      
      {/* Sticky Combined Controls */}
      <div className="sticky top-14 md:top-16 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-3 py-2 sm:px-6 sm:py-4 transition-all duration-200">
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-3">
          {/* Stats row - Scrollable on mobile */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 sm:grid sm:grid-cols-4 sm:gap-4">
            {[
              { label: 'Total', value: trucks.length, color: 'bg-brand/5 border-brand/10', textColor: 'text-brand' },
              { label: 'Available', value: trucks.filter(t => t.status === 'Available').length, color: 'bg-em-green/5 border-em-green/10', textColor: 'text-em-green' },
              { label: 'On Trip', value: trucks.filter(t => t.status === 'On Trip').length, color: 'bg-brand/5 border-brand/10', textColor: 'text-brand-mid' },
              { label: 'Alerts', value: trucks.filter(t => t.status === 'Maintenance').length, color: 'bg-em-red/5 border-em-red/10', textColor: 'text-em-red' },
            ].map(({ label, value, color, textColor }) => (
              <Card key={label} padding="none" className={`${color} border shrink-0 w-[100px] sm:w-auto p-2.5 flex flex-col justify-center items-center text-center rounded-xl`}>
                <div className={`text-lg sm:text-2xl font-black font-mono ${textColor}`}>{value}</div>
                <div className="text-[9px] sm:text-[10px] font-bold text-text3 mt-0.5 uppercase tracking-wider">{label}</div>
              </Card>
            ))}
          </div>

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

      <div className="flex-1 p-3 sm:p-6 lg:max-w-6xl lg:mx-auto w-full">

        {/* Fleet grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(truck => (
            <Card
              key={truck.id}
              className="cursor-pointer hover:shadow-md transition-all hover:border-brand/20"
              onClick={() => navigate(`/fleet/${truck.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    truck.status === 'Available' ? 'bg-em-green-soft' :
                    truck.status === 'On Trip' ? 'bg-brand-light' :
                    truck.status === 'Maintenance' ? 'bg-em-red-soft' : 'bg-accent-soft'
                  }`}>
                    <Truck size={18} className={
                      truck.status === 'Available' ? 'text-em-green' :
                      truck.status === 'On Trip' ? 'text-brand-mid' :
                      truck.status === 'Maintenance' ? 'text-em-red' : 'text-accent'
                    } />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-text1 sm:text-lg">{truck.id}</div>
                    <div className="text-[10px] sm:text-xs text-text3 font-bold uppercase tracking-wider truncate mb-0.5">{truck.plate} · {truck.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {truck.compliance === 'warn' && <AlertTriangle size={14} className="text-em-red" />}
                  <Badge variant={statusColors[truck.status] as any} className="text-[10px] font-bold border-0 px-2 py-0.5 uppercase tracking-tighter">{truck.status}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-text2 bg-surface rounded-lg p-2 border border-gray-50">
                  <div className="w-5 h-5 bg-brand rounded flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-sm shadow-brand/20">
                    {truck.driver !== 'Unassigned' ? truck.driver.split(' ').map(n => n[0]).join('') : '—'}
                  </div>
                  <span className="truncate font-bold tracking-tight">{truck.driver}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text3 bg-surface rounded-lg p-2 border border-gray-50">
                  <MapPin size={11} className="text-slate-300 shrink-0" />
                  <span className="truncate font-medium">{truck.location.split(',')[0]}</span>
                </div>
              </div>

              {/* Fuel bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-text3 mb-1">
                  <span>Fuel</span>
                  <span className={truck.fuel < 30 ? 'text-em-red font-medium' : ''}>{truck.fuel}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${truck.fuel > 50 ? 'bg-em-green' : truck.fuel > 25 ? 'bg-accent' : 'bg-em-red'}`}
                    style={{ width: `${truck.fuel}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-text3">
                <span>Next service: <strong className="text-text2">{truck.nextService}</strong></span>
                <ChevronRight size={14} className="text-text3" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
