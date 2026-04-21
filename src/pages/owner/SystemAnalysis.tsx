import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import {
  Brain, Truck, Radio, ChevronLeft, TrendingUp, TrendingDown,
  MapPin, Clock, Zap, CheckCircle, AlertTriangle, ArrowRight, Star,
  Search, Settings2
} from 'lucide-react'

const internalFleet = [
  { id: 'TRK-002', driver: 'Anna Chen', distance: 8, eta: '18 min', fuelCost: 240, driverPay: 160, toll: 8.40, total: 408.40, margin: 791.60, marginPct: 66, rating: 4.9, status: 'Available' },
  { id: 'TRK-007', driver: 'Ben Torres', distance: 22, eta: '35 min', fuelCost: 260, driverPay: 165, toll: 8.40, total: 433.40, margin: 766.60, marginPct: 64, rating: 4.7, status: 'Available' },
  { id: 'TRK-011', driver: 'Mia Walsh', distance: 41, eta: '58 min', fuelCost: 295, driverPay: 170, toll: 8.40, total: 473.40, margin: 726.60, marginPct: 61, rating: 4.8, status: 'Available' },
]

const externalOptions = [
  { company: 'FastHaul Pty Ltd', partner: true, trucks: 2, rating: 4.8, jobs: 142 },
  { company: 'Prime Freight AU', partner: false, trucks: 1, rating: 4.6, jobs: 89 },
  { company: 'BlueLine Transport', partner: false, trucks: 3, rating: 4.5, jobs: 57 },
]

export default function SystemAnalysis() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<'internal' | 'broadcast'>('internal')
  const [filters, setFilters] = useState({
    search: '',
    type: ''
  })
  const orderValue = 1200

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Decision Center" subtitle="System Analysis — ORD-441" />
      <div className="flex-1 p-6">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-1.5 text-sm text-text3 hover:text-text2 mb-5"
        >
          <ChevronLeft size={16} /> Back to Orders
        </button>

        {/* Order summary */}
        <div className="bg-brand rounded-2xl p-5 mb-6 flex items-center justify-between">
          <div>
            <div className="text-white/60 text-xs mb-1 uppercase tracking-wide">Analysing Order</div>
            <div className="text-white font-bold text-lg">ORD-441 · Sydney CBD → Port Botany</div>
            <div className="flex items-center gap-4 mt-2">
              {[['13.6m Semi', Truck], ['24 km', MapPin], ['07:00 pickup', Clock]].map(([label, Icon]: any) => (
                <div key={label} className="flex items-center gap-1.5 text-white/70 text-sm">
                  <Icon size={13} />{label}
                </div>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-white/60 text-xs mb-1">Order Value</div>
            <div className="text-white font-bold text-3xl font-mono">${orderValue.toLocaleString()}</div>
            <Badge variant="warning" className="mt-2">Awaiting Decision</Badge>
          </div>
        </div>

        {/* System Recommendation Banner */}
        <div className="bg-em-green-soft border border-em-green/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <div className="w-10 h-10 bg-em-green rounded-xl flex items-center justify-center shrink-0">
            <Zap size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-text1 mb-0.5">System Recommendation: Use Internal Fleet</div>
            <p className="text-sm text-text2">TRK-002 (Anna Chen) is only 8km from pickup. Best margin at $791.60 (66%). Internal option is optimal for this job.</p>
          </div>
          <Brain size={20} className="text-em-green shrink-0 mt-1" />
        </div>

        {/* Decision Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-6 w-fit gap-1">
          <button
            onClick={() => setSelected('internal')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              selected === 'internal' ? 'bg-brand text-white shadow-sm' : 'text-text2 hover:text-text1'
            }`}
          >
            <Truck size={15} /> Use Internal Fleet
          </button>
          <button
            onClick={() => setSelected('broadcast')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              selected === 'broadcast' ? 'bg-accent text-white shadow-sm' : 'text-text2 hover:text-text1'
            }`}
          >
            <Radio size={15} /> Broadcast to Network
          </button>
        </div>

        {selected === 'internal' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-text1">Available Internal Trucks</h3>
              <div className="text-xs text-text3">{internalFleet.filter(truck => {
                const matchSearch = !filters.search || 
                  truck.id.toLowerCase().includes(filters.search.toLowerCase()) || 
                  truck.driver.toLowerCase().includes(filters.search.toLowerCase())
                const matchType = !filters.type || truck.id.toLowerCase().includes(filters.type.toLowerCase()) // In this mock, ID or metadata would have type
                return matchSearch && matchType
              }).length} trucks found · sorted by efficiency</div>
            </div>

            {/* Compact Filter Bar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5 flex-1 shadow-sm focus-within:border-brand-mid transition-colors">
                <Search size={13} className="text-slate-300" />
                <input
                  className="text-xs text-text1 outline-none bg-transparent flex-1 placeholder:text-text3 font-medium"
                  placeholder="Filter by ID or Driver..."
                  value={filters.search}
                  onChange={e => setFilters({...filters, search: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5 flex-1 shadow-sm focus-within:border-brand-mid transition-colors">
                <Settings2 size={13} className="text-slate-300" />
                <input
                  className="text-xs text-text1 outline-none bg-transparent flex-1 placeholder:text-text3 font-medium"
                  placeholder="Truck Type (Semi, Flatbed...)"
                  value={filters.type}
                  onChange={e => setFilters({...filters, type: e.target.value})}
                />
              </div>
            </div>

            {internalFleet.filter(truck => {
                const matchSearch = !filters.search || 
                  truck.id.toLowerCase().includes(filters.search.toLowerCase()) || 
                  truck.driver.toLowerCase().includes(filters.search.toLowerCase())
                const matchType = !filters.type || truck.id.toLowerCase().includes(filters.type.toLowerCase())
                return matchSearch && matchType
              }).map((truck, i) => (
              <Card
                key={truck.id}
                className={`cursor-pointer transition-all ${i === 0 ? 'ring-2 ring-em-green border-em-green/30' : 'hover:border-brand/30'}`}
              >
                <div className="flex items-start gap-4">
                  {/* Rank badge */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${
                    i === 0 ? 'bg-em-green text-white' : 'bg-gray-100 text-text3'
                  }`}>
                    {i === 0 ? <CheckCircle size={20} /> : i + 1}
                  </div>

                  {/* Truck info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-text1">{truck.id}</span>
                      <span className="text-text3 text-sm">·</span>
                      <span className="text-sm text-text2">{truck.driver}</span>
                      {i === 0 && <Badge variant="success">Best Option</Badge>}
                      <div className="ml-auto flex items-center gap-1">
                        <Star size={12} className="text-accent fill-accent" />
                        <span className="text-xs font-medium text-text2">{truck.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-text3 mb-3">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {truck.distance}km from pickup</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> ETA: {truck.eta}</span>
                      <Badge variant="success" className="text-xs">{truck.status}</Badge>
                    </div>

                    {/* Cost breakdown */}
                    <div className="bg-surface rounded-xl p-3">
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          ['Fuel', `$${truck.fuelCost}`],
                          ['Driver Pay', `$${truck.driverPay}`],
                          ['Tolls', `$${truck.toll.toFixed(2)}`],
                          ['Total Cost', `$${truck.total.toFixed(2)}`],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <div className="text-xs text-text3">{k}</div>
                            <div className="text-sm font-semibold font-mono text-text1">{v}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-text3">Your margin: </span>
                          <span className="font-bold text-em-green font-mono text-base">${truck.margin.toFixed(2)}</span>
                          <span className="text-xs text-em-green ml-1 font-medium">({truck.marginPct}%)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {i === 0 ? <TrendingUp size={14} className="text-em-green" /> : <TrendingDown size={14} className="text-text3" />}
                          <span className="text-xs text-text3">vs avg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {i === 0 && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate('/decision/fleet-assignment')}
                    >
                      <Truck size={14} /> Assign TRK-002 → Anna Chen
                    </Button>
                    <Button size="sm" variant="outline">View Route</Button>
                  </div>
                )}
                {i > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 w-full"
                    onClick={() => navigate('/decision/fleet-assignment')}
                  >
                    Select This Truck
                  </Button>
                )}
              </Card>
            ))}

            {/* Compare with broadcast */}
            {/* <div className="bg-accent-soft border border-accent/20 rounded-2xl p-4 flex items-center gap-4">
              <AlertTriangle size={18} className="text-accent shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-text1">Broadcast comparison available</div>
                <p className="text-xs text-text2 mt-0.5">2 partner companies can take this job from $650 — compare before deciding</p>
              </div>
              <Button size="sm" variant="accent" onClick={() => setSelected('broadcast')}>
                Compare <ArrowRight size={13} />
              </Button>
            </div> */}
          </div>
        )}

        {selected === 'broadcast' && (
          <div className="space-y-5">
            {/* Internal baseline reference */}
            <Card className="border-brand/20 bg-brand-light">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-brand-mid" />
                  <span className="font-semibold text-text1">Internal Option Available</span>
                  <Badge variant="default">TRK-002</Badge>
                </div>
                <button
                  onClick={() => setSelected('internal')}
                  className="text-xs text-brand font-medium hover:underline"
                >
                  View details
                </button>
              </div>
              <div className="mt-2 flex items-center gap-6 text-sm">
                <div>
                  <span className="text-text3">Your cost </span>
                  <span className="font-bold font-mono text-text1">$408.40</span>
                </div>
                <div>
                  <span className="text-text3">Margin </span>
                  <span className="font-bold font-mono text-em-green">$791.60 (66%)</span>
                </div>
              </div>
              <p className="text-xs text-text3 mt-2">You can still use this truck — broadcasting will let you compare once bids arrive.</p>
            </Card>

            {/* How it works */}
            <div className="bg-accent-soft border border-accent/20 rounded-2xl p-4 flex items-start gap-3">
              <Radio size={18} className="text-accent shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-text1 text-sm mb-0.5">How broadcasting works</div>
                <p className="text-xs text-text2">Your job details are sent to selected network partners. Each company reviews and responds with their price. You compare bids when they arrive and decide who gets the job — or fall back to your internal fleet.</p>
              </div>
            </div>

            {/* Network partners */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-text1">Network Partners</h3>
                <span className="text-xs text-text3">{externalOptions.length} companies will be notified</span>
              </div>
              {externalOptions.map((opt) => (
                <Card key={opt.company} className="mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center text-brand-mid font-bold text-sm shrink-0">
                      {opt.company.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text1 text-sm">{opt.company}</span>
                        {opt.partner && <Badge variant="success">Trusted Partner</Badge>}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-text3">
                        <span>{opt.trucks} trucks nearby</span>
                        <span className="flex items-center gap-1">
                          <Star size={11} className="text-accent fill-accent" />
                          {opt.rating} · {opt.jobs} jobs
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-text3 mb-0.5">Bid price</div>
                      <div className="text-sm font-semibold text-text3 italic">Awaiting response</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button
              size="lg"
              variant="accent"
              className="w-full rounded-xl"
              onClick={() => navigate('/decision/broadcast')}
            >
              <Radio size={16} /> Broadcast Job to Network
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
