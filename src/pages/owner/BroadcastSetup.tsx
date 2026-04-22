import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Radio, ChevronLeft, DollarSign, Clock, Users, Check, Zap, MapPin } from 'lucide-react'

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
            <Card className="bg-brand border-0">
              <div className="text-white/60 text-xs mb-1 uppercase tracking-wide">Broadcasting Order</div>
              <div className="text-white font-bold text-lg mb-2">ORD-441 · Sydney CBD → Port Botany</div>
              <div className="flex items-center gap-4">
                <span className="text-white/70 text-sm flex items-center gap-1"><MapPin size={12} /> 24 km</span>
                <span className="text-white/70 text-sm">13.6m Semi · 18.5t</span>
                <span className="text-white/70 text-sm flex items-center gap-1"><Clock size={12} /> Pickup 07:00</span>
              </div>
              <div className="mt-3 pt-3 border-t border-white/20">
                <span className="text-white/60 text-xs">Order Value: </span>
                <span className="text-white font-bold text-lg font-mono">$1,200.00</span>
              </div>
            </Card>

            {/* Price mode */}
            <Card>
              <h3 className="font-semibold text-text1 mb-4 flex items-center gap-2">
                <DollarSign size={16} className="text-brand-mid" /> Pricing Mode
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {priceModes.map(({ id, label, desc, icon: Icon, color, iconBg }) => (
                  <button
                    key={id}
                    onClick={() => setPriceMode(id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      priceMode === id ? color : 'border-gray-100 hover:border-gray-200 bg-surface'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${priceMode === id ? iconBg : 'bg-gray-100'}`}>
                        <Icon size={15} className={priceMode === id ? '' : 'text-text3'} />
                      </div>
                      {priceMode === id && <Check size={14} className="text-em-green ml-auto" />}
                    </div>
                    <div className="font-semibold text-text1 text-sm">{label}</div>
                    <div className="text-text3 text-xs mt-0.5 leading-snug">{desc}</div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Price settings */}
            <Card>
              <h3 className="font-semibold text-text1 mb-4">Price Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                {priceMode === 'fixed' && (
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Fixed Price (partner receives)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text3 font-mono">$</span>
                      <input
                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-mono outline-none focus:border-brand-mid"
                        value={fixedPrice}
                        onChange={e => setFixedPrice(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-text3 mt-1">You keep: <strong className="text-em-green">${(1200 - parseInt(fixedPrice || '0')).toFixed(2)}</strong></p>
                  </div>
                )}
                {priceMode === 'open_bid' && (
                  <>
                    <div>
                      <label className="text-xs font-medium text-text2 mb-1.5 block">Minimum Accepted Bid</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text3 font-mono">$</span>
                        <input className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-mono outline-none focus:border-brand-mid" defaultValue="600" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-text2 mb-1.5 block">Maximum Budget</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text3 font-mono">$</span>
                        <input className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-mono outline-none focus:border-brand-mid" defaultValue="950" />
                      </div>
                    </div>
                  </>
                )}
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Your Commission (%)</label>
                  <div className="relative">
                    <input
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono outline-none focus:border-brand-mid"
                      value={commission}
                      onChange={e => setCommission(e.target.value)}
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text3">%</span>
                  </div>
                  <p className="text-xs text-text3 mt-1">On order value: <strong>${(1200 * parseInt(commission || '0') / 100).toFixed(2)}</strong></p>
                </div>
              </div>
            </Card>

            {/* Deadline & Visibility */}
            <Card>
              <h3 className="font-semibold text-text1 mb-4 flex items-center gap-2">
                <Clock size={16} className="text-brand-mid" /> Broadcast Settings
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-text2 mb-3 block">
                    Response Deadline: <strong>{deadline} minutes</strong>
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
                  <div className="flex justify-between text-xs text-text3 mt-1">
                    <span>10 min</span>
                    <span>120 min</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Visibility</label>
                  <div className="space-y-2">
                    {[
                      { id: 'all', label: 'All Network Partners', count: '48 companies' },
                      { id: 'trusted', label: 'Trusted Partners Only', count: '12 companies' },
                      { id: 'selected', label: 'Selected Companies', count: 'Custom' },
                    ].map(({ id, label, count }) => (
                      <label key={id} className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-surface">
                        <input type="radio" name="visibility" defaultChecked={id === 'all'} className="accent-brand" />
                        <div>
                          <div className="text-sm font-medium text-text1">{label}</div>
                          <div className="text-xs text-text3">{count}</div>
                        </div>
                      </label>
                    ))}
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
          <div className="max-w-lg mx-auto text-center pt-10">
            <div className="w-20 h-20 bg-accent-soft rounded-3xl flex items-center justify-center mx-auto mb-5">
              <Radio size={36} className="text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-text1 mb-2">Broadcast Sent!</h2>
            <p className="text-text3 mb-2">ORD-441 has been broadcast to <strong>48 partner companies</strong>.</p>
            <p className="text-text3 text-sm mb-8">Responses will arrive within {deadline} minutes. You'll be notified when partners accept or bid.</p>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {[['Partners Notified', '48'], ['Trucks Available Nearby', '12'], ['Deadline', `${deadline} min`]].map(([k, v]) => (
                <Card key={k} padding="sm">
                  <div className="text-xl font-bold text-text1 font-mono">{v}</div>
                  <div className="text-xs text-text3 mt-0.5">{k}</div>
                </Card>
              ))}
            </div>

            <div className="flex gap-3">
              <Button size="lg" variant="outline" className="flex-1" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
              <Button size="lg" className="flex-1" onClick={() => navigate('/marketplace')}>
                Monitor Network
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
