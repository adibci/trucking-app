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
          <div className="flex gap-1 overflow-x-auto no-scrollbar py-1">
            {[
              { label: 'Total', value: drivers.length, icon: Users, color: 'text-slate-400' },
              { label: 'Active', value: drivers.filter(d => d.status !== 'On Leave').length, icon: Truck, color: 'text-blue-500' },
              { label: 'Rating', value: '4.8', icon: Star, color: 'text-amber-500' },
              { label: 'OTR', value: '94%', icon: TrendingUp, color: 'text-em-green' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="shrink-0 flex items-center gap-2 bg-white border border-slate-100 rounded-lg px-2.5 py-1.5 shadow-sm">
                <Icon size={12} className={color} />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black font-mono text-slate-800 leading-none">{value}</span>
                  <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">{label}</span>
                </div>
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
        <div className="space-y-2">
          {drivers.map(driver => (
            <Card
              key={driver.id}
              padding="none"
              className="cursor-pointer hover:shadow-md transition-all group border border-slate-100 overflow-hidden relative"
              onClick={() => navigate(`/drivers/${driver.id}`)}
            >
              <div 
                className="absolute left-0 top-0 bottom-0 w-1" 
                style={{ backgroundColor: 
                  driver.status === 'Available' ? '#10b981' : 
                  driver.status === 'On Trip' ? '#2563eb' : 
                  driver.status === 'On Leave' ? '#94a3b8' : '#f59e0b' 
                }}
              />
              <div className="p-2.5 pl-3.5 flex flex-col gap-2">
                {/* Header: Name, ID, License & Status */}
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black text-slate-900 leading-none truncate">{driver.name}</span>
                      <Badge variant={
                        driver.status === 'Available' ? 'success' :
                        driver.status === 'On Trip' ? 'default' :
                        driver.status === 'On Leave' ? 'outline' : 'warning'
                      } className="font-black text-[7px] border-0 px-1 py-0 h-3 uppercase tracking-tighter shrink-0">
                        {driver.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[8px] font-black text-slate-400 font-mono tracking-tight">{driver.id}</span>
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">· {driver.license} LIC</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest leading-none mb-0.5">Asset</span>
                    <div className="flex items-center gap-1 text-[9px] font-black text-slate-700">
                      <Truck size={8} className="text-slate-400" />
                      {driver.truck}
                    </div>
                  </div>
                </div>

                {/* Metrics Bar: Rating, Trips, On-Time */}
                <div className="flex items-center gap-3 bg-slate-50/80 border border-slate-100 rounded-lg px-2 py-1.5">
                  <div className="flex items-center gap-1.5 border-r border-slate-200 pr-3">
                    <Star size={9} className="text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-black text-slate-800 font-mono">{driver.rating}</span>
                  </div>
                  <div className="flex items-center gap-1.5 border-r border-slate-200 pr-3">
                    <Package size={9} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-800 font-mono">{driver.trips}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp size={9} className="text-em-green" />
                    <span className="text-[10px] font-black text-em-green font-mono">{driver.onTime}%</span>
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
