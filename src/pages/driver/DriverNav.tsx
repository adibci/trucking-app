import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Navigation, Mic, Volume2, ChevronRight, AlertTriangle } from 'lucide-react'

export default function DriverNav() {
  const navigate = useNavigate()
  const [muted, setMuted] = useState(false)

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center py-8 px-4">
      <div className="w-[390px] bg-slate-900 rounded-[44px] overflow-hidden shadow-2xl border border-black/10 relative" style={{ height: 844 }}>
        {/* Status bar */}
        <div className="flex justify-between items-center px-8 py-4 text-white text-xs font-mono relative z-10">
          <span>9:41</span>
          <span>●●● GPS ■</span>
        </div>

        {/* Next turn banner */}
        <div className="absolute top-16 left-0 right-0 z-20 px-3">
          <div className="bg-brand text-white rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <ChevronRight size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="text-xl font-bold">Turn right</div>
                <div className="text-sm text-white/80">onto Southern Cross Dr</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold font-mono">800m</div>
              </div>
            </div>
          </div>
        </div>

        {/* Map background */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full" style={{
            background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 60%, #1a3c5e 100%)',
          }}>
            {[...Array(14)].map((_, i) => (
              <div key={`h${i}`} className="absolute w-full border-t border-white/4" style={{ top: `${i * 7}%` }} />
            ))}
            {[...Array(18)].map((_, i) => (
              <div key={`v${i}`} className="absolute h-full border-l border-white/4" style={{ left: `${i * 6}%` }} />
            ))}
            <svg className="absolute inset-0 w-full h-full">
              {/* Road */}
              <path d="M 200,700 L 200,500 Q 200,400 300,350 L 400,300" stroke="#334155" strokeWidth="20" fill="none" />
              <path d="M 200,700 L 200,500 Q 200,400 300,350 L 400,300" stroke="#475569" strokeWidth="16" fill="none" />
              {/* Route highlight */}
              <path d="M 200,700 L 200,500 Q 200,400 300,350 L 400,300" stroke="#2563A8" strokeWidth="6" fill="none" opacity="0.8" />
              {/* Destination */}
              <path d="M 400,300 L 600,200 Q 700,160 750,130" stroke="#2563A8" strokeWidth="4" fill="none" strokeDasharray="8,4" opacity="0.6" />
            </svg>

            {/* Current position marker */}
            <div className="absolute" style={{ left: '51%', top: '82%' }}>
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-brand-mid border-3 border-white shadow-lg" />
                <div className="absolute inset-0 w-4 h-4 rounded-full bg-brand-mid animate-ping opacity-50" />
              </div>
            </div>

            {/* Destination pin */}
            <div className="absolute" style={{ left: '92%', top: '15%' }}>
              <div className="w-8 h-8 bg-em-red rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <Navigation size={14} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Alert banner */}
        <div className="absolute z-20" style={{ top: '52%', left: 12, right: 12 }}>
          <div className="bg-accent/90 backdrop-blur rounded-xl px-3 py-2 flex items-center gap-2">
            <AlertTriangle size={14} className="text-white shrink-0" />
            <span className="text-white text-xs font-medium">Speed camera in 500m</span>
          </div>
        </div>

        {/* Bottom panel */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-6">
          {/* ETA row */}
          <div className="bg-white/95 backdrop-blur rounded-3xl p-4 mb-3 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs text-text3 mb-0.5">ETA to Port Botany</div>
                <div className="text-2xl font-bold text-text1 font-mono">38 min</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-text3 mb-0.5">Distance</div>
                <div className="text-2xl font-bold text-text1 font-mono">18.4km</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-text3 mb-0.5">Speed</div>
                <div className="text-2xl font-bold text-text1 font-mono">62</div>
                <div className="text-xs text-text3">km/h</div>
              </div>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-mid rounded-full" style={{ width: '35%' }} />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              className="flex-1 py-3 rounded-2xl bg-white/90 backdrop-blur text-sm font-semibold text-text1 shadow flex items-center justify-center gap-2"
              onClick={() => navigate('/driver/status-update')}
            >
              Update Status
            </button>
            <button
              onClick={() => setMuted(!muted)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow ${muted ? 'bg-em-red-soft' : 'bg-white/90 backdrop-blur'}`}
            >
              <Volume2 size={18} className={muted ? 'text-em-red' : 'text-text1'} />
            </button>
            <button className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur flex items-center justify-center shadow">
              <Mic size={18} className="text-text1" />
            </button>
            <button
              onClick={() => navigate('/driver/active-job')}
              className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur flex items-center justify-center shadow"
            >
              <X size={18} className="text-text1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
