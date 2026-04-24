import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Radio, User, Phone, Mail, MapPin, ChevronRight, ChevronLeft,
  Check, Truck, FileText, Shield, Upload, AlertCircle, Camera,
  CreditCard, Star, Calendar, Award
} from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Personal Info', icon: User },
  { id: 2, label: 'Licence & Experience', icon: Award },
  { id: 3, label: 'Vehicle Details', icon: Truck },
  { id: 4, label: 'Documents', icon: FileText },
  { id: 5, label: 'Review & Submit', icon: Shield },
]

const LICENSE_CLASSES = ['MR – Medium Rigid', 'HR – Heavy Rigid', 'HC – Heavy Combination', 'MC – Multi Combination']
const VEHICLE_TYPES = ['B-Double', 'Semi-Trailer', 'Refrigerated', 'Flatbed', 'Box Truck', 'Tanker', 'Livestock', 'Car Carrier']
const YEARS_EXP = ['Less than 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years']
const STATES = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT']

interface FormData {
  firstName: string
  lastName: string
  dob: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  postcode: string
  licenseClass: string
  licenseNumber: string
  licenseExpiry: string
  yearsExp: string
  ownTruck: string
  vehicleType: string
  vehicleRego: string
  hasPhoto: boolean
}

export default function OnboardingDriver() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', dob: '', phone: '', email: '',
    address: '', city: '', state: 'NSW', postcode: '',
    licenseClass: '', licenseNumber: '', licenseExpiry: '',
    yearsExp: '', ownTruck: 'no', vehicleType: '', vehicleRego: '',
    hasPhoto: false,
  })

  function set(field: keyof FormData, value: string | boolean) {
    setForm(p => ({ ...p, [field]: value }))
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-emerald-50 border-4 border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-emerald-500" strokeWidth={3} />
          </div>
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto -mt-8 ml-12 mb-4 border-4 border-white">
            <Truck size={24} className="text-slate-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Profile Created!</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-2">
            Welcome, <span className="font-bold text-slate-700">{form.firstName} {form.lastName}</span>!
          </p>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Your driver profile is under review. You'll receive a notification once approved and matched to jobs.
          </p>
          <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left space-y-2">
            {[
              { label: 'Driver ID', value: 'DRV-' + Math.random().toString(36).substr(2, 8).toUpperCase() },
              { label: 'Status', value: 'Pending Verification' },
              { label: 'License Class', value: form.licenseClass || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                <span className="text-xs font-black text-slate-700">{value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/driver/home')}
            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95"
          >
            Go to Driver App →
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full mt-2 text-slate-400 text-sm py-2 hover:text-slate-600 transition-all"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
            <Truck size={18} className="text-white" />
          </div>
          <div>
            <div className="text-white font-black text-sm leading-none">Truck Apps</div>
            <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider mt-0.5">Driver Onboarding</div>
          </div>
        </div>
        <button onClick={() => navigate('/login')} className="text-white/50 hover:text-white text-xs font-bold transition-all">
          Cancel
        </button>
      </div>

      {/* Progress */}
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
                  active ? 'bg-white text-slate-900' : 'bg-white/10 text-white/40'
                }`}>
                  {done ? <Check size={12} strokeWidth={3} /> : <Icon size={12} />}
                  <span className={`text-[10px] font-black uppercase tracking-wider hidden sm:block`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-px w-4 mx-0.5 transition-all ${done ? 'bg-emerald-500' : 'bg-white/20'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-start justify-center px-4 pb-8 pt-2">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5">
            <div className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-0.5">Step {step} of {STEPS.length}</div>
            <h2 className="text-white text-xl font-black">{STEPS[step - 1].label}</h2>
          </div>

          <div className="p-6 space-y-4">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <>
                {/* Profile Photo */}
                <div className="flex justify-center mb-2">
                  <button
                    onClick={() => set('hasPhoto', true)}
                    className="relative group"
                  >
                    <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all ${form.hasPhoto ? 'bg-slate-800 border-slate-600' : 'bg-slate-100 border-slate-200 hover:border-slate-300'}`}>
                      {form.hasPhoto
                        ? <Check size={28} className="text-white" strokeWidth={3} />
                        : <Camera size={24} className="text-slate-400" />
                      }
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                      <Camera size={12} className="text-white" />
                    </div>
                  </button>
                </div>
                <p className="text-center text-[10px] text-slate-400 font-bold -mt-2 mb-2">Upload Profile Photo</p>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="First Name" required>
                    <input className={inputCls} placeholder="John" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
                  </Field>
                  <Field label="Last Name" required>
                    <input className={inputCls} placeholder="Smith" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
                  </Field>
                </div>
                <Field label="Date of Birth" required>
                  <input className={inputCls} type="date" value={form.dob} onChange={e => set('dob', e.target.value)} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Phone" required>
                    <input className={inputCls} type="tel" placeholder="+61 4XX XXX XXX" value={form.phone} onChange={e => set('phone', e.target.value)} />
                  </Field>
                  <Field label="Email">
                    <input className={inputCls} type="email" placeholder="john@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                  </Field>
                </div>
              </>
            )}

            {/* Step 2: Licence */}
            {step === 2 && (
              <>
                <Field label="Heavy Vehicle Licence Class" required>
                  <div className="space-y-2">
                    {LICENSE_CLASSES.map(cls => (
                      <button
                        key={cls}
                        onClick={() => set('licenseClass', cls)}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between ${form.licenseClass === cls ? 'border-slate-800 bg-slate-800/5' : 'border-gray-100 hover:border-gray-200'}`}
                      >
                        <span className={`text-xs font-black ${form.licenseClass === cls ? 'text-slate-800' : 'text-slate-600'}`}>{cls}</span>
                        {form.licenseClass === cls && <Check size={14} className="text-slate-800" strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Licence Number" required>
                    <input className={inputCls} placeholder="XXXXXXXXXX" value={form.licenseNumber} onChange={e => set('licenseNumber', e.target.value)} />
                  </Field>
                  <Field label="Expiry Date" required>
                    <input className={inputCls} type="date" value={form.licenseExpiry} onChange={e => set('licenseExpiry', e.target.value)} />
                  </Field>
                </div>
                <Field label="Years of Heavy Vehicle Experience" required>
                  <div className="flex flex-wrap gap-2">
                    {YEARS_EXP.map(y => (
                      <button
                        key={y}
                        onClick={() => set('yearsExp', y)}
                        className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold transition-all ${form.yearsExp === y ? 'border-slate-800 bg-slate-800 text-white' : 'border-gray-200 text-slate-600 hover:border-gray-300'}`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </Field>
              </>
            )}

            {/* Step 3: Vehicle Details */}
            {step === 3 && (
              <>
                <Field label="Do you own your vehicle?" required>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: 'yes', label: 'Yes – Owner-Operator', sub: 'I drive my own truck' },
                      { val: 'no', label: 'No – Subcontractor', sub: 'I use company vehicles' },
                    ].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => set('ownTruck', opt.val)}
                        className={`text-left p-3 rounded-xl border-2 transition-all ${form.ownTruck === opt.val ? 'border-slate-800 bg-slate-800/5' : 'border-gray-100 hover:border-gray-200'}`}
                      >
                        <div className={`text-xs font-black ${form.ownTruck === opt.val ? 'text-slate-800' : 'text-slate-600'}`}>{opt.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </Field>
                {form.ownTruck === 'yes' && (
                  <>
                    <Field label="Primary Vehicle Type">
                      <div className="flex flex-wrap gap-2">
                        {VEHICLE_TYPES.map(v => (
                          <button
                            key={v}
                            onClick={() => set('vehicleType', v)}
                            className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold transition-all ${form.vehicleType === v ? 'border-slate-800 bg-slate-800 text-white' : 'border-gray-200 text-slate-600'}`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <Field label="Vehicle Registration">
                      <input className={inputCls} placeholder="e.g. AB 12 CD" value={form.vehicleRego} onChange={e => set('vehicleRego', e.target.value)} />
                    </Field>
                  </>
                )}
                <Field label="Home Base / State">
                  <select className={inputCls} value={form.state} onChange={e => set('state', e.target.value)}>
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
              </>
            )}

            {/* Step 4: Documents */}
            {step === 4 && (
              <>
                {[
                  { label: 'Heavy Vehicle Licence (Front & Back)', sub: 'Photo or scan of your current licence', required: true },
                  { label: 'Medical Fitness Certificate', sub: 'Commercial driver health assessment', required: true },
                  { label: 'Police / Criminal History Check', sub: 'Issued within the last 12 months', required: false },
                  { label: 'Vehicle Registration & CTP (if owner-operator)', sub: 'Required if you own your vehicle', required: false },
                ].map((doc, idx) => (
                  <div key={idx} className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                        <FileText size={16} className="text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-slate-800 flex items-center gap-1">
                          {doc.label}
                          {doc.required && <span className="text-red-400">*</span>}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{doc.sub}</div>
                        <button className="mt-2 flex items-center gap-1.5 text-[11px] font-black text-slate-700 hover:underline">
                          <Upload size={11} />Upload File
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-3">
                  <Shield size={14} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 leading-relaxed">Your documents are encrypted at rest and used only for verification. They will never be shared without your consent.</p>
                </div>
              </>
            )}

            {/* Step 5: Review */}
            {step === 5 && (
              <>
                <div className="space-y-3">
                  {[
                    { section: 'Personal', items: [['Name', `${form.firstName} ${form.lastName}`], ['DOB', form.dob], ['Phone', form.phone], ['Email', form.email]] },
                    { section: 'Licence', items: [['Class', form.licenseClass], ['Number', form.licenseNumber], ['Expiry', form.licenseExpiry], ['Experience', form.yearsExp]] },
                    { section: 'Vehicle', items: [['Owns Truck', form.ownTruck === 'yes' ? 'Yes' : 'No'], ['Type', form.vehicleType || '—'], ['Rego', form.vehicleRego || '—'], ['State', form.state]] },
                  ].map(({ section, items }) => (
                    <div key={section} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{section}</div>
                      <div className="space-y-1.5">
                        {items.map(([label, value]) => (
                          <div key={label} className="flex justify-between gap-2">
                            <span className="text-[11px] text-slate-400 font-bold">{label}</span>
                            <span className="text-[11px] text-slate-800 font-bold text-right">{value || '—'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded" />
                  <span className="text-xs text-slate-500 leading-relaxed">I confirm all information is accurate and I agree to the <span className="text-slate-800 font-bold">Driver Terms</span> and <span className="text-slate-800 font-bold">Privacy Policy</span>.</span>
                </label>
              </>
            )}
          </div>

          {/* Nav buttons */}
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
              className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl text-sm font-black transition-all active:scale-95 shadow-lg"
            >
              {step === 5 ? (<><Check size={16} strokeWidth={3} /> Submit Profile</>) : (<>Continue <ChevronRight size={16} /></>)}
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

const inputCls = "w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-100 text-slate-800 text-sm font-medium bg-white outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10 transition placeholder:text-slate-300"
