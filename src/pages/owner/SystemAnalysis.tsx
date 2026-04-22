import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import {
  Brain, Truck, Radio, ChevronLeft, ChevronRight, TrendingUp, TrendingDown,
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
  const [isSelectedOpen, setIsSelectedOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    type: ''
  })
  const orderValue = 1200

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Decision Center" subtitle="System Analysis — ORD-441" />
      
      <div className="flex-1 px-0 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto w-full px-3 sm:px-0">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-1.5 text-xs font-bold text-text3 hover:text-text2 mb-4 uppercase tracking-wider"
          >
            <ChevronLeft size={14} /> Back to Orders
          </button>

          {/* Order summary - Stacked on mobile */}
          {/* <div className="bg-brand rounded-2xl p-4 sm:p-5 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl shadow-brand/20">
            <div>
              <div className="text-white/60 text-[10px] mb-1 uppercase tracking-widest font-black">Analysing Order</div>
              <div className="text-white font-bold text-base sm:text-lg">ORD-441 · Sydney → Port Botany</div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
                {[['13.6m Semi', Truck], ['24 km', MapPin], ['07:00 P/U', Clock]].map(([label, Icon]: any) => (
                  <div key={label} className="flex items-center gap-1.5 text-white/70 text-[11px] sm:text-xs">
                    <Icon size={11} className="shrink-0" />{label}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center sm:block justify-between pt-3 sm:pt-0 border-t border-white/10 sm:border-0 shrink-0">
              <div className="sm:text-right">
                <div className="text-white/60 text-[10px] mb-0.5 font-medium">Order Value</div>
                <div className="text-white font-bold text-xl sm:text-3xl font-mono leading-none tracking-tight">$1,200</div>
              </div>
              <div className="sm:text-right mt-1 sm:mt-2">
                <Badge variant="warning" className="text-[9px] px-1.5 py-0 h-auto font-black uppercase">Pending Decision</Badge>
              </div>
            </div>
          </div> */}

          {/* System Recommendation Banner */}
          <div className="bg-em-green-soft border border-em-green/20 rounded-2xl p-3.5 mb-5 flex items-start gap-3">
            <div className="w-9 h-9 bg-em-green rounded-xl flex items-center justify-center shrink-0">
              <Zap size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-text1 text-sm mb-0.5">Optimal Choice: Use Internal Fleet</div>
              <p className="text-xs text-text2 leading-relaxed">TRK-002 (Anna Chen) is 8km away. Best margin: <span className="font-bold text-em-green">$791.60</span>.</p>
            </div>
            <Brain size={18} className="text-em-green shrink-0 mt-1" />
          </div>

          {/* Decision Toggle - Buttons on Large, Dropdown on Mobile */}
          <div className="hidden sm:flex bg-gray-100 p-1 rounded-2xl mb-6 w-fit gap-1">
            <button
              onClick={() => setSelected('internal')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selected === 'internal' ? 'bg-brand text-white shadow-sm' : 'text-text2 hover:text-text1'
              }`}
            >
              <Truck size={14} /> Use Internal Fleet
            </button>
            <button
              onClick={() => setSelected('broadcast')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selected === 'broadcast' ? 'bg-accent text-white shadow-sm' : 'text-text2 hover:text-text1'
              }`}
            >
              <Radio size={14} /> Broadcast to Network
            </button>
          </div>
          <div className="sm:hidden relative w-full mb-5">
            <button 
              onClick={() => setIsSelectedOpen(!isSelectedOpen)}
              className="flex items-center justify-between w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm h-11"
            >
              <span className="flex items-center gap-2">
                {selected === 'internal' ? <Truck size={15} /> : <Radio size={15} />}
                {selected === 'internal' ? 'Assign Internal Fleet' : 'Broadcast to Network'}
              </span>
              <ChevronRight size={14} className={`transition-transform ${isSelectedOpen ? '-rotate-90' : 'rotate-90'}`} />
            </button>
            
            {isSelectedOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsSelectedOpen(false)} />
                <div className="absolute top-12 left-0 right-0 z-50 bg-white border border-gray-100 rounded-2xl shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-200">
                  <button 
                    onClick={() => { setSelected('internal'); setIsSelectedOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${selected === 'internal' ? 'bg-brand/5 text-brand' : 'text-text3 hover:bg-gray-50'}`}
                  >
                    <Truck size={15} /> Assign Internal Fleet
                  </button>
                  <button 
                    onClick={() => { setSelected('broadcast'); setIsSelectedOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${selected === 'broadcast' ? 'bg-accent/5 text-accent' : 'text-text3 hover:bg-gray-50'}`}
                  >
                    <Radio size={15} /> Broadcast to Network
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto w-full px-3 sm:px-0">

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

            {/* Responsive Filter Bar */}
            <div className="flex flex-col xs:flex-row items-center gap-2 sm:gap-3 mb-4">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 flex-1 w-full shadow-sm focus-within:border-brand-mid transition-colors">
                <Search size={14} className="text-slate-300 shrink-0" />
                <input
                  className="text-sm xs:text-xs text-text1 outline-none bg-transparent flex-1 placeholder:text-text3 font-medium"
                  placeholder="ID or Driver..."
                  value={filters.search}
                  onChange={e => setFilters({...filters, search: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 flex-1 w-full shadow-sm focus-within:border-brand-mid transition-colors">
                <Settings2 size={14} className="text-slate-300 shrink-0" />
                <input
                  className="text-sm xs:text-xs text-text1 outline-none bg-transparent flex-1 placeholder:text-text3 font-medium"
                  placeholder="Truck Type..."
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
                padding="none"
                className={`transition-all border-l-4 group ${i === 0 ? 'ring-2 ring-em-green border-em-green' : 'hover:border-brand/30 border-l-transparent'}`}
              >
                <div className="p-3 md:p-4">
                  <div className="flex flex-col gap-3">
                    {/* Top Row: ID, Driver, Rank */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                          i === 0 ? 'bg-em-green text-white shadow-lg shadow-em-green/20' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {i + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-black text-slate-800 text-sm md:text-base leading-tight truncate">{truck.id}</h3>
                            {i === 0 && <Badge variant="success" className="text-[8px] px-1.5 py-0 h-auto font-black uppercase tracking-widest">BEST OPTION</Badge>}
                          </div>
                          <div className="flex items-center gap-1.5 leading-none">
                            <span className="text-[10px] font-bold text-slate-500 truncate">{truck.driver}</span>
                            <div className="flex items-center gap-0.5 px-1 py-0.5 bg-slate-50 rounded border border-slate-100">
                              <Star size={9} className="text-amber-400 fill-amber-400" />
                              <span className="text-[9px] font-black text-slate-500 leading-none">{truck.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[9px] font-black uppercase text-slate-400 leading-none mb-1">Margin</div>
                        <div className="text-lg font-black text-em-green font-mono leading-none">${truck.margin.toFixed(0)}</div>
                        <div className="text-[10px] font-bold text-em-green/70 leading-none mt-1">{truck.marginPct}%</div>
                      </div>
                    </div>

                    {/* Middle Row: Distance/ETA & Status */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-100 flex items-center gap-2">
                        <MapPin size={12} className="text-slate-300 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Arrival</div>
                          <div className="text-[10px] font-bold text-slate-700 truncate">{truck.distance}km · {truck.eta}</div>
                        </div>
                      </div>
                      <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-100 flex items-center gap-2">
                        <Clock size={12} className="text-slate-300 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Status</div>
                          <div className="text-[10px] font-bold text-em-green truncate">{truck.status}</div>
                        </div>
                      </div>
                    </div>

                    {/* Cost Summary Row - Very Compact */}
                    <div className="flex items-center justify-between py-2 border-t border-b border-slate-50">
                      {[
                        { k: 'Fuel', v: truck.fuelCost },
                        { k: 'Driver', v: truck.driverPay },
                        { k: 'Tolls', v: truck.toll.toFixed(0) },
                        { k: 'Total', v: truck.total.toFixed(0), bold: true },
                      ].map(({ k, v, bold }) => (
                        <div key={k} className="text-center px-1">
                          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{k}</div>
                          <div className={`text-[10px] font-mono ${bold ? 'font-black text-slate-800' : 'font-bold text-slate-600'}`}>${v}</div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Row: Actions */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 font-black text-[10px] uppercase tracking-widest h-9 rounded-xl border-slate-200"
                        onClick={() => navigate('/fleet/' + truck.id)}
                      >
                        View Route
                      </Button>
                      <Button 
                        size="sm" 
                        className={`flex-1 font-black text-[10px] uppercase tracking-widest h-9 rounded-xl border-0 shadow-md ${
                          i === 0 ? 'bg-em-green shadow-em-green/20' : 'bg-slate-900 shadow-slate-200'
                        }`}
                        onClick={() => navigate('/decision/fleet-assignment')}
                      >
                        Assign {truck.id}
                      </Button>
                    </div>
                  </div>
                </div>
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
                <Card key={opt.company} padding="none" className="mb-3 hover:shadow-md transition-all">
                  <div className="p-3 md:p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-brand/5 rounded-xl flex items-center justify-center text-brand font-black text-sm shrink-0 border border-brand/10">
                        {opt.company.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-black text-slate-800 text-sm truncate">{opt.company}</span>
                          {opt.partner && <Badge variant="success" className="text-[8px] px-1.5 py-0 h-auto font-black uppercase tracking-widest">PARTNER</Badge>}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                          <span className="flex items-center gap-1"><Truck size={10} /> {opt.trucks} nearby</span>
                          <span className="flex items-center gap-1">
                            <Star size={10} className="text-amber-400 fill-amber-400" />
                            {opt.rating} · {opt.jobs} jobs
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[9px] font-black uppercase text-slate-400 leading-none mb-1">Status</div>
                        <div className="text-[10px] font-black text-slate-400 italic leading-none">Awaiting Bid</div>
                      </div>
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
  </div>
)
}
