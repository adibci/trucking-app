import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Plus, Search, MapPin, Truck, Clock, ChevronRight, Package, ArrowRight, Settings2 } from 'lucide-react'

const orders = [
  { id: 'ORD-441', route: 'Sydney CBD → Port Botany', pickup: '07:00 today', type: '13.6m Semi', status: 'Awaiting Decision', customer: 'Coles Logistics', distance: '24 km', urgent: true, category: 'shipment' },
  { id: 'POST-001', route: 'Melbourne → Sydney', pickup: '08:00 Tomorrow', type: 'B-Double (TRK-001)', status: 'Seeking Loads', customer: 'Private Fleet', distance: '880 km', urgent: false, category: 'posting', rate: '$1.85/km' },
  { id: 'ORD-440', route: 'Parramatta → Newcastle', pickup: '08:30 today', type: 'B-Double', status: 'Assigned', customer: 'Toll Group', distance: '165 km', urgent: false, category: 'shipment' },
  { id: 'POST-002', route: 'Brisbane → Townsville', pickup: 'Wed, 09:00', type: 'Tanker (TRK-017)', status: 'Available', customer: 'Private Fleet', distance: '1,350 km', urgent: false, category: 'posting', rate: '$2.15/km' },
  { id: 'ORD-439', route: 'Melbourne → Geelong', pickup: '06:00 today', type: 'Curtainsider', status: 'In Transit', customer: 'Woolworths Supply', distance: '75 km', urgent: false, category: 'shipment' },
  { id: 'ORD-438', route: 'Brisbane → Gold Coast', pickup: 'Tomorrow 09:00', type: 'Refrigerated', status: 'Scheduled', customer: 'Metcash', distance: '92 km', urgent: false, category: 'shipment' },
  { id: 'ORD-437', route: 'Adelaide → Port Augusta', pickup: 'Yesterday', type: 'Flatbed', status: 'Completed', customer: 'BlueScope Steel', distance: '310 km', urgent: false, category: 'shipment' },
  { id: 'ORD-436', route: 'Perth → Fremantle', pickup: 'Yesterday', type: 'Container', status: 'Completed', customer: 'DP World', distance: '22 km', urgent: false, category: 'shipment' },
]

const statusTabs = ['All Status', 'Awaiting Decision', 'Assigned', 'In Transit', 'Scheduled', 'Completed', 'Seeking Loads']

export default function OrderList() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('All')
  const [activeCategory, setActiveCategory] = useState<'All' | 'shipment' | 'posting'>('All')


  const [filters, setFilters] = useState({
    origin: '',
    dest: '',
    type: ''
  })

  const filtered = orders.filter(o => {
    const matchTab = activeTab === 'All' || o.status === activeTab
    const matchCategory = activeCategory === 'All' || o.category === activeCategory
    
    const route = o.route.toLowerCase()
    const type = o.type.toLowerCase()
    
    const matchOrigin = !filters.origin || route.split('→')[0].toLowerCase().includes(filters.origin.toLowerCase())
    const matchDest = !filters.dest || (route.split('→')[1] || '').toLowerCase().includes(filters.dest.toLowerCase())
    const matchType = !filters.type || type.includes(filters.type.toLowerCase())
    
    return matchTab && matchCategory && matchOrigin && matchDest && matchType
  })

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <TopBar title="Orders & Postings" subtitle={`${orders.length} total entries`} />
      
      {/* Sticky Combined Navigation Controls */}
      <div className="sticky top-14 md:top-16 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-3 py-2 sm:px-6 sm:py-3 transition-all duration-200">
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-3">
          {/* Mobile-only Search Bar at Top */}
          <div className="lg:hidden flex items-center bg-white border border-gray-200 rounded-xl shadow-sm focus-within:border-brand-mid transition-all">
            <div className="flex items-center gap-2 px-3 py-2 border-r border-gray-100 flex-1">
              <MapPin size={13} className="text-slate-300" />
              <input
                className="text-[11px] text-text1 outline-none bg-transparent w-full placeholder:text-slate-400 font-bold"
                placeholder="Departure"
                value={filters.origin}
                onChange={e => setFilters({...filters, origin: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 flex-1">
              <ArrowRight size={13} className="text-slate-300" />
              <input
                className="text-[11px] text-text1 outline-none bg-transparent w-full placeholder:text-slate-400 font-bold"
                placeholder="Destination"
                value={filters.dest}
                onChange={e => setFilters({...filters, dest: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 w-full">
            {/* Category Switcher - Buttons */}
            <div className="flex-1 min-w-0">
              <div className="flex bg-gray-200/50 p-0.5 rounded-lg text-[9px] sm:text-xs font-bold gap-0.5 w-full">
                <button 
                  onClick={() => setActiveCategory('All')}
                  className={`flex-1 px-1.5 py-1 rounded-md transition-all whitespace-nowrap text-center ${activeCategory === 'All' ? 'bg-white text-brand shadow-sm' : 'text-text3 hover:text-text2'}`}
                >
                  All Entries
                </button>
                <button 
                  onClick={() => setActiveCategory('shipment')}
                  className={`flex-1 px-1.5 py-1 rounded-md transition-all flex items-center justify-center gap-1 whitespace-nowrap ${activeCategory === 'shipment' ? 'bg-white text-brand shadow-sm' : 'text-text3 hover:text-text2'}`}
                >
                  <Package size={12} className="shrink-0" /> <span className="truncate">Shipments</span>
                </button>
                <button 
                  onClick={() => setActiveCategory('posting')}
                  className={`flex-1 px-1.5 py-1 rounded-md transition-all flex items-center justify-center gap-1 whitespace-nowrap ${activeCategory === 'posting' ? 'bg-white text-brand shadow-sm' : 'text-text3 hover:text-text2'}`}
                >
                  <Truck size={12} className="shrink-0" /> <span className="truncate">Fleet Posts</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 h-[28px] sm:h-10 w-max">
              <button
                 onClick={() => navigate('/orders/create')}
                 className="flex items-center justify-center gap-1.5 shrink-0 bg-brand text-white rounded-lg font-bold text-[10px] sm:text-xs active:scale-95 transition-all px-2.5 h-full shadow-lg shadow-brand/10"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">New Order</span>
              </button>
            </div>
          </div>

          {/* Status Tabs Bar */}
          <div className="w-full py-0.5 sm:py-1">
            <div className="flex flex-wrap gap-1 w-full">
              {statusTabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2 py-1 rounded-md text-[9px] font-bold border transition-all ${
                    activeTab === tab 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                      : 'bg-white border-gray-200 text-text3 hover:border-gray-300'
                  }`}
                >
                  {tab}
                  {tab !== 'All' && (
                    <span className={`ml-1 opacity-60 font-mono ${activeTab === tab ? 'text-white' : 'text-brand'}`}>
                      {orders.filter(o => o.status === tab).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Overlays */}
        <div className="relative max-w-6xl mx-auto w-full">


        </div>
      </div>

      <div className="flex-1 p-3 sm:p-6 lg:max-w-6xl lg:mx-auto w-full">

        {/* Orders grid */}
        <div className="grid gap-3">
          {filtered.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <Search size={24} className="text-gray-300" />
               </div>
               <h3 className="text-sm font-bold text-slate-800">No matches found</h3>
               <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search terms</p>
            </div>
          ) : filtered.map(order => {
            const isPosting = order.category === 'posting'
            
            return (
              <Card
                key={order.id}
                padding="none"
                className={`hover:shadow-lg transition-all border-l-4 overflow-hidden group ${
                  isPosting ? 'border-brand' : order.urgent ? 'border-em-red' : 'border-brand-mid'
                }`}
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div className="p-3 md:p-4">
                  <div className="flex flex-col gap-3">
                    {/* Top Row: Icon, Route, ID */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-sm transition-transform group-hover:scale-105 ${
                          isPosting ? 'bg-brand/5 border-brand/10 text-brand' : 'bg-cyan-50 border-cyan-100 text-cyan-600'
                        }`}>
                          {isPosting ? <Truck size={18} /> : <Package size={18} />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-black text-slate-800 text-sm md:text-base leading-tight truncate">{order.route}</h3>
                            {order.urgent && <Badge variant="danger" className="text-[8px] px-1 py-0 h-auto font-black animate-pulse">URGENT</Badge>}
                          </div>
                          <div className="flex items-center gap-2 leading-none">
                            <span className="text-[10px] font-black text-slate-400 font-mono tracking-tight">{order.id}</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">· {isPosting ? 'Fleet Post' : 'Shipment'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant={
                          order.status === 'Awaiting Decision' ? 'warning' :
                          order.status === 'Completed' ? 'outline' :
                          order.status === 'Seeking Loads' ? 'default' : 'info'
                        } className="font-black text-[8px] border-0 px-2 py-0.5 tracking-widest shadow-sm">
                          {order.status === 'Awaiting Decision' ? 'REVIEWING' : order.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* Middle Row: Details Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-100 flex items-center gap-2">
                        <Clock size={12} className="text-slate-300 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">{isPosting ? 'Available' : 'Pickup'}</div>
                          <div className="text-[10px] font-bold text-slate-700 truncate">{order.pickup}</div>
                        </div>
                      </div>
                      <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-100 flex items-center gap-2">
                        <Truck size={12} className="text-slate-300 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Vehicle</div>
                          <div className="text-[10px] font-bold text-slate-700 truncate">{isPosting ? order.type.split('(')[0].trim() : order.type}</div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Customer & Action */}
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">{isPosting ? 'Target Rate' : 'Customer'}</div>
                          <div className={`text-[11px] font-black leading-none ${isPosting ? 'text-brand font-mono' : 'text-slate-700'}`}>{isPosting ? order.rate : order.customer}</div>
                        </div>
                        <div className="w-px h-6 bg-slate-100" />
                        <div>
                          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Distance</div>
                          <div className="text-[11px] font-black text-slate-700 leading-none">{order.distance}</div>
                        </div>
                      </div>
                      <div className="text-slate-300 group-hover:text-brand transition-colors">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                {isPosting && (
                  <div className="bg-brand/5 px-4 py-1.5 border-t border-brand/5 flex items-center justify-between">
                     <span className="text-[8px] font-black text-brand uppercase tracking-[0.2em]">Global Visibility Active</span>
                     <button className="text-[8px] font-black text-brand hover:underline flex items-center gap-1 uppercase tracking-widest">
                        Edit <Settings2 size={10} />
                     </button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Calendar({ size, className }: { size: number, className: string }) {
    return <Clock size={size} className={className} />
}
