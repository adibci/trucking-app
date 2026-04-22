import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Users, Plus, Search, Star, Truck, Package, TrendingUp, ChevronRight } from 'lucide-react'

const drivers = [
  { id: 'DRV-001', name: 'Marcus Lee', license: 'HC', truck: 'TRK-001', status: 'On Trip', rating: 4.9, trips: 312, onTime: 98, revenue: '$124K', badge: 'Top Performer', photo: 'ML' },
  { id: 'DRV-002', name: 'Anna Chen', license: 'MC', truck: 'TRK-002', status: 'Available', rating: 4.9, trips: 289, onTime: 97, revenue: '$118K', badge: 'Top Performer', photo: 'AC' },
  { id: 'DRV-003', name: 'James Park', license: 'HC', truck: 'TRK-003', status: 'Returning', rating: 4.7, trips: 218, onTime: 94, revenue: '$89K', badge: null, photo: 'JP' },
  { id: 'DRV-004', name: 'Sam Wilson', license: 'HC', truck: 'TRK-004', status: 'On Trip', rating: 4.6, trips: 195, onTime: 91, revenue: '$76K', badge: null, photo: 'SW' },
  { id: 'DRV-005', name: 'Tony Nguyen', license: 'HR', truck: 'TRK-006', status: 'Available', rating: 4.8, trips: 167, onTime: 95, revenue: '$65K', badge: null, photo: 'TN' },
  { id: 'DRV-006', name: 'Rachel Kim', license: 'MC', truck: 'Unassigned', status: 'On Leave', rating: 4.5, trips: 143, onTime: 92, revenue: '$58K', badge: null, photo: 'RK' },
]

export default function DriverList() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <TopBar title="Driver Management" subtitle={`${drivers.length} drivers registered`} />

      {/* Sticky Controls */}
      <div className="sticky top-14 md:top-16 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-3 py-2 sm:px-6 sm:py-3 transition-all duration-200">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-2">
          {/* Stats row */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 sm:grid sm:grid-cols-4 sm:gap-4">
            {[
              { label: 'Total', value: drivers.length },
              { label: 'On Duty', value: drivers.filter(d => d.status !== 'On Leave').length },
              { label: 'Avg Rating', value: '4.8' },
              { label: 'On-Time', value: '94%' },
            ].map(({ label, value }) => (
              <div key={label} className="shrink-0 w-[100px] sm:w-auto bg-gray-50 border border-gray-100 rounded-xl p-2.5 flex flex-col justify-center items-center text-center">
                <div className="text-lg sm:text-2xl font-black font-mono text-brand">{value}</div>
                <div className="text-[9px] sm:text-[10px] font-bold text-text3 mt-0.5 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>

          {/* Search + Add */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1 shadow-sm focus-within:border-brand-mid transition-colors h-10">
              <Search size={16} className="text-text3 shrink-0" />
              <input className="text-xs outline-none bg-transparent placeholder:text-text3 w-full font-bold" placeholder="Search drivers..." />
            </div>
            <Button onClick={() => navigate('/drivers/add')} className="h-10 px-3 shadow-lg shadow-brand/10 shrink-0">
              <Plus size={18} /> <span className="hidden xs:inline ml-1 text-xs">Add</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full">
        {/* Driver list */}
        <div className="space-y-3">
          {drivers.map(driver => (
            <Card
              key={driver.id}
              padding="none"
              className="cursor-pointer hover:shadow-lg transition-all group border-l-4 overflow-hidden"
              style={{ borderLeftColor: 
                driver.status === 'Available' ? '#10b981' : 
                driver.status === 'On Trip' ? '#2563eb' : 
                driver.status === 'On Leave' ? '#94a3b8' : '#f59e0b' 
              }}
              onClick={() => navigate(`/drivers/${driver.id}`)}
            >
              <div className="p-3 md:p-4">
                <div className="flex flex-col gap-3">
                  {/* Top Row: Avatar, Name, Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md shadow-brand/20">
                          {driver.photo}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          driver.status === 'Available' ? 'bg-em-green' :
                          driver.status === 'On Trip' ? 'bg-brand-mid' :
                          driver.status === 'On Leave' ? 'bg-slate-300' : 'bg-accent'
                        }`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-black text-slate-800 text-sm md:text-base leading-tight truncate">{driver.name}</h3>
                          {driver.badge && <Badge variant="success" className="text-[8px] px-1.5 py-0 h-auto font-black uppercase tracking-widest whitespace-nowrap">{driver.badge.toUpperCase()}</Badge>}
                        </div>
                        <div className="flex items-center gap-2 leading-none">
                          <span className="text-[10px] font-black text-slate-400 font-mono tracking-tight">{driver.id}</span>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">· Lic: {driver.license}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[9px] font-black uppercase text-slate-400 leading-none mb-1">Status</div>
                      <Badge variant={
                        driver.status === 'Available' ? 'success' :
                        driver.status === 'On Trip' ? 'default' :
                        driver.status === 'On Leave' ? 'outline' : 'warning'
                      } className="font-black text-[8px] border-0 px-2 py-0.5 tracking-widest shadow-sm">
                        {driver.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Middle Row: Performance Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-100 flex items-center gap-2">
                      <Star size={12} className="text-amber-400 fill-amber-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Rating</div>
                        <div className="text-[10px] font-black text-slate-700 font-mono">{driver.rating}</div>
                      </div>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-100 flex items-center gap-2">
                      <Package size={12} className="text-slate-300 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Trips</div>
                        <div className="text-[10px] font-black text-slate-700 font-mono">{driver.trips}</div>
                      </div>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-100 flex items-center gap-2">
                      <TrendingUp size={12} className="text-em-green shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">On-Time</div>
                        <div className="text-[10px] font-black text-em-green font-mono">{driver.onTime}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Assignments & Action */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Truck size={12} className="text-slate-300" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assigned: {driver.truck}</span>
                    </div>
                    <div className="text-slate-300 group-hover:text-brand transition-colors">
                      <ChevronRight size={16} />
                    </div>
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
