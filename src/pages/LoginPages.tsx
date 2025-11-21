import React, { useState } from 'react'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login submitted:', { email, password })
  }

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden flex items-center justify-center px-4">
      {/* Pattern impression & communication sur tout le fond */}
      <div className="absolute inset-0 opacity-[0.05]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="food-pattern"
              x="0"
              y="0"
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              {/* Imprimante */}
              <g
                transform="translate(10, 10)"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              >
                <rect x="6" y="6" width="18" height="10" rx="2" />
                <rect x="4" y="14" width="22" height="10" rx="2" />
                <rect x="8" y="18" width="14" height="4" rx="1" />
                <line x1="10" y1="10" x2="18" y2="10" />
              </g>

              {/* Carte de visite / flyer */}
              <g
                transform="translate(70, 10)"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              >
                <rect x="6" y="4" width="18" height="22" rx="2" />
                <line x1="9" y1="9" x2="21" y2="9" />
                <line x1="9" y1="13" x2="19" y2="13" />
                <line x1="9" y1="17" x2="17" y2="17" />
              </g>

              {/* Bulle de discussion */}
              <g
                transform="translate(10, 70)"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              >
                <rect x="6" y="6" width="20" height="14" rx="4" />
                <path d="M14 20 L13 24 L17 20" />
                <circle cx="11" cy="12" r="1" />
                <circle cx="16" cy="12" r="1" />
                <circle cx="21" cy="12" r="1" />
              </g>

              {/* Mégaphone */}
              <g
                transform="translate(70, 70)"
                stroke="white"
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
          <rect width="100%" height="100%" fill="url(#food-pattern)" />
        </svg>
      </div>

      {/* Vague bleue en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#4F7CFF"
            fillOpacity="1"
            d="M0,160 C320,100 420,220 720,180 C1020,140 1120,200 1440,160 L1440,320 L0,320 Z"
          />
        </svg>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid gap-10 md:grid-cols-[1.1fr,1fr] items-center">
          {/* Texte / branding à gauche (desktop) */}
          <div className="hidden md:block text-left space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/5 px-4 py-1 border border-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <p className="text-xs tracking-wide text-gray-300 uppercase">
                Plateforme de suivi Colorix
              </p>
            </div>

            <h1 className="text-4xl lg:text-5xl font-semibold text-white leading-tight">
              Bienvenue sur votre
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-300">
                espace de pilotage
              </span>
            </h1>

            <p className="text-sm text-gray-400 max-w-md">
              Visualisez vos projets, suivez vos tâches et collaborez avec votre
              équipe, le tout depuis un tableau de bord unique et fluide.
            </p>
          </div>

          {/* Carte de connexion */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl px-8 py-10">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 60 60"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Cherry */}
                  <circle cx="35" cy="40" r="15" fill="#FF6B9D" />
                  <circle cx="25" cy="35" r="12" fill="#FF6B9D" />
                  {/* Stem */}
                  <path
                    d="M30 25 Q28 15 25 10"
                    stroke="#4ADE80"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M30 25 Q32 18 35 12"
                    stroke="#4ADE80"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Leaves */}
                  <ellipse
                    cx="24"
                    cy="12"
                    rx="6"
                    ry="3"
                    fill="#4ADE80"
                    transform="rotate(-30 24 12)"
                  />
                  <ellipse
                    cx="34"
                    cy="14"
                    rx="5"
                    ry="2.5"
                    fill="#4ADE80"
                    transform="rotate(20 34 14)"
                  />
                </svg>
              </div>

              {/* Titres */}
              <div className="text-center mb-8 space-y-2">
                <h2 className="text-2xl font-semibold text-white">
                  Connexion à Colorix
                </h2>
                <p className="text-sm text-gray-400">
                  Entrez vos identifiants pour accéder à votre tableau de bord.
                </p>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-5">
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

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-600 bg-transparent text-blue-500 focus:ring-blue-500"
                    />
                    <span>Se souvenir de moi</span>
                  </label>

                  <button
                    type="button"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    onClick={() => console.log('Mot de passe oublié')}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                <div className="pt-2 space-y-4">
                  <Button type="submit" className="w-full">
                    Se connecter
                  </Button>

                  <p className="text-xs text-center text-gray-400">
                    Pas encore de compte ?{' '}
                    <button
                      type="button"
                      className="text-blue-400 hover:text-blue-300 font-medium"
                      onClick={() => console.log('Créer un compte')}
                    >
                      Créer un compte
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
