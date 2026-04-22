import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fetchOSRMRoute } from '../../components/map/LeafletMap'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { X, Layers, Filter, MapPin, Clock, Navigation, Truck, Phone, ZoomIn, ZoomOut, AlertCircle, ChevronRight } from 'lucide-react'

// Real Australian coordinates
const FLEET: FleetTruck[] = [
  {
    id: 'TRK-001', driver: 'Marcus Lee', status: 'On Trip',
    from: [-33.8151, 151.0011], to: [-37.8136, 144.9631], // Parramatta → Melbourne
    progress: 0.42,
    route: 'Parramatta → Melbourne',
    speed: 95, eta: '3h 40min',
  },
  {
    id: 'TRK-002', driver: 'Anna Chen', status: 'Available',
    from: [-33.8688, 151.2093], to: [-33.8688, 151.2093], // Parked Sydney CBD
    progress: 1,
    route: 'Sydney CBD Depot',
    speed: 0, eta: 'Ready now',
  },
  {
    id: 'TRK-003', driver: 'James Park', status: 'On Trip',
    from: [-33.8688, 151.2093], to: [-33.9697, 151.2421], // Sydney → Port Botany
    progress: 0.65,
    route: 'Sydney → Port Botany',
    speed: 72, eta: '22 min',
  },
  {
    id: 'TRK-004', driver: 'Sam Wilson', status: 'Returning',
    from: [-37.8136, 144.9631], to: [-33.8688, 151.2093], // Melbourne → Sydney
    progress: 0.15,
    route: 'Melbourne → Sydney (Return)',
    speed: 100, eta: '6h 10min',
  },
  {
    id: 'TRK-005', driver: 'Unassigned', status: 'Maintenance',
    from: [-33.8688, 151.2093], to: [-33.8688, 151.2093],
    progress: 1,
    route: 'Auburn Service Centre',
    speed: 0, eta: 'Back tomorrow',
  },
]

interface FleetTruck {
  id: string
  driver: string
  status: string
  from: [number, number]
  to: [number, number]
  progress: number
  route: string
  speed: number
  eta: string
  routeCoords?: [number, number][]
  currentPos?: [number, number]
  distance?: number
  duration?: number
}

const STATUS_COLOR: Record<string, string> = {
  'On Trip': '#2563A8',
  'Available': '#059669',
  'Returning': '#F59E0B',
  'Maintenance': '#DC2626',
}

const STATUS_BADGE: Record<string, string> = {
  'On Trip': 'default',
  'Available': 'success',
  'Returning': 'warning',
  'Maintenance': 'danger',
}

function makeTruckIcon(color: string, id: string, speed: number) {
  return L.divIcon({
    className: '',
    html: `<div style="position:relative">
      <div style="
        width:40px;height:40px;background:${color};border-radius:10px;
        border:3px solid white;box-shadow:0 3px 14px rgba(0,0,0,0.35);
        display:flex;align-items:center;justify-content:center;
      ">
        <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
          <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-.5 1.5 1.96 2.5H17V9.5h2.5zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2.22-3c-.55-.61-1.33-1-2.22-1s-1.67.39-2.22 1H3V6h12v9H8.22zM18 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
        </svg>
      </div>
      ${speed > 0 ? `<div style="
        position:absolute;top:-20px;left:50%;transform:translateX(-50%);
        background:rgba(0,0,0,0.75);color:white;padding:1px 5px;
        border-radius:4px;font-size:10px;font-weight:600;white-space:nowrap;font-family:monospace;
      ">${speed}km/h</div>` : ''}
      <div style="
        position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);
        background:${color};color:white;padding:1px 5px;
        border-radius:4px;font-size:9px;font-weight:700;white-space:nowrap;font-family:monospace;
        box-shadow:0 1px 4px rgba(0,0,0,0.2);
      ">${id}</div>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}

function makeEndpointIcon(type: 'A' | 'B') {
  const color = type === 'A' ? '#059669' : '#DC2626'
  return L.divIcon({
    className: '',
    html: `<div style="
      width:30px;height:30px;background:${color};border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);border:2.5px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      display:flex;align-items:center;justify-content:center;
    ">
      <div style="transform:rotate(45deg);color:white;font-size:12px;font-weight:bold;">${type}</div>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  })
}

export default function LiveMap() {
  const navigate = useNavigate()
  const mapDivRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layersRef = useRef<Map<string, { markers: L.Layer[]; poly?: L.Polyline; completedPoly?: L.Polyline }>>(new Map())

  const [fleet, setFleet] = useState<FleetTruck[]>(FLEET)
  const [selected, setSelected] = useState<FleetTruck | null>(null)
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [routesLoaded, setRoutesLoaded] = useState(0)

  // Init map
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return

    const map = L.map(mapDivRef.current, {
      center: [-33.86, 147.0], // centered on NSW/VIC
      zoom: 6,
      zoomControl: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)
    mapRef.current = map
    return () => { map.remove(); mapRef.current = null }
  }, [])

  // Fetch routes for on-trip/returning trucks
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const tripsToFetch = FLEET.filter(t => t.status !== 'Available' && t.status !== 'Maintenance')
    let loaded = 0

    tripsToFetch.forEach(truck => {
      fetchOSRMRoute(truck.from, truck.to)
        .then(({ coords, distance, duration }) => {
          const splitIdx = Math.floor(coords.length * truck.progress)
          const currentPos = coords[splitIdx]
          const completedCoords = coords.slice(0, splitIdx + 1)
          const remainingCoords = coords.slice(splitIdx)

          setFleet(prev => prev.map(t =>
            t.id === truck.id
              ? { ...t, routeCoords: coords, currentPos, distance, duration }
              : t
          ))

          if (!map) return

          // Remove old layers
          const existing = layersRef.current.get(truck.id)
          existing?.markers.forEach(m => map.removeLayer(m))
          existing?.poly?.remove()
          existing?.completedPoly?.remove()

          const layers: L.Layer[] = []
          const color = STATUS_COLOR[truck.status]

          // Completed route (solid green)
          const completedPoly = L.polyline(completedCoords, {
            color: '#059669', weight: 5, opacity: 0.85, lineCap: 'round',
          }).addTo(map)

          // Remaining route (brand-mid dashed)
          const remainingPoly = L.polyline(remainingCoords, {
            color, weight: 4, opacity: 0.7, dashArray: '10, 5', lineCap: 'round',
          }).addTo(map)

          layers.push(remainingPoly)

          // Pickup marker A
          const fromMarker = L.marker(truck.from, { icon: makeEndpointIcon('A') })
            .addTo(map)
            .bindPopup(`<strong>Pickup:</strong> ${truck.route.split(' → ')[0]}`)
          layers.push(fromMarker)

          // Dropoff marker B
          const toMarker = L.marker(truck.to, { icon: makeEndpointIcon('B') })
            .addTo(map)
            .bindPopup(`<strong>Dropoff:</strong> ${truck.route.split(' → ')[1] || truck.route}`)
          layers.push(toMarker)

          // Truck marker (current position)
          const truckMarker = L.marker(currentPos, {
            icon: makeTruckIcon(color, truck.id, truck.speed),
            zIndexOffset: 500,
          }).addTo(map)
            .on('click', () => {
              const updated = { ...truck, currentPos, distance, duration }
              setSelected(updated)
            })
          layers.push(truckMarker)

          layersRef.current.set(truck.id, { markers: layers, poly: remainingPoly, completedPoly })

          loaded++
          setRoutesLoaded(loaded)
          if (loaded === tripsToFetch.length) setLoading(false)
        })
        .catch(err => {
          console.warn(`Route fetch failed for ${truck.id}:`, err)
          loaded++
          if (loaded === tripsToFetch.length) setLoading(false)
        })
    })

    // Place available/maintenance trucks without route
    FLEET.filter(t => t.status === 'Available' || t.status === 'Maintenance').forEach(truck => {
      if (!map) return
      const color = STATUS_COLOR[truck.status]
      const marker = L.marker(truck.from, { icon: makeTruckIcon(color, truck.id, 0) })
        .addTo(map)
        .on('click', () => setSelected(truck))
        .bindPopup(`<strong>${truck.id}</strong> — ${truck.driver}<br>${truck.route}`)

      const existing = layersRef.current.get(truck.id)
      existing?.markers.forEach(m => map.removeLayer(m))
      layersRef.current.set(truck.id, { markers: [marker] })
    })

    if (tripsToFetch.length === 0) setLoading(false)
  }, [])

  const filtered = fleet.filter(t => filter === 'All' || t.status === filter)
  const counts = {
    available: fleet.filter(t => t.status === 'Available').length,
    onTrip: fleet.filter(t => t.status === 'On Trip').length,
    returning: fleet.filter(t => t.status === 'Returning').length,
    maintenance: fleet.filter(t => t.status === 'Maintenance').length,
  }

  function centerOnTruck(truck: FleetTruck) {
    const pos = truck.currentPos || truck.from
    mapRef.current?.setView(pos, 12, { animate: true })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      {/* Map */}
      <div className="absolute inset-0 z-0">
        <div ref={mapDivRef} className="w-full h-full" />
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10 gap-3 pointer-events-none">
            <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-sm font-medium">Loading real routes from OSRM…</p>
            <p className="text-white/50 text-xs">{routesLoaded}/{FLEET.filter(t => t.status !== 'Available' && t.status !== 'Maintenance').length} routes fetched</p>
          </div>
        )}
      </div>

      {/* Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-lg flex flex-col transition-all">
        {/* Row 1: Logo & Title */}
        <div className="flex items-center gap-2 px-3 py-2 sm:p-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 hover:bg-slate-100 transition-all active:scale-95"
          >
            <X size={16} className="text-slate-600" />
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="text-[9px] font-black text-brand uppercase tracking-widest leading-none mb-1">Control Tower</div>
            <div className="text-xs font-black text-slate-800 uppercase tracking-tight leading-none truncate">Live Map · {fleet.length} Units</div>
          </div>

          <div className="flex items-center gap-1">
             <button className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200 text-slate-600">
               <Layers size={14} />
             </button>
          </div>
        </div>

        {/* Row 2: Live Filters (scrollable) */}
        <div className="flex items-center gap-1.5 px-3 pb-2 overflow-x-auto no-scrollbar">
          {['All', 'Available', 'On Trip', 'Returning', 'Maintenance'].map(f => {
            const count = f === 'All' ? fleet.length : fleet.filter(t => t.status === f).length
            const active = filter === f
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 px-2.5 py-1.5 rounded-lg border flex items-center gap-2 transition-all ${
                  active 
                    ? 'bg-brand border-brand text-white shadow-md' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${
                  f === 'Available' ? 'bg-em-green' :
                  f === 'On Trip' ? 'bg-blue-400' :
                  f === 'Returning' ? 'bg-accent' :
                  f === 'Maintenance' ? 'bg-em-red' : 'bg-slate-300'
                } ${active && 'ring-2 ring-white/50'}`} />
                <span className="text-[10px] font-black uppercase tracking-tight whitespace-nowrap">{f} · {count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Legend & Zoom (Desktop) */}
      <div className="absolute bottom-6 left-6 z-20 hidden md:block">
        <div className="bg-white/95 backdrop-blur rounded-2xl px-4 py-3 shadow-xl border border-slate-100">
          <div className="text-[9px] font-black text-slate-400 mb-2 uppercase tracking-widest">Navigation Legend</div>
          <div className="space-y-2">
            {[
              { color: '#059669', label: 'Completed route' },
              { color: '#2563A8', label: 'Remaining route', dashed: true },
            ].map(({ color, label, dashed }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {dashed
                    ? [1, 2, 3].map(i => <div key={i} style={{ background: color }} className="w-2.5 h-1 rounded-full" />)
                    : <div style={{ background: color }} className="w-8 h-1 rounded-full" />
                  }
                </div>
                <span className="text-[10px] font-bold text-slate-600 uppercase">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sheet UI (Mobile/Desktop) */}
      <div className={`absolute bottom-0 inset-x-0 md:inset-x-auto md:right-6 md:bottom-6 z-30 transition-all duration-500 ${
        selected ? 'translate-y-0' : 'translate-y-[calc(100%-48px)] md:translate-y-0'
      }`}>
        <Card className="bg-white/98 backdrop-blur-xl border-t md:border border-slate-200 shadow-2xl overflow-hidden rounded-t-[2.5rem] md:rounded-2xl md:w-80" padding="none">
          {/* Header Handle */}
          <div className="md:hidden w-full flex flex-col items-center pt-3 pb-1" onClick={() => !selected && setSelected(null)}>
            <div className="w-10 h-1.5 bg-slate-200 rounded-full mb-2" />
            {!selected && (
               <div className="flex items-center justify-between w-full px-5 pb-2">
                 <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Fleet Status · {filtered.length} units</span>
                 <Filter size={12} className="text-slate-400" />
               </div>
            )}
          </div>

          {selected ? (
            <div className="animate-in slide-in-from-bottom-10 duration-500">
               <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                  style={{ background: STATUS_COLOR[selected.status] }}
                >
                  <Truck size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-800">{selected.id}</span>
                    <Badge variant={STATUS_BADGE[selected.status] as any} className="text-[8px] font-black border-0 px-1.5 py-0 uppercase">{selected.status}</Badge>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">{selected.driver}</div>
                </div>
                <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"><X size={16} className="text-slate-400" /></button>
              </div>

              <div className="p-4 space-y-4">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <MapPin size={12} className="text-slate-400 mt-1 shrink-0" />
                    <span className="text-xs font-bold text-slate-700 leading-snug">{selected.route}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'ETA', value: selected.eta, icon: Clock },
                    { label: 'Speed', value: selected.speed > 0 ? `${selected.speed} km/h` : 'STOPPED', icon: Navigation },
                    { label: 'Distance', value: selected.distance ? `${(selected.distance / 1000).toFixed(1)} km` : '—', icon: MapPin },
                    { label: 'Duration', value: selected.duration ? `${Math.floor(selected.duration / 3600)}h ${Math.floor((selected.duration % 3600) / 60)}m` : '—', icon: Clock },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-white border border-slate-100 rounded-xl p-2.5 shadow-sm">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon size={10} className="text-slate-300" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</span>
                      </div>
                      <div className="text-[11px] font-black text-slate-800 font-mono leading-none">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 h-9 text-[10px] font-black uppercase tracking-widest rounded-lg" onClick={() => centerOnTruck(selected)}>
                    Center
                  </Button>
                  <Button size="sm" className="flex-1 h-9 text-[10px] font-black uppercase tracking-widest rounded-lg" onClick={() => {
                    if (selected.status === 'Available') navigate('/decision/fleet-assignment')
                    else navigate('/orders/ORD-440/tracking')
                  }}>
                    {selected.status === 'Available' ? 'Assign Job' : 'View Track'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-2 pt-0 max-h-[60vh] overflow-y-auto no-scrollbar">
              {filtered.map(truck => (
                <div
                  key={truck.id}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                  onClick={() => {
                    setSelected(truck)
                    centerOnTruck(truck)
                  }}
                >
                  <div
                    className="w-1.5 self-stretch rounded-full shrink-0"
                    style={{ background: STATUS_COLOR[truck.status] }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-black text-slate-800 font-mono leading-none mb-1">{truck.id}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide truncate">{truck.driver}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-slate-700 leading-none mb-1">{truck.eta}</div>
                    {truck.speed > 0 && (
                      <div className="text-[9px] font-black text-brand-mid font-mono leading-none">{truck.speed}km/h</div>
                    )}
                  </div>
                  <ChevronRight size={14} className="text-slate-200" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
