import React, { useState } from 'react'
interface Task {
  title: string
  status: 'Approved' | 'In review'
}
const tasks: Task[] = [
  {
    title: 'Create a user flow of social application design',
    status: 'Approved',
  },
  {
    title: 'Create a user flow of social application design',
    status: 'In review',
  },
]
const statusColors = {
  Approved: 'bg-green-100 text-green-700',
  'In review': 'bg-red-100 text-red-700',
}
export function TaskList() {
  const [activeTab, setActiveTab] = useState('All')
  const tabs = [
    {
      label: 'All',
      count: 10,
    },
    {
      label: 'Important',
      count: 0,
    },
    {
      label: 'Notes',
      count: 5,
    },
    {
      label: 'Links',
      count: 10,
    },
  ]
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Today task</h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === tab.label ? 'text-[#FF6B6B]' : 'text-gray-600 hover:text-gray-900'}`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.label ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                {tab.count}
              </span>
            )}
            {activeTab === tab.label && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B6B]"></div>
            )}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-[#FF6B6B]"></div>
              <span className="text-sm text-[#1A1A1A]">{task.title}</span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}
            >
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
