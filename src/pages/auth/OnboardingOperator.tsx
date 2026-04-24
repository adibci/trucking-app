import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Radio, Building2, User, Phone, Mail, MapPin, ChevronRight,
  ChevronLeft, Check, Truck, FileText, Shield, Globe, Upload,
  AlertCircle, Package, Star, Clock, Briefcase
} from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Company Info', icon: Building2 },
  { id: 2, label: 'Contact & Location', icon: MapPin },
  { id: 3, label: 'Fleet Details', icon: Truck },
  { id: 4, label: 'Documents', icon: FileText },
  { id: 5, label: 'Review & Submit', icon: Shield },
]

interface FormData {
  companyName: string
  abn: string
  operatorType: string
  fleetSize: string
  contactName: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  postcode: string
  vehicleTypes: string[]
  routes: string[]
  license: string
  insurance: string
  accreditation: string
}

const VEHICLE_TYPES = ['B-Double', 'Semi-Trailer', 'Refrigerated', 'Flatbed', 'Box Truck', 'Tanker', 'Livestock', 'Car Carrier']
const ROUTE_TYPES = ['Metro / City', 'Interstate', 'Regional', 'Remote / Outback', 'Port Logistics']
const STATES = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT']

export default function OnboardingOperator() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<FormData>({
    companyName: '', abn: '', operatorType: 'owner-operator', fleetSize: '',
    contactName: '', phone: '', email: '', address: '', city: '', state: 'NSW', postcode: '',
    vehicleTypes: [], routes: [], license: '', insurance: '', accreditation: '',
  })

  function toggle(field: 'vehicleTypes' | 'routes', value: string) {
    setForm(p => ({
      ...p,
      [field]: p[field].includes(value) ? p[field].filter(v => v !== value) : [...p[field], value]
    }))
  }

  function set(field: keyof FormData, value: string) {
    setForm(p => ({ ...p, [field]: value }))
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f2142] to-[#1a3a6e] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-emerald-50 border-4 border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-emerald-500" strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Application Submitted!</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-2">
            Welcome, <span className="font-bold text-slate-700">{form.companyName || 'Operator'}</span>!
          </p>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Your operator profile is under review. We'll notify you within <strong>1–2 business days</strong> once verified.
          </p>
          <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left space-y-2">
            {[
              { label: 'Application ID', value: 'OP-' + Math.random().toString(36).substr(2, 8).toUpperCase() },
              { label: 'Status', value: 'Under Review' },
              { label: 'Estimated Review', value: '1–2 Business Days' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                <span className="text-xs font-black text-slate-700">{value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              localStorage.setItem('role', 'operator')
              localStorage.setItem('approvalStatus', 'pending')
              navigate('/dashboard')
            }}
            className="w-full bg-[#0f2142] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#1a3a6e] transition-all active:scale-95"
          >
            Enter Application
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2142] via-[#1a3060] to-[#0f2142] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
            <Radio size={18} className="text-white" />
          </div>
          <div>
            <div className="text-white font-black text-sm leading-none">Truck Apps</div>
            <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider mt-0.5">Operator Onboarding</div>
          </div>
        </div>
        <button onClick={() => navigate('/login')} className="text-white/50 hover:text-white text-xs font-bold transition-all">
          Cancel
        </button>
      </div>

      {/* Progress stepper */}
      <div className="px-6 py-4 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max mx-auto max-w-2xl">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const done = step > s.id
            const active = step === s.id
            return (
              <div key={s.id} className="flex items-center">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
                  done ? 'bg-emerald-500 text-white' :
                  active ? 'bg-white text-[#0f2142]' : 'bg-white/10 text-white/40'
                }`}>
                  {done ? <Check size={12} strokeWidth={3} /> : <Icon size={12} />}
                  <span className={`text-[10px] font-black uppercase tracking-wider hidden sm:block ${active ? 'text-[#0f2142]' : ''}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-4 mx-0.5 transition-all ${done ? 'bg-emerald-500' : 'bg-white/20'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form Card */}
      <div className="flex-1 flex items-start justify-center px-4 pb-8 pt-2">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#0f2142] to-[#1a4080] px-6 py-5">
            <div className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-0.5">Step {step} of {STEPS.length}</div>
            <h2 className="text-white text-xl font-black">{STEPS[step - 1].label}</h2>
          </div>

          <div className="p-6 space-y-4">
            {/* Step 1: Company Info */}
            {step === 1 && (
              <>
                <Field label="Company / Business Name" required>
                  <input className={inputCls} placeholder="e.g. BC Transport Pty Ltd" value={form.companyName} onChange={e => set('companyName', e.target.value)} />
                </Field>
                <Field label="ABN (Australian Business Number)" required>
                  <input className={inputCls} placeholder="XX XXX XXX XXX" value={form.abn} onChange={e => set('abn', e.target.value)} />
                </Field>
                <Field label="Operator Type" required>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'owner-operator', label: 'Owner-Operator', sub: 'You drive your own truck' },
                      { id: 'fleet-company', label: 'Fleet Company', sub: 'Multiple trucks & drivers' },
                      { id: 'freight-broker', label: 'Freight Broker', sub: 'Coordinate loads only' },
                      { id: 'logistics-provider', label: 'Logistics Provider', sub: 'End-to-end logistics' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => set('operatorType', opt.id)}
                        className={`text-left p-3 rounded-xl border-2 transition-all ${form.operatorType === opt.id ? 'border-[#0f2142] bg-[#0f2142]/5' : 'border-gray-100 hover:border-gray-200'}`}
                      >
                        <div className={`text-xs font-black ${form.operatorType === opt.id ? 'text-[#0f2142]' : 'text-slate-700'}`}>{opt.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Number of Vehicles in Fleet">
                  <input className={inputCls} type="number" placeholder="e.g. 12" value={form.fleetSize} onChange={e => set('fleetSize', e.target.value)} />
                </Field>
              </>
            )}

            {/* Step 2: Contact & Location */}
            {step === 2 && (
              <>
                <Field label="Primary Contact Name" required>
                  <input className={inputCls} placeholder="Full name" value={form.contactName} onChange={e => set('contactName', e.target.value)} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Phone" required>
                    <input className={inputCls} type="tel" placeholder="+61 4XX XXX XXX" value={form.phone} onChange={e => set('phone', e.target.value)} />
                  </Field>
                  <Field label="Email" required>
                    <input className={inputCls} type="email" placeholder="ops@company.com" value={form.email} onChange={e => set('email', e.target.value)} />
                  </Field>
                </div>
                <Field label="Street Address" required>
                  <input className={inputCls} placeholder="123 Depot Road" value={form.address} onChange={e => set('address', e.target.value)} />
                </Field>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="City">
                    <input className={inputCls} placeholder="Sydney" value={form.city} onChange={e => set('city', e.target.value)} />
                  </Field>
                  <Field label="State">
                    <select className={inputCls} value={form.state} onChange={e => set('state', e.target.value)}>
                      {STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Postcode">
                    <input className={inputCls} placeholder="2000" value={form.postcode} onChange={e => set('postcode', e.target.value)} />
                  </Field>
                </div>
              </>
            )}

            {/* Step 3: Fleet Details */}
            {step === 3 && (
              <>
                <Field label="Vehicle Types Operating" required>
                  <div className="flex flex-wrap gap-2">
                    {VEHICLE_TYPES.map(v => (
                      <button
                        key={v}
                        onClick={() => toggle('vehicleTypes', v)}
                        className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                          form.vehicleTypes.includes(v) ? 'border-[#0f2142] bg-[#0f2142] text-white' : 'border-gray-200 text-slate-600 hover:border-gray-300'
                        }`}
                      >
                        <Truck size={11} />
                        {v}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Operating Routes / Corridors" required>
                  <div className="flex flex-wrap gap-2">
                    {ROUTE_TYPES.map(r => (
                      <button
                        key={r}
                        onClick={() => toggle('routes', r)}
                        className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                          form.routes.includes(r) ? 'border-[#0f2142] bg-[#0f2142] text-white' : 'border-gray-200 text-slate-600 hover:border-gray-300'
                        }`}
                      >
                        <Globe size={11} />
                        {r}
                      </button>
                    ))}
                  </div>
                </Field>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-3">
                  <AlertCircle size={14} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 leading-relaxed">Select all vehicle types and routes that apply to your operations. This helps match you with relevant freight opportunities.</p>
                </div>
              </>
            )}

            {/* Step 4: Documents */}
            {step === 4 && (
              <>
                {[
                  { key: 'license', label: "Transport Operator's Licence", sub: 'Heavy vehicle operator licence issued by your state authority', required: true },
                  { key: 'insurance', label: 'Public Liability Insurance', sub: 'Minimum $10M cover — upload certificate of currency', required: true },
                  { key: 'accreditation', label: 'NHVAS Accreditation (optional)', sub: 'Mass Management, Maintenance Management or Basic Fatigue', required: false },
                ].map(doc => (
                  <div key={doc.key} className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                        <FileText size={16} className="text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-slate-800 flex items-center gap-1">
                          {doc.label}
                          {doc.required && <span className="text-red-400">*</span>}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{doc.sub}</div>
                        <button className="mt-2 flex items-center gap-1.5 text-[11px] font-black text-[#0f2142] hover:underline">
                          <Upload size={11} />
                          Upload PDF / Image
                        </button>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center shrink-0" />
                    </div>
                  </div>
                ))}
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-3">
                  <Shield size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed">All documents are encrypted and securely stored. They are only accessible to authorised Truck Apps compliance personnel.</p>
                </div>
              </>
            )}

            {/* Step 5: Review */}
            {step === 5 && (
              <>
                <div className="space-y-3">
                  {[
                    { section: 'Company', items: [['Name', form.companyName], ['ABN', form.abn], ['Type', form.operatorType.replace(/-/g, ' ')], ['Fleet Size', form.fleetSize]] },
                    { section: 'Contact', items: [['Contact', form.contactName], ['Phone', form.phone], ['Email', form.email], ['Address', [form.address, form.city, form.state, form.postcode].filter(Boolean).join(', ')]] },
                    { section: 'Fleet', items: [['Vehicles', form.vehicleTypes.join(', ') || '—'], ['Routes', form.routes.join(', ') || '—']] },
                  ].map(({ section, items }) => (
                    <div key={section} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{section}</div>
                      <div className="space-y-1.5">
                        {items.map(([label, value]) => (
                          <div key={label} className="flex justify-between gap-2">
                            <span className="text-[11px] text-slate-400 font-bold">{label}</span>
                            <span className="text-[11px] text-slate-800 font-bold text-right truncate max-w-[55%]">{value || '—'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded" />
                  <span className="text-xs text-slate-500 leading-relaxed">I confirm that all information provided is accurate and I agree to the <span className="text-[#0f2142] font-bold">Terms of Service</span> and <span className="text-[#0f2142] font-bold">Privacy Policy</span>.</span>
                </label>
              </>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="px-6 pb-6 flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-slate-700 text-sm font-bold hover:border-gray-300 transition-all active:scale-95"
              >
                <ChevronLeft size={16} /> Back
              </button>
            )}
            <button
              onClick={() => step < 5 ? setStep(s => s + 1) : setSubmitted(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-[#0f2142] hover:bg-[#1a3a6e] text-white py-3 rounded-xl text-sm font-black transition-all active:scale-95 shadow-lg shadow-[#0f2142]/20"
            >
              {step === 5 ? (<><Check size={16} strokeWidth={3} /> Submit Application</>) : (<>Continue <ChevronRight size={16} /></>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = "w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-100 text-slate-800 text-sm font-medium bg-white outline-none focus:border-[#0f2142] focus:ring-2 focus:ring-[#0f2142]/10 transition placeholder:text-slate-300"
