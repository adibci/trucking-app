import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Plus, Search, Filter, MapPin, Truck, Clock, ChevronRight, Package, ArrowRight, Settings2 } from 'lucide-react'

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

const statusTabs = ['All', 'Awaiting Decision', 'Assigned', 'In Transit', 'Scheduled', 'Completed', 'Seeking Loads']

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
      <div className="flex-1 p-4 md:p-6 lg:max-w-6xl lg:mx-auto w-full">
        {/* Unified Navigation Row */}
        <div className="flex items-center gap-3 mb-5 overflow-x-auto no-scrollbar pb-1">
          {/* Category Switcher */}
          <div className="flex bg-gray-200/50 p-1 rounded-xl shrink-0 gap-1">
            <button 
              onClick={() => setActiveCategory('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeCategory === 'All' ? 'bg-white text-brand shadow-sm' : 'text-text3 hover:text-text2'}`}
            >
              All Entries
            </button>
            <button 
              onClick={() => setActiveCategory('shipment')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${activeCategory === 'shipment' ? 'bg-white text-brand shadow-sm' : 'text-text3 hover:text-text2'}`}
            >
              <Package size={14} /> Shipments
            </button>
            <button 
              onClick={() => setActiveCategory('posting')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${activeCategory === 'posting' ? 'bg-white text-brand shadow-sm' : 'text-text3 hover:text-text2'}`}
            >
              <Truck size={14} /> Fleet Posts
            </button>
          </div>

          {/* Advanced Multi-Input Filter Row */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm focus-within:border-brand-mid transition-colors flex-1 min-w-[450px]">
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
                placeholder={activeCategory === 'posting' ? "Truck Type" : "Good Type"}
                value={filters.type}
                onChange={e => setFilters({...filters, type: e.target.value})}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-[11px] text-text2 font-bold hover:bg-gray-50 transition-colors shadow-sm self-stretch">
              <Filter size={13} /> Filter
            </button>

            <button
              onClick={() => navigate('/orders/create')}
              className="flex items-center justify-center gap-1.5 shrink-0 bg-brand text-white rounded-xl font-bold text-xs active:scale-95 transition-all px-3 py-1.5 shadow-lg shadow-brand/10 self-stretch"
            >
              <Plus size={16} />
              <span className="hidden md:inline">Create New</span>
            </button>
          </div>
        </div>

        {/* Status tabs */}
        <div className="mb-5 overflow-x-auto no-scrollbar">
          <div className="flex gap-1 w-max">
            {statusTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                  activeTab === tab 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                    : 'bg-white border-gray-200 text-text3 hover:border-gray-300'
                }`}
              >
                {tab}
                {tab !== 'All' && (
                  <span className={`ml-1.5 opacity-60 font-mono ${activeTab === tab ? 'text-white' : 'text-brand'}`}>
                    {orders.filter(o => o.status === tab).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

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
                className={`group cursor-pointer hover:shadow-xl transition-all border-l-4 overflow-hidden ${
                  isPosting ? 'border-l-brand' : order.urgent ? 'border-l-em-red' : 'border-l-brand-mid'
                }`}
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                {/* Unified Desktop & Mobile Layout */}
                <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
                  
                  {/* Left: icon & Type */}
                  <div className="flex items-center gap-3 md:w-48 shrink-0">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm transition-transform group-hover:scale-105 ${
                      isPosting ? 'bg-brand/5 border-brand/10 text-brand' : 'bg-cyan-50 border-cyan-100 text-cyan-600'
                    }`}>
                      {isPosting ? <Truck size={20} /> : <Package size={20} />}
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-text3 mb-0.5">
                            {isPosting ? 'Back Log Post' : 'Direct Shipment'}
                        </div>
                        <div className="text-xs font-mono font-bold text-text1">{order.id}</div>
                    </div>
                  </div>

                  {/* Middle: Route Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[13px] font-bold text-slate-800 mb-2">
                       {order.route}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Calendar size={12} className="text-slate-300" />
                        <span className="text-slate-600">{isPosting ? 'Ready: ' : 'Pickup: '}{order.pickup}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <Truck size={12} className="text-slate-300" />
                        <span className="text-slate-600">
                          {isPosting ? order.type.split('(')[0].trim() : order.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <MapPin size={12} className="text-slate-300" />
                        <span className="text-slate-600">{order.distance}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Reward/Customer & Status */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 md:min-w-[140px] pt-3 md:pt-0 border-t md:border-0 border-gray-50">
                    <div className="text-right">
                       <div className="text-[10px] font-black uppercase text-slate-400 mb-0.5">
                         {isPosting ? 'Target Rate' : 'Customer'}
                       </div>
                       <div className={`text-xs font-bold leading-tight ${isPosting ? 'text-brand' : 'text-slate-800'}`}>
                         {isPosting ? order.rate : order.customer}
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Badge variant={
                        order.status === 'Awaiting Decision' ? 'warning' :
                        order.status === 'In Transit' ? 'success' :
                        order.status === 'Completed' ? 'outline' :
                        order.status === 'Seeking Loads' ? 'default' : 'info'
                        } size="sm" className="font-bold border-0 h-6">
                        {order.status === 'Awaiting Decision' ? 'Reviewing' : order.status}
                        </Badge>
                        <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

                {isPosting && (
                  <div className="bg-brand/5 px-5 py-2 border-t border-brand/5 flex items-center justify-between">
                     <span className="text-[10px] font-bold text-brand uppercase tracking-widest">Global Visibility Active</span>
                     <button className="text-[10px] font-bold text-brand hover:underline flex items-center gap-1">
                        Edit Terms <Settings2 size={10} />
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
