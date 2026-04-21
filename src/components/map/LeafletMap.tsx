import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix leaflet default icon broken by bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

export interface RoutePoint {
  lat: number
  lng: number
  label: string
  type: 'pickup' | 'dropoff' | 'truck'
}

export interface RouteSegment {
  from: [number, number]
  to: [number, number]
  color?: string
  dashed?: boolean
}

interface LeafletMapProps {
  center: [number, number]
  zoom?: number
  height?: string | number
  points?: RoutePoint[]
  routeCoords?: [number, number][]
  completedCoords?: [number, number][]
  truckPosition?: [number, number]
  truckHeading?: number
  onMapReady?: (map: L.Map) => void
  className?: string
}

export function LeafletMap({
  center,
  zoom = 13,
  height = 400,
  points = [],
  routeCoords = [],
  completedCoords = [],
  truckPosition,
  onMapReady,
  className = '',
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const routeLayerRef = useRef<L.Polyline | null>(null)
  const completedLayerRef = useRef<L.Polyline | null>(null)
  const truckMarkerRef = useRef<L.Marker | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: false,
      attributionControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    // Custom zoom control (bottom-right on mobile/tablet)
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    mapRef.current = map
    onMapReady?.(map)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Update route polylines
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (routeLayerRef.current) { routeLayerRef.current.remove() }
    if (completedLayerRef.current) { completedLayerRef.current.remove() }

    if (routeCoords.length > 1) {
      routeLayerRef.current = L.polyline(routeCoords, {
        color: '#2563A8',
        weight: 5,
        opacity: 0.85,
        dashArray: '12, 6',
        lineCap: 'round',
      }).addTo(map)
    }

    if (completedCoords.length > 1) {
      completedLayerRef.current = L.polyline(completedCoords, {
        color: '#059669',
        weight: 5,
        opacity: 0.9,
        lineCap: 'round',
      }).addTo(map)
    }
  }, [routeCoords, completedCoords])

  // Update point markers
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    points.forEach(pt => {
      let marker: L.Marker

      if (pt.type === 'pickup') {
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:36px;height:36px;background:#059669;border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);border:3px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,0.3);
            display:flex;align-items:center;justify-content:center;
          ">
            <div style="transform:rotate(45deg);color:white;font-size:14px;font-weight:bold;">A</div>
          </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        })
        marker = L.marker([pt.lat, pt.lng], { icon })
      } else if (pt.type === 'dropoff') {
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:36px;height:36px;background:#DC2626;border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);border:3px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,0.3);
            display:flex;align-items:center;justify-content:center;
          ">
            <div style="transform:rotate(45deg);color:white;font-size:14px;font-weight:bold;">B</div>
          </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        })
        marker = L.marker([pt.lat, pt.lng], { icon })
      } else {
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:38px;height:38px;background:#1A3C5E;border-radius:10px;
            border:3px solid white;box-shadow:0 3px 12px rgba(0,0,0,0.4);
            display:flex;align-items:center;justify-content:center;
          ">
            <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-.5 1.5 1.96 2.5H17V9.5h2.5zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2.22-3c-.55-.61-1.33-1-2.22-1s-1.67.39-2.22 1H3V6h12v9H8.22zM18 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
            </svg>
          </div>
          <div style="
            position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);
            background:rgba(26,60,94,0.9);color:white;padding:2px 6px;
            border-radius:4px;font-size:10px;font-weight:600;white-space:nowrap;font-family:monospace;
          ">${pt.label}</div>`,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        })
        marker = L.marker([pt.lat, pt.lng], { icon })
      }

      marker.bindPopup(`<strong>${pt.label}</strong>`)
      marker.addTo(map)
      markersRef.current.push(marker)
    })
  }, [points])

  // Update truck position (animated)
  useEffect(() => {
    const map = mapRef.current
    if (!map || !truckPosition) return

    if (truckMarkerRef.current) {
      truckMarkerRef.current.setLatLng(truckPosition)
    } else {
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:42px;height:42px;background:#2563A8;border-radius:12px;
          border:3px solid white;box-shadow:0 4px 16px rgba(37,99,168,0.5);
          display:flex;align-items:center;justify-content:center;
          animation:pulse 2s infinite;
        ">
          <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z"/>
          </svg>
        </div>`,
        iconSize: [42, 42],
        iconAnchor: [21, 21],
      })
      truckMarkerRef.current = L.marker(truckPosition, { icon, zIndexOffset: 1000 }).addTo(map)
    }
  }, [truckPosition])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height, width: '100%', zIndex: 0 }}
    />
  )
}

// Fetch real route from OSRM (free, no API key)
export async function fetchOSRMRoute(
  from: [number, number],
  to: [number, number]
): Promise<{ coords: [number, number][]; distance: number; duration: number; steps: OsrmStep[] }> {
  const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson&steps=true`
  const res = await fetch(url)
  const data = await res.json()

  if (data.code !== 'Ok') throw new Error('OSRM route not found')

  const route = data.routes[0]
  const coords: [number, number][] = route.geometry.coordinates.map(
    ([lng, lat]: [number, number]) => [lat, lng]
  )
  const steps: OsrmStep[] = route.legs[0].steps.map((s: any) => ({
    instruction: s.maneuver.type,
    name: s.name || 'unnamed road',
    distance: s.distance,
    duration: s.duration,
    maneuver: s.maneuver.modifier || '',
  }))

  return {
    coords,
    distance: route.distance,
    duration: route.duration,
    steps,
  }
}

export interface OsrmStep {
  instruction: string
  name: string
  distance: number
  duration: number
  maneuver: string
}
