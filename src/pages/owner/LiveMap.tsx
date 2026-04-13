import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fetchOSRMRoute } from '../../components/map/LeafletMap'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { X, Layers, Filter, MapPin, Clock, Navigation, Truck, Phone, ZoomIn, ZoomOut, AlertCircle } from 'lucide-react'

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

      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center shadow-lg hover:bg-white"
        >
          <X size={18} className="text-text1" />
        </button>

        <div className="flex-1 bg-white/95 backdrop-blur rounded-2xl px-4 py-2.5 shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs text-text3 uppercase tracking-wide font-medium">Control Tower</div>
            <div className="text-sm font-bold text-text1">Live Fleet Map · {fleet.length} Vehicles</div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">{counts.available} Avail</Badge>
            <Badge variant="default">{counts.onTrip} On Trip</Badge>
            {counts.returning > 0 && <Badge variant="warning">{counts.returning} Return</Badge>}
          </div>
        </div>

        <button className="w-10 h-10 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center shadow-lg hover:bg-white">
          <Layers size={18} className="text-text1" />
        </button>
      </div>

      {/* Filter pills */}
      <div className="absolute top-20 left-4 z-20 flex flex-col gap-1.5">
        {['All', 'Available', 'On Trip', 'Returning', 'Maintenance'].map(f => {
          const count = f === 'All' ? fleet.length : fleet.filter(t => t.status === f).length
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all text-left ${
                filter === f
                  ? 'bg-white text-text1 shadow-md'
                  : 'bg-black/40 text-white/80 hover:bg-black/60 backdrop-blur'
              }`}
            >
              <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                f === 'Available' ? 'bg-em-green' :
                f === 'On Trip' ? 'bg-brand-mid' :
                f === 'Returning' ? 'bg-accent' :
                f === 'Maintenance' ? 'bg-em-red' : 'bg-gray-400'
              }`} />
              {f} ({count})
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-white/95 backdrop-blur rounded-2xl px-3 py-2 shadow-lg">
          <div className="text-xs font-semibold text-text3 mb-1.5 uppercase tracking-wide">Legend</div>
          <div className="space-y-1">
            {[
              { color: '#059669', label: 'Completed route' },
              { color: '#2563A8', label: 'Remaining route', dashed: true },
            ].map(({ color, label, dashed }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {dashed
                    ? [1, 2, 3].map(i => <div key={i} style={{ background: color }} className="w-2 h-1 rounded" />)
                    : <div style={{ background: color }} className="w-8 h-1 rounded" />
                  }
                </div>
                <span className="text-xs text-text2">{label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 mt-1">
              <div className="w-4 h-4 bg-em-green rounded-sm flex items-center justify-center text-white text-xs font-bold">A</div>
              <span className="text-xs text-text2">Pickup</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-em-red rounded-sm flex items-center justify-center text-white text-xs font-bold">B</div>
              <span className="text-xs text-text2">Dropoff</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected truck panel */}
      {selected && (
        <div className="absolute bottom-4 right-4 z-20 w-80">
          <Card className="bg-white/97 backdrop-blur shadow-2xl" padding="none">
            <div className="flex items-start gap-3 p-4 border-b border-gray-100">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: STATUS_COLOR[selected.status] }}
              >
                <Truck size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text1">{selected.id}</span>
                  <Badge variant={STATUS_BADGE[selected.status] as any}>{selected.status}</Badge>
                </div>
                <div className="text-xs text-text3 mt-0.5">{selected.driver}</div>
              </div>
              <button onClick={() => setSelected(null)}><X size={15} className="text-text3" /></button>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <MapPin size={14} className="text-text3 mt-0.5 shrink-0" />
                <span className="text-text2">{selected.route}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'ETA', value: selected.eta },
                  { label: 'Speed', value: selected.speed > 0 ? `${selected.speed} km/h` : 'Stopped' },
                  { label: 'Route Distance', value: selected.distance ? `${(selected.distance / 1000).toFixed(1)} km` : '—' },
                  { label: 'Total Duration', value: selected.duration ? `${Math.floor(selected.duration / 3600)}h ${Math.floor((selected.duration % 3600) / 60)}min` : '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-surface rounded-xl p-2.5">
                    <div className="text-xs text-text3">{label}</div>
                    <div className="text-sm font-semibold text-text1 font-mono">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 px-4 pb-4">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => centerOnTruck(selected)}>
                <Navigation size={13} /> Center
              </Button>
              {selected.status === 'On Trip' && (
                <Button size="sm" className="flex-1" onClick={() => navigate('/orders/ORD-440/tracking')}>
                  Full Track
                </Button>
              )}
              {selected.status === 'Available' && (
                <Button size="sm" className="flex-1" onClick={() => navigate('/decision/fleet-assignment')}>
                  Assign Job
                </Button>
              )}
              <Button size="sm" variant="outline">
                <Phone size={13} />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Fleet mini-list */}
      {!selected && (
        <div className="absolute right-4 top-20 z-20 w-64">
          <Card className="bg-white/95 backdrop-blur shadow-xl" padding="none">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-text1">Fleet Status</span>
              <Filter size={13} className="text-text3" />
            </div>
            <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto">
              {filtered.map(truck => (
                <div
                  key={truck.id}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-surface transition"
                  onClick={() => {
                    setSelected(truck)
                    centerOnTruck(truck)
                  }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: STATUS_COLOR[truck.status] }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-text1 font-mono">{truck.id}</div>
                    <div className="text-xs text-text3 truncate">{truck.driver}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-text3 whitespace-nowrap">{truck.eta}</div>
                    {truck.speed > 0 && (
                      <div className="text-xs text-brand-mid font-mono">{truck.speed}km/h</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
