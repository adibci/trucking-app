import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { MapPin, Truck, Package, Calendar, ArrowRight, Plus, X, ChevronLeft, FileText } from 'lucide-react'

const truckTypes = ['13.6m Semi', 'B-Double', 'Road Train', 'Curtainsider', 'Refrigerated', 'Flatbed', 'Container', 'Tipper']
const loadTypes = ['General Freight', 'Palletised', 'Bulk Liquid', 'Refrigerated', 'Hazardous', 'Oversized', 'Steel', 'Container']
const packagingTypes = ['BOXES', 'PALLETS', 'CARTONS', 'CRATES', 'DRUMS', 'BAGS', 'LOOSE']

interface AncillaryRow {
  id: number
  kind: string
  name: string
  quantity: string
}

export default function CreateOrder() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedTruck, setSelectedTruck] = useState('13.6m Semi')
  const [selectedLoad, setSelectedLoad] = useState('General Freight')
  const [priority, setPriority] = useState('Standard')
  const [hazardous, setHazardous] = useState(false)
  const [signRequired, setSignRequired] = useState(false)
  const [ancillaries, setAncillaries] = useState<AncillaryRow[]>([{ id: 1, kind: '', name: '', quantity: '' }])

  function addAncillaryRow() {
    setAncillaries(prev => [...prev, { id: Date.now(), kind: '', name: '', quantity: '' }])
  }

  function removeAncillaryRow(id: number) {
    setAncillaries(prev => prev.filter(r => r.id !== id))
  }

  function updateAncillary(id: number, field: keyof Omit<AncillaryRow, 'id'>, value: string) {
    setAncillaries(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid'

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Create Order" subtitle="New delivery order" />
      <div className="flex-1 p-4 md:p-6 max-w-3xl mx-auto w-full">
        {/* Back */}
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-1.5 text-sm text-text3 hover:text-text2 mb-5"
        >
          <ChevronLeft size={16} /> Back to Orders
        </button>

        {/* Step indicator */}
        <div className="flex items-center mb-7">
          {['Route & Load', 'Schedule', 'Review'].map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none min-w-0">
              <div className={`flex items-center gap-2 shrink-0 ${i + 1 <= step ? 'text-brand-mid' : 'text-text3'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                  i + 1 < step ? 'bg-brand-mid text-white' :
                  i + 1 === step ? 'bg-brand text-white' : 'bg-gray-100 text-text3'
                }`}>{i + 1}</div>
                <span className="text-sm font-medium whitespace-nowrap">{label}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-px mx-2 min-w-[12px] ${i + 1 < step ? 'bg-brand-mid' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* ─── STEP 1 ─────────────────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5">

            {/* Pick Up */}
            <Card>
              <h3 className="font-semibold text-text1 mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-em-green" /> Pick Up
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Location</label>
                    <input className={inputCls} placeholder="Location name" defaultValue="WESTPARK - CEVA Logistics Erskine Park" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Suburb</label>
                    <input className={inputCls} placeholder="Suburb, State, Postcode" defaultValue="Erskine Park NSW 2759" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Address</label>
                  <input className={inputCls} placeholder="Street address" defaultValue="Building A2, Westpark Industrial Estate, 23-107 Erskine Park Rd" />
                </div>
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Instructions</label>
                  <input className={inputCls} placeholder="e.g. Gate code, dock number..." />
                </div>
              </div>
            </Card>

            {/* Delivery */}
            <Card>
              <h3 className="font-semibold text-text1 mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-em-red" /> Delivery
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Location</label>
                    <input className={inputCls} placeholder="Location name" defaultValue="David Jones Burwood" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Suburb</label>
                    <input className={inputCls} placeholder="Suburb, State, Postcode" defaultValue="Burwood NSW 2134" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Address</label>
                  <input className={inputCls} placeholder="Street address" defaultValue="Dock 2 Wilga Street Burwood 2134" />
                </div>
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Instructions</label>
                  <input className={inputCls} placeholder="e.g. Delivery hours, contact on arrival..." />
                </div>
              </div>
            </Card>

            {/* Route preview */}
            <div className="bg-surface rounded-xl p-3 flex items-center justify-between border border-gray-100 gap-2 flex-wrap">
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

            {/* Items and Suggested Vehicle */}
            <Card>
              <h3 className="font-semibold text-text1 mb-4 flex items-center gap-2">
                <Package size={16} className="text-brand-mid" /> Items and Suggested Vehicle
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Consignment #</label>
                  <input className={inputCls} placeholder="e.g. CON-00123" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Number</label>
                    <input type="number" className={inputCls} placeholder="Qty" defaultValue="1" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Packaging</label>
                    <select className={inputCls}>
                      {packagingTypes.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Load Type</label>
                    <select className={inputCls} value={selectedLoad} onChange={e => setSelectedLoad(e.target.value)}>
                      {loadTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Description</label>
                  <input className={inputCls} placeholder="Description of goods" defaultValue="BOXES" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Weight (kg)</label>
                    <input type="number" className={inputCls} placeholder="0.00" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Volume (m³)</label>
                    <input type="number" className={inputCls} placeholder="0.00" />
                  </div>
                </div>

                {/* Dimensions */}
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Dimensions (cm)</label>
                  <div className="flex items-center gap-2">
                    <input type="number" className={`${inputCls} flex-1`} placeholder="L" />
                    <span className="text-text3 text-sm font-medium">×</span>
                    <input type="number" className={`${inputCls} flex-1`} placeholder="W" />
                    <span className="text-text3 text-sm font-medium">×</span>
                    <input type="number" className={`${inputCls} flex-1`} placeholder="H" />
                  </div>
                </div>

                {/* Suggested Vehicle Type */}
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Suggested Vehicle Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                </div>

                {/* Hazardous & Sign */}
                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hazardous}
                      onChange={e => setHazardous(e.target.checked)}
                      className="w-4 h-4 rounded accent-brand-mid cursor-pointer"
                    />
                    <span className="text-sm text-text2">Hazardous Goods</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={signRequired}
                      onChange={e => setSignRequired(e.target.checked)}
                      className="w-4 h-4 rounded accent-brand-mid cursor-pointer"
                    />
                    <span className="text-sm text-text2">Signature Required</span>
                  </label>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button size="lg" className="rounded-xl px-8" onClick={() => setStep(2)}>
                Next: Schedule <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* ─── STEP 2 ─────────────────────────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-5">

            {/* Customer Details */}
            <Card>
              <h3 className="font-semibold text-text1 mb-4">Customer Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Customer / Company</label>
                  <input className={inputCls} placeholder="Company name" defaultValue="Coles Logistics" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Customer Reference</label>
                    <input className={inputCls} placeholder="e.g. DJ BURWOOD; 4C" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Internal Reference</label>
                    <input className={inputCls} placeholder="Internal ref" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Contact Person</label>
                    <input className={inputCls} placeholder="Contact name" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Booked By</label>
                    <input className={inputCls} placeholder="Name of booker" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Order Value</label>
                  <input className={inputCls} placeholder="$" defaultValue="$1,200" />
                </div>
              </div>
            </Card>

            {/* Scheduling */}
            <Card>
              <h3 className="font-semibold text-text1 mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-brand-mid" /> Scheduling
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Earliest Pickup Date</label>
                    <input type="date" className={inputCls} defaultValue="2026-04-10" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Earliest Pickup Time</label>
                    <input type="time" className={inputCls} defaultValue="06:00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Pickup Date</label>
                    <input type="date" defaultValue="2026-04-10" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Pickup Time</label>
                    <input type="time" defaultValue="07:00" className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Required Delivery By</label>
                    <input type="date" defaultValue="2026-04-10" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text2 mb-1.5 block">Delivery Time</label>
                    <input type="time" defaultValue="12:00" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Priority</label>
                  <div className="flex gap-2">
                    {['Standard', 'Urgent', 'Express'].map(p => (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                          priority === p
                            ? 'bg-brand text-white border-brand'
                            : 'border-gray-200 text-text2 hover:border-brand/30 bg-surface'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Ancillaries */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-text1">Ancillaries</h3>
                <button
                  onClick={addAncillaryRow}
                  className="flex items-center gap-1 text-xs text-brand-mid hover:text-brand font-medium"
                >
                  <Plus size={13} /> Add Row
                </button>
              </div>
              <div className="space-y-2">
                {/* Header */}
                <div className="grid grid-cols-[1fr_2fr_1fr_auto] gap-2 text-xs font-medium text-text3 px-1">
                  <span>Kind</span>
                  <span>Name</span>
                  <span>Quantity</span>
                  <span className="w-5" />
                </div>
                {ancillaries.map(row => (
                  <div key={row.id} className="grid grid-cols-[1fr_2fr_1fr_auto] gap-2 items-center">
                    <input
                      className={inputCls}
                      placeholder="Kind"
                      value={row.kind}
                      onChange={e => updateAncillary(row.id, 'kind', e.target.value)}
                    />
                    <input
                      className={inputCls}
                      placeholder="Name"
                      value={row.name}
                      onChange={e => updateAncillary(row.id, 'name', e.target.value)}
                    />
                    <input
                      className={inputCls}
                      placeholder="0"
                      value={row.quantity}
                      onChange={e => updateAncillary(row.id, 'quantity', e.target.value)}
                    />
                    <button
                      onClick={() => removeAncillaryRow(row.id)}
                      className="text-text3 hover:text-em-red transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Notes */}
            <Card>
              <h3 className="font-semibold text-text1 mb-4 flex items-center gap-2">
                <FileText size={16} className="text-brand-mid" /> Notes
              </h3>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid h-24 resize-none"
                placeholder="Any additional notes for this order..."
              />
            </Card>

            <div className="flex justify-between">
              <Button size="lg" variant="outline" className="rounded-xl" onClick={() => setStep(1)}>Back</Button>
              <Button size="lg" className="rounded-xl px-8" onClick={() => setStep(3)}>
                Review Order <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* ─── STEP 3 ─────────────────────────────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-5">
            <Card>
              <h3 className="font-semibold text-text1 mb-4">Order Summary</h3>
              <div className="space-y-3">
                {[
                  { label: 'Pick Up', value: 'WESTPARK - CEVA Logistics Erskine Park' },
                  { label: 'Delivery', value: 'David Jones Burwood' },
                  { label: 'Distance', value: '24 km' },
                  { label: 'Vehicle Type', value: selectedTruck },
                  { label: 'Hazardous Goods', value: hazardous ? 'Yes' : 'No' },
                  { label: 'Signature Required', value: signRequired ? 'Yes' : 'No' },
                  { label: 'Pickup', value: '10 Apr 2026, 07:00' },
                  { label: 'Delivery By', value: '10 Apr 2026, 12:00' },
                  { label: 'Customer', value: 'Coles Logistics' },
                  { label: 'Priority', value: priority },
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
