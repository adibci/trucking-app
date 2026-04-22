import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import {
  TrendingUp, TrendingDown, Truck, Package, DollarSign, AlertTriangle,
  MapPin, Clock, ArrowRight, Radio, Zap, ChevronRight, Navigation
} from 'lucide-react'

const kpis = [
  { label: 'Active Trucks', value: '18', sub: '4 returning soon', icon: Truck, trend: '+2', up: true, color: 'bg-brand-light', iconColor: 'text-brand-mid' },
  { label: "Today's Revenue", value: '$24,350', sub: 'vs $21K yesterday', icon: DollarSign, trend: '+16%', up: true, color: 'bg-em-green-soft', iconColor: 'text-em-green' },
  { label: 'Orders In Progress', value: '11', sub: '3 awaiting decision', icon: Package, trend: '-1', up: false, color: 'bg-accent-soft', iconColor: 'text-accent' },
  { label: 'Empty Miles Today', value: '340 km', sub: 'Potential savings: $520', icon: Radio, trend: '-18%', up: true, color: 'bg-em-red-soft', iconColor: 'text-em-red' },
]

const trucks = [
  { id: 'TRK-001', driver: 'Marcus Lee', status: 'On Trip', eta: '2h 15m', load: 'Sydney → Melbourne', lat: -33.8688, lng: 151.2093 },
  { id: 'TRK-002', driver: 'Anna Chen', status: 'Available', eta: 'Ready now', load: 'Idle — Parramatta', lat: -33.8151, lng: 151.0011 },
  { id: 'TRK-003', driver: 'James Park', status: 'Returning', eta: '45 min', load: 'Returning to base', lat: -33.9, lng: 151.1 },
  { id: 'TRK-004', driver: 'Sam Wilson', status: 'On Trip', eta: '4h', load: 'Melbourne → Brisbane', lat: -37.8136, lng: 144.9631 },
]

const orders = [
  { id: 'ORD-441', route: 'Sydney CBD → Port Botany', type: '13.6m Semi', status: 'Awaiting Decision', urgent: true },
  { id: 'ORD-440', route: 'Parramatta → Newcastle', type: 'B-Double', status: 'Assigned', urgent: false },
  { id: 'ORD-439', route: 'Melbourne → Geelong', type: 'Curtainsider', status: 'In Transit', urgent: false },
]

const recommendations = [
  {
    type: 'assign',
    title: 'TRK-002 is 8km from pickup',
    desc: 'ORD-441: Sydney CBD → Port Botany',
    action: 'Assign Now',
    icon: Zap,
    color: 'bg-em-green-soft border-em-green/20',
    btnVariant: 'primary' as const,
  },
  {
    type: 'broadcast',
    title: 'No internal truck for ORD-443',
    desc: 'Broadcast to network — 3 partners nearby',
    action: 'Broadcast Job',
    icon: Radio,
    color: 'bg-accent-soft border-accent/20',
    btnVariant: 'accent' as const,
  },
  {
    type: 'warning',
    title: 'TRK-004 returns empty in 4h',
    desc: 'Melbourne → base. Potential backlog available.',
    action: 'Find Backlog',
    icon: AlertTriangle,
    color: 'bg-em-red-soft border-em-red/20',
    btnVariant: 'outline' as const,
  },
]

function MapPlaceholder() {
  return (
    <div className="relative bg-slate-800 rounded-2xl overflow-hidden" style={{ height: 340 }}>
      {/* Simulated map background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e3a5f 100%)',
      }}>
        {/* Grid lines */}
        {[...Array(8)].map((_, i) => (
          <div key={`h${i}`} className="absolute w-full border-t border-white/5" style={{ top: `${i * 14}%` }} />
        ))}
        {[...Array(10)].map((_, i) => (
          <div key={`v${i}`} className="absolute h-full border-l border-white/5" style={{ left: `${i * 11}%` }} />
        ))}
        {/* Route line */}
        <svg className="absolute inset-0 w-full h-full">
          <path d="M 80,200 Q 200,120 320,150 Q 420,180 500,100" stroke="#F59E0B" strokeWidth="2" fill="none" strokeDasharray="6,4" opacity="0.7" />
          <path d="M 80,200 Q 150,280 240,250" stroke="#059669" strokeWidth="2" fill="none" strokeDasharray="6,4" opacity="0.5" />
        </svg>
      </div>
      {/* Truck pins */}
      {trucks.map((t, i) => (
        <div key={t.id} className="absolute" style={{ left: `${15 + i * 20}%`, top: `${30 + (i % 3) * 18}%` }}>
          <div className={`relative group cursor-pointer`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg ${
              t.status === 'Available' ? 'bg-em-green' :
              t.status === 'On Trip' ? 'bg-brand-mid' : 'bg-accent'
            }`}>
              <Truck size={14} className="text-white" />
            </div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-lg px-2 py-1 text-xs font-medium text-text1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition shadow-lg">
              {t.id}
            </div>
          </div>
        </div>
      ))}
      {/* Map overlay controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5">
        {['+', '−'].map(c => (
          <button key={c} className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-sm font-bold text-text1">{c}</button>
        ))}
      </div>
      <div className="absolute bottom-3 left-3 flex items-center gap-3">
        {[{ color: 'bg-em-green', label: 'Available' }, { color: 'bg-brand-mid', label: 'On Trip' }, { color: 'bg-accent', label: 'Returning' }].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
            <span className="text-white/70 text-xs">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Dashboard" subtitle="Monday, 6 April 2026 · 09:14 AEST" />
      <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6">

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {kpis.map(({ label, value, sub, icon: Icon, trend, up, color, iconColor }) => (
            <Card key={label} className="relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-16 h-16 ${color} rounded-bl-3xl`} />
              <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={17} className={iconColor} />
              </div>
              <div className="text-2xl font-bold text-text1 font-mono">{value}</div>
              <div className="text-xs text-text3 mt-0.5">{sub}</div>
              <div className="flex items-center gap-1 mt-2">
                {up ? <TrendingUp size={12} className="text-em-green" /> : <TrendingDown size={12} className="text-em-red" />}
                <span className={`text-xs font-medium ${up ? 'text-em-green' : 'text-em-red'}`}>{trend}</span>
              </div>
              <div className="text-xs text-text3 mt-0.5">{label}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Live Map */}
          <div className="md:col-span-2">
            <Card padding="none" className="overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <Navigation size={15} className="text-brand-mid" />
                  <span className="text-sm font-semibold text-text1">Live Fleet Map</span>
                  <Badge variant="success">18 Active</Badge>
                </div>
                <button onClick={() => navigate('/live-map')} className="text-xs text-brand-mid font-medium flex items-center gap-1 hover:underline">
                  Full Screen <ChevronRight size={12} />
                </button>
              </div>
              <div className="p-3">
                <MapPlaceholder />
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Smart Recommendations */}
            <Card padding="none">
              <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
                <Zap size={15} className="text-accent" />
                <span className="text-sm font-semibold text-text1">Smart Recommendations</span>
              </div>
              <div className="p-3 space-y-2">
                {recommendations.map(({ title, desc, action, icon: Icon, color, btnVariant }, i) => (
                  <div key={i} className={`${color} border rounded-2xl p-3`}>
                    <div className="flex items-start gap-2 mb-2">
                      <Icon size={14} className="text-current mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-text1 leading-snug">{title}</div>
                        <div className="text-xs text-text3 mt-0.5">{desc}</div>
                      </div>
                    </div>
                    <Button size="sm" variant={btnVariant} className="w-full text-xs rounded-lg">
                      {action}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Fleet Status */}
            <Card padding="none">
              <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                <span className="text-sm font-semibold text-text1">Fleet Status</span>
                <button onClick={() => navigate('/fleet')} className="text-xs text-brand-mid font-medium">View all</button>
              </div>
              <div className="divide-y divide-gray-50">
                {trucks.slice(0, 3).map(t => (
                  <div key={t.id} className="px-3 py-2 flex items-center gap-3 group cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => navigate('/fleet/' + t.id)}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                      t.status === 'Available' ? 'bg-em-green/10 text-em-green' :
                      t.status === 'On Trip' ? 'bg-brand/10 text-brand-mid' : 'bg-accent/10 text-accent'
                    }`}>
                      <Truck size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-black text-slate-800 leading-none">{t.id}</span>
                        <Badge variant={
                          t.status === 'Available' ? 'success' :
                          t.status === 'On Trip' ? 'default' : 'warning'
                        } className="text-[7px] px-1 py-0 h-auto font-black uppercase tracking-tighter">
                          {t.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 truncate leading-none">{t.load}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[8px] font-black uppercase text-slate-300 leading-none mb-0.5">ETA</div>
                      <div className="text-[10px] font-black text-slate-700 font-mono leading-none">{t.eta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Incoming Orders */}
        <Card padding="none">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Package size={15} className="text-brand-mid" />
              <span className="text-sm font-semibold text-text1">Incoming Orders</span>
              <Badge variant="warning">3 Need Decision</Badge>
            </div>
            <button onClick={() => navigate('/orders')} className="text-xs text-brand-mid font-medium flex items-center gap-1 ml-auto md:ml-0">
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {orders.map(order => (
              <div key={order.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => navigate('/orders/' + order.id)}>
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MapPin size={16} className="text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xs font-black text-slate-800 truncate leading-tight">{order.route}</h4>
                    {order.urgent && <Badge variant="danger" className="text-[7px] px-1 py-0 h-auto font-black animate-pulse">URGENT</Badge>}
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    <span>{order.id}</span>
                    <span>·</span>
                    <span>{order.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden xs:block">
                    <div className="text-[8px] font-black uppercase text-slate-300 leading-none mb-1">Status</div>
                    <Badge variant={
                      order.status === 'Awaiting Decision' ? 'warning' :
                      order.status === 'In Transit' ? 'success' : 'default'
                    } className="text-[8px] px-1.5 py-0 h-auto font-black uppercase tracking-tighter">
                      {order.status === 'Awaiting Decision' ? 'ANALYSING' : order.status.toUpperCase()}
                    </Badge>
                  </div>
                  {order.status === 'Awaiting Decision' && (
                    <Button 
                      size="sm" 
                      className="h-8 px-3 text-[10px] font-black uppercase tracking-widest rounded-lg bg-brand border-0 shadow-md shadow-brand/10" 
                      onClick={(e) => { e.stopPropagation(); navigate('/decision') }}
                    >
                      Analyse
                    </Button>
                  )}
                  <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
