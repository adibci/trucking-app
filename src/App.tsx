import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { OwnerLayout } from './components/layout/OwnerLayout'
import 'leaflet/dist/leaflet.css'

// Auth
import Splash from './pages/auth/Splash'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

// Owner
import Dashboard from './pages/owner/Dashboard'
import OrderList from './pages/owner/OrderList'
import CreateOrder from './pages/owner/CreateOrder'
import OrderDetail from './pages/owner/OrderDetail'
import OrderTracking from './pages/owner/OrderTracking'
import SystemAnalysis from './pages/owner/SystemAnalysis'
import FleetAssignment from './pages/owner/FleetAssignment'
import BroadcastSetup from './pages/owner/BroadcastSetup'
import FleetList from './pages/owner/FleetList'
import DriverList from './pages/owner/DriverList'
import LiveMap from './pages/owner/LiveMap'
import Marketplace from './pages/owner/Marketplace'
import MarketplaceBidDetail from './pages/owner/MarketplaceBidDetail'
import NetworkMap from './pages/owner/NetworkMap'

// Driver
import DriverHome from './pages/driver/DriverHome'
import JobNotification from './pages/driver/JobNotification'
import ActiveJob from './pages/driver/ActiveJob'
import DriverNav from './pages/driver/DriverNav'
import StatusUpdate from './pages/driver/StatusUpdate'
import POD from './pages/driver/POD'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Owner App */}
        <Route element={<OwnerLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/create" element={<CreateOrder />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/orders/:id/tracking" element={<OrderTracking />} />
          <Route path="/decision" element={<SystemAnalysis />} />
          <Route path="/decision/fleet-assignment" element={<FleetAssignment />} />
          <Route path="/decision/broadcast" element={<BroadcastSetup />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/fleet" element={<FleetList />} />
          <Route path="/drivers" element={<DriverList />} />
          {/* Placeholders for other owner routes */}
          <Route path="/billing" element={<Placeholder title="Billing & Invoices" />} />
          <Route path="/trust" element={<Placeholder title="Trust & Ratings" />} />
          <Route path="/analytics" element={<Placeholder title="Analytics" />} />
          <Route path="/settings" element={<Placeholder title="Settings" />} />
        </Route>

        {/* Full-screen routes (no sidebar) */}
        <Route path="/live-map" element={<LiveMap />} />
        <Route path="/network-map" element={<NetworkMap />} />
        <Route path="/marketplace/bid-detail" element={<MarketplaceBidDetail />} />
        <Route path="/orders/tracking" element={<OrderTracking />} />

        {/* Driver App */}
        <Route path="/driver/home" element={<DriverHome />} />
        <Route path="/driver/notification" element={<JobNotification />} />
        <Route path="/driver/active-job" element={<ActiveJob />} />
        <Route path="/driver/nav" element={<DriverNav />} />
        <Route path="/driver/status-update" element={<StatusUpdate />} />
        <Route path="/driver/pod" element={<POD />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16 bg-white border-b border-gray-100 flex items-center px-6">
        <h1 className="text-lg font-semibold text-text1">{title}</h1>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚧</span>
          </div>
          <h2 className="text-xl font-bold text-text1 mb-2">{title}</h2>
          <p className="text-text3 text-sm">Phase 2 — Coming Soon</p>
        </div>
      </div>
    </div>
  )
}
