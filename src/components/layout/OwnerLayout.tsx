import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Clock, AlertCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export function OwnerLayout() {
  const location = useLocation()
  const { user } = useAuth()

  const role           = user?.role ?? 'operator'
  const approvalStatus = user?.approvalStatus ?? 'approved'
  const isRestricted   = role === 'operator' && (approvalStatus === 'pending' || approvalStatus === 'rejected')

  // Admin should only use /admin routes
  if (role === 'admin' && !location.pathname.startsWith('/admin')) {
    return <Navigate to="/admin" replace />
  }

  const allowedRestrictedPaths = ['/dashboard', '/settings', '/documents']
  const isAllowedPath = allowedRestrictedPaths.includes(location.pathname)

  // Restricted operator trying to access full features → send back to dashboard
  if (isRestricted && !isAllowedPath) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar: visible only on md+ */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content: full width on mobile, offset on desktop */}
      <main className="flex-1 md:ml-60 min-h-screen flex flex-col pb-16 md:pb-0 overflow-x-hidden">
        <div className="flex-1 flex flex-col w-full relative">
          {isRestricted && location.pathname === '/dashboard' ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50/50">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-lg border border-slate-100 text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  approvalStatus === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                }`}>
                  {approvalStatus === 'rejected' ? <AlertCircle size={32} /> : <Clock size={32} />}
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  {approvalStatus === 'rejected' ? 'Action Required' : 'Account Under Review'}
                </h2>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  {approvalStatus === 'rejected' 
                    ? 'Some of your documents require attention. Please go to the "Documents" page to resolve the issues.'
                    : 'Your operator profile is currently being reviewed. You will have full access to all features once approved.'}
                </p>
                
                <div className="bg-slate-50 rounded-xl p-4 text-left space-y-4 mb-6 border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500">Account Status</span>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${
                      approvalStatus === 'rejected' ? 'text-red-700 bg-red-100' : 'text-amber-700 bg-amber-100'
                    }`}>
                      {approvalStatus}
                    </span>
                  </div>

                  {approvalStatus === 'rejected' && (
                    <div className="space-y-2.5 pt-3 border-t border-slate-200">
                      <span className="text-xs font-bold text-slate-700 block mb-1">Document Status</span>
                      {[
                        { name: "Operator's Licence", status: "pending" },
                        { name: "Liability Insurance", status: "rejected" },
                        { name: "NHVAS Accreditation", status: "approved" },
                        { name: "Business Registration", status: "not_uploaded" }
                      ].map(doc => {
                        let statusColor = "text-slate-600 bg-slate-100";
                        if (doc.status === 'approved') statusColor = "text-emerald-700 bg-emerald-100";
                        if (doc.status === 'pending') statusColor = "text-amber-700 bg-amber-100";
                        if (doc.status === 'rejected') statusColor = "text-red-700 bg-red-100";
                        
                        return (
                          <div key={doc.name} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm">
                            <span className="text-[11px] font-semibold text-slate-600">{doc.name}</span>
                            <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider ${statusColor}`}>
                              {doc.status.replace('_', ' ')}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  
                  {approvalStatus === 'pending' && (
                    <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                      <span className="text-xs font-semibold text-slate-500">Estimated Time</span>
                      <span className="text-xs font-bold text-slate-700">1-2 Business Days</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>

      {/* Bottom nav: visible only on mobile */}
      {(!isRestricted || isAllowedPath) && <BottomNav />}
    </div>
  )
}
