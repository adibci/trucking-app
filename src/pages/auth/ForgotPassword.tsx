import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Radio, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '../../components/ui/Button'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [sent, setSent] = useState(false)

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand rounded-2xl mb-4">
            <Radio size={22} className="text-white" />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          {!sent ? (
            <>
              <div className="w-12 h-12 bg-brand-light rounded-2xl flex items-center justify-center mb-4">
                <Mail size={22} className="text-brand-mid" />
              </div>
              <h2 className="text-xl font-bold text-text1 mb-1">Reset Password</h2>
              <p className="text-text3 text-sm mb-6">
                Enter your email and we'll send a reset link
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-text2 mb-1.5 block">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-text1 text-sm outline-none focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/10"
                    placeholder="you@company.com"
                  />
                </div>
                <Button size="lg" className="w-full rounded-xl" onClick={() => setSent(true)}>
                  Send Reset Link
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-em-green-soft rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-em-green" />
              </div>
              <h2 className="text-xl font-bold text-text1 mb-2">Check your email</h2>
              <p className="text-text3 text-sm mb-6">
                We sent a password reset link to your email address. It expires in 15 minutes.
              </p>
              <Button size="lg" className="w-full rounded-xl mb-3" onClick={() => navigate('/login')}>
                Back to Sign In
              </Button>
              <button
                onClick={() => setSent(false)}
                className="text-sm text-text3 hover:text-text2 transition"
              >
                Resend email
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-5">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-text3 hover:text-text2">
            <ArrowLeft size={14} /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
