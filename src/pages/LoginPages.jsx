import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { LoginUser } from '../api/post/login'
import { Input } from '../components/global/Input'
import { Button } from '../components/global/Button'
import colorixLogo from '../assets/colorixorigin.png'


export function LoginPage() {
  const navigate = useNavigate();
  const { mutate, isPending, isSuccess, isError, error, data } = LoginUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    mutate({ email, password })
  }

  useEffect(() => {
    if (isSuccess) {
      if (data.message) {
        toast.error(data.message);
      } else if (data.access_token) {
        localStorage.setItem('colorix_token', data.access_token);
        navigate('/dashboard');
      }
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error(error || 'Erreur réseau !');
    }
  }, [isError]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#020c1f] via-[#051937] to-[#073061] relative overflow-hidden flex items-center justify-center px-4">
      {/* Particules animées en arrière-plan */}
      <div className="particles-container">
        <div className="particle w-3 h-3 top-20 left-20"></div>
        <div className="particle w-2 h-2 top-40 right-32"></div>
        <div className="particle w-4 h-4 bottom-40 left-40"></div>
        <div className="particle w-1.5 h-1.5 top-60 right-20"></div>
        <div className="particle w-2.5 h-2.5 bottom-20 right-40"></div>
        <div className="particle w-1 h-1 top-80 left-60"></div>
      </div>
      <div className="absolute inset-0 opacity-[0.2]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="colorix-pattern"
              x="0"
              y="0"
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              <g
                transform="translate(10, 10)"
                stroke="#2e5483ff"
                strokeWidth="1.5"
                fill="none"
              >
                <rect x="6" y="6" width="18" height="10" rx="2" />
                <rect x="4" y="14" width="22" height="10" rx="2" />
                <rect x="8" y="18" width="14" height="4" rx="1" />
                <line x1="10" y1="10" x2="18" y2="10" />
              </g>
              <g
                transform="translate(70, 10)"
                stroke="#2e5483ff"
                strokeWidth="1.5"
                fill="none"
              >
                <rect x="6" y="4" width="18" height="22" rx="2" />
                <line x1="9" y1="9" x2="21" y2="9" />
                <line x1="9" y1="13" x2="19" y2="13" />
                <line x1="9" y1="17" x2="17" y2="17" />
              </g>
              <g
                transform="translate(10, 70)"
                stroke="#2e5483ff"
                strokeWidth="1.5"
                fill="none"
              >
                <rect x="6" y="6" width="20" height="14" rx="4" />
                <path d="M14 20 L13 24 L17 20" />
                <circle cx="11" cy="12" r="1" />
                <circle cx="16" cy="12" r="1" />
                <circle cx="21" cy="12" r="1" />
              </g>
              <g
                transform="translate(70, 70)"
                stroke="#2e5483ff"
                strokeWidth="1.5"
                fill="none"
              >
                <path d="M6 12 L18 8 L18 20 L6 16 Z" />
                <line x1="6" y1="16" x2="4" y2="20" />
                <line x1="20" y1="10" x2="24" y2="8" />
                <line x1="20" y1="18" x2="24" y2="20" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#colorix-pattern)" />
        </svg>
      </div>
      <div className="absolute bottom-[-1px] left-0 right-0 h-80 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="url(#colorixWave)"
            d="M0,170 C320,120 420,230 720,190 C1020,150 1120,210 1440,170 L1440,320 L0,320 Z"
          />
          <defs>
            <linearGradient id="colorixWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0c58c9" />
              <stop offset="50%" stopColor="#1b7bff" />
              <stop offset="100%" stopColor="#34c759" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="relative z-10 w-full max-w-5xl">
        <div className="flex flex-col items-center gap-10 text-center">
          <div className="space-y-6 max-w-xl">
            <div className="flex justify-center">
              <img
                src={colorixLogo}
                alt="Colorix logo"
                className="w-40 h-33 drop-shadow-[0_10px_35px_rgba(10,40,80,0.55)]"
              />
            </div>
            <h1 className="text-4xl lg:text-5xl font-semibold text-white leading-tight">
              Connexion
              <span className="block glow-text">
                Colorix
              </span>
            </h1>
          </div>
          <div className="w-full max-w-md mx-auto">
            <div className="futuristic-card rounded-3xl shadow-[0_25px_80px_rgba(3,12,32,0.45)] px-8 py-8">
              {/* Effet de grille en arrière-plan */}
              <div className="absolute inset-0 opacity-5 rounded-3xl">
                <div className="grid-pattern w-full h-full"></div>
              </div>
              <div className="relative z-10 text-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Se connecter
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
                <Input
                  type="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Adresse e-mail"
                  label="Adresse e-mail"
                />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label="Mot de passe"
                  label="Mot de passe"
                />
                <Button type="submit" className="w-full mt-6">
                  Se connecter
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-center" />
    </div>
  )
}
