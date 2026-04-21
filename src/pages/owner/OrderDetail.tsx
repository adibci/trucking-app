import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { MapPin, Truck, Clock, Package, Phone, ChevronLeft, Brain, Navigation, FileText } from 'lucide-react'

const timeline = [
  { time: '06:45', event: 'Order received', status: 'done' },
  { time: '07:00', event: 'Analysed by system', status: 'done' },
  { time: '07:12', event: 'Assigned to TRK-002 (Anna Chen)', status: 'done' },
  { time: '07:30', event: 'Driver en route to pickup', status: 'active' },
  { time: '—', event: 'Pickup: Sydney CBD', status: 'upcoming' },
  { time: '—', event: 'In transit to Port Botany', status: 'upcoming' },
  { time: '—', event: 'Delivery & POD', status: 'upcoming' },
]

export default function OrderDetail() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Order Detail" subtitle="ORD-440" />
      <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-1.5 text-sm text-text3 hover:text-text2 mb-5"
        >
          <ChevronLeft size={16} /> Back to Orders
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-text1">ORD-440</h2>
              <Badge variant="default">Assigned</Badge>
            </div>
            <p className="text-text3 text-sm">Parramatta → Newcastle · B-Double · Toll Group</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => navigate('/orders/ORD-440/tracking')}>
              <Navigation size={14} /> Track
            </Button>
            <Button size="sm" className="flex-1 sm:flex-none" onClick={() => navigate('/decision')}>
              <Brain size={14} /> Re-analyse
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: route + load */}
          <div className="lg:col-span-2 space-y-5">
            {/* Route card */}
            <Card>
              <h3 className="font-semibold text-text1 mb-4 flex items-center gap-2">
                <MapPin size={15} className="text-brand-mid" /> Route
              </h3>
              <div className="relative pl-5">
                <div className="absolute left-1.5 top-3 bottom-3 w-0.5 bg-gray-200" />
                <div className="space-y-6">
                  {[
                    { dot: 'bg-em-green', label: 'Pickup', addr: '45 Church St, Parramatta NSW 2150', time: '08:30 today', contact: 'Toll Group Dispatcher' },
                    { dot: 'bg-em-red', label: 'Drop-off', addr: 'Newcastle Port, NSW 2300', time: 'By 14:00 today', contact: 'Port Operations' },
                  ].map(({ dot, label, addr, time, contact }) => (
                    <div key={label} className="relative">
                      <div className={`absolute -left-5 top-1 w-3 h-3 rounded-full ${dot} border-2 border-white shadow`} />
                      <div className="text-xs font-semibold text-text3 uppercase tracking-wide mb-0.5">{label}</div>
                      <div className="text-sm font-medium text-text1">{addr}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-text3"><Clock size={11} /> {time}</span>
                        <span className="text-xs text-text3">{contact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 pt-4 border-t border-gray-50">
                {[['Distance', '165 km'], ['Est. Time', '2h 10m'], ['Toll', '$18.20']].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[10px] text-text3 uppercase font-bold tracking-tight mb-0.5">{k}</div>
                    <div className="text-sm font-bold text-text1 font-mono">{v}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Load */}
            <Card>
              <h3 className="font-semibold text-text1 mb-3 flex items-center gap-2">
                <Package size={15} className="text-brand-mid" /> Load Details
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  ['Type', 'General Freight'],
                  ['Weight', '22 tonnes'],
                  ['Pallets', '32 pallets'],
                  ['Truck', 'B-Double'],
                  ['Ref #', 'PO-98421'],
                  ['Value', '$2,400.00'],
                ].map(([k, v]) => (
                  <div key={k} className="bg-surface rounded-xl p-3">
                    <div className="text-xs text-text3 mb-0.5">{k}</div>
                    <div className="text-sm font-semibold text-text1">{v}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Timeline */}
            <Card>
              <h3 className="font-semibold text-text1 mb-4">Activity Timeline</h3>
              <div className="relative pl-6">
                <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-gray-100" />
                {timeline.map(({ time, event, status }) => (
                  <div key={event} className="relative mb-4 last:mb-0">
                    <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 ${
                      status === 'done' ? 'bg-em-green border-em-green' :
                      status === 'active' ? 'bg-brand-mid border-brand-mid' :
                      'bg-white border-gray-200'
                    }`} />
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-text3 font-mono w-10 shrink-0">{time}</span>
                      <span className={`text-sm ${status === 'upcoming' ? 'text-text3' : 'text-text1'} ${status === 'active' ? 'font-semibold' : ''}`}>{event}</span>
                      {status === 'active' && (
                        <div className="ml-auto">
                          <div className="w-2 h-2 rounded-full bg-brand-mid animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right: driver + financials */}
          <div className="space-y-4">
            {/* Assigned Driver */}
            <Card>
              <h3 className="font-semibold text-text1 mb-3 flex items-center gap-2">
                <Truck size={15} className="text-brand-mid" /> Assigned
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-semibold text-sm">AC</div>
                <div>
                  <div className="font-medium text-text1 text-sm">Anna Chen</div>
                  <div className="text-xs text-text3">TRK-002 · B-Double</div>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                {[['Status', 'En route to pickup'], ['ETA Pickup', '~22 min'], ['Current Location', '12km away']].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span className="text-text3">{k}</span>
                    <span className="font-medium text-text1">{v}</span>
                  </div>
                ))}
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-gray-200 text-sm text-text2 hover:bg-gray-50">
                <Phone size={13} /> Call Driver
              </button>
            </Card>

            {/* Financials */}
            <Card>
              <h3 className="font-semibold text-text1 mb-3 flex items-center gap-2">
                <FileText size={15} className="text-brand-mid" /> Financials
              </h3>
              <div className="space-y-2">
                {[
                  ['Order Value', '$2,400.00', 'text-text1'],
                  ['Fuel Cost', '-$340.00', 'text-em-red'],
                  ['Driver Pay', '-$180.00', 'text-em-red'],
                  ['Tolls', '-$18.20', 'text-em-red'],
                ].map(([k, v, color]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-text3">{k}</span>
                    <span className={`font-semibold font-mono ${color}`}>{v}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-100 flex justify-between text-sm">
                  <span className="font-semibold text-text1">Net Margin</span>
                  <span className="font-bold text-em-green font-mono">$1,861.80</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text3">Margin %</span>
                  <span className="text-em-green font-medium">77.6%</span>
                </div>
              </div>
            </Card>

            <Button variant="outline" className="w-full" onClick={() => navigate('/orders/ORD-440/tracking')}>
              <Navigation size={14} /> Open Full Map
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
