import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { X, Layers, Filter, MapPin, Truck, Package, Eye, EyeOff, Navigation, Info, Search, Calendar, ChevronRight, ArrowRight, Map, Settings2, Globe, Target } from 'lucide-react'

// Mock Data for Network View
const FLEET = [
  { id: 'TRK-001', driver: 'Marcus Lee', type: 'B-Double', status: 'On Trip', from: [-33.8151, 151.0011], to: [-37.8136, 144.9631], progress: 0.42, route: 'Parramatta → Melbourne', depCity: 'Parramatta', destCity: 'Melbourne', speed: 95, eta: '3h 40m' },
  { id: 'TRK-002', driver: 'Anna Chen', type: 'Refrigerated', status: 'Available', from: [-33.8688, 151.2093], to: [-33.8688, 151.2093], progress: 1, route: 'Sydney CBD Depot', depCity: 'Sydney', destCity: 'Sydney', speed: 0, eta: 'Ready now' },
  { id: 'TRK-003', driver: 'James Park', type: 'Semi-Trailer', status: 'On Trip', from: [-33.8688, 151.2093], to: [-33.9697, 151.2421], progress: 0.65, route: 'Sydney → Port Botany', depCity: 'Sydney', destCity: 'Port Botany', speed: 72, eta: '22m' },
  { id: 'TRK-004', driver: 'Sam Wilson', type: 'B-Double', status: 'Returning', from: [-37.8136, 144.9631], to: [-33.8688, 151.2093], progress: 0.15, route: 'Melbourne → Sydney', depCity: 'Melbourne', destCity: 'Sydney HQ', speed: 100, eta: '5h 45m' },
  { id: 'TRK-005', driver: 'Unassigned', type: 'Flatbed', status: 'Maintenance', from: [-33.8688, 151.2093], to: [-33.8688, 151.2093], progress: 1, route: 'Auburn Service Centre', depCity: 'Auburn', destCity: 'Service Center', speed: 0, eta: '24h+' },
  { id: 'TRK-006', driver: 'David Smith', type: 'Box Truck', status: 'Returning', from: [-35.2809, 144.9631], to: [-33.8688, 151.2093], progress: 0.35, route: 'Canberra → Sydney', depCity: 'Canberra', destCity: 'Sydney HQ', speed: 92, eta: '2h 10m' },
  { id: 'TRK-007', driver: 'Elena Rodriguez', type: 'Semi-Trailer', status: 'Returning', from: [-37.8136, 144.9631], to: [-34.9285, 138.6007], progress: 0.55, route: 'Melbourne → Adelaide', depCity: 'Melbourne', destCity: 'Adelaide Depot', speed: 88, eta: '4h 20m' },
  { id: 'TRK-008', driver: 'Mike Johnson', type: 'Refrigerated', status: 'Returning', from: [-27.4698, 153.0251], to: [-33.8688, 151.2093], progress: 0.22, route: 'Brisbane → Sydney', depCity: 'Brisbane', destCity: 'Sydney HQ', speed: 90, eta: '7h 15m' },
  { id: 'TRK-009', driver: 'Sarah Connor', type: 'B-Double', status: 'Returning', from: [-32.9267, 151.7789], to: [-33.8688, 151.2093], progress: 0.78, route: 'Newcastle → Sydney', depCity: 'Newcastle', destCity: 'Sydney HQ', speed: 85, eta: '55m' },
  { id: 'TRK-010', driver: 'Chris Pratt', type: 'Flatbed', status: 'Returning', from: [-31.9505, 115.8605], to: [-34.9285, 138.6007], progress: 0.08, route: 'Perth → Adelaide', depCity: 'Perth', destCity: 'Adelaide Depot', speed: 98, eta: '18h 30m' },
  { id: 'TRK-011', driver: 'Robert Downey', type: 'Box Truck', status: 'Available', from: [-33.8151, 151.0011], to: [-33.8151, 151.0011], progress: 1, route: 'Parramatta Yard', depCity: 'Parramatta', destCity: 'Parramatta', speed: 0, eta: 'Now' },
  
  // New 25 Trucks
  { id: 'TRK-012', driver: 'T. Holland', type: 'B-Double', status: 'Returning', from: [-12.4634, 130.8456], to: [-23.6980, 133.8807], progress: 0.25, route: 'Darwin → Alice Springs', depCity: 'Darwin', destCity: 'Alice Springs', speed: 95, eta: '14h 20m' },
  { id: 'TRK-013', driver: 'Zendaya', type: 'Refrigerated', status: 'Returning', from: [-31.9505, 115.8605], to: [-17.9614, 122.2359], progress: 0.45, route: 'Perth → Broome', depCity: 'Perth', destCity: 'Broome', speed: 90, eta: '22h 10m' },
  { id: 'TRK-014', driver: 'B. Cumberbatch', type: 'Semi-Trailer', status: 'Returning', from: [-42.8821, 147.3272], to: [-41.4332, 147.1441], progress: 0.60, route: 'Hobart → Launceston', depCity: 'Hobart', destCity: 'Launceston', speed: 85, eta: '1h 15m' },
  { id: 'TRK-015', driver: 'E. Olsen', type: 'Flatbed', status: 'Returning', from: [-28.0167, 153.4000], to: [-27.4698, 153.0251], progress: 0.85, route: 'Gold Coast → Brisbane', depCity: 'Gold Coast', destCity: 'Brisbane', speed: 80, eta: '45m' },
  { id: 'TRK-016', driver: 'P. Bettany', type: 'Box Truck', status: 'Returning', from: [-34.4278, 150.8931], to: [-33.8688, 151.2093], progress: 0.50, route: 'Wollongong → Sydney', depCity: 'Wollongong', destCity: 'Sydney', speed: 88, eta: '1h 05m' },
  { id: 'TRK-017', driver: 'S. Johansson', type: 'Tanker', status: 'Returning', from: [-16.9186, 145.7781], to: [-19.2590, 146.8169], progress: 0.30, route: 'Cairns → Townsville', depCity: 'Cairns', destCity: 'Townsville', speed: 92, eta: '3h 40m' },
  { id: 'TRK-018', driver: 'M. Ruffalo', type: 'B-Double', status: 'Returning', from: [-37.5622, 143.8503], to: [-37.8136, 144.9631], progress: 0.70, route: 'Ballarat → Melbourne', depCity: 'Ballarat', destCity: 'Melbourne', speed: 85, eta: '1h 20m' },
  { id: 'TRK-019', driver: 'J. Renner', type: 'Refrigerated', status: 'Returning', from: [-36.7570, 144.2794], to: [-37.8136, 144.9631], progress: 0.40, route: 'Bendigo → Melbourne', depCity: 'Bendigo', destCity: 'Melbourne', speed: 82, eta: '1h 50m' },
  { id: 'TRK-020', driver: 'M. Ali', type: 'Semi-Trailer', status: 'Returning', from: [-36.0737, 146.9135], to: [-35.1082, 147.3598], progress: 0.20, route: 'Albury → Wagga Wagga', depCity: 'Albury', destCity: 'Wagga Wagga', speed: 88, eta: '1h 10m' },
  { id: 'TRK-021', driver: 'B. Larson', type: 'Flatbed', status: 'Returning', from: [-32.9283, 151.7817], to: [-33.8688, 151.2093], progress: 0.90, route: 'Newcastle → Sydney', depCity: 'Newcastle', destCity: 'Sydney', speed: 90, eta: '1h 30m' },
  { id: 'TRK-022', driver: 'C. Hemsworth', type: 'Tanker', status: 'Returning', from: [-38.1499, 144.3617], to: [-37.8136, 144.9631], progress: 0.15, route: 'Geelong → Melbourne', depCity: 'Geelong', destCity: 'Melbourne', speed: 85, eta: '50m' },
  { id: 'TRK-023', driver: 'T. Hiddleston', type: 'B-Double', status: 'Returning', from: [-27.5598, 151.9507], to: [-27.4698, 153.0251], progress: 0.35, route: 'Toowoomba → Brisbane', depCity: 'Toowoomba', destCity: 'Brisbane', speed: 88, eta: '1h 45m' },
  { id: 'TRK-024', driver: 'I. Elba', type: 'Refrigerated', status: 'Returning', from: [-23.3750, 150.5111], to: [-21.1411, 149.1861], progress: 0.55, route: 'Rockhampton → Mackay', depCity: 'Rockhampton', destCity: 'Mackay', speed: 90, eta: '4h 10m' },
  { id: 'TRK-025', driver: 'M. Freeman', type: 'Semi-Trailer', status: 'Returning', from: [-33.3256, 115.6369], to: [-31.9505, 115.8605], progress: 0.28, route: 'Bunbury → Perth', depCity: 'Bunbury', destCity: 'Perth', speed: 92, eta: '1h 55m' },
  { id: 'TRK-026', driver: 'C. Evans', type: 'Flatbed', status: 'Returning', from: [-32.4907, 115.7503], to: [-31.9505, 115.8605], progress: 0.75, route: 'Mandurah → Perth', depCity: 'Mandurah', destCity: 'Perth', speed: 85, eta: '50m' },
  { id: 'TRK-027', driver: 'R. Reynolds', type: 'Box Truck', status: 'Returning', from: [-31.4333, 152.9167], to: [-32.9283, 151.7817], progress: 0.65, route: 'Port Macquarie → Newcastle', depCity: 'Port Macquarie', destCity: 'Newcastle', speed: 88, eta: '2h 45m' },
  { id: 'TRK-028', driver: 'H. Jackman', type: 'Tanker', status: 'Returning', from: [-31.0927, 150.9320], to: [-30.5015, 151.6662], progress: 0.42, route: 'Tamworth → Armidale', depCity: 'Tamworth', destCity: 'Armidale', speed: 85, eta: '1h 30m' },
  { id: 'TRK-029', driver: 'G. Gadot', type: 'B-Double', status: 'Returning', from: [-32.2478, 148.6011], to: [-33.2833, 149.1000], progress: 0.18, route: 'Dubbo → Orange', depCity: 'Dubbo', destCity: 'Orange', speed: 90, eta: '1h 50m' },
  { id: 'TRK-030', driver: 'J. Momoa', type: 'Refrigerated', status: 'Returning', from: [-28.7733, 114.6133], to: [-31.9505, 115.8605], progress: 0.05, route: 'Geraldton → Perth', depCity: 'Geraldton', destCity: 'Perth', speed: 95, eta: '5h 10m' },
  { id: 'TRK-031', driver: 'A. Miller', type: 'Semi-Trailer', status: 'Returning', from: [-30.7489, 121.4658], to: [-31.9505, 115.8605], progress: 0.12, route: 'Kalgoorlie → Perth', depCity: 'Kalgoorlie', destCity: 'Perth', speed: 88, eta: '7h 30m' },
  { id: 'TRK-032', driver: 'M. Robbie', type: 'Flatbed', status: 'Returning', from: [-37.8306, 140.7806], to: [-34.9285, 138.6007], progress: 0.38, route: 'Mount Gambier → Adelaide', depCity: 'Mount Gambier', destCity: 'Adelaide', speed: 85, eta: '5h 25m' },
  { id: 'TRK-033', driver: 'N. Kidman', type: 'Tanker', status: 'Returning', from: [-41.1806, 146.3478], to: [-41.4332, 147.1441], progress: 0.82, route: 'Devonport → Launceston', depCity: 'Devonport', destCity: 'Launceston', speed: 82, eta: '1h 10m' },
  { id: 'TRK-034', driver: 'H. Ledger', type: 'Box Truck', status: 'Returning', from: [-41.0506, 145.9083], to: [-41.1806, 146.3478], progress: 0.95, route: 'Burnie → Devonport', depCity: 'Burnie', destCity: 'Devonport', speed: 80, eta: '35m' },
  { id: 'TRK-035', driver: 'G. Pearce', type: 'B-Double', status: 'Returning', from: [-34.1847, 142.1625], to: [-34.9285, 138.6007], progress: 0.20, route: 'Mildura → Adelaide', depCity: 'Mildura', destCity: 'Adelaide', speed: 88, eta: '4h 45m' },
  { id: 'TRK-036', driver: 'E. Bana', type: 'Refrigerated', status: 'Returning', from: [-36.3833, 145.4000], to: [-37.8136, 144.9631], progress: 0.10, route: 'Shepparton → Melbourne', depCity: 'Shepparton', destCity: 'Melbourne', speed: 85, eta: '2h 15m' },
]

const GOODS = [
  { id: 'GD-001', name: 'Grain Shipment', loc: [-35.1234, 147.3689], destination: 'Melbourne Port', destLoc: [-37.8136, 144.9631], weight: '22 Tons', type: 'Agriculture', base: 'Melbourne' },
  { id: 'GD-002', name: 'Mining Parts', loc: [-31.9505, 121.4658], destination: 'Kalgoorlie Yard', destLoc: [-30.7489, 121.4658], weight: '5.5 Tons', type: 'Industrial', base: 'Perth' },
  { id: 'GD-003', name: 'Retail Pack', loc: [-34.4250, 150.8931], destination: 'Sydney Distribution', destLoc: [-33.8688, 151.2093], weight: '12 Tons', type: 'Consumer', base: 'Sydney' },
  { id: 'GD-004', name: 'Chilled Goods', loc: [-36.7570, 144.2794], destination: 'Bendigo Hub', destLoc: [-36.7570, 144.2794], weight: '18 Tons', type: 'Food', base: 'Melbourne' },
]

const MAP_THEMES = {
  Voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  Satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
}

const STATUS_COLOR: Record<string, string> = {
  'On Trip': '#2563EB',
  'Available': '#10B981',
  'Returning': '#EF4444',
  'Maintenance': '#64748B', 
}

const GOODS_COLOR = '#D100D1'

function getBezierPoints(start: [number, number], end: [number, number], progress = 1, pointsCount = 60) {
  const points: [number, number][] = []
  const mid: [number, number] = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]
  const dx = end[1] - start[1]
  const dy = end[0] - start[0]
  const factor = 0.2
  const control: [number, number] = [mid[0] + dx * factor, mid[1] - dy * factor]
  
  const endT = progress
  for (let i = 0; i <= pointsCount; i++) {
    const t = (i / pointsCount) * endT
    const lat = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * control[0] + t * t * end[0]
    const lng = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * control[1] + t * t * end[1]
    points.push([lat, lng])
  }
  return points
}

export default function NetworkMap() {
  const navigate = useNavigate()
  const mapDivRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const tileLayerRef = useRef<L.TileLayer | null>(null)
  
  const [showTrucks, setShowTrucks] = useState(true)
  const [showGoods, setShowGoods] = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('Returning')
  const [filterType, setFilterType] = useState('All')
  const [filterDep, setFilterDep] = useState('All')
  const [filterDest, setFilterDest] = useState('All')
  const [mapTheme, setMapTheme] = useState<keyof typeof MAP_THEMES>('Voyager')
  
  const layersRef = useRef<{
    trucks: L.LayerGroup,
    goods: L.LayerGroup
  }>({
    trucks: L.layerGroup(),
    goods: L.layerGroup()
  })

  const uniqueTypes = Array.from(new Set(FLEET.map(t => t.type))).sort()
  const uniqueDep = Array.from(new Set(FLEET.map(t => t.depCity))).sort()
  const uniqueDest = Array.from(new Set(FLEET.map(t => t.destCity))).sort()

  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return

    const map = L.map(mapDivRef.current, {
      center: [-30.0, 135.0],
      zoom: 5,
      zoomControl: false,
    })

    const tileLayer = L.tileLayer(MAP_THEMES.Voyager, {
      attribution: '© <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19
    }).addTo(map)

    tileLayerRef.current = tileLayer
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    mapRef.current = map
    
    layersRef.current.trucks.addTo(map)
    layersRef.current.goods.addTo(map)

    return () => { map.remove(); mapRef.current = null }
  }, [])

  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return
    tileLayerRef.current.setUrl(MAP_THEMES[mapTheme])
  }, [mapTheme])

  const filteredFleet = FLEET.filter(t => {
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) || t.driver.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All' || t.status === filterStatus
    const matchType = filterType === 'All' || t.type === filterType
    const matchDep = filterDep === 'All' || t.depCity === filterDep
    const matchDest = filterDest === 'All' || t.destCity === filterDest
    return matchSearch && matchStatus && matchType && matchDep && matchDest
  })

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    layersRef.current.trucks.clearLayers()
    layersRef.current.goods.clearLayers()

    const hasSelection = selected !== null

    if (showTrucks) {
      filteredFleet.forEach(truck => {
        const isSelected = hasSelection && selected.id === truck.id
        const isDimmed = hasSelection && !isSelected
        
        const hasTrip = truck.from[0] !== truck.to[0] || truck.from[1] !== truck.to[1]
        const color = STATUS_COLOR[truck.status] || '#2563EB'
        const baseOpacity = isDimmed ? 0.05 : 0.8
        const bgOpacity = isDimmed ? 0.02 : 0.2

        if (hasTrip) {
          const fullPoints = getBezierPoints(truck.from as [number, number], truck.to as [number, number], 1)
          const currentPoints = getBezierPoints(truck.from as [number, number], truck.to as [number, number], truck.progress)
          const currentPos = currentPoints[currentPoints.length - 1]

          L.polyline(fullPoints, {
            color: color, weight: 1.5, opacity: bgOpacity, dashArray: '5, 5', lineCap: 'round'
          }).addTo(layersRef.current.trucks)

          const line = L.polyline(currentPoints, {
            color: color, weight: isSelected ? 4 : 3, opacity: baseOpacity, lineCap: 'round', className: isDimmed ? '' : 'animated-truck-line'
          }).addTo(layersRef.current.trucks)

          line.on('click', (e) => {
            L.DomEvent.stopPropagation(e)
            setSelected({ ...truck, type: 'truck' })
          })

          const icon = L.divIcon({
            className: '',
            html: `<div style="
              width:32px;height:32px;background:${color};border-radius:8px;
              display:flex;align-items:center;justify-content:center;
              border:2px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.15);
              opacity: ${isDimmed ? 0.3 : 1};
              transition: opacity 0.3s;
            ">
              <svg width="18" height="18" fill="white" viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-.5 1.5 1.96 2.5H17V9.5h2.5zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
            </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          })
          L.marker(currentPos, { icon }).addTo(layersRef.current.trucks).on('click', () => setSelected({ ...truck, type: 'truck' }))
        } else {
          const icon = L.divIcon({
            className: '',
            html: `<div style="
              width:28px;height:28px;background:${color};border-radius:50%;
              display:flex;align-items:center;justify-content:center;
              border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.1);
              opacity: ${isDimmed ? 0.3 : 1};
            ">
              <svg width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z"/></svg>
            </div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          })
          L.marker(truck.from as [number, number], { icon }).addTo(layersRef.current.trucks).on('click', () => setSelected({ ...truck, type: 'truck' }))
        }
      })
    }

    if (showGoods) {
      GOODS.forEach(gd => {
        const isSelected = hasSelection && selected.id === gd.id
        const isDimmed = hasSelection && !isSelected
        const goodsOpacity = isDimmed ? 0.05 : 0.4
        const markerOpacity = isDimmed ? 0.3 : 1

        if (gd.destLoc) {
          const goodsPoints = getBezierPoints(gd.loc as [number, number], gd.destLoc as [number, number], 1)
          L.polyline(goodsPoints, {
            color: GOODS_COLOR, weight: isSelected ? 3 : 2, opacity: goodsOpacity, dashArray: '8, 8', lineCap: 'round'
          }).addTo(layersRef.current.goods)
        }

        const icon = L.divIcon({
          className: '',
          html: `<div class="goods-marker" style="
            width:32px;height:32px;background:${GOODS_COLOR};border-radius:10px;
            display:flex;align-items:center;justify-content:center;
            border:2.5px solid white;box-shadow:0 4px 12px rgba(209,0,209,0.3);
            animation: ${isDimmed ? 'none' : 'pulse-goods 2s infinite'};
            opacity: ${markerOpacity};
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        })

        const marker = L.marker(gd.loc as [number, number], { icon }).addTo(layersRef.current.goods)
        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e)
          setSelected({ ...gd, type: 'goods' })
        })
      })
    }
  }, [showTrucks, showGoods, filteredFleet, selected]) // Added selected dependency

  function centerOn(item: any) {
    const pos = item.type === 'truck' ? (item.from as [number, number]) : (item.loc as [number, number])
    mapRef.current?.setView(pos, 8, { animate: true })
    setSelected(item)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-slate-900 font-sans" onClick={() => setSelected(null)}>
      <style>{`
        .animated-truck-line { stroke-dasharray: 8; animation: move-dash 2s linear infinite; }
        @keyframes move-dash { to { stroke-dashoffset: -16; } }
        @keyframes pulse-goods {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(209,0,209,0.4); }
          70% { transform: scale(1.08); box-shadow: 0 0 0 10px rgba(209,0,209,0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(209,0,209,0); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {/* ... rest of UI ... */}
      <div className="absolute inset-0 z-0">
        <div ref={mapDivRef} className="w-full h-full" />
      </div>

      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col gap-3 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg hover:bg-white transition text-slate-600 border border-slate-200"
          >
            <X size={18} />
          </button>

          <div className="flex-1 bg-white/95 backdrop-blur-md rounded-2xl px-5 py-3 shadow-lg flex items-center justify-between border border-slate-200 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-4 shrink-0 pr-4 border-r border-slate-200 mr-4">
              <div>
                <div className="text-[10px] text-blue-600 uppercase tracking-widest font-bold">Network Analytics</div>
                <div className="text-sm font-bold text-slate-800">Advanced Fleet Search</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-bold uppercase ml-1">Search</span>
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="text" 
                    placeholder="ID / Driver..." 
                    className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 h-8 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500 w-44 font-bold text-slate-700 shadow-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold uppercase ml-1">Status</span>
                  <select 
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 h-8 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700 min-w-[100px] shadow-sm cursor-pointer"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="On Trip">On Trip</option>
                    <option value="Available">Available</option>
                    <option value="Returning">Returning</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold uppercase ml-1">Type</span>
                  <select 
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 h-8 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700 min-w-[100px] shadow-sm cursor-pointer"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="All">All Types</option>
                    {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold uppercase ml-1">Departure</span>
                  <select 
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 h-8 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700 min-w-[120px] shadow-sm cursor-pointer"
                    value={filterDep}
                    onChange={(e) => setFilterDep(e.target.value)}
                  >
                    <option value="All">All Origins</option>
                    {uniqueDep.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold uppercase ml-1">Destination</span>
                  <select 
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 h-8 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700 min-w-[120px] shadow-sm cursor-pointer"
                    value={filterDest}
                    onChange={(e) => setFilterDest(e.target.value)}
                  >
                    <option value="All">All Dest.</option>
                    {uniqueDest.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="h-8 w-px bg-slate-200 mx-1" />
              <div className="flex flex-col" onClick={(e) => e.stopPropagation()}>
                <span className="text-[9px] text-slate-400 font-bold uppercase ml-1">Map Theme</span>
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
                  {(Object.keys(MAP_THEMES) as Array<keyof typeof MAP_THEMES>).map(t => (
                    <button
                      key={t}
                      onClick={() => setMapTheme(t)}
                      className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${mapTheme === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-6 top-24 bottom-6 z-20 w-80 flex flex-col gap-4 pointer-events-none">
        <Card className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl flex-1 overflow-hidden pointer-events-auto" padding="none">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Fleet Overview</h3>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold uppercase tracking-wider">{filteredFleet.length} units</span>
          </div>
          <div className="p-2 overflow-y-auto max-h-[calc(100vh-16rem)]">
            {filteredFleet.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings2 size={24} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest">No Matches</p>
                <p className="text-[10px] mt-1">Try adjusting your filters</p>
              </div>
            ) : filteredFleet.map(truck => (
              <div 
                key={truck.id}
                onClick={(e) => { e.stopPropagation(); centerOn({ ...truck, type: 'truck' }) }}
                className={`p-3 rounded-xl mb-1.5 cursor-pointer transition-all border ${selected?.id === truck.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white hover:bg-slate-50 border-transparent shadow-sm hover:shadow'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border border-slate-100 shadow-sm" style={{ background: `${STATUS_COLOR[truck.status]}10`, color: STATUS_COLOR[truck.status] }}>
                    <Truck size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 font-mono tracking-tight">{truck.id}</span>
                      <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-wider">{truck.eta}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-50/80 p-1.5 rounded-lg mb-1.5">
                      <div className="flex-1 min-w-0 flex items-center gap-1">
                        <MapPin size={8} className="text-slate-300" />
                        <span className="truncate text-slate-600 tracking-tight">{truck.depCity}</span>
                      </div>
                      <ArrowRight size={8} className="text-slate-300 shrink-0" />
                      <div className="flex-1 min-w-0 flex items-center gap-1">
                        <MapPin size={8} className="text-blue-400" />
                        <span className="truncate text-blue-700 tracking-tight">{truck.destCity}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-50 pt-1.5">
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tight truncate max-w-[100px]">{truck.type}</div>
                      <Badge variant={truck.status === 'On Trip' ? 'default' : truck.status === 'Available' ? 'success' : 'warning'} className="text-[8px] px-1.5 py-0 h-4 border-0">
                        {truck.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {selected && (
          <Card className="bg-white/98 backdrop-blur-xl border border-white shadow-2xl p-0 overflow-hidden animate-in slide-in-from-bottom-4 ring-1 ring-slate-200 pointer-events-auto" padding="none" onClick={(e) => e.stopPropagation()}>
            <div className={`px-4 py-3 flex items-center justify-between ${selected.type === 'truck' ? 'bg-blue-50/50' : 'bg-amber-50/50 border-b border-amber-100'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                  {selected.type === 'truck' ? <Truck size={20} className="text-blue-600" /> : <Package size={20} className="text-amber-600" />}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800 tracking-tight">{selected.id}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider truncate max-w-[120px]">{selected.driver || selected.type}</div>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelected(null); }} 
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Route Information</div>
                <div className="text-xs font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center gap-2">
                  <Navigation size={12} className="text-blue-500" />
                  {selected.route || selected.name}
                </div>
                {(selected.destination || selected.type) && (
                  <div className="text-xs font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center gap-2 mt-1">
                    <Map size={12} className="text-blue-500" />
                    Dest: {selected.destination || 'Pending'}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="text-[10px] text-slate-400 uppercase font-extrabold mb-1 tracking-tighter">Speed/Weight</div>
                  <div className="text-sm font-black text-slate-800">{selected.speed !== undefined ? `${selected.speed} km/h` : selected.weight}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="text-[10px] text-slate-400 uppercase font-extrabold mb-1 tracking-tighter">Arrival/Base</div>
                  <div className="text-sm font-black text-slate-800">{selected.eta || selected.base}</div>
                </div>
              </div>
              <Button className="w-full text-[11px] font-black uppercase tracking-[0.1em] py-3 rounded-xl shadow-lg bg-slate-900 border-0">
                View Full Operations Track
              </Button>
            </div>
          </Card>
        )}
      </div>

      <div className="absolute bottom-6 left-6 z-20 flex gap-2 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={() => setShowTrucks(!showTrucks)}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl border font-black text-xs transition-all shadow-xl backdrop-blur-md ${showTrucks ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/90 border-slate-200 text-slate-400'}`}
        >
          <Truck size={16} /> Fleet Arcs
        </button>
        <button 
          onClick={() => setShowGoods(!showGoods)}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl border font-black text-xs transition-all shadow-xl backdrop-blur-md ${showGoods ? 'bg-[#D100D1] border-[#B000B0] text-white' : 'bg-white/90 border-slate-200 text-slate-400'}`}
        >
          <Package size={16} /> Market Goods
        </button>
      </div>
    </div>
  )
}
