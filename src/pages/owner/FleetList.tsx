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

  const filters = ['All', 'Available', 'On Trip', 'Returning', 'Maintenance']
  const filtered = filter === 'All' ? trucks : trucks.filter(t => t.status === filter)

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Fleet Management" subtitle={`${trucks.length} vehicles registered`} />
      <div className="flex-1 p-6">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Fleet', value: trucks.length, color: 'bg-brand-light', textColor: 'text-brand-mid' },
            { label: 'Available', value: trucks.filter(t => t.status === 'Available').length, color: 'bg-em-green-soft', textColor: 'text-em-green' },
            { label: 'On Trip', value: trucks.filter(t => t.status === 'On Trip').length, color: 'bg-brand-light', textColor: 'text-brand' },
            { label: 'Maintenance', value: trucks.filter(t => t.status === 'Maintenance').length, color: 'bg-em-red-soft', textColor: 'text-em-red' },
          ].map(({ label, value, color, textColor }) => (
            <Card key={label} className={`${color} border-0`}>
              <div className={`text-3xl font-bold font-mono ${textColor}`}>{value}</div>
              <div className="text-xs text-text3 mt-1">{label}</div>
            </Card>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
              <Search size={15} className="text-text3" />
              <input className="text-sm outline-none bg-transparent placeholder:text-text3 w-48" placeholder="Search trucks, drivers..." />
            </div>
            <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
              {filters.map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? 'bg-white text-text1 shadow-sm' : 'text-text3'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={() => navigate('/fleet/add')}>
            <Plus size={16} /> Add Truck
          </Button>
        </div>

        {/* Fleet grid */}
        <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <div className="font-bold text-text1">{truck.id}</div>
                    <div className="text-xs text-text3">{truck.plate} · {truck.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {truck.compliance === 'warn' && <AlertTriangle size={14} className="text-em-red" />}
                  <Badge variant={statusColors[truck.status] as any}>{truck.status}</Badge>
                </div>
              </div>

              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-2 text-sm text-text2">
                  <div className="w-5 h-5 bg-brand rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {truck.driver !== 'Unassigned' ? truck.driver.split(' ').map(n => n[0]).join('') : '—'}
                  </div>
                  {truck.driver}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-text3">
                  <MapPin size={11} /> {truck.location}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-text3">
                  <Clock size={11} /> {truck.eta}
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
