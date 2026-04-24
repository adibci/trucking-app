import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fetchOSRMRoute } from '../../components/map/LeafletMap'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { X, Filter, MapPin, Clock, Navigation, Truck, Search, ChevronRight, ArrowRight } from 'lucide-react'

// Real Australian coordinates
const FLEET: FleetTruck[] = [
  {
    id: 'TRK-001', driver: 'Marcus Lee', type: 'B-Double', status: 'On Trip',
    from: [-33.8151, 151.0011], to: [-37.8136, 144.9631],
    progress: 0.42, route: 'Parramatta → Melbourne',
    depCity: 'Parramatta', destCity: 'Melbourne', speed: 95, eta: '3h 40m',
  },
  {
    id: 'TRK-002', driver: 'Anna Chen', type: 'Refrigerated', status: 'Available',
    from: [-33.8688, 151.2093], to: [-33.8688, 151.2093],
    progress: 1, route: 'Sydney CBD Depot',
    depCity: 'Sydney', destCity: 'Sydney', speed: 0, eta: 'Ready now',
  },
  {
    id: 'TRK-003', driver: 'James Park', type: 'Semi-Trailer', status: 'On Trip',
    from: [-33.8688, 151.2093], to: [-33.9697, 151.2421],
    progress: 0.65, route: 'Sydney → Port Botany',
    depCity: 'Sydney', destCity: 'Port Botany', speed: 72, eta: '22m',
  },
  {
    id: 'TRK-004', driver: 'Sam Wilson', type: 'B-Double', status: 'Returning',
    from: [-37.8136, 144.9631], to: [-33.8688, 151.2093],
    progress: 0.15, route: 'Melbourne → Sydney (Return)',
    depCity: 'Melbourne', destCity: 'Sydney HQ', speed: 100, eta: '5h 45m',
  },
  {
    id: 'TRK-005', driver: 'Unassigned', type: 'Flatbed', status: 'Maintenance',
    from: [-33.8688, 151.2093], to: [-33.8688, 151.2093],
    progress: 1, route: 'Auburn Service Centre',
    depCity: 'Auburn', destCity: 'Depot', speed: 0, eta: 'Back tomorrow',
  },
]

interface FleetTruck {
  id: string
  driver: string
  type: string
  status: string
  from: [number, number]
  to: [number, number]
  progress: number
  route: string
  depCity: string
  destCity: string
  speed: number
  eta: string
  routeCoords?: [number, number][]
  currentPos?: [number, number]
  distance?: number
  duration?: number
}

const STATUS_COLOR: Record<string, string> = {
  'On Trip': '#2563EB',
  'Available': '#10B981',
  'Returning': '#F59E0B',
  'Maintenance': '#DC2626',
}

const MAP_THEMES = {
  Voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  Satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
}

function makeTruckIcon(color: string, id: string, speed: number) {
  return L.divIcon({
    className: '',
    html: `<div style="position:relative">
      <div style="
        width:36px;height:36px;background:${color};border-radius:9px;
        border:2.5px solid white;box-shadow:0 3px 12px rgba(0,0,0,0.25);
        display:flex;align-items:center;justify-content:center;
      ">
        <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
          <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-.5 1.5 1.96 2.5H17V9.5h2.5zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2.22-3c-.55-.61-1.33-1-2.22-1s-1.67.39-2.22 1H3V6h12v9H8.22zM18 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
        </svg>
      </div>
      ${speed > 0 ? `<div style="
        position:absolute;top:-20px;left:50%;transform:translateX(-50%);
        background:rgba(0,0,0,0.75);color:white;padding:1px 5px;
        border-radius:4px;font-size:9px;font-weight:700;white-space:nowrap;font-family:monospace;
      ">${speed}km/h</div>` : ''}
      <div style="
        position:absolute;bottom:-17px;left:50%;transform:translateX(-50%);
        background:${color};color:white;padding:1px 5px;
        border-radius:4px;font-size:8px;font-weight:700;white-space:nowrap;font-family:monospace;
        box-shadow:0 1px 4px rgba(0,0,0,0.2);
      ">${id}</div>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })
}

function makeEndpointIcon(type: 'A' | 'B') {
  const color = type === 'A' ? '#059669' : '#DC2626'
  return L.divIcon({
    className: '',
    html: `<div style="
      width:28px;height:28px;background:${color};border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);border:2px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.25);
      display:flex;align-items:center;justify-content:center;
    ">
      <div style="transform:rotate(45deg);color:white;font-size:11px;font-weight:bold;">${type}</div>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  })
}

export default function LiveMap() {
  const navigate = useNavigate()
  const mapDivRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const tileLayerRef = useRef<L.TileLayer | null>(null)
  const layersRef = useRef<Map<string, { markers: L.Layer[]; poly?: L.Polyline; completedPoly?: L.Polyline }>>(new Map())

  const [fleet, setFleet] = useState<FleetTruck[]>(FLEET)
  const [selected, setSelected] = useState<FleetTruck | null>(null)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [mapTheme, setMapTheme] = useState<keyof typeof MAP_THEMES>('Voyager')
  const [loading, setLoading] = useState(true)
  const [routesLoaded, setRoutesLoaded] = useState(0)
  const [isOpen, setIsOpen] = useState(true)

  // Init map
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return

    const map = L.map(mapDivRef.current, {
      center: [-33.86, 147.0],
      zoom: 6,
      zoomControl: false,
    })

    const tile = L.tileLayer(MAP_THEMES.Voyager, {
      attribution: '© <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(map)

    tileLayerRef.current = tile
    mapRef.current = map
    return () => { map.remove(); mapRef.current = null }
  }, [])

  // Switch map theme
  useEffect(() => {
    if (!tileLayerRef.current) return
    tileLayerRef.current.setUrl(MAP_THEMES[mapTheme])
  }, [mapTheme])

  // Fetch routes
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
            t.id === truck.id ? { ...t, routeCoords: coords, currentPos, distance, duration } : t
          ))

          if (!map) return
          const existing = layersRef.current.get(truck.id)
          existing?.markers.forEach(m => map.removeLayer(m))
          existing?.poly?.remove()
          existing?.completedPoly?.remove()

          const layers: L.Layer[] = []
          const color = STATUS_COLOR[truck.status]

          const completedPoly = L.polyline(completedCoords, {
            color: '#059669', weight: 5, opacity: 0.85, lineCap: 'round',
          }).addTo(map)

          const remainingPoly = L.polyline(remainingCoords, {
            color, weight: 4, opacity: 0.7, dashArray: '10, 5', lineCap: 'round',
          }).addTo(map)
          layers.push(remainingPoly)

          const fromMarker = L.marker(truck.from, { icon: makeEndpointIcon('A') })
            .addTo(map).bindPopup(`<strong>Pickup:</strong> ${truck.depCity}`)
          layers.push(fromMarker)

          const toMarker = L.marker(truck.to, { icon: makeEndpointIcon('B') })
            .addTo(map).bindPopup(`<strong>Dropoff:</strong> ${truck.destCity}`)
          layers.push(toMarker)

          const truckMarker = L.marker(currentPos, {
            icon: makeTruckIcon(color, truck.id, truck.speed),
            zIndexOffset: 500,
          }).addTo(map).on('click', () => {
            const updated = { ...truck, currentPos, distance, duration }
            setSelected(updated)
          })
          layers.push(truckMarker)

          layersRef.current.set(truck.id, { markers: layers, poly: remainingPoly, completedPoly })

          loaded++
          setRoutesLoaded(loaded)
          if (loaded === tripsToFetch.length) setLoading(false)
        })
        .catch(() => {
          loaded++
          if (loaded === tripsToFetch.length) setLoading(false)
        })
    })

    FLEET.filter(t => t.status === 'Available' || t.status === 'Maintenance').forEach(truck => {
      if (!map) return
      const color = STATUS_COLOR[truck.status]
      const marker = L.marker(truck.from, { icon: makeTruckIcon(color, truck.id, 0) })
        .addTo(map).on('click', () => setSelected(truck))
      const existing = layersRef.current.get(truck.id)
      existing?.markers.forEach(m => map.removeLayer(m))
      layersRef.current.set(truck.id, { markers: [marker] })
    })

    if (tripsToFetch.length === 0) setLoading(false)
  }, [])

  function centerOnTruck(truck: FleetTruck) {
    const pos = truck.currentPos || truck.from
    mapRef.current?.setView(pos, 12, { animate: true })
  }

  const filtered = fleet.filter(t => {
    const matchFilter = filter === 'All' || t.status === filter
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) || t.driver.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" onClick={() => setSelected(null)}>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Map */}
      <div className="absolute inset-0 z-0">
        <div ref={mapDivRef} className="w-full h-full" />
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10 gap-3 pointer-events-none">
            <div className="w-10 h-10 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-sm font-bold">Loading routes…</p>
            <p className="text-white/60 text-xs font-mono">
              {routesLoaded}/{FLEET.filter(t => t.status !== 'Available' && t.status !== 'Maintenance').length} routes
            </p>
          </div>
        )}
      </div>

      {/* ── TOP HEADER ── */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-lg pointer-events-none">
        {/* Row 1: Close + Search + Theme */}
        <div className="flex items-center gap-2 px-3 py-2 pointer-events-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shrink-0 border border-slate-200 hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
          >
            <X size={16} className="text-slate-600" />
          </button>

          <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-1.5 flex-1 border border-slate-200/60 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all min-w-0">
            <Search size={13} className="text-slate-400 shrink-0" />
            <input
              className="text-xs text-slate-700 outline-none bg-transparent w-full placeholder:text-slate-400 font-bold"
              placeholder="ID / Driver..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
            {(Object.keys(MAP_THEMES) as Array<keyof typeof MAP_THEMES>).map(t => (
              <button
                key={t}
                onClick={() => setMapTheme(t)}
                className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${mapTheme === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Status filter pills */}
        <div className="flex items-center gap-1.5 px-3 pb-2 overflow-x-auto no-scrollbar pointer-events-auto">
          {['All', 'Available', 'On Trip', 'Returning', 'Maintenance'].map(f => {
            const count = f === 'All' ? fleet.length : fleet.filter(t => t.status === f).length
            const active = filter === f
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 px-2.5 py-1.5 rounded-lg border flex items-center gap-2 transition-all ${
                  active
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${
                  f === 'Available' ? 'bg-emerald-400' :
                  f === 'On Trip' ? 'bg-blue-400' :
                  f === 'Returning' ? 'bg-amber-400' :
                  f === 'Maintenance' ? 'bg-red-400' : 'bg-slate-300'
                } ${active && 'ring-2 ring-white/50'}`} />
                <span className="text-[10px] font-black uppercase tracking-tight whitespace-nowrap">{f} · {count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── CUSTOM ZOOM BUTTONS ── above the bottom sheet */}
      <div
        className="absolute right-4 z-40 flex flex-col gap-1.5 pointer-events-auto transition-all duration-300"
        style={{ bottom: isOpen ? 'calc(70vh + 12px)' : 'calc(72px + 12px)' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all font-bold text-xl leading-none"
        >+</button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all font-bold text-xl leading-none"
        >−</button>
      </div>

      {/* ── BOTTOM SHEET (mobile) / SIDEBAR (desktop) ── */}
      <div className={`
        fixed lg:absolute right-0 lg:right-6 lg:top-24 lg:bottom-6 z-30 lg:w-80
        flex flex-col pointer-events-none transition-all duration-500 ease-out
        ${isOpen
          ? 'inset-x-0 bottom-0 top-auto h-[70vh] lg:inset-auto lg:h-auto pointer-events-auto'
          : 'inset-x-0 bottom-0 top-auto h-[72px] lg:inset-auto lg:h-auto pointer-events-auto'
        }
      `}>
        <Card
          className="bg-white backdrop-blur-xl border-t lg:border border-slate-200 shadow-2xl flex-1 overflow-hidden pointer-events-auto rounded-t-3xl lg:rounded-2xl"
          padding="none"
        >
          {/* Mobile handle */}
          <div
            className="lg:hidden flex flex-col items-center pt-2.5 pb-2 border-b border-slate-100 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="w-9 h-1 bg-slate-300 hover:bg-slate-400 rounded-full mb-2.5 transition-colors" />
            <div className="flex items-center justify-between w-full px-4">
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                Fleet Status
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              </span>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                {filtered.length} units
              </span>
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:flex sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              Fleet Status
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            </h3>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-black uppercase tracking-tighter">
              {filtered.length} units
            </span>
          </div>

          {/* Fleet list or selected detail */}
          {selected ? (
            <div className="animate-in slide-in-from-bottom-4 duration-300 overflow-y-auto h-full" onClick={e => e.stopPropagation()}>
              {/* Detail header */}
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
                    <Badge
                      variant={selected.status === 'On Trip' ? 'default' : selected.status === 'Available' ? 'success' : selected.status === 'Returning' ? 'warning' : 'danger' as any}
                      className="text-[8px] font-black border-0 px-1.5 py-0 uppercase"
                    >
                      {selected.status}
                    </Badge>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">{selected.driver}</div>
                </div>
                <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                  <X size={16} className="text-slate-400" />
                </button>
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
                  <Button size="sm" className="flex-1 h-9 text-[10px] font-black uppercase tracking-widest rounded-lg bg-slate-900 border-0" onClick={() => {
                    if (selected.status === 'Available') navigate('/decision/fleet-assignment')
                    else navigate('/orders/ORD-440/tracking')
                  }}>
                    {selected.status === 'Available' ? 'Assign Job' : 'View Track'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-y-auto no-scrollbar p-2" style={{ height: 'calc(100% - 3.5rem)' }}>
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search size={22} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest">No Results</p>
                </div>
              ) : filtered.map(truck => (
                <div
                  key={truck.id}
                  onClick={e => { e.stopPropagation(); setSelected(truck); centerOnTruck(truck) }}
                  className={`p-2 rounded-xl mb-1.5 cursor-pointer transition-all border ${
                    selected?.id === truck.id
                      ? 'bg-blue-50/80 border-blue-200 ring-1 ring-blue-100 shadow-sm'
                      : 'bg-white hover:bg-slate-50/80 border-gray-100 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1.5 self-stretch rounded-full shrink-0"
                      style={{ backgroundColor: STATUS_COLOR[truck.status] }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-slate-900 tracking-tight font-mono">{truck.id}</span>
                        <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-mono">{truck.eta}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400 truncate mb-1">
                        <span className="truncate">{truck.depCity}</span>
                        {truck.destCity && truck.destCity !== truck.depCity && (
                          <>
                            <ArrowRight size={7} className="text-slate-300 shrink-0" />
                            <span className="text-blue-500 truncate">{truck.destCity}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[7px] font-black text-slate-400 uppercase truncate">{truck.type}</span>
                        <Badge
                          variant={truck.status === 'On Trip' ? 'default' : truck.status === 'Available' ? 'success' : truck.status === 'Returning' ? 'warning' : 'danger' as any}
                          className="text-[6px] px-1 py-0 h-3 border-0 font-black uppercase shrink-0"
                        >
                          {truck.status}
                        </Badge>
                      </div>
                    </div>
                    {truck.speed > 0 && (
                      <div className="text-right shrink-0">
                        <div className="text-[9px] font-black text-amber-500 font-mono">{truck.speed}km/h</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Legend (Desktop) */}
      <div className="absolute bottom-6 left-6 z-20 hidden md:block">
        <div className="bg-white/95 backdrop-blur rounded-2xl px-4 py-3 shadow-xl border border-slate-100">
          <div className="text-[9px] font-black text-slate-400 mb-2 uppercase tracking-widest">Route Legend</div>
          <div className="space-y-2">
            {[
              { color: '#059669', label: 'Completed' },
              { color: '#2563EB', label: 'Remaining', dashed: true },
            ].map(({ color, label, dashed }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {dashed
                    ? [1, 2, 3].map(i => <div key={i} style={{ background: color }} className="w-2 h-1 rounded-full" />)
                    : <div style={{ background: color }} className="w-8 h-1 rounded-full" />
                  }
                </div>
                <span className="text-[10px] font-bold text-slate-600 uppercase">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
