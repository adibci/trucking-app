import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Radio, Star, Clock, MapPin, Truck, ChevronRight, TrendingDown, TrendingUp, Package, ShieldCheck, Box, Zap, Search, Settings2, FileText, DollarSign, ArrowRight } from 'lucide-react'

// 1. Incoming Bids (Bids from others on YOUR broadcasts)
const INCOMING_BIDS = [
  { id: 'BID-001', order: 'ORD-441', route: 'Sydney CBD → Port Botany', company: 'FastHaul Pty Ltd', price: 650, commission: 120, eta: '25 min', rating: 4.8, jobs: 142, trusted: true, timeLeft: '23 min', status: 'Awaiting Selection' },
  { id: 'BID-002', order: 'ORD-441', route: 'Sydney CBD → Port Botany', company: 'Prime Freight AU', price: 720, commission: 80, eta: '31 min', rating: 4.6, jobs: 89, trusted: false, timeLeft: '23 min', status: 'Awaiting Selection' },
  { id: 'BID-003', order: 'ORD-438', route: 'Brisbane → Gold Coast', company: 'SunState Haulage', price: 480, commission: 95, eta: '18 min', rating: 4.9, jobs: 204, trusted: true, timeLeft: '41 min', status: 'Awaiting Selection' },
]

// 2. Open Loads (Goods from others looking for YOUR trucks)
const MARKET_LOADS = [
  { id: 'LD-902', company: 'Global Retailers', route: 'Melbourne → Adelaide', type: 'General Freight', weight: '24 Tons', rate: '$3,850', pickup: 'Tomorrow AM', rating: 4.5, urgent: true, reqs: ['Curtainsider', 'Tail-lift'] },
  { id: 'LD-881', company: 'AgriCorp Australia', route: 'Wagga Wagga → Sydney', type: 'Grain', weight: '22 Tons', rate: '$1,900', pickup: '23 Apr', rating: 4.7, urgent: false, reqs: ['B-Double', 'Tipper'] },
  { id: 'LD-950', company: 'Industrial Spares', route: 'Newcastle → Brisbane', type: 'Machinery', weight: '8 Tons', rate: '$2,400', pickup: 'Now', rating: 4.9, urgent: true, reqs: ['Flatbed', 'Oversized'] },
]

// 3. Open Trucks (Back Logs from others where YOU can put your goods)
const MARKET_TRUCKS = [
  { id: 'TRK-XP-01', company: 'Express Movers', vehicle: 'B-Double', route: 'Sydney → Melbourne', availability: 'Now', rating: 4.8, certs: ['DG', 'MSIC', 'Fatigue Mgmt'], trusted: true, space: '34 Pallets' },
  { id: 'TRK-XP-09', company: 'Coastal Logistics', vehicle: 'Refrigerated', route: 'Brisbane → Cairns', availability: '24 Apr', rating: 4.6, certs: ['Food Grade', 'SLP'], trusted: true, space: '22 Pallets' },
  { id: 'TRK-XP-04', company: 'Interstate Bulk', vehicle: 'Semi-Trailer', route: 'Perth → Adelaide', availability: 'Tomorrow', rating: 4.3, certs: ['HC License', 'White Card'], trusted: false, space: '26 Tons' },
]

export default function Marketplace() {
  const navigate = useNavigate()
  const [exchangeType, setExchangeType] = useState<'trucks' | 'loads' | 'bids'>('trucks')
  const [filters, setFilters] = useState({
    origin: '',
    dest: '',
    type: ''
  })

  // Filter Logic
  const filterItem = (item: any) => {
    const route = item.route?.toLowerCase() || ''
    const type = (item.type || item.vehicle || '').toLowerCase()
    
    const matchOrigin = !filters.origin || route.split('→')[0].toLowerCase().includes(filters.origin.toLowerCase())
    const matchDest = !filters.dest || (route.split('→')[1] || '').toLowerCase().includes(filters.dest.toLowerCase())
    const matchType = !filters.type || type.includes(filters.type.toLowerCase())
    
    return matchOrigin && matchDest && matchType
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <TopBar title="Marketplace Exchange" subtitle="Real-time logistics marketplace" />
      
      <div className="flex-1 p-4 md:p-6 lg:max-w-7xl lg:mx-auto w-full">
        
        {/* Market Stats (Summary) */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Market Loads', value: '42', icon: <Package size={16} />, color: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
            { label: 'Available Trucks', value: '18', icon: <Truck size={16} />, color: 'bg-brand/5 text-brand border-brand/10' },
            { label: 'Current Bids', value: '5', icon: <DollarSign size={16} />, color: 'bg-amber-50 text-amber-600 border-amber-100' },
            { label: 'Partners Active', value: '124', icon: <Zap size={16} />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
          ].map(({ label, value, icon, color }) => (
            <Card key={label} padding="none" className="p-4 border shadow-sm">
               <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${color}`}>
                    {icon}
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-800 leading-none">{value}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</div>
                  </div>
               </div>
            </Card>
          ))}
        </div> */}

        {/* Unified Exchange Switcher */}
        {/* Unified Exchange Switcher Row */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex bg-gray-200/50 p-1 rounded-xl shrink-0 gap-1 w-max overflow-x-auto no-scrollbar">
            <button
              onClick={() => setExchangeType('trucks')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${exchangeType === 'trucks' ? 'bg-white text-brand shadow-sm' : 'text-text3 hover:text-text2'}`}
            >
              <Truck size={14} /> Find Trucks
            </button>
            <button
              onClick={() => setExchangeType('loads')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${exchangeType === 'loads' ? 'bg-white text-brand shadow-sm' : 'text-text3 hover:text-text2'}`}
            >
              <Box size={14} /> Find Loads
            </button>
            <button
              onClick={() => setExchangeType('bids')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${exchangeType === 'bids' ? 'bg-white text-brand shadow-sm' : 'text-text3 hover:text-text2'}`}
            >
              <DollarSign size={14} /> My Bids
            </button>
          </div>

          {/* Advanced Multi-Input Filter Row - Hidden on mobile */}
          <div className="hidden lg:flex items-center bg-white border border-gray-200 rounded-xl shadow-sm focus-within:border-brand-mid transition-colors flex-1 min-w-[500px]">
            <div className="flex items-center gap-2 px-3 py-1.5 border-r border-gray-100 flex-1">
              <MapPin size={13} className="text-slate-300" />
              <input
                className="text-xs text-text1 outline-none bg-transparent w-full placeholder:text-text3 font-medium"
                placeholder="Departure"
                value={filters.origin}
                onChange={e => setFilters({...filters, origin: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 border-r border-gray-100 flex-1">
              <ArrowRight size={13} className="text-slate-300" />
              <input
                className="text-xs text-text1 outline-none bg-transparent w-full placeholder:text-text3 font-medium"
                placeholder="Destination"
                value={filters.dest}
                onChange={e => setFilters({...filters, dest: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 flex-1">
              <Settings2 size={13} className="text-slate-300" />
              <input
                className="text-xs text-text1 outline-none bg-transparent w-full placeholder:text-text3 font-medium"
                placeholder={exchangeType === 'trucks' ? "Truck Type" : "Good Type"}
                value={filters.type}
                onChange={e => setFilters({...filters, type: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Exchange Grid */}
        <div className="grid gap-4">
          
          {/* ─── INCOMING BIDS ────────────────────────────────────────────────── */}
          {exchangeType === 'bids' && INCOMING_BIDS.filter(filterItem).map(bid => (
            <Card key={bid.id} className="hover:shadow-md transition-all border-l-4 border-l-amber-400 overflow-hidden" padding="none">
              <div className="p-4 md:p-5 flex flex-col md:flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="warning" className="font-bold border-0"><Clock size={11} className="mr-1" /> {bid.timeLeft} left</Badge>
                    <span className="text-xs font-mono font-bold text-slate-400">Ref: {bid.order}</span>
                  </div>
                  <div className="text-base font-bold text-slate-800 flex items-center gap-2 mb-3">
                    <MapPin size={16} className="text-slate-300" /> {bid.route}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-lg shadow-brand/20">
                      {bid.company.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        {bid.company}
                        {bid.trusted && <ShieldCheck size={14} className="text-emerald-500" />}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{bid.rating} · {bid.jobs} jobs completed</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:w-px md:bg-gray-100 hidden md:block" />

                <div className="md:w-[240px] shrink-0 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                     <div className="text-right flex-1">
                        <div className="text-[10px] font-black uppercase text-slate-400 mb-0.5">Bid Amount</div>
                        <div className="text-2xl font-black text-slate-800 font-mono">${bid.price}</div>
                     </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 font-bold text-xs rounded-xl" onClick={() => navigate('/marketplace/bid-detail')}>Details</Button>
                    <Button size="sm" className="flex-1 font-bold text-xs rounded-xl bg-slate-900 border-0 shadow-lg shadow-slate-200">Accept</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* ─── MARKET LOADS (Goods) ────────────────────────────────────────── */}
          {exchangeType === 'loads' && MARKET_LOADS.filter(filterItem).map(load => (
            <Card key={load.id} className={`hover:shadow-md transition-all border-l-4 overflow-hidden ${load.urgent ? 'border-l-em-red' : 'border-l-cyan-400'}`} padding="none">
              <div className="p-4 md:p-5 flex flex-col md:flex-row gap-4 items-center">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0">
                  <Package size={22} className="text-cyan-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="text-sm font-black text-slate-800">{load.route}</div>
                    {load.urgent && <Badge variant="danger" className="animate-pulse">URGENT</Badge>}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                       <Box size={12} className="text-slate-300" /> {load.type} · {load.weight}
                    </div>
                    <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                       <Clock size={12} className="text-slate-300" /> {load.pickup}
                    </div>
                  </div>
                  <div className="flex gap-1.5 mt-2.5">
                    {load.reqs.map(r => (
                      <span key={r} className="px-2 py-0.5 bg-gray-100 text-[9px] font-black uppercase text-slate-500 rounded-md tracking-widest">{r}</span>
                    ))}
                  </div>
                </div>

                <div className="md:w-[180px] shrink-0 text-right">
                   <div className="text-[10px] font-black uppercase text-slate-400 mb-0.5">Budget Rate</div>
                   <div className="text-xl font-black text-cyan-600 font-mono mb-3">{load.rate}</div>
                   <Button size="sm" className="w-full font-bold text-xs rounded-xl bg-cyan-600 border-0 shadow-lg shadow-cyan-100 flex items-center justify-center gap-2 group">
                      Place Bid <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                   </Button>
                </div>
              </div>
            </Card>
          ))}

          {/* ─── MARKET TRUCKS (Empty Miles) ─────────────────────────────────── */}
          {exchangeType === 'trucks' && MARKET_TRUCKS.filter(filterItem).map(trk => (
            <Card key={trk.id} className="hover:shadow-md transition-all border-l-4 border-l-brand-mid overflow-hidden" padding="none">
              <div className="p-4 md:p-5 flex flex-col md:flex-row gap-4 items-center">
                <div className="w-12 h-12 rounded-2xl bg-brand/5 border border-brand/10 flex items-center justify-center shrink-0">
                  <Truck size={22} className="text-brand" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="text-sm font-black text-slate-800">{trk.route}</div>
                    <div className="text-[10px] font-black uppercase text-slate-300 px-2 py-0.5 rounded-lg border border-slate-100 tracking-widest">Back Log</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                       <Zap size={12} className="text-slate-300" /> {trk.vehicle} · {trk.space}
                    </div>
                    <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                       <Clock size={12} className="text-slate-300" /> Ready {trk.availability}
                    </div>
                  </div>
                  <div className="flex gap-1.5 mt-2.5">
                    {trk.certs.map(c => (
                      <span key={c} className="px-2 py-0.5 bg-brand/5 text-[9px] font-black uppercase text-brand rounded-md tracking-widest flex items-center gap-1 italic">
                        <ShieldCheck size={9} /> {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:w-[180px] shrink-0 text-right">
                   <div className="text-[10px] font-black uppercase text-slate-400 mb-0.5">Partner Rating</div>
                   <div className="flex items-center justify-end gap-1 mb-3">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="text-sm font-black text-slate-800">{trk.rating}</span>
                      <span className="text-[10px] text-slate-400 font-bold ml-1">Excellent</span>
                   </div>
                   <Button size="sm" className="w-full font-bold text-xs rounded-xl bg-brand border-0 shadow-lg shadow-brand/20 flex items-center justify-center gap-2 group">
                      Contact Truck <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                   </Button>
                </div>
              </div>
            </Card>
          ))}

        </div>

      </div>
    </div>
  )
}
