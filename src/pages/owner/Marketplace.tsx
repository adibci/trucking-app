import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Radio, Star, Clock, MapPin, Truck, ChevronRight, TrendingDown, TrendingUp, Package, ShieldCheck, Box, Zap, Search, Settings2, FileText, DollarSign, ArrowRight, Filter } from 'lucide-react'

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
  const [isExchangeOpen, setIsExchangeOpen] = useState(false)
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
      <TopBar title="Network Exchange" subtitle="Real-time logistics network" />
      
      {/* Sticky Combined Navigation Controls */}
      <div className="sticky top-14 md:top-16 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-3 py-2 sm:px-6 sm:py-3 transition-all duration-200">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-2">
          {/* Unified Exchange Switcher Row */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 sm:gap-4 w-full">
            {/* Unified Exchange Switcher - Dropdown on Mobile */}
            <div className="sm:hidden relative w-full">
              <button 
                onClick={() => setIsExchangeOpen(!isExchangeOpen)}
                className="flex items-center justify-between w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 shadow-sm h-10"
              >
                <span className="flex items-center gap-2">
                  {exchangeType === 'trucks' ? <Truck size={14} className="text-brand" /> : exchangeType === 'loads' ? <Box size={14} className="text-brand" /> : <DollarSign size={14} className="text-brand" />}
                  {exchangeType === 'trucks' ? 'Find Trucks' : exchangeType === 'loads' ? 'Find Loads' : 'My Bids Exchange'}
                </span>
                <ChevronRight size={14} className={`transition-transform ${isExchangeOpen ? '-rotate-90' : 'rotate-90'}`} />
              </button>
              
              {isExchangeOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsExchangeOpen(false)} />
                  <div className="absolute top-12 left-0 right-0 z-50 bg-white border border-gray-100 rounded-2xl shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-200">
                    <button 
                      onClick={() => { setExchangeType('trucks'); setIsExchangeOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${exchangeType === 'trucks' ? 'bg-brand/5 text-brand' : 'text-text3 hover:bg-gray-50'}`}
                    >
                      <Truck size={14} /> Find Trucks
                    </button>
                    <button 
                      onClick={() => { setExchangeType('loads'); setIsExchangeOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${exchangeType === 'loads' ? 'bg-brand/5 text-brand' : 'text-text3 hover:bg-gray-50'}`}
                    >
                      <Box size={14} /> Find Loads
                    </button>
                    <button 
                      onClick={() => { setExchangeType('bids'); setIsExchangeOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${exchangeType === 'bids' ? 'bg-brand/5 text-brand' : 'text-text3 hover:bg-gray-50'}`}
                    >
                      <DollarSign size={14} /> My Bids
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Desktop Switcher */}
            <div className="hidden sm:flex bg-gray-200/50 p-1 rounded-xl shrink-0 gap-1">
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

            {/* Advanced Multi-Input Filter Row */}
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

            {/* Mobile Filter Toggle */}
            <div className="sm:hidden flex gap-2">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1 shadow-sm focus-within:border-brand-mid transition-colors h-10">
                <Search size={14} className="text-slate-300 shrink-0" />
                <input
                  className="text-xs text-text1 outline-none bg-transparent flex-1 placeholder:text-text3 font-bold"
                  placeholder="ID / Route..."
                  value={filters.origin}
                  onChange={e => setFilters({...filters, origin: e.target.value})}
                />
              </div>
              <button
                className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-text3 shadow-sm active:scale-95 transition-all"
              >
                <Filter size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-3 sm:p-6 lg:max-w-7xl lg:mx-auto w-full">

        {/* Exchange Grid */}
        <div className="grid gap-4">
          
          {/* ─── INCOMING BIDS ────────────────────────────────────────────────── */}
          {exchangeType === 'bids' && INCOMING_BIDS.filter(filterItem).map(bid => (
            <Card key={bid.id} className="hover:shadow-lg transition-all border-l-4 border-amber-400 overflow-hidden group" padding="none">
              <div className="p-3 md:p-4">
                <div className="flex flex-col gap-3">
                  {/* Top Row: Route & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-slate-400 font-mono">#{bid.order}</span>
                        <Badge variant="warning" className="text-[9px] px-1.5 py-0 h-auto font-black uppercase tracking-widest">{bid.timeLeft} LEFT</Badge>
                      </div>
                      <h3 className="font-black text-slate-800 text-sm md:text-base leading-tight truncate">{bid.route}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[9px] font-black uppercase text-slate-400 leading-none mb-1">Bid Amount</div>
                      <div className="text-lg font-black text-slate-800 font-mono leading-none">${bid.price}</div>
                    </div>
                  </div>

                  {/* Middle Row: Partner Info */}
                  <div className="flex items-center justify-between bg-slate-50/80 rounded-xl p-2 border border-slate-100">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-sm shadow-brand/20">
                        {bid.company.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-700 truncate">{bid.company}</span>
                          {bid.trusted && <ShieldCheck size={12} className="text-emerald-500 shrink-0" />}
                        </div>
                        <div className="flex items-center gap-1 leading-none">
                          <Star size={10} className="text-amber-400 fill-amber-400" />
                          <span className="text-[10px] font-bold text-slate-400">{bid.rating} · {bid.jobs} jobs</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 px-2 border-l border-slate-200">
                      <div className="text-[9px] font-black uppercase text-slate-400 leading-none mb-1">Comm.</div>
                      <div className="text-xs font-bold text-slate-700 leading-none">${bid.commission}</div>
                    </div>
                  </div>

                  {/* Bottom Row: Actions */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 font-black text-[10px] uppercase tracking-widest h-9 rounded-xl border-slate-200" 
                      onClick={() => navigate('/marketplace/bid-detail')}
                    >
                      Analyze
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 font-black text-[10px] uppercase tracking-widest h-9 rounded-xl bg-slate-900 border-0 shadow-md shadow-slate-200"
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* ─── MARKET LOADS (Goods) ────────────────────────────────────────── */}
          {exchangeType === 'loads' && MARKET_LOADS.filter(filterItem).map(load => (
            <Card key={load.id} className={`hover:shadow-lg transition-all border-l-4 overflow-hidden group ${load.urgent ? 'border-em-red' : 'border-cyan-400'}`} padding="none">
              <div className="p-3 md:p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${load.urgent ? 'bg-em-red/5 text-em-red' : 'bg-cyan-50 text-cyan-600'}`}>
                        <Package size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-black text-slate-800 text-sm md:text-base leading-tight truncate">{load.route}</h3>
                          {load.urgent && <Badge variant="danger" className="text-[8px] px-1 py-0 h-auto font-black animate-pulse">URGENT</Badge>}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{load.company}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[9px] font-black uppercase text-slate-400 leading-none mb-1">Budget</div>
                      <div className="text-lg font-black text-cyan-600 font-mono leading-none">{load.rate}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-100 flex items-center gap-2">
                      <Box size={12} className="text-slate-300 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Cargo</div>
                        <div className="text-[10px] font-bold text-slate-700 truncate">{load.type} · {load.weight}</div>
                      </div>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-100 flex items-center gap-2">
                      <Clock size={12} className="text-slate-300 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Pickup</div>
                        <div className="text-[10px] font-bold text-slate-700 truncate">{load.pickup}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex gap-1 overflow-x-auto no-scrollbar">
                      {load.reqs.map(r => (
                        <span key={r} className="px-1.5 py-0.5 bg-slate-100 text-[8px] font-black uppercase text-slate-500 rounded tracking-widest whitespace-nowrap">{r}</span>
                      ))}
                    </div>
                    <Button size="sm" className="shrink-0 font-black text-[10px] uppercase tracking-widest h-8 px-4 rounded-xl bg-cyan-600 border-0 shadow-md shadow-cyan-100 flex items-center gap-1.5">
                      Bid <ArrowRight size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* ─── MARKET TRUCKS (Empty Miles) ─────────────────────────────────── */}
          {exchangeType === 'trucks' && MARKET_TRUCKS.filter(filterItem).map(trk => (
            <Card key={trk.id} className="hover:shadow-lg transition-all border-l-4 border-brand-mid overflow-hidden group" padding="none">
              <div className="p-3 md:p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-brand/5 border border-brand/10 flex items-center justify-center shrink-0">
                        <Truck size={18} className="text-brand" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-black text-slate-800 text-sm md:text-base leading-tight truncate">{trk.route}</h3>
                          <span className="text-[8px] font-black uppercase text-brand/60 px-1.5 py-0 rounded border border-brand/10 tracking-widest whitespace-nowrap">BACK LOG</span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{trk.company}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[9px] font-black uppercase text-slate-400 leading-none mb-1">Rating</div>
                      <div className="flex items-center justify-end gap-1 leading-none">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-sm font-black text-slate-800 font-mono">{trk.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-100 flex items-center gap-2">
                      <Zap size={12} className="text-slate-300 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Vehicle</div>
                        <div className="text-[10px] font-bold text-slate-700 truncate">{trk.vehicle} · {trk.space}</div>
                      </div>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-100 flex items-center gap-2">
                      <Clock size={12} className="text-slate-300 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Available</div>
                        <div className="text-[10px] font-bold text-slate-700 truncate">{trk.availability}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex gap-1 overflow-x-auto no-scrollbar">
                      {trk.certs.map(c => (
                        <span key={c} className="px-1.5 py-0.5 bg-brand/5 text-[8px] font-black uppercase text-brand rounded tracking-widest whitespace-nowrap italic flex items-center gap-1">
                          <ShieldCheck size={9} /> {c}
                        </span>
                      ))}
                    </div>
                    <Button size="sm" className="shrink-0 font-black text-[10px] uppercase tracking-widest h-8 px-4 rounded-xl bg-brand border-0 shadow-md shadow-brand/20 flex items-center gap-1.5">
                      Book <ArrowRight size={12} />
                    </Button>
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
