import { ChevronRight } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'

export default function Settings() {
  return (
    <>
      <TopBar title="Admin Settings" subtitle="Platform configuration and parameters" />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl space-y-4">
          {[
            {
              section: 'Platform Settings',
              items: [
                { label: 'Commission Rate', desc: 'Default platform fee for all completed orders', value: '5.5%' },
                { label: 'Auto-Approval', desc: 'Automatically approve operators with verified ABN', value: 'Off' },
                { label: 'Minimum Insurance Cover', desc: 'Required public liability minimum', value: '$10M' },
              ]
            },
            {
              section: 'Notifications',
              items: [
                { label: 'New Operator Applications', desc: 'Email alerts for new onboarding submissions', value: 'On' },
                { label: 'Document Expiry Alerts', desc: 'Notify 30 days before licence/insurance expiry', value: 'On' },
                { label: 'Daily Activity Digest', desc: 'Summary email of platform activity', value: 'Off' },
              ]
            },
            {
              section: 'Admin Access',
              items: [
                { label: 'Two-Factor Authentication', desc: 'Required for all admin logins', value: 'Enabled' },
                { label: 'Session Timeout', desc: 'Auto logout after inactivity', value: '60 min' },
                { label: 'API Access Keys', desc: 'Manage integration tokens', value: '3 Active' },
              ]
            }
          ].map(({ section, items }) => (
            <div key={section} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{section}</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {items.map(item => (
                  <div key={item.label} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition cursor-pointer group">
                    <div>
                      <div className="text-sm font-black text-slate-800">{item.label}</div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">{item.desc}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-black text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">{item.value}</span>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
