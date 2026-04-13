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
    <div className="flex flex-col min-h-screen">
      <TopBar title="Driver Management" subtitle={`${drivers.length} drivers registered`} />
      <div className="flex-1 p-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Drivers', value: drivers.length, sub: 'All registered' },
            { label: 'On Duty', value: drivers.filter(d => d.status !== 'On Leave').length, sub: 'Active today' },
            { label: 'Avg Rating', value: '4.8', sub: 'Last 30 days', mono: true },
            { label: 'Avg On-Time', value: '94%', sub: 'Delivery rate', mono: true },
          ].map(({ label, value, sub, mono }) => (
            <Card key={label}>
              <div className={`text-3xl font-bold text-text1 ${mono ? 'font-mono' : ''}`}>{value}</div>
              <div className="text-xs text-text3 mt-0.5">{sub}</div>
              <div className="text-xs text-text2 font-medium mt-1">{label}</div>
            </Card>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
              <Search size={15} className="text-text3" />
              <input className="text-sm outline-none bg-transparent placeholder:text-text3 w-48" placeholder="Search drivers..." />
            </div>
          </div>
          <Button onClick={() => navigate('/drivers/add')}>
            <Plus size={16} /> Add Driver
          </Button>
        </div>

        {/* Driver list */}
        <div className="space-y-3">
          {drivers.map(driver => (
            <Card
              key={driver.id}
              className="cursor-pointer hover:shadow-md transition-all hover:border-brand/20"
              onClick={() => navigate(`/drivers/${driver.id}`)}
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white font-bold">
                    {driver.photo}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    driver.status === 'Available' ? 'bg-em-green' :
                    driver.status === 'On Trip' ? 'bg-brand-mid' :
                    driver.status === 'On Leave' ? 'bg-gray-300' : 'bg-accent'
                  }`} />
                </div>

                {/* Name & info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-text1">{driver.name}</span>
                    <span className="text-xs text-text3 font-mono">{driver.id}</span>
                    {driver.badge && (
                      <span className="text-xs bg-accent-soft text-accent font-semibold px-2 py-0.5 rounded-full">
                        {driver.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text3">
                    <span>License: <strong className="text-text2">{driver.license}</strong></span>
                    <span className="flex items-center gap-1"><Truck size={11} /> {driver.truck}</span>
                    <Badge variant={
                      driver.status === 'Available' ? 'success' :
                      driver.status === 'On Trip' ? 'default' :
                      driver.status === 'On Leave' ? 'outline' : 'warning'
                    }>{driver.status}</Badge>
                  </div>
                </div>

                {/* Performance stats */}
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Star size={12} className="text-accent fill-accent" />
                      <span className="font-bold text-text1 font-mono">{driver.rating}</span>
                    </div>
                    <div className="text-xs text-text3">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Package size={12} className="text-text3" />
                      <span className="font-bold text-text1 font-mono">{driver.trips}</span>
                    </div>
                    <div className="text-xs text-text3">Trips</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <TrendingUp size={12} className="text-em-green" />
                      <span className="font-bold text-em-green font-mono">{driver.onTime}%</span>
                    </div>
                    <div className="text-xs text-text3">On-Time</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-text1 font-mono text-sm">{driver.revenue}</div>
                    <div className="text-xs text-text3">Revenue</div>
                  </div>
                </div>

                <ChevronRight size={16} className="text-text3 shrink-0" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
