import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { LoginPage } from './pages/LoginPages'
import { CustomerScreen } from './pages/Customer'
import { EstimateScreen } from './pages/Estimate'
import {ProductScreen} from './pages/Product'
import { TimeLog } from './pages/TimeLog'
import { AdminsScreen } from './pages/Admins'

function App() {
  return (
    <Routes>
      {/* Route par défaut : redirection vers /login (tu peux changer vers /dashboard si tu préfères) */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Page de login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Tableau de bord */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Gestion des utilisateurs */}
      <Route path="/customer" element={<CustomerScreen />} />

      {/* Devis */}
      <Route path="/estimates" element={<EstimateScreen />} />

      {/* Products */}
      <Route path="/products" element={<ProductScreen />} />

      {/* Suivi du temps */}
      <Route path="/time-log" element={<TimeLog />} />

      {/* Clients */}
      <Route path="/admins" element={<AdminsScreen />} />


      {/* Route catch-all : si l'URL ne correspond à rien */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
