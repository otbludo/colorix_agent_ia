import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Dashboard } from './pages/Dashboard'
import { LoginPage } from './pages/LoginPages'

function App() {
  const [count, setCount] = useState(0)

   return <Dashboard />
  // return <LoginPage />
}

export default App
