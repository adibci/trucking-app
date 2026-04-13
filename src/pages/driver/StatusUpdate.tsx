import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, MapPin, Package, Truck, CheckCircle, Navigation, Camera } from 'lucide-react'

const statuses = [
  { id: 'arrived_pickup', label: 'Arrived at Pickup', icon: MapPin, color: 'bg-brand-light text-brand-mid', desc: 'I am at the pickup location' },
  { id: 'loading', label: 'Loading Cargo', icon: Package, color: 'bg-accent-soft text-accent', desc: 'Loading in progress' },
  { id: 'in_transit', label: 'In Transit', icon: Truck, color: 'bg-blue-50 text-blue-600', desc: 'Cargo loaded, heading to delivery' },
  { id: 'arrived_delivery', label: 'Arrived at Delivery', icon: MapPin, color: 'bg-em-green-soft text-em-green', desc: 'I am at the drop-off location' },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'bg-em-green-soft text-em-green', desc: 'Cargo delivered successfully' },
]

export default function StatusUpdate() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('loading')
  const [note, setNote] = useState('')
  const [updated, setUpdated] = useState(false)

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
          <button onClick={() => navigate('/driver/active-job')} className="text-white/60"><ChevronLeft size={22} /></button>
          <div className="text-white font-semibold">Update Status</div>
          <div className="w-8" />
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* Current job reference */}
          <div className="bg-white rounded-2xl border border-gray-100 p-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-light rounded-xl flex items-center justify-center">
              <Package size={14} className="text-brand-mid" />
            </div>
            <div>
              <div className="text-xs text-text3">Active Job</div>
              <div className="text-sm font-bold text-text1">ORD-441 · Sydney → Port Botany</div>
            </div>
          </div>

          {!updated ? (
            <>
              {/* Status selection */}
              <div>
                <div className="text-xs font-semibold text-text2 uppercase tracking-wide mb-2">Select Status</div>
                <div className="space-y-2">
                  {statuses.map(({ id, label, icon: Icon, color, desc }) => (
                    <button
                      key={id}
                      onClick={() => setSelected(id)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all ${
                        selected === id ? 'border-brand bg-brand-light' : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${selected === id ? 'text-brand' : 'text-text1'}`}>{label}</div>
                        <div className="text-xs text-text3">{desc}</div>
                      </div>
                      {selected === id && (
                        <div className="ml-auto w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl border border-gray-100 p-3 flex items-center gap-2">
                <Navigation size={15} className="text-brand-mid" />
                <div>
                  <div className="text-xs text-text3">Your current location</div>
                  <div className="text-sm font-medium text-text1">Sydney CBD, NSW · Accurate to 5m</div>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="text-xs font-medium text-text2 mb-1.5 block">Optional Note</label>
                <textarea
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-brand-mid resize-none bg-white"
                  rows={3}
                  placeholder="Add any notes for dispatcher..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
              </div>

              {/* Photo */}
              <button className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center gap-2 text-sm text-text3 hover:border-brand/30 hover:text-brand-mid transition">
                <Camera size={16} /> Attach Photo
              </button>

              <button
                className="w-full py-4 rounded-2xl bg-brand text-white font-bold text-base shadow-lg active:scale-95 transition"
                onClick={() => setUpdated(true)}
              >
                Update Status
              </button>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-em-green-soft rounded-3xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-em-green" />
              </div>
              <h3 className="text-xl font-bold text-text1 mb-1">Status Updated!</h3>
              <p className="text-text3 text-sm mb-6">
                Status set to "<strong>{statuses.find(s => s.id === selected)?.label}</strong>". Dispatcher has been notified.
              </p>
              <div className="space-y-2">
                <button
                  className="w-full py-3.5 rounded-2xl bg-brand text-white font-bold"
                  onClick={() => navigate('/driver/nav')}
                >
                  <Navigation size={16} className="inline mr-2" />
                  Continue Navigation
                </button>
                {selected === 'delivered' && (
                  <button
                    className="w-full py-3.5 rounded-2xl border border-gray-200 text-text2 font-semibold"
                    onClick={() => navigate('/driver/pod')}
                  >
                    Upload Proof of Delivery
                  </button>
                )}
                <button
                  className="w-full py-3.5 rounded-2xl border border-gray-200 text-text2 font-semibold"
                  onClick={() => navigate('/driver/active-job')}
                >
                  Back to Job
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
