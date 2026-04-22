import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Radio, Truck, ChevronLeft, DollarSign, Clock, Users, Check, Zap, MapPin } from 'lucide-react'

const priceModes = [
  {
    id: 'fixed',
    label: 'Fixed Price',
    desc: 'Partners accept or skip — no negotiation',
    icon: DollarSign,
    color: 'border-brand bg-brand-light',
    iconBg: 'bg-brand text-white',
  },
  {
    id: 'open_bid',
    label: 'Open Bid',
    desc: 'Partners submit their best price — you choose',
    icon: Zap,
    color: 'border-accent bg-accent-soft',
    iconBg: 'bg-accent text-white',
  },
  {
    id: 'negotiated',
    label: 'Negotiated',
    desc: 'Direct negotiation with selected partners',
    icon: Users,
    color: 'border-em-green bg-em-green-soft',
    iconBg: 'bg-em-green text-white',
  },
]

export default function BroadcastSetup() {
  const navigate = useNavigate()
  const [priceMode, setPriceMode] = useState('fixed')
  const [deadline, setDeadline] = useState(30)
  const [fixedPrice, setFixedPrice] = useState('900')
  const [commission, setCommission] = useState('10')
  const [broadcast, setBroadcast] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Broadcast Job" subtitle="Send to partner network" />
      <div className="flex-1 p-6 max-w-3xl mx-auto w-full">
        <button
          onClick={() => navigate('/decision')}
          className="flex items-center gap-1.5 text-sm text-text3 hover:text-text2 mb-5"
        >
          <ChevronLeft size={16} /> Back to Analysis
        </button>

        {!broadcast ? (
          <div className="space-y-5">
            {/* Job summary */}
            <Card padding="none" className="bg-slate-900 border-0 overflow-hidden shadow-xl shadow-slate-200">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Broadcasting Order</div>
                    <div className="text-white font-black text-base md:text-lg leading-tight">ORD-441 · Sydney CBD → Port Botany</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Value</div>
                    <div className="text-xl font-black text-white font-mono leading-none">$1,200</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/5 rounded-xl p-2 flex items-center gap-2 border border-white/10">
                    <MapPin size={12} className="text-slate-400" />
                    <div className="text-[10px] font-bold text-white/80">24 km</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2 flex items-center gap-2 border border-white/10">
                    <Truck size={12} className="text-slate-400" />
                    <div className="text-[10px] font-bold text-white/80 truncate">13.6m Semi</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2 flex items-center gap-2 border border-white/10">
                    <Clock size={12} className="text-slate-400" />
                    <div className="text-[10px] font-bold text-white/80">07:00</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Price mode */}
            <Card padding="none">
              <div className="p-3 border-b border-slate-50">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <DollarSign size={14} className="text-brand" /> Pricing Mode
                </h3>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
                  {priceModes.map(({ id, label, desc, icon: Icon, color, iconBg }) => (
                    <button
                      key={id}
                      onClick={() => setPriceMode(id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${
                        priceMode === id ? color + ' border-current' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-sm ${priceMode === id ? iconBg : 'bg-white text-slate-400'}`}>
                          <Icon size={14} />
                        </div>
                        {priceMode === id && <Check size={12} className="text-em-green" />}
                      </div>
                      <div className={`font-black text-[11px] uppercase tracking-wider mb-1 ${priceMode === id ? 'text-current' : 'text-slate-700'}`}>{label}</div>
                      <div className={`text-[9px] font-bold leading-tight line-clamp-2 ${priceMode === id ? 'text-current/80' : 'text-slate-400'}`}>{desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Price settings */}
            <Card padding="none">
              <div className="p-3 border-b border-slate-50">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Price Settings</h3>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {priceMode === 'fixed' && (
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Fixed Price (partner receives)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">$</span>
                        <input
                          className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-black font-mono outline-none focus:border-brand transition-colors bg-slate-50/50"
                          value={fixedPrice}
                          onChange={e => setFixedPrice(e.target.value)}
                        />
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 mt-1.5 flex items-center gap-1">
                        You keep: <span className="font-black text-em-green font-mono">${(1200 - parseInt(fixedPrice || '0')).toFixed(0)}</span>
                      </p>
                    </div>
                  )}
                  {priceMode === 'open_bid' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Min Bid</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">$</span>
                          <input className="w-full pl-6 pr-2 py-2 rounded-lg border border-slate-200 text-xs font-black font-mono outline-none focus:border-brand bg-slate-50/50" defaultValue="600" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Max Budget</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">$</span>
                          <input className="w-full pl-6 pr-2 py-2 rounded-lg border border-slate-200 text-xs font-black font-mono outline-none focus:border-brand bg-slate-50/50" defaultValue="950" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Your Commission (%)</label>
                    <div className="relative">
                      <input
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-black font-mono outline-none focus:border-brand transition-colors bg-slate-50/50"
                        value={commission}
                        onChange={e => setCommission(e.target.value)}
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mt-1.5 flex items-center gap-1">
                      Earnings: <span className="font-black text-brand font-mono">${(1200 * parseInt(commission || '0') / 100).toFixed(0)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Deadline & Visibility */}
            <Card padding="none">
              <div className="p-3 border-b border-slate-50">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={14} className="text-brand" /> Broadcast Settings
                </h3>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                      Deadline: <span className="text-slate-800">{deadline} minutes</span>
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={120}
                      step={5}
                      value={deadline}
                      onChange={e => setDeadline(parseInt(e.target.value))}
                      className="w-full accent-brand"
                    />
                    <div className="flex justify-between text-[9px] font-black text-slate-300 mt-2 uppercase tracking-tighter">
                      <span>10 min</span>
                      <span>FAST</span>
                      <span>120 min</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Visibility</label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {[
                        { id: 'all', label: 'All Partners', count: '48 Cos' },
                        { id: 'trusted', label: 'Trusted', count: '12 Cos' },
                      ].map(({ id, label, count }) => (
                        <label key={id} className="flex items-center justify-between gap-3 cursor-pointer p-2 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-2">
                            <input type="radio" name="visibility" defaultChecked={id === 'all'} className="accent-brand" />
                            <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">{label}</span>
                          </div>
                          <span className="text-[9px] font-black text-slate-400 font-mono">{count}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Network preview */}
            {/* <Card className="bg-em-green-soft border-em-green/20">
              <div className="flex items-center gap-2 mb-2">
                <Users size={15} className="text-em-green" />
                <span className="font-semibold text-text1 text-sm">Network Reach Preview</span>
              </div>
              <div className="flex items-center gap-6">
                {[['Companies', '48'], ['Available Trucks Nearby', '12'], ['Avg Response Time', '8 min']].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-xl font-bold text-text1 font-mono">{v}</div>
                    <div className="text-xs text-text3">{k}</div>
                  </div>
                ))}
              </div>
            </Card> */}

            <Button
              size="lg"
              variant="accent"
              className="w-full rounded-xl font-semibold"
              onClick={() => setBroadcast(true)}
            >
              <Radio size={18} /> Broadcast to Network Now
            </Button>
          </div>
        ) : (
          /* Success */
          <div className="max-w-lg mx-auto text-center pt-8">
            <div className="w-16 h-16 bg-brand/5 border-2 border-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand/5">
              <Radio size={32} className="text-brand animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight">Broadcast Active</h2>
            <p className="text-slate-500 font-bold text-sm mb-8 leading-relaxed px-4">
              ORD-441 has been broadcast to <span className="text-brand">48 partners</span>. 
              Expect responses within {deadline} minutes.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-8">
              {[
                { k: 'Network', v: '48' },
                { k: 'Nearby', v: '12' },
                { k: 'Time', v: `${deadline}m` },
              ].map(({ k, v }) => (
                <div key={k} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-lg font-black text-slate-800 font-mono leading-none">{v}</div>
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{k}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 px-4">
              <Button size="lg" variant="outline" className="flex-1 font-black text-xs uppercase tracking-widest rounded-xl h-12" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button size="lg" className="flex-1 font-black text-xs uppercase tracking-widest rounded-xl h-12 bg-slate-900 border-0 shadow-lg shadow-slate-200" onClick={() => navigate('/marketplace')}>
                Monitor Network
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
