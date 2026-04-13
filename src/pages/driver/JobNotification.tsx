import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Truck, Package, DollarSign, Clock, Check, X, ChevronLeft, Navigation } from 'lucide-react'

export default function JobNotification() {
  const navigate = useNavigate()
  const [seconds, setSeconds] = useState(292)
  const [decision, setDecision] = useState<'accept' | 'decline' | null>(null)

  useEffect(() => {
    if (decision || seconds <= 0) return
    const t = setInterval(() => setSeconds(s => s - 1), 1000)
    return () => clearInterval(t)
  }, [decision, seconds])

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const pct = (seconds / 300) * 100

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center py-8 px-4">
      <div className="w-[390px] bg-surface rounded-[44px] overflow-hidden shadow-2xl border border-black/10">
        {/* Status bar */}
        <div className="flex justify-between items-center px-8 py-4 bg-brand text-white text-xs font-mono">
          <span>9:41</span>
          <span>●●● WiFi ■</span>
        </div>

        {/* Header */}
        <div className="bg-brand px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/driver/home')} className="text-white/60 hover:text-white">
            <ChevronLeft size={22} />
          </button>
          <div className="text-white font-semibold">Incoming Job</div>
          <div className="w-8" />
        </div>

        {/* Notification card */}
        {!decision ? (
          <div className="bg-brand-light border-b border-brand/10 px-5 py-4">
            <div className="text-xs font-semibold text-brand-mid uppercase tracking-wide mb-1">New Job Offer</div>
            <div className="text-sm text-text2">You have a new job waiting for your response</div>

            {/* Timer ring */}
            <div className="flex items-center gap-4 mt-3">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#E2E8F0" strokeWidth="4" />
                  <circle
                    cx="32" cy="32" r="28" fill="none"
                    stroke={pct > 50 ? '#059669' : pct > 25 ? '#F59E0B' : '#DC2626'}
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - pct / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xs font-bold font-mono ${pct <= 25 ? 'text-em-red' : 'text-text1'}`}>
                    {mins}:{secs.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-text1">Time to respond</div>
                <div className="text-xs text-text3">Job expires if no response</div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`px-5 py-4 text-center ${decision === 'accept' ? 'bg-em-green-soft' : 'bg-em-red-soft'}`}>
            <div className={`text-lg font-bold ${decision === 'accept' ? 'text-em-green' : 'text-em-red'}`}>
              {decision === 'accept' ? 'Job Accepted!' : 'Job Declined'}
            </div>
            <div className="text-sm text-text2 mt-0.5">
              {decision === 'accept' ? 'Navigate to pickup point now' : 'Another job will be assigned shortly'}
            </div>
          </div>
        )}

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          {/* Route */}
          <div className="px-5 py-4">
            <div className="relative pl-5">
              <div className="absolute left-1.5 top-3 bottom-3 w-0.5 bg-gray-200" />
              <div className="mb-5">
                <div className="absolute left-[-2px] top-1.5 w-3 h-3 rounded-full bg-em-green border-2 border-white shadow" />
                <div className="text-xs font-semibold text-text3 uppercase tracking-wide mb-1">PICKUP</div>
                <div className="text-base font-bold text-text1">Sydney CBD</div>
                <div className="text-sm text-text2">301 George St, Sydney NSW 2000</div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-text3">
                  <span className="flex items-center gap-1"><Clock size={11} /> 07:00 today</span>
                  <span className="flex items-center gap-1"><Navigation size={11} /> 12 km from you</span>
                </div>
              </div>
              <div>
                <div className="absolute left-[-2px] bottom-1.5 w-3 h-3 rounded-full bg-em-red border-2 border-white shadow" />
                <div className="text-xs font-semibold text-text3 uppercase tracking-wide mb-1">DROP-OFF</div>
                <div className="text-base font-bold text-text1">Port Botany</div>
                <div className="text-sm text-text2">Port Botany Intermodal Terminal</div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-text3">
                  <span className="flex items-center gap-1"><Clock size={11} /> By 12:00 today</span>
                  <span className="flex items-center gap-1"><MapPin size={11} /> 24 km total</span>
                </div>
              </div>
            </div>
          </div>

          {/* Job details */}
          <div className="px-5 pb-4">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { icon: Truck, label: 'Vehicle Required', value: '13.6m Semi' },
                { icon: Package, label: 'Load Type', value: 'General Freight' },
                { icon: Package, label: 'Weight', value: '18.5 tonnes' },
                { icon: Clock, label: 'Est. Duration', value: '~45 min' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-surface rounded-2xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-text3 mb-1">
                    <Icon size={11} /> {label}
                  </div>
                  <div className="text-sm font-semibold text-text1">{value}</div>
                </div>
              ))}
            </div>

            {/* Pay estimate */}
            <div className="bg-em-green-soft border border-em-green/20 rounded-2xl p-4 mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-text3 mb-0.5">Your Pay</div>
                <div className="text-3xl font-bold text-text1 font-mono">$185.00</div>
                <div className="text-xs text-em-green font-medium">incl. fuel allowance</div>
              </div>
              <DollarSign size={40} className="text-em-green/30" />
            </div>

            {/* Special notes */}
            <div className="bg-accent-soft border border-accent/20 rounded-xl p-3 mb-4">
              <div className="text-xs font-semibold text-accent mb-1">Special Notes</div>
              <div className="text-xs text-text2">Fragile cargo. Drive carefully. Customer requires photo on pickup.</div>
            </div>
          </div>
        </div>

        {/* Accept / Decline */}
        <div className="px-5 pb-6 pt-2">
          {!decision ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDecision('decline')}
                className="py-4 rounded-2xl bg-em-red-soft text-em-red font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <X size={20} /> Decline
              </button>
              <button
                onClick={() => { setDecision('accept'); setTimeout(() => navigate('/driver/active-job'), 1500) }}
                className="py-4 rounded-2xl bg-brand text-white font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition shadow-lg"
              >
                <Check size={20} /> Accept
              </button>
            </div>
          ) : decision === 'accept' ? (
            <button
              className="w-full py-4 rounded-2xl bg-brand text-white font-bold text-base flex items-center justify-center gap-2"
              onClick={() => navigate('/driver/active-job')}
            >
              <Navigation size={18} /> Navigate to Pickup
            </button>
          ) : (
            <button
              className="w-full py-4 rounded-2xl bg-surface text-text2 font-semibold text-base border border-gray-200"
              onClick={() => navigate('/driver/home')}
            >
              Back to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
