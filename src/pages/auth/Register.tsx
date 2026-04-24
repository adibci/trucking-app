import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Radio, Building2, User, ChevronRight, Upload } from 'lucide-react'
import { Button } from '../../components/ui/Button'

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [type, setType] = useState<'company' | 'driver'>('company')

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand rounded-2xl mb-4">
            <Radio size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text1">Create Account</h1>
          <p className="text-text3 text-sm mt-1">Join the Truck Apps logistics network</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-8 max-w-[200px] mx-auto w-full">
          {[1, 2].map(s => (
            <div key={s} className={`flex items-center ${s === 1 ? 'flex-1' : ''}`}>
              <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                s <= step ? 'bg-brand text-white' : 'bg-gray-100 text-text3'
              }`}>{s}</div>
              {s < 2 && <div className={`flex-1 h-0.5 mx-3 ${s < step ? 'bg-brand' : 'bg-gray-100'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-text1 mb-1">Account Type</h2>
              <p className="text-text3 text-sm mb-5">Select your role in the network</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { id: 'company', icon: Building2, title: 'Company Owner', desc: 'Manage fleet, orders & partner network' },
                  { id: 'driver', icon: User, title: 'Driver', desc: 'Accept jobs, navigate & update status' },
                ].map(({ id, icon: Icon, title, desc }) => (
                  <button
                    key={id}
                    onClick={() => setType(id as 'company' | 'driver')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      type === id ? 'border-brand-mid bg-brand-light' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                      type === id ? 'bg-brand-mid' : 'bg-gray-100'
                    }`}>
                      <Icon size={18} className={type === id ? 'text-white' : 'text-text3'} />
                    </div>
                    <div className="font-semibold text-text1 text-sm">{title}</div>
                    <div className="text-text3 text-xs mt-1">{desc}</div>
                  </button>
                ))}
              </div>
              <Button size="lg" className="w-full rounded-xl" onClick={() => setStep(2)}>
                Continue <ChevronRight size={16} />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-text1 mb-1">
                {type === 'company' ? 'Company Details' : 'Personal Details'}
              </h2>
              <p className="text-text3 text-sm mb-5">Fill in your information</p>
              <div className="space-y-4">
                {type === 'company' ? (
                  <>
                    <div>
                      <label className="text-xs font-medium text-text2 mb-1.5 block">Company Name</label>
                      <input className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid" placeholder="BC Transport Pty Ltd" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-text2 mb-1.5 block">Email Address</label>
                      <input className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid" placeholder="you@company.com" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-text2 mb-1.5 block">Mobile</label>
                      <input className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid" placeholder="+61 4XX XXX XXX" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-text2 mb-1.5 block">First Name</label>
                        <input className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid" placeholder="John" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-text2 mb-1.5 block">Last Name</label>
                        <input className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid" placeholder="Smith" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-text2 mb-1.5 block">Email Address</label>
                      <input className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid" placeholder="you@example.com" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-text2 mb-1.5 block">Mobile</label>
                      <input className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid" placeholder="+61 4XX XXX XXX" />
                    </div>
                  </>
                )}

                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Password</label>
                  <input type="password" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid" placeholder="Min. 8 characters" />
                </div>
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Confirm Password</label>
                  <input type="password" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-mid" placeholder="Repeat password" />
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded mt-0.5" />
                  <span className="text-xs text-text2">
                    I agree to the <span className="text-brand-mid font-medium">Terms of Service</span> and{' '}
                    <span className="text-brand-mid font-medium">Privacy Policy</span>
                  </span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" size="lg" className="flex-1 rounded-xl" onClick={() => setStep(1)}>Back</Button>
                <Button size="lg" className="flex-1 rounded-xl" onClick={() => navigate(type === 'company' ? '/onboarding/operator' : '/onboarding/driver')}>
                  Create Account
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-text3 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-mid font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
