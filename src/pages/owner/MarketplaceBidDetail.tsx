import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fetchOSRMRoute } from '../../components/map/LeafletMap'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ArrowLeft, Clock, Truck, MapPin, CheckCircle, RotateCcw } from 'lucide-react'

// ─── Data ──────────────────────────────────────────────────────────────────

const ORDER = {
  id: 'ORD-441',
  route: 'Sydney CBD → Port Botany',
  pickup: [-33.8688, 151.2093] as [number, number],
  dropoff: [-33.9711, 151.2165] as [number, number],
  value: 1200,
}

const DEPOT: [number, number] = [-33.8136, 151.0034]

const RECOMMENDED_ID = 'TRK-005'

interface FleetTruck {
  id: string
  driver: string
  status: 'returning' | 'available' | 'on-trip'
  backlog: boolean
  pos: [number, number]
  distanceKm: number
  etaMin: number
  cost: number
  margin: number
  marginPct: number
  costBreakdown: { fuel: number; driver: number; tolls: number }
}

const FLEET: FleetTruck[] = [
  {
    id: 'TRK-005', driver: 'Jack Morris', status: 'returning', backlog: true,
    pos: [-33.9050, 151.1700],
    distanceKm: 8, etaMin: 14,
    cost: 121.40, margin: 1078.60, marginPct: 90,
    costBreakdown: { fuel: 45, driver: 68, tolls: 8.40 },
  },
  {
    id: 'TRK-008', driver: 'Sam Lee', status: 'available', backlog: false,
    pos: [-33.9175, 151.0345],
    distanceKm: 18, etaMin: 24,
    cost: 189.60, margin: 1010.40, marginPct: 84,
    costBreakdown: { fuel: 89, driver: 88, tolls: 12.60 },
  },
  {
    id: 'TRK-002', driver: 'Anna Chen', status: 'available', backlog: false,
    pos: [-33.8136, 151.0034],
    distanceKm: 32, etaMin: 38,
    cost: 239.80, margin: 960.20, marginPct: 80,
    costBreakdown: { fuel: 145, driver: 78, tolls: 16.80 },
  },
  {
    id: 'TRK-011', driver: 'Mia Walsh', status: 'on-trip', backlog: false,
    pos: [-33.7500, 151.1000],
    distanceKm: 0, etaMin: 0,
    cost: 0, margin: 0, marginPct: 0,
    costBreakdown: { fuel: 0, driver: 0, tolls: 0 },
  },
]

// ─── Map icon helpers ───────────────────────────────────────────────────────

function makeEndpointIcon(type: 'A' | 'B') {
  const color = type === 'A' ? '#059669' : '#DC2626'
  return L.divIcon({
    className: '',
    html: `<div style="
      width:36px;height:36px;background:${color};border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      display:flex;align-items:center;justify-content:center;">
      <div style="transform:rotate(45deg);color:white;font-size:14px;font-weight:bold;">${type}</div>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  })
}

function makeDepotIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;">
      <div style="
        width:34px;height:34px;background:#1A3C5E;border-radius:8px;
        border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.35);
        display:flex;align-items:center;justify-content:center;">
        <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </div>
      <div style="position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);
        background:rgba(26,60,94,0.9);color:white;padding:1px 5px;
        border-radius:3px;font-size:9px;font-weight:600;white-space:nowrap;letter-spacing:0.05em;">
        DEPOT
      </div>
    </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  })
}

function makeFleetTruckIcon(truck: FleetTruck) {
  const color =
    truck.status === 'returning' ? '#F59E0B' :
    truck.status === 'available' ? '#059669' : '#94A3B8'
  const backlogDot = truck.backlog
    ? `<div style="position:absolute;top:-4px;right:-4px;width:12px;height:12px;
        background:#F59E0B;border-radius:50%;border:2px solid white;
        box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>`
    : ''
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;">
      <div style="
        width:38px;height:38px;background:${color};border-radius:10px;
        border:3px solid white;box-shadow:0 3px 12px rgba(0,0,0,0.3);
        display:flex;align-items:center;justify-content:center;">
        <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
          <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-.5 1.5 1.96 2.5H17V9.5h2.5zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2.22-3c-.55-.61-1.33-1-2.22-1s-1.67.39-2.22 1H3V6h12v9H8.22zM18 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
        </svg>
      </div>
      ${backlogDot}
      <div style="position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);
        background:${color};color:white;padding:1px 5px;
        border-radius:4px;font-size:9px;font-weight:700;white-space:nowrap;font-family:monospace;
        box-shadow:0 1px 4px rgba(0,0,0,0.2);">
        ${truck.id}
      </div>
    </div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  })
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function MarketplaceBidDetail() {
  const navigate = useNavigate()
  const mapDivRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const routeLayersRef = useRef<L.Layer[]>([])

  const [selectedId, setSelectedId] = useState(RECOMMENDED_ID)
  const [routeLoading, setRouteLoading] = useState(false)

  // Countdown timer: 23 min
  const [secondsLeft, setSecondsLeft] = useState(23 * 60)
  useEffect(() => {
    const t = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [])
  const timerDisplay = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`

  // Map init
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return

    const map = L.map(mapDivRef.current, {
      center: [-33.8900, 151.1500],
      zoom: 11,
      zoomControl: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)
    mapRef.current = map

    // Static markers
    L.marker(ORDER.pickup, { icon: makeEndpointIcon('A') })
      .addTo(map).bindPopup('<strong>Pickup</strong><br/>Sydney CBD')
    L.marker(ORDER.dropoff, { icon: makeEndpointIcon('B') })
      .addTo(map).bindPopup('<strong>Dropoff</strong><br/>Port Botany')
    L.marker(DEPOT, { icon: makeDepotIcon() })
      .addTo(map).bindPopup('<strong>Fleet Depot</strong><br/>Parramatta')

    // Fleet truck markers
    FLEET.forEach(truck => {
      L.marker(truck.pos, { icon: makeFleetTruckIcon(truck) })
        .addTo(map)
        .bindPopup(`<strong>${truck.id}</strong> — ${truck.driver}`)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Fetch & draw route segments when selected truck changes
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Clear previous route polylines
    routeLayersRef.current.forEach(l => map.removeLayer(l))
    routeLayersRef.current = []

    const truck = FLEET.find(t => t.id === selectedId)
    if (!truck || truck.status === 'on-trip') return

    setRouteLoading(true)

    Promise.all([
      fetchOSRMRoute(truck.pos, ORDER.pickup),       // deadhead: truck → pickup
      fetchOSRMRoute(ORDER.pickup, ORDER.dropoff),   // cargo: pickup → dropoff
      fetchOSRMRoute(ORDER.dropoff, DEPOT),          // return: dropoff → depot
    ]).then(([deadhead, cargo, returnLeg]) => {
      if (!mapRef.current) return
      const m = mapRef.current

      const deadheadPoly = L.polyline(deadhead.coords, {
        color: '#94A3B8', weight: 4, opacity: 0.85,
        dashArray: '8, 6', lineCap: 'round',
      }).addTo(m)

      const cargoPoly = L.polyline(cargo.coords, {
        color: '#1A3C5E', weight: 5, opacity: 0.9,
        lineCap: 'round',
      }).addTo(m)

      const returnPoly = L.polyline(returnLeg.coords, {
        color: '#2563A8', weight: 4, opacity: 0.6,
        dashArray: '8, 6', lineCap: 'round',
      }).addTo(m)

      routeLayersRef.current = [deadheadPoly, cargoPoly, returnPoly]

      // Fit bounds to show full route
      const allCoords = [...deadhead.coords, ...cargo.coords, ...returnLeg.coords]
      m.fitBounds(L.latLngBounds(allCoords), { padding: [50, 50] })
      setRouteLoading(false)
    }).catch(() => setRouteLoading(false))
  }, [selectedId])

  const sortedTrucks = [...FLEET].sort((a, b) => {
    const rank = (t: FleetTruck) =>
      t.backlog ? 0 :
      t.status === 'available' ? 1 : 2
    if (rank(a) !== rank(b)) return rank(a) - rank(b)
    return a.distanceKm - b.distanceKm
  })

  const selectedTruck = FLEET.find(t => t.id === selectedId)

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">

      {/* Top bar */}
      <div className="shrink-0 h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-3 z-20 shadow-sm">
        <button
          onClick={() => navigate('/marketplace')}
          className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50"
        >
          <ArrowLeft size={16} className="text-text1" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-text3 font-medium truncate">{ORDER.id} · {ORDER.route}</div>
          <div className="text-sm font-bold text-text1">Select Truck for Bid</div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold font-mono shrink-0 ${
          secondsLeft < 300 ? 'bg-em-red-soft text-em-red' : 'bg-accent-soft text-accent'
        }`}>
          <Clock size={13} />
          {timerDisplay}
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-text3">Order Value</div>
          <div className="text-sm font-bold text-text1 font-mono">${ORDER.value.toLocaleString()}</div>
        </div>
      </div>

      {/* Side-by-side body */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — Map */}
        <div className="relative flex-1">
          <div ref={mapDivRef} className="w-full h-full" />

          {/* Route loading overlay */}
          {routeLoading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1000 }}>
              <div className="bg-white/95 rounded-xl px-4 py-2 shadow-lg flex items-center gap-2 text-sm font-medium text-text1">
                <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                Calculating routes…
              </div>
            </div>
          )}

          {/* Map legend — bottom-left */}
          <div className="absolute bottom-5 left-4 bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-3 min-w-[220px]" style={{ zIndex: 1000 }}>
            <div className="text-xs font-bold text-text1 mb-2.5 uppercase tracking-wide">Map Legend</div>

            {/* Route lines */}
            <div className="text-xs font-semibold text-text3 uppercase tracking-wide mb-1.5">Routes</div>
            <div className="space-y-2 mb-3">
              {[
                { color: '#94A3B8', dashed: true,  label: 'Deadhead',         sub: 'empty truck to pickup' },
                { color: '#1A3C5E', dashed: false, label: 'Cargo leg',         sub: 'pickup → drop-off' },
                { color: '#2563A8', dashed: true,  label: 'Return to depot',   sub: 'drop-off → base' },
              ].map(({ color, dashed, label, sub }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="flex items-center gap-0.5 w-9 shrink-0">
                    {dashed
                      ? [0, 1, 2].map(i => (
                          <div key={i} style={{ background: color }} className="w-2 h-1.5 rounded-full" />
                        ))
                      : <div style={{ background: color }} className="w-9 h-1.5 rounded-full" />
                    }
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-text1 leading-tight">{label}</div>
                    <div className="text-xs text-text3 leading-tight">{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Truck status */}
            <div className="text-xs font-semibold text-text3 uppercase tracking-wide mb-1.5 pt-2 border-t border-gray-100">Truck Status</div>
            <div className="space-y-1.5">
              {[
                { color: '#F59E0B', label: 'Returning',  sub: 'backlog candidate ★' },
                { color: '#059669', label: 'Available',  sub: 'at depot or idle' },
                { color: '#94A3B8', label: 'On trip',    sub: 'unavailable' },
              ].map(({ color, label, sub }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div style={{ background: color }} className="w-4 h-4 rounded-md shrink-0 border border-white shadow-sm" />
                  <div>
                    <div className="text-xs font-semibold text-text1 leading-tight">{label}</div>
                    <div className="text-xs text-text3 leading-tight">{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Markers */}
            <div className="text-xs font-semibold text-text3 uppercase tracking-wide mb-1.5 pt-2 mt-2 border-t border-gray-100">Markers</div>
            <div className="space-y-1.5">
              {[
                { bg: '#059669', label: 'A', text: 'Pickup point' },
                { bg: '#DC2626', label: 'B', text: 'Drop-off point' },
                { bg: '#1A3C5E', label: '⌂', text: 'Fleet depot' },
              ].map(({ bg, label, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <div
                    style={{ background: bg, width: 20, height: 20, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 10, flexShrink: 0 }}
                  >
                    {label}
                  </div>
                  <span className="text-xs text-text2">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Truck selection panel */}
        <div className="w-[420px] shrink-0 flex flex-col border-l border-gray-100 bg-gray-50">

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">

            {/* System recommendation banner */}
            <div className="flex items-start gap-3 bg-accent-soft border border-accent/20 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <RotateCcw size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-accent uppercase tracking-wide">System Recommendation</div>
                <div className="text-sm font-bold text-text1 mt-0.5">
                  TRK-005 — Backlog · 90% margin
                </div>
                <p className="text-xs text-text2 mt-1 leading-relaxed">
                  Jack Morris just delivered nearby and is returning empty. Assigning this job adds minimal deadhead — nearly the same route home.
                </p>
              </div>
            </div>

            {/* Route flow diagram */}
            <div className="bg-white rounded-2xl border border-gray-100 px-4 py-3">
              <div className="text-xs font-semibold text-text3 uppercase tracking-wide mb-2">Full Route (selected truck)</div>
              <div className="flex items-center gap-1 flex-wrap text-xs">
                {[
                  { label: 'Depot', color: 'text-text1 font-semibold' },
                  { label: '→', color: 'text-text3' },
                  { label: 'Truck position', color: 'text-accent font-semibold' },
                  { label: '→', color: 'text-text3' },
                  { label: 'Pickup A', color: 'text-em-green font-semibold' },
                  { label: '→', color: 'text-text3' },
                  { label: 'Drop-off B', color: 'text-em-red font-semibold' },
                  { label: '→', color: 'text-text3' },
                  { label: 'Depot', color: 'text-text1 font-semibold' },
                ].map((s, i) => (
                  <span key={i} className={s.color}>{s.label}</span>
                ))}
              </div>
            </div>

            {/* Truck list header */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-text1">
                Available Trucks
                <span className="text-text3 font-normal ml-1.5">
                  ({FLEET.filter(t => t.status !== 'on-trip').length} of {FLEET.length})
                </span>
              </span>
              <span className="text-xs text-text3">backlog priority</span>
            </div>

            {/* Truck cards */}
            {sortedTrucks.map((truck) => {
              const isSelected = selectedId === truck.id
              const isUnavailable = truck.status === 'on-trip'
              const rank = FLEET.filter(t => t.status !== 'on-trip').indexOf(truck) + 1

              return (
                <Card
                  key={truck.id}
                  padding="none"
                  className={`transition-all ${
                    isUnavailable
                      ? 'opacity-50 cursor-not-allowed'
                      : isSelected
                      ? 'ring-2 ring-brand border-brand/30 shadow-md cursor-pointer'
                      : 'hover:border-gray-300 cursor-pointer'
                  }`}
                  onClick={() => { if (!isUnavailable) setSelectedId(truck.id) }}
                >
                  <div className="flex items-start gap-3 px-3 pt-3 pb-2">
                    {/* Rank badge */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      truck.backlog
                        ? 'bg-accent text-white'
                        : isSelected
                        ? 'bg-brand text-white'
                        : 'bg-surface text-text3'
                    }`}>
                      {isUnavailable ? '—' : truck.backlog ? '★' : rank}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <span className="font-bold text-text1 font-mono text-sm">{truck.id}</span>
                        <span className="text-xs text-text2">{truck.driver}</span>
                        <Badge variant={
                          truck.status === 'available' ? 'success' :
                          truck.status === 'returning' ? 'warning' : 'outline'
                        }>
                          {truck.status === 'returning' ? 'Returning' :
                           truck.status === 'available' ? 'Available' : 'On Trip'}
                        </Badge>
                        {truck.backlog && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                            <RotateCcw size={9} /> Backlog
                          </span>
                        )}
                      </div>
                      {!isUnavailable && (
                        <div className="flex items-center gap-3 text-xs text-text3">
                          <span className="flex items-center gap-1">
                            <MapPin size={10} /> {truck.distanceKm}km to pickup
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} /> ETA {truck.etaMin} min
                          </span>
                        </div>
                      )}
                    </div>

                    {!isUnavailable && (
                      <div className="text-right shrink-0">
                        <div className="text-xs text-text3">Margin</div>
                        <div className="text-sm font-bold text-em-green font-mono">{truck.marginPct}%</div>
                        <div className="text-xs font-mono text-text3">${truck.margin.toFixed(0)}</div>
                      </div>
                    )}
                  </div>

                  {!isUnavailable && (
                    <div className="px-3 pb-3 space-y-2">
                      {/* Cost breakdown */}
                      <div className="grid grid-cols-4 gap-1.5 bg-surface rounded-xl p-2">
                        {[
                          { k: 'Fuel', v: truck.costBreakdown.fuel },
                          { k: 'Driver', v: truck.costBreakdown.driver },
                          { k: 'Tolls', v: truck.costBreakdown.tolls },
                          { k: 'Total', v: truck.cost },
                        ].map(({ k, v }, i) => (
                          <div key={k} className="text-center">
                            <div className="text-xs text-text3">{k}</div>
                            <div className={`text-xs font-mono ${i === 3 ? 'font-bold text-text1' : 'text-text2'}`}>
                              ${Number(v).toFixed(0)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Margin bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              truck.marginPct >= 85 ? 'bg-em-green' :
                              truck.marginPct >= 75 ? 'bg-brand-mid' : 'bg-accent'
                            }`}
                            style={{ width: `${truck.marginPct}%` }}
                          />
                        </div>
                        <span className="text-xs text-text3 shrink-0 w-16 text-right">{truck.marginPct}% margin</span>
                      </div>

                      {/* Select button */}
                      <Button
                        size="sm"
                        variant={isSelected ? 'primary' : 'outline'}
                        className="w-full"
                        onClick={e => { e.stopPropagation(); setSelectedId(truck.id) }}
                      >
                        {isSelected
                          ? <><CheckCircle size={13} /> Selected</>
                          : <>Select {truck.id}</>
                        }
                      </Button>
                    </div>
                  )}

                  {isUnavailable && (
                    <div className="px-3 pb-3">
                      <p className="text-xs text-text3 italic">Currently on trip — unavailable</p>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>

          {/* Sticky award footer */}
          <div className="shrink-0 bg-white border-t border-gray-100 px-4 py-3">
            <Button
              size="lg"
              className="w-full"
              onClick={() => navigate('/marketplace')}
            >
              <Truck size={16} />
              Accept Job to {selectedId}
              {selectedTruck && (
                <span className="ml-1.5 opacity-70 font-normal text-sm">
                  · ${selectedTruck.margin.toFixed(0)} ({selectedTruck.marginPct}%)
                </span>
              )}
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
