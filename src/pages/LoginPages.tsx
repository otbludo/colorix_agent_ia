import React, { useState } from 'react'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
export function LoginPage() {
  const [email, setEmail] = useState('')
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email submitted:', email)
  }
  return (
    <div className="min-h-screen w-full bg-[#1a1a1a] relative overflow-hidden flex items-center justify-center">
      {/* Food Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03]">
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
              {/* Burger */}
              <g
                transform="translate(10, 10)"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              >
                <ellipse cx="15" cy="5" rx="12" ry="3" />
                <rect x="5" y="8" width="20" height="3" rx="1" />
                <rect x="3" y="12" width="24" height="4" rx="1" />
                <rect x="5" y="17" width="20" height="3" rx="1" />
                <ellipse cx="15" cy="22" rx="12" ry="3" />
              </g>

              {/* Fries */}
              <g
                transform="translate(70, 10)"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              >
                <path d="M8 5 L8 20 M12 3 L12 20 M16 5 L16 20 M20 4 L20 20" />
                <path d="M6 20 L22 20 L20 25 L8 25 Z" />
              </g>

              {/* Ice Cream */}
              <g
                transform="translate(10, 70)"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              >
                <circle cx="15" cy="8" r="7" />
                <circle cx="15" cy="14" r="6" />
                <path d="M15 20 L12 28 L18 28 Z" />
              </g>

              {/* Taco */}
              <g
                transform="translate(70, 70)"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              >
                <path d="M5 15 Q15 5 25 15 L23 18 Q15 12 7 18 Z" />
                <line x1="9" y1="13" x2="9" y2="16" />
                <line x1="13" y1="11" x2="13" y2="14" />
                <line x1="17" y1="11" x2="17" y2="14" />
                <line x1="21" y1="13" x2="21" y2="16" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#food-pattern)" />
        </svg>
      </div>

      {/* Blue Wave at Bottom */}
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

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-[#2d2d2d] rounded-3xl shadow-2xl p-12">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <svg
              width="60"
              height="60"
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

          {/* Welcome Text */}
          <h1 className="text-2xl font-bold text-white text-center mb-8">
            Welcome Back
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              placeholder="you@yourmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email address"
              label="Enter your mail"
            />

            <div className="flex flex-col items-center gap-3">
              <Button type="submit" className="w-full">
                Next &gt;
              </Button>

              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  console.log('Forgot password clicked')
                }}
              >
                forgot password
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
