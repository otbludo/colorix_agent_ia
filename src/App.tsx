import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { LoginPage } from './pages/LoginPages'
import { UserManagement } from './pages/UserManagement'
import { Quotes } from './pages/Quotes'
import { TimeLog } from './pages/TimeLog'
import { Customers } from './pages/Customers'
import { Settings } from './pages/Settings'

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
      <Route path="/users" element={<UserManagement />} />

      {/* Devis */}
      <Route path="/quotes" element={<Quotes />} />

      {/* Suivi du temps */}
      <Route path="/time-log" element={<TimeLog />} />

      {/* Clients */}
      <Route path="/customers" element={<Customers />} />

      {/* Paramètres */}
      <Route path="/settings" element={<Settings />} />

      {/* Route catch-all : si l'URL ne correspond à rien */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
