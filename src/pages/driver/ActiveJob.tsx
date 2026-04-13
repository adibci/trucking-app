import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Truck, Phone, MessageCircle, Navigation, ChevronLeft, Package, AlertCircle } from 'lucide-react'

const steps = [
  { label: 'En route to pickup', done: true, active: false },
  { label: 'Arrived at pickup', done: true, active: false },
  { label: 'Loading cargo', done: false, active: true },
  { label: 'In transit', done: false, active: false },
  { label: 'Arrived at destination', done: false, active: false },
  { label: 'Proof of delivery', done: false, active: false },
]

export default function ActiveJob() {
  const navigate = useNavigate()

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
          <button onClick={() => navigate('/driver/home')} className="text-white/60"><ChevronLeft size={22} /></button>
          <div className="text-white font-semibold">Active Job</div>
          <button className="text-white/60"><Phone size={18} /></button>
        </div>

        {/* Current status */}
        <div className="bg-em-green px-5 py-4 text-white">
          <div className="text-xs text-white/70 uppercase tracking-wide mb-0.5">Current Status</div>
          <div className="text-xl font-bold">Loading Cargo</div>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
            <span className="text-xs text-white/80">At Sydney CBD pickup · Waiting for confirmation</span>
          </div>
        </div>

        <div className="overflow-y-auto px-5 py-4 space-y-4">
          {/* Job ID & route */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-text3 font-mono">ORD-441</div>
              <div className="flex items-center gap-1 text-xs text-em-green font-semibold">
                <div className="w-1.5 h-1.5 rounded-full bg-em-green" />
                Active
              </div>
            </div>
            <div className="relative pl-4">
              <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gray-200" />
              <div className="mb-4">
                <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-em-green border-2 border-white" />
                <div className="text-xs text-text3 mb-0.5">Pickup — CURRENT LOCATION</div>
                <div className="text-sm font-bold text-text1">Sydney CBD, NSW</div>
              </div>
              <div>
                <div className="absolute left-0 bottom-1.5 w-2.5 h-2.5 rounded-full bg-em-red border-2 border-white" />
                <div className="text-xs text-text3 mb-0.5">Drop-off</div>
                <div className="text-sm font-bold text-text1">Port Botany, NSW</div>
                <div className="text-xs text-text3">ETA ~45 min · 24km</div>
              </div>
            </div>
          </div>

          {/* Trip progress steps */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="text-xs font-semibold text-text1 mb-3">Trip Progress</div>
            <div className="space-y-3">
              {steps.map(({ label, done, active }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    done ? 'bg-em-green' : active ? 'bg-brand border-2 border-brand' : 'bg-gray-100'
                  }`}>
                    {done ? (
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5l3 3 7-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : active ? (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    ) : null}
                  </div>
                  <span className={`text-sm ${done ? 'text-text3 line-through' : active ? 'text-text1 font-semibold' : 'text-text3'}`}>
                    {label}
                  </span>
                  {active && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Load info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="text-xs font-semibold text-text1 mb-2 flex items-center gap-1.5">
              <Package size={13} /> Load Details
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[['Type', 'General Freight'], ['Weight', '18.5t'], ['Pallets', '24'], ['Ref #', 'PO-98421']].map(([k, v]) => (
                <div key={k} className="bg-surface rounded-lg p-2">
                  <div className="text-text3 mb-0.5">{k}</div>
                  <div className="font-semibold text-text1">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-accent-soft border border-accent/20 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle size={15} className="text-accent shrink-0 mt-0.5" />
            <div className="text-xs text-text2">
              <strong className="text-text1">Note:</strong> Fragile cargo — max speed 80km/h on highways. Photo required on pickup.
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-5 pb-6 pt-2 space-y-2">
          <button
            className="w-full py-3.5 rounded-2xl bg-brand text-white font-bold flex items-center justify-center gap-2"
            onClick={() => navigate('/driver/status-update')}
          >
            Update Status
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              className="py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-text2 flex items-center justify-center gap-2"
              onClick={() => navigate('/driver/nav')}
            >
              <Navigation size={14} /> Navigate
            </button>
            <button className="py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-text2 flex items-center justify-center gap-2">
              <MessageCircle size={14} /> Message
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
