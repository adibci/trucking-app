import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../../components/layout/TopBar'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Radio, Star, Clock, MapPin, Truck, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'

const bids = [
  { id: 'BID-001', order: 'ORD-441', route: 'Sydney CBD → Port Botany', company: 'FastHaul Pty Ltd', price: 650, commission: 120, eta: '25 min', rating: 4.8, jobs: 142, trusted: true, timeLeft: '23 min', status: 'Awaiting Selection' },
  { id: 'BID-002', order: 'ORD-441', route: 'Sydney CBD → Port Botany', company: 'Prime Freight AU', price: 720, commission: 80, eta: '31 min', rating: 4.6, jobs: 89, trusted: false, timeLeft: '23 min', status: 'Awaiting Selection' },
  { id: 'BID-003', order: 'ORD-438', route: 'Brisbane → Gold Coast', company: 'SunState Haulage', price: 480, commission: 95, eta: '18 min', rating: 4.9, jobs: 204, trusted: true, timeLeft: '41 min', status: 'Awaiting Selection' },
]

export default function Marketplace() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('active')

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Marketplace" subtitle="Open logistics exchange" />
      <div className="flex-1 p-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Active Broadcasts', value: '3', color: 'text-brand-mid' },
            { label: 'Incoming Bids', value: '5', color: 'text-accent' },
            { label: 'Awaiting Decision', value: '2', color: 'text-em-red' },
            { label: 'Completed Today', value: '8', color: 'text-em-green' },
          ].map(({ label, value, color }) => (
            <Card key={label}>
              <div className={`text-3xl font-bold font-mono ${color}`}>{value}</div>
              <div className="text-xs text-text3 mt-1">{label}</div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl w-fit mb-5 gap-1">
          {['active', 'history'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? 'bg-white text-text1 shadow-sm' : 'text-text3'}`}
            >
              {t === 'active' ? 'Active Bids' : 'History'}
            </button>
          ))}
        </div>

        {/* Bid cards */}
        <div className="space-y-4">
          {bids.map(bid => (
            <Card key={bid.id} className="hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="warning">
                      <Clock size={11} className="mr-1" />
                      {bid.timeLeft} left
                    </Badge>
                    <span className="text-xs font-mono text-text3">{bid.order}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-text1">
                    <MapPin size={13} className="text-text3" /> {bid.route}
                  </div>
                </div>
                <Badge variant={bid.status === 'Awaiting Selection' ? 'warning' : 'success'}>{bid.status}</Badge>
              </div>

              <div className="bg-surface rounded-xl p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      {bid.company.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text1">{bid.company}</div>
                      <div className="flex items-center gap-1">
                        <Star size={11} className="text-accent fill-accent" />
                        <span className="text-xs text-text3">{bid.rating} · {bid.jobs} jobs</span>
                        {bid.trusted && <Badge variant="success" className="text-xs">Trusted</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-text3">Partner charges</div>
                    <div className="text-xl font-bold text-text1 font-mono">${bid.price}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { k: 'Your Commission', v: `$${bid.commission}`, color: 'text-em-green' },
                    { k: 'ETA', v: bid.eta },
                    { k: 'Truck Type', v: '13.6m Semi' },
                  ].map(({ k, v, color }) => (
                    <div key={k} className="bg-white rounded-lg p-2">
                      <div className="text-xs text-text3">{k}</div>
                      <div className={`text-sm font-semibold font-mono ${color || 'text-text1'}`}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate('/marketplace/bid-detail')}>View Details</Button>
                <Button size="sm" className="flex-1" onClick={() => navigate('/marketplace/bids')}>
                  Accept Job
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
