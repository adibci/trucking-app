import { useNavigate } from 'react-router-dom'
import { Truck, MapPin, Clock, DollarSign, Package, ChevronRight, Bell, Navigation, BarChart3, User } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

const stats = [
  { label: 'Today', value: '$284', icon: DollarSign, color: 'text-em-green' },
  { label: 'This Week', value: '$1,420', icon: BarChart3, color: 'text-brand-mid' },
  { label: 'Trips Today', value: '3', icon: Package, color: 'text-accent' },
  { label: 'Km Today', value: '342', icon: Navigation, color: 'text-text2' },
]

export default function DriverHome() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center py-8 px-4">
      {/* Phone frame */}
      <div className="w-[390px] bg-surface rounded-[44px] overflow-hidden shadow-2xl border border-black/10">
        {/* Status bar */}
        <div className="flex justify-between items-center px-8 py-4 bg-brand text-white text-xs font-mono font-medium">
          <span>9:41</span>
          <span>●●● WiFi ■</span>
        </div>

        {/* Header */}
        <div className="bg-brand px-6 pb-6 pt-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white text-sm font-bold">EM</div>
              <span className="text-white font-semibold text-lg">EmptyMiles</span>
            </div>
            <button
              className="relative w-9 h-9 rounded-full bg-white/15 flex items-center justify-center"
              onClick={() => navigate('/driver/notification')}
            >
              <Bell size={16} className="text-white" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border border-brand" />
            </button>
          </div>

          <div className="text-white/60 text-sm mb-1">Good morning,</div>
          <div className="text-white font-bold text-2xl tracking-tight">Marcus Lee</div>

          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-3 py-1.5 text-xs text-white font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Online
            </div>
            <div className="bg-white/10 rounded-full px-3 py-1.5 text-xs text-white/70">TRK-001 · HC License</div>
          </div>
        </div>

        {/* Earnings card */}
        <div className="mx-4 -mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative z-10">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-xs text-text3 uppercase tracking-wide font-medium mb-1">Today's Earnings</div>
              <div className="text-3xl font-bold text-text1 font-mono">$284.00</div>
              <div className="text-xs text-em-green font-medium mt-1">+18% vs yesterday</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-text3 mb-1">This Week</div>
              <div className="text-xl font-bold text-text1 font-mono">$1,420</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1 bg-gray-50 rounded-xl overflow-hidden">
            {[['3', 'Trips'], ['342km', 'Distance'], ['98%', 'On-Time']].map(([v, l]) => (
              <div key={l} className="bg-white p-2.5 text-center">
                <div className="text-sm font-bold text-text1 font-mono">{v}</div>
                <div className="text-xs text-text3">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Job */}
        <div className="mx-4 mt-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-semibold text-text1 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-em-red" />
              New Job Available
            </div>
          </div>
          <div
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer active:scale-98 transition-all"
            onClick={() => navigate('/driver/notification')}
          >
            <div className="bg-brand-light px-4 py-2.5 flex justify-between items-center border-b border-brand/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-mid bg-brand-mid/15 px-2 py-0.5 rounded-full uppercase tracking-wide">Incoming</span>
              </div>
              <div className="flex items-center gap-1.5 text-em-red font-bold text-sm font-mono">
                <Clock size={13} />
                04:52
              </div>
            </div>
            <div className="p-4">
              <div className="relative pl-4 mb-3">
                <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-gray-200" />
                <div className="mb-3">
                  <div className="absolute left-[-3px] top-1 w-2 h-2 rounded-full bg-em-green border-2 border-white" />
                  <div className="text-xs text-text3 mb-0.5">PICKUP</div>
                  <div className="text-sm font-semibold text-text1">Sydney CBD, NSW 2000</div>
                  <div className="text-xs text-text3">07:00 today · 12km away</div>
                </div>
                <div>
                  <div className="absolute left-[-3px] bottom-1 w-2 h-2 rounded-full bg-em-red border-2 border-white" />
                  <div className="text-xs text-text3 mb-0.5">DROP-OFF</div>
                  <div className="text-sm font-semibold text-text1">Port Botany, NSW 2036</div>
                  <div className="text-xs text-text3">By 12:00 today</div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4 text-xs text-text3">
                <span className="flex items-center gap-1"><Truck size={11} /> 13.6m Semi</span>
                <span className="flex items-center gap-1"><MapPin size={11} /> 24km</span>
                <span className="font-semibold text-em-green text-sm ml-auto font-mono">$185</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button className="py-2.5 rounded-xl bg-em-red-soft text-em-red text-sm font-semibold">
                  Decline
                </button>
                <button
                  className="py-2.5 rounded-xl bg-brand text-white text-sm font-semibold"
                  onClick={() => navigate('/driver/active-job')}
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Today's schedule */}
        <div className="mx-4 mt-4 mb-4">
          <div className="text-sm font-semibold text-text1 mb-2">Today's Completed</div>
          <div className="space-y-2">
            {[
              { route: 'Parramatta → Blacktown', time: '06:15–07:45', pay: '$82', status: 'Done' },
              { route: 'Blacktown → Penrith', time: '08:30–09:50', pay: '$64', status: 'Done' },
            ].map(trip => (
              <div key={trip.route} className="bg-white rounded-xl border border-gray-100 px-3 py-2.5 flex items-center gap-3">
                <div className="w-7 h-7 bg-em-green-soft rounded-lg flex items-center justify-center shrink-0">
                  <Package size={13} className="text-em-green" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-text1">{trip.route}</div>
                  <div className="text-xs text-text3">{trip.time}</div>
                </div>
                <div className="font-bold text-em-green font-mono text-sm">{trip.pay}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="flex border-t border-gray-100 bg-white">
          {[
            { icon: Truck, label: 'Home', active: true, href: '/driver/home' },
            { icon: Package, label: 'Jobs', active: false, href: '/driver/trips' },
            { icon: Navigation, label: 'Navigate', active: false, href: '/driver/nav' },
            { icon: DollarSign, label: 'Earnings', active: false, href: '/driver/earnings' },
            { icon: User, label: 'Profile', active: false, href: '/driver/profile' },
          ].map(({ icon: Icon, label, active, href }) => (
            <button
              key={label}
              className={`flex-1 flex flex-col items-center py-3 gap-1 ${active ? 'text-brand-mid' : 'text-text3'}`}
              onClick={() => navigate(href)}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
