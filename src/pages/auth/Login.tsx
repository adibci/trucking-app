import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Radio, Eye, EyeOff, ArrowRight, Building2, User } from 'lucide-react'
import { Button } from '../../components/ui/Button'

export default function Login() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [role, setRole] = useState<'owner' | 'driver'>('owner')

  return (
    <div className="min-h-screen bg-brand flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center p-12 w-[45%] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-brand-mid/40 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <Radio size={20} className="text-white" />
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">EmptyMiles</span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Smart logistics<br />collaboration for<br />fleet owners
          </h2>
          <p className="text-white/60 text-base leading-relaxed mb-8">
            Connect with partner companies, broadcast jobs, eliminate empty miles and maximize revenue.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Partner Companies', value: '280+' },
              { label: 'Jobs Matched', value: '12.4K' },
              { label: 'Avg. Revenue Gain', value: '34%' },
              { label: 'Empty Miles Cut', value: '61%' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 rounded-2xl p-4">
                <div className="text-2xl font-bold text-white font-mono">{value}</div>
                <div className="text-white/50 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 bg-surface flex items-center justify-center p-8 rounded-l-3xl lg:rounded-l-[40px]">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <Radio size={16} className="text-white" />
            </div>
            <span className="text-brand text-xl font-bold">EmptyMiles</span>
          </div>

          <h2 className="text-2xl font-bold text-text1 mb-1">Welcome back</h2>
          <p className="text-text3 text-sm mb-6">Sign in to your account</p>

          {/* Role switcher */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setRole('owner')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                role === 'owner' ? 'bg-white text-text1 shadow-sm' : 'text-text3'
              }`}
            >
              <Building2 size={15} /> Company Owner
            </button>
            <button
              onClick={() => setRole('driver')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                role === 'driver' ? 'bg-white text-text1 shadow-sm' : 'text-text3'
              }`}
            >
              <User size={15} /> Driver
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-text2 mb-1.5 block">Email Address</label>
              <input
                type="email"
                defaultValue="owner@bctransport.com.au"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-text1 text-sm bg-white outline-none focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/10 transition"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text2 mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  defaultValue="password123"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-text1 text-sm bg-white outline-none focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/10 transition pr-11"
                  placeholder="Your password"
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text3 hover:text-text2"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-xs text-text2">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-xs text-brand-mid font-medium hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              size="lg"
              variant="primary"
              className="w-full rounded-xl font-semibold"
              onClick={() => navigate(role === 'owner' ? '/dashboard' : '/driver/home')}
            >
              Sign In <ArrowRight size={16} />
            </Button>
          </div>

          <p className="text-center text-sm text-text3 mt-6">
            New company?{' '}
            <Link to="/register" className="text-brand-mid font-medium hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
