import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Truck, MapPin, Clock, Star, Check, ChevronLeft, Phone, MessageCircle } from 'lucide-react'

const drivers = [
  { id: 'TRK-002', name: 'Anna Chen', vehicle: 'Kenworth T610 · B-Double', distance: 8, eta: '18 min', rating: 4.9, jobs: 312, status: 'Available', cost: 408.40 },
  { id: 'TRK-007', name: 'Ben Torres', vehicle: 'Mack Anthem · 13.6m Semi', distance: 22, eta: '35 min', rating: 4.7, jobs: 218, status: 'Available', cost: 433.40 },
  { id: 'TRK-011', name: 'Mia Walsh', vehicle: 'Volvo FH · Curtainsider', distance: 41, eta: '58 min', rating: 4.8, jobs: 267, status: 'Available', cost: 473.40 },
]

export default function FleetAssignment() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('TRK-002')
  const [assigned, setAssigned] = useState(false)

  const selectedDriver = drivers.find(d => d.id === selected)!

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Internal Fleet Assignment" subtitle="ORD-441 · Sydney CBD → Port Botany" />
      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <button
          onClick={() => navigate('/decision')}
          className="flex items-center gap-1.5 text-sm text-text3 hover:text-text2 mb-5"
        >
          <ChevronLeft size={16} /> Back to Analysis
        </button>

        {!assigned ? (
          <div className="grid grid-cols-3 gap-5">
            {/* Driver selection */}
            <div className="col-span-2">
              <h3 className="font-semibold text-text1 mb-3">Select Driver & Truck</h3>
              <div className="space-y-3">
                {drivers.map(driver => (
                  <Card
                    key={driver.id}
                    className={`cursor-pointer transition-all ${
                      selected === driver.id ? 'ring-2 ring-brand border-brand/30' : 'hover:border-gray-300'
                    }`}
                    onClick={() => setSelected(driver.id)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Select indicator */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selected === driver.id ? 'border-brand bg-brand' : 'border-gray-300'
                      }`}>
                        {selected === driver.id && <Check size={12} className="text-white" />}
                      </div>

                      {/* Avatar */}
                      <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-semibold text-sm shrink-0">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-text1">{driver.name}</span>
                          <span className="text-xs text-text3">{driver.id}</span>
                          <div className="flex items-center gap-1 ml-auto">
                            <Star size={12} className="text-accent fill-accent" />
                            <span className="text-xs font-medium">{driver.rating}</span>
                            <span className="text-xs text-text3">({driver.jobs})</span>
                          </div>
                        </div>
                        <div className="text-xs text-text3 mt-0.5">{driver.vehicle}</div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-text3"><MapPin size={11} /> {driver.distance}km away</span>
                          <span className="flex items-center gap-1 text-xs text-text3"><Clock size={11} /> ETA: {driver.eta}</span>
                          <Badge variant="success">{driver.status}</Badge>
                        </div>
                      </div>

                      {/* Cost */}
                      <div className="text-right shrink-0">
                        <div className="text-xs text-text3">Est. cost</div>
                        <div className="font-bold text-text1 font-mono">${driver.cost.toFixed(2)}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Assignment summary */}
            <div className="space-y-4">
              <Card className="bg-brand-light border-brand/20">
                <h4 className="font-semibold text-text1 mb-3">Assignment Preview</h4>
                <div className="space-y-2">
                  {[
                    ['Driver', selectedDriver.name],
                    ['Truck', selectedDriver.id],
                    ['Vehicle', selectedDriver.vehicle.split(' · ')[0]],
                    ['ETA to Pickup', selectedDriver.eta],
                    ['Distance', `${selectedDriver.distance} km`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm">
                      <span className="text-text3">{k}</span>
                      <span className="font-medium text-text1">{v}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-brand/20 flex justify-between">
                    <span className="text-sm font-semibold text-text1">Total Cost</span>
                    <span className="font-bold text-em-red font-mono">${selectedDriver.cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-text1">Your Margin</span>
                    <span className="font-bold text-em-green font-mono">${(1200 - selectedDriver.cost).toFixed(2)}</span>
                  </div>
                </div>
              </Card>

              <Card>
                <h4 className="font-semibold text-text1 mb-3">Order Details</h4>
                <div className="space-y-2 text-sm">
                  {[
                    ['Order', 'ORD-441'],
                    ['Route', 'Sydney → Port Botany'],
                    ['Distance', '24 km'],
                    ['Pickup', '07:00 today'],
                    ['Order Value', '$1,200'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-text3">{k}</span>
                      <span className="font-medium text-text1">{v}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="space-y-2">
                <Button size="lg" className="w-full" onClick={() => setAssigned(true)}>
                  <Truck size={16} /> Assign {selected} Now
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  Notify Driver First
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Success state */
          <div className="max-w-lg mx-auto text-center pt-10">
            <div className="w-20 h-20 bg-em-green-soft rounded-3xl flex items-center justify-center mx-auto mb-5">
              <Check size={36} className="text-em-green" />
            </div>
            <h2 className="text-2xl font-bold text-text1 mb-2">Job Assigned!</h2>
            <p className="text-text3 mb-8">
              ORD-441 has been assigned to <strong>{selectedDriver.name}</strong> ({selected}). The driver has been notified.
            </p>

            <Card className="text-left mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white font-semibold">
                  {selectedDriver.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-text1">{selectedDriver.name}</div>
                  <div className="text-xs text-text3">{selectedDriver.vehicle}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="success">Notified</Badge>
                    <span className="text-xs text-text3">ETA to pickup: {selectedDriver.eta}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center">
                    <Phone size={14} className="text-text2" />
                  </button>
                  <button className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center">
                    <MessageCircle size={14} className="text-text2" />
                  </button>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button size="lg" variant="outline" className="flex-1" onClick={() => navigate('/orders')}>
                Back to Orders
              </Button>
              <Button size="lg" className="flex-1" onClick={() => navigate('/orders/ORD-441/tracking')}>
                Track Live
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
