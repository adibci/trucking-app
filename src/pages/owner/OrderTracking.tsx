import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import { LeafletMap, fetchOSRMRoute, type OsrmStep } from '../../components/map/LeafletMap'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Truck, Clock, MapPin, Phone, X, Navigation, CheckCircle, AlertCircle, ChevronRight, ChevronLeft, FileText } from 'lucide-react'

// Real AU coordinates
const PICKUP: [number, number] = [-33.8688, 151.2093]   // Sydney CBD
const DROPOFF: [number, number] = [-33.9697, 151.2421]  // Port Botany

// Truck starts ~35% along the route
const TRUCK_PROGRESS = 0.35

function formatDist(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`
}
function formatTime(s: number) {
  const m = Math.floor(s / 60)
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}min` : `${m} min`
}

export default function OrderTracking() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allCoords, setAllCoords] = useState<[number, number][]>([])
  const [completedCoords, setCompletedCoords] = useState<[number, number][]>([])
  const [remainingCoords, setRemainingCoords] = useState<[number, number][]>([])
  const [truckPos, setTruckPos] = useState<[number, number]>(PICKUP)
  const [routeInfo, setRouteInfo] = useState({ distance: 0, duration: 0 })
  const [steps, setSteps] = useState<OsrmStep[]>([])
  const [mapCenter, setMapCenter] = useState<[number, number]>([-33.92, 151.23])
  const [showSteps, setShowSteps] = useState(false)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    fetchOSRMRoute(PICKUP, DROPOFF)
      .then(({ coords, distance, duration, steps }) => {
        setAllCoords(coords)
        setRouteInfo({ distance, duration })
        setSteps(steps)

        // Split at progress point
        const splitIdx = Math.floor(coords.length * TRUCK_PROGRESS)
        setCompletedCoords(coords.slice(0, splitIdx + 1))
        setRemainingCoords(coords.slice(splitIdx))
        setTruckPos(coords[splitIdx])

        // Center map between truck and destination
        const midLat = (coords[splitIdx][0] + DROPOFF[0]) / 2
        const midLng = (coords[splitIdx][1] + DROPOFF[1]) / 2
        setMapCenter([midLat, midLng])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError('Could not load route. Check your internet connection.')
        setLoading(false)
      })
  }, [])

  // Simulate truck moving along route
  useEffect(() => {
    if (allCoords.length === 0) return
    let idx = Math.floor(allCoords.length * TRUCK_PROGRESS)
    const interval = setInterval(() => {
      idx = Math.min(idx + 1, allCoords.length - 1)
      setTruckPos(allCoords[idx])
      setCompletedCoords(allCoords.slice(0, idx + 1))
      setRemainingCoords(allCoords.slice(idx))
      if (idx >= allCoords.length - 1) clearInterval(interval)
    }, 100)
    return () => clearInterval(interval)
  }, [allCoords])

  const progress = allCoords.length
    ? (completedCoords.length / allCoords.length) * 100
    : 0

  const remainingDistance = routeInfo.distance * (1 - progress / 100)
  const remainingTime = routeInfo.duration * (1 - progress / 100)

  const pickupPoint = { lat: PICKUP[0], lng: PICKUP[1], label: 'Sydney CBD (Pickup)', type: 'pickup' as const }
  const dropoffPoint = { lat: DROPOFF[0], lng: DROPOFF[1], label: 'Port Botany (Delivery)', type: 'dropoff' as const }

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden relative">
      {/* ── Full-screen Leaflet Map ── */}
      <div className="absolute inset-0">
        {loading && (
          <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center z-10 gap-3">
            <div className="w-10 h-10 border-3 border-brand-mid border-t-transparent rounded-full animate-spin" />
            <p className="text-white/60 text-sm">Fetching real route via OSRM…</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center z-10 gap-3">
            <AlertCircle size={36} className="text-em-red" />
            <p className="text-white/70 text-sm">{error}</p>
            <button className="text-brand-mid text-sm underline" onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}
        {!loading && !error && (
          <LeafletMap
            center={mapCenter}
            zoom={12}
            height="100%"
            points={[pickupPoint, dropoffPoint]}
            completedCoords={completedCoords}
            routeCoords={remainingCoords}
            truckPosition={truckPos}
            onMapReady={m => { mapInstanceRef.current = m }}
            className="h-full w-full"
          />
        )}
      </div>

      {/* ── Top bar ── */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center gap-3">
        <button
          onClick={() => navigate('/orders')}
          className="w-10 h-10 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center shadow-lg hover:bg-white transition"
        >
          <X size={18} className="text-text1" />
        </button>
        <div className="flex-1 bg-white/95 backdrop-blur rounded-2xl px-4 py-2 shadow-lg min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[10px] text-text3 font-bold uppercase tracking-wider">Live Tracking</div>
              <div className="text-xs sm:text-sm font-bold text-text1 truncate">ORD-440 · Sydney CBD → Port Botany</div>
            </div>
            <Badge variant="default" className="shrink-0 text-[10px] px-1.5 py-0">In Transit</Badge>
          </div>
        </div>
        <button
          onClick={() => {
            if (mapInstanceRef.current && truckPos) {
              mapInstanceRef.current.setView(truckPos, 15, { animate: true })
            }
          }}
          className="w-10 h-10 bg-brand text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-brand/90 transition"
          title="Center on truck"
        >
          <Navigation size={18} />
        </button>
      </div>

      {/* ── Step-by-step panel (collapsible) ── */}
      {showSteps && steps.length > 0 && (
        <div className="absolute top-20 left-4 z-20 w-72 bg-white/95 backdrop-blur rounded-2xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-text1">Turn-by-Turn Directions</span>
            <button onClick={() => setShowSteps(false)}><X size={15} className="text-text3" /></button>
          </div>
          <div className="overflow-y-auto max-h-72">
            {steps.slice(0, 12).map((step, i) => (
              <div key={i} className={`flex items-start gap-3 px-4 py-2.5 border-b border-gray-50 last:border-0 ${i === 0 ? 'bg-brand-light' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${i === 0 ? 'bg-brand-mid text-white' : 'bg-gray-100 text-text3'}`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-text1 capitalize">{step.instruction} {step.maneuver}</div>
                  <div className="text-xs text-text3 truncate">{step.name}</div>
                  <div className="text-xs text-text3 mt-0.5">{formatDist(step.distance)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Bottom card ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-2 sm:p-4">
        <div className="bg-white/97 backdrop-blur rounded-3xl p-4 sm:p-5 shadow-2xl">
          {/* Progress */}
          <div className="flex items-center justify-between text-xs text-text3 mb-2">
            <span className="flex items-center gap-1">
              <CheckCircle size={11} className="text-em-green" /> Parramatta
            </span>
            <span className="font-semibold text-brand-mid">{Math.round(progress)}% complete</span>
            <span className="flex items-center gap-1">
              <MapPin size={11} className="text-em-red" /> Newcastle
            </span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand to-brand-mid transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'ETA', value: formatTime(remainingTime), sub: 'Left' },
              { label: 'Distance', value: formatDist(remainingDistance), sub: 'to go' },
              { label: 'Total', value: formatDist(routeInfo.distance), sub: formatTime(routeInfo.duration) },
            ].map(({ label, value, sub }) => (
              <div key={label} className="bg-surface rounded-xl p-2 sm:p-3 text-center">
                <div className="text-[10px] text-text3 mb-0.5 font-bold uppercase">{label}</div>
                <div className="text-sm sm:text-base font-bold text-text1 font-mono">{value}</div>
                <div className="text-[9px] text-text3 font-medium truncate">{sub}</div>
              </div>
            ))}
          </div>

          {/* Driver + actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center shrink-0 shadow-sm shadow-brand/20">
                <span className="text-white text-xs font-bold">AC</span>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-text1 truncate">Anna Chen</div>
                <div className="text-[10px] text-text3 font-medium truncate">TRK-002 · B-Double</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className="w-9 h-9 p-0 rounded-xl"
                onClick={() => setShowSteps(!showSteps)}
              >
                <Navigation size={15} className={showSteps ? 'text-brand' : 'text-text2'} />
              </Button>
              <Button size="sm" variant="outline" className="w-9 h-9 p-0 rounded-xl">
                <Phone size={15} />
              </Button>
              <Button size="sm" className="hidden sm:flex rounded-xl">Message</Button>
              <Button size="sm" className="w-9 h-9 p-0 flex sm:hidden rounded-xl">
                <FileText size={15} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
