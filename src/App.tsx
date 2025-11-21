import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { LoginPage } from './pages/LoginPages'

function App() {
  return (
    <Routes>
      {/* Route par défaut : redirection vers /login (tu peux changer vers /dashboard si tu préfères) */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Page de login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Tableau de bord */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Route catch-all : si l'URL ne correspond à rien */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
