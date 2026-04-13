import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { MapPin, Truck, Package, Calendar, ArrowRight, Plus, X, ChevronLeft } from 'lucide-react'

const truckTypes = ['13.6m Semi', 'B-Double', 'Road Train', 'Curtainsider', 'Refrigerated', 'Flatbed', 'Container', 'Tipper']
const loadTypes = ['General Freight', 'Palletised', 'Bulk Liquid', 'Refrigerated', 'Hazardous', 'Oversized', 'Steel', 'Container']

export default function CreateOrder() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedTruck, setSelectedTruck] = useState('13.6m Semi')
  const [selectedLoad, setSelectedLoad] = useState('General Freight')

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Create Order" subtitle="New delivery order" />
      <div className="flex-1 p-6 max-w-3xl mx-auto w-full">
        {/* Back */}
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-1.5 text-sm text-text3 hover:text-text2 mb-5"
        >
          <ChevronLeft size={16} /> Back to Orders
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-7">
          {['Route & Load', 'Schedule', 'Review'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 ${i + 1 <= step ? 'text-brand-mid' : 'text-text3'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                  i + 1 < step ? 'bg-brand-mid text-white' :
                  i + 1 === step ? 'bg-brand text-white' : 'bg-gray-100 text-text3'
                }`}>{i + 1}</div>
                <span className="text-sm font-medium">{label}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-px w-12 ${i + 1 < step ? 'bg-brand-mid' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-5">
            <Card>
              <h3 className="font-semibold text-text1 mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-brand-mid" /> Route Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Pickup Location</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-em-green" />
                    <input
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid"
                      placeholder="Enter pickup address or search..."
                      defaultValue="Sydney CBD, NSW 2000"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Drop-off Location</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-em-red" />
                    <input
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid"
                      placeholder="Enter drop-off address..."
                      defaultValue="Port Botany, NSW 2036"
                    />
                  </div>
                </div>

                {/* Route preview */}
                <div className="bg-surface rounded-xl p-3 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-text3">Distance:</span>{' '}
                    <span className="font-semibold text-text1 font-mono">24 km</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-text3">Est. time:</span>{' '}
                    <span className="font-semibold text-text1">38 min</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-text3">Est. toll:</span>{' '}
                    <span className="font-semibold text-text1 font-mono">$8.40</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-text1 mb-4 flex items-center gap-2">
                <Truck size={16} className="text-brand-mid" /> Truck Type Required
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {truckTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedTruck(type)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium text-center transition-all border ${
                      selectedTruck === type
                        ? 'bg-brand text-white border-brand'
                        : 'bg-surface border-gray-100 text-text2 hover:border-brand/30'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-text1 mb-4 flex items-center gap-2">
                <Package size={16} className="text-brand-mid" /> Load Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Load Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {loadTypes.slice(0, 4).map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedLoad(type)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium text-center border transition-all ${
                          selectedLoad === type
                            ? 'bg-brand-mid text-white border-brand-mid'
                            : 'bg-surface border-gray-100 text-text2 hover:border-brand-mid/30'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Weight (tonnes)</label>
                    <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid" placeholder="e.g. 18.5" defaultValue="18.5" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Pallets / Units</label>
                    <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid" placeholder="e.g. 24 pallets" defaultValue="24" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <label className="text-xs font-medium text-text2 mb-1.5 block">Special Instructions</label>
                <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid h-20 resize-none" placeholder="Any special handling instructions..." />
              </div>
            </Card>

            <div className="flex justify-end">
              <Button size="lg" className="rounded-xl px-8" onClick={() => setStep(2)}>
                Next: Schedule <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <Card>
              <h3 className="font-semibold text-text1 mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-brand-mid" /> Scheduling
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Pickup Date</label>
                  <input type="date" defaultValue="2026-04-06" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid" />
                </div>
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Pickup Time</label>
                  <input type="time" defaultValue="07:00" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid" />
                </div>
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Required Delivery By</label>
                  <input type="date" defaultValue="2026-04-06" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid" />
                </div>
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Delivery Time</label>
                  <input type="time" defaultValue="12:00" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid" />
                </div>
              </div>
              <div className="mt-4">
                <label className="text-xs font-medium text-text2 mb-1.5 block">Priority</label>
                <div className="flex gap-2">
                  {['Standard', 'Urgent', 'Express'].map(p => (
                    <button key={p} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      p === 'Standard' ? 'bg-brand text-white border-brand' : 'border-gray-200 text-text2 hover:border-brand/30 bg-surface'
                    }`}>{p}</button>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-text1 mb-4">Customer Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Customer / Company</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid" placeholder="Company name" defaultValue="Coles Logistics" />
                </div>
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Contact Person</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid" placeholder="Contact name" />
                </div>
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Reference Number</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid" placeholder="e.g. PO-12345" />
                </div>
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Order Value</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid" placeholder="$" defaultValue="$1,200" />
                </div>
              </div>
            </Card>

            <div className="flex justify-between">
              <Button size="lg" variant="outline" className="rounded-xl" onClick={() => setStep(1)}>Back</Button>
              <Button size="lg" className="rounded-xl px-8" onClick={() => setStep(3)}>
                Review Order <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <Card>
              <h3 className="font-semibold text-text1 mb-4">Order Summary</h3>
              <div className="space-y-3">
                {[
                  { label: 'Route', value: 'Sydney CBD → Port Botany' },
                  { label: 'Distance', value: '24 km' },
                  { label: 'Truck Type', value: '13.6m Semi' },
                  { label: 'Load', value: 'General Freight · 18.5t · 24 pallets' },
                  { label: 'Pickup', value: 'Mon 6 Apr 2026, 07:00' },
                  { label: 'Delivery By', value: 'Mon 6 Apr 2026, 12:00' },
                  { label: 'Customer', value: 'Coles Logistics' },
                  { label: 'Order Value', value: '$1,200.00' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-text3">{label}</span>
                    <span className="text-sm font-medium text-text1">{value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-em-green-soft border-em-green/20">
              <div className="flex items-center gap-2 text-em-green font-semibold mb-1">
                <Truck size={16} />
                System Suggestion
              </div>
              <p className="text-sm text-text2">TRK-002 is 8km from pickup and available now. Estimated cost: $320. Margin: $880.</p>
              <Button size="sm" className="mt-3">Go to Analysis →</Button>
            </Card>

            <div className="flex justify-between">
              <Button size="lg" variant="outline" className="rounded-xl" onClick={() => setStep(2)}>Back</Button>
              <div className="flex gap-3">
                <Button size="lg" variant="outline" className="rounded-xl" onClick={() => navigate('/decision')}>
                  Analyse First
                </Button>
                <Button size="lg" variant="accent" className="rounded-xl px-8" onClick={() => navigate('/orders')}>
                  <Plus size={16} /> Create Order
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
