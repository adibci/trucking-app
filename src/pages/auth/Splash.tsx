import { useNavigate } from 'react-router-dom'
import { Radio, ArrowRight, Truck, Building2, Users } from 'lucide-react'
import { Button } from '../../components/ui/Button'

export default function Splash() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-brand flex flex-col items-center justify-center px-6 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-mid/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-sm w-full text-center">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-accent rounded-3xl mb-6 shadow-xl">
          <Radio size={36} className="text-white" />
        </div>

        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Truck Apps</h1>
        <p className="text-white/60 text-base mb-2">B2B Logistics Collaboration Network</p>
        <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-12">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
          <span className="text-white/80 text-xs font-medium">Australia · Real-time</span>
        </div>

        {/* Value props */}
        <div className="space-y-3 mb-12 text-left">
          {[
            { icon: Building2, text: 'Connect your fleet with partner companies' },
            { icon: Truck, text: 'Eliminate empty miles with smart backlog matching' },
            { icon: Users, text: 'Owner-first platform — drivers just execute' },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/8 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 bg-accent/20 rounded-xl flex items-center justify-center shrink-0">
                <Icon size={16} className="text-accent" />
              </div>
              <p className="text-white/80 text-sm font-medium">{text}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <Button
            size="lg"
            variant="accent"
            className="w-full rounded-2xl font-semibold text-base"
            onClick={() => navigate('/login')}
          >
            Get Started <ArrowRight size={18} />
          </Button>
          <button
            onClick={() => navigate('/login')}
            className="w-full text-white/60 text-sm py-2 hover:text-white/90 transition-colors"
          >
            Already have an account? <span className="text-accent font-medium">Sign in</span>
          </button>
        </div>

        {/* Role selection hint */}
        <div className="mt-8 flex items-center justify-center gap-6">
          {['Company Owner', 'Dispatcher', 'Driver'].map(role => (
            <div key={role} className="text-center">
              <div className="text-white/40 text-xs">{role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
