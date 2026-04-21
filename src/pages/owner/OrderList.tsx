import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Plus, Search, Filter, MapPin, Truck, Clock, ChevronRight, Package } from 'lucide-react'

const orders = [
  { id: 'ORD-441', route: 'Sydney CBD → Port Botany', pickup: '07:00 today', type: '13.6m Semi', status: 'Awaiting Decision', customer: 'Coles Logistics', distance: '24 km', urgent: true },
  { id: 'ORD-440', route: 'Parramatta → Newcastle', pickup: '08:30 today', type: 'B-Double', status: 'Assigned', customer: 'Toll Group', distance: '165 km', urgent: false },
  { id: 'ORD-439', route: 'Melbourne → Geelong', pickup: '06:00 today', type: 'Curtainsider', status: 'In Transit', customer: 'Woolworths Supply', distance: '75 km', urgent: false },
  { id: 'ORD-438', route: 'Brisbane → Gold Coast', pickup: 'Tomorrow 09:00', type: 'Refrigerated', status: 'Scheduled', customer: 'Metcash', distance: '92 km', urgent: false },
  { id: 'ORD-437', route: 'Adelaide → Port Augusta', pickup: 'Yesterday', type: 'Flatbed', status: 'Completed', customer: 'BlueScope Steel', distance: '310 km', urgent: false },
  { id: 'ORD-436', route: 'Perth → Fremantle', pickup: 'Yesterday', type: 'Container', status: 'Completed', customer: 'DP World', distance: '22 km', urgent: false },
]

const statusTabs = ['All', 'Awaiting Decision', 'Assigned', 'In Transit', 'Scheduled', 'Completed']

export default function OrderList() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = orders.filter(o => {
    const matchTab = activeTab === 'All' || o.status === activeTab
    const matchSearch = o.route.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Orders" subtitle={`${orders.length} total orders`} />
      <div className="flex-1 p-4 md:p-6">
        {/* Header actions */}
        <div className="flex items-center gap-2 mb-5 md:justify-between">
          {/* Search bar */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex-1 md:flex-none md:w-72">
            <Search size={15} className="text-text3 shrink-0" />
            <input
              className="text-sm text-text1 outline-none bg-transparent flex-1 placeholder:text-text3 min-w-0"
              placeholder="Search orders..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filter — hidden on mobile to save space */}
          <button className="hidden md:flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-text2 shrink-0">
            <Filter size={14} /> Filter
          </button>

          {/* Create Order: icon-only on mobile, full text on desktop */}
          <button
            onClick={() => navigate('/orders/create')}
            className="flex items-center justify-center gap-1.5 shrink-0 bg-brand text-white rounded-xl font-medium text-sm active:scale-95 transition-all px-3 py-2.5 md:px-4"
          >
            <Plus size={16} />
            <span className="hidden md:inline">Create Order</span>
          </button>
        </div>

        {/* Status tabs — horizontal scroll on mobile */}
        <div className="mb-5 overflow-x-auto pb-1">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-max">
            {statusTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === tab ? 'bg-white text-text1 shadow-sm' : 'text-text3 hover:text-text2'
                }`}
              >
                {tab}
                {tab !== 'All' && (
                  <span className="ml-1.5 text-xs">
                    ({orders.filter(o => o.status === tab).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders grid */}
        <div className="space-y-3">
          {filtered.map(order => (
            <Card
              key={order.id}
              className="cursor-pointer hover:shadow-md transition-all hover:border-brand-light"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              {/* Mobile layout */}
              <div className="flex items-center gap-3 md:hidden">
                {/* Left: icon */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  order.status === 'In Transit' ? 'bg-em-green-soft' :
                  order.status === 'Awaiting Decision' ? 'bg-accent-soft' :
                  order.status === 'Completed' ? 'bg-gray-100' : 'bg-brand-light'
                }`}>
                  <Package size={17} className={
                    order.status === 'In Transit' ? 'text-em-green' :
                    order.status === 'Awaiting Decision' ? 'text-accent' :
                    order.status === 'Completed' ? 'text-text3' : 'text-brand-mid'
                  } />
                </div>

                {/* Middle: info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-mono text-[10px] text-text3">{order.id}</span>
                    {order.urgent && <Badge variant="danger">Urgent</Badge>}
                  </div>
                  <div className="text-sm font-semibold text-text1 truncate">{order.route}</div>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-text3">
                    <span className="flex items-center gap-1"><Truck size={10} />{order.type}</span>
                    <span>·</span>
                    <span>{order.pickup}</span>
                  </div>
                </div>

                {/* Right: status + action */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Badge variant={
                    order.status === 'Awaiting Decision' ? 'warning' :
                    order.status === 'In Transit' ? 'success' :
                    order.status === 'Completed' ? 'outline' :
                    order.status === 'Assigned' ? 'default' : 'info'
                  }>{order.status === 'Awaiting Decision' ? 'Pending' : order.status}</Badge>
                  {order.status === 'Awaiting Decision' ? (
                    <button
                      className="text-[11px] font-semibold text-brand-mid bg-brand-light px-2.5 py-1 rounded-lg"
                      onClick={e => { e.stopPropagation(); navigate('/decision') }}
                    >
                      Analyse →
                    </button>
                  ) : (
                    <ChevronRight size={14} className="text-text3" />
                  )}
                </div>
              </div>

              {/* Desktop layout */}
              <div className="hidden md:flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center shrink-0">
                  <Package size={18} className="text-brand-mid" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-text3">{order.id}</span>
                    {order.urgent && <Badge variant="danger">Urgent</Badge>}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-text1">
                    <MapPin size={13} className="text-text3 shrink-0" />
                    {order.route}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-text3"><Truck size={11} /> {order.type}</span>
                    <span className="flex items-center gap-1 text-xs text-text3"><Clock size={11} /> {order.pickup}</span>
                    <span className="text-xs text-text3">{order.distance}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-text3 mb-1">{order.customer}</div>
                  <Badge variant={
                    order.status === 'Awaiting Decision' ? 'warning' :
                    order.status === 'In Transit' ? 'success' :
                    order.status === 'Completed' ? 'outline' :
                    order.status === 'Assigned' ? 'default' : 'info'
                  }>{order.status}</Badge>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {order.status === 'Awaiting Decision' && (
                    <Button size="sm" variant="primary" onClick={e => { e.stopPropagation(); navigate('/decision') }}>
                      Analyse
                    </Button>
                  )}
                  <ChevronRight size={16} className="text-text3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
