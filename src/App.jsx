import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { LoginPage } from './pages/LoginPages'
import { CustomerScreen } from './pages/Customer'
import { EstimateScreen } from './pages/Estimate'
import { ProductScreen } from './pages/Product'
import { TimeLog } from './pages/TimeLog'
import { AdminsScreen } from './pages/Admins'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/customer" element={<CustomerScreen />} />
      <Route path="/estimates" element={<EstimateScreen />} />
      <Route path="/products" element={<ProductScreen />} />
      <Route path="/time-log" element={<TimeLog />} />
      <Route path="/admins" element={<AdminsScreen />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
