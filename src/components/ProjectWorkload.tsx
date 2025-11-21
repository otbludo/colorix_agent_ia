import React from 'react'
import { ChevronDown } from 'lucide-react'
export function ProjectsWorkload() {
  const workloadData = [
    {
      id: '07',
      color: 'bg-[#FF6B6B]',
    },
    {
      id: '08',
      color: 'bg-gray-300',
    },
    {
      id: '08',
      color: 'bg-gray-300',
    },
  ]
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1A1A1A]">Projects Workload</h2>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <span className="text-sm text-gray-700">Last 3 months</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 py-4 sm:py-8">
        {workloadData.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center text-white font-bold text-lg mb-2`}
            >
              {item.id}
            </div>
            <div className="w-1 h-12 bg-gray-300"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
