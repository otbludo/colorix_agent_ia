import React from 'react'
import { ChevronDown } from 'lucide-react'
interface Project {
  name: string
  manager: string
  dueDate: string
  status: 'Completed' | 'Delayed' | 'At risk' | 'On going'
  progress: number
}
const projects: Project[] = [
  {
    name: 'Nelsa web development',
    manager: 'Om prakash sao',
    dueDate: 'May 25, 2023',
    status: 'Completed',
    progress: 100,
  },
  {
    name: 'Datascale AI app',
    manager: 'Neilsan mando',
    dueDate: 'Jun 20, 2023',
    status: 'Delayed',
    progress: 35,
  },
  {
    name: 'Media channel branding',
    manager: 'Tiruvelly priya',
    dueDate: 'July 13, 2023',
    status: 'At risk',
    progress: 68,
  },
  {
    name: 'Corlax iOS app development',
    manager: 'Matte hannery',
    dueDate: 'Dec 20, 2023',
    status: 'Completed',
    progress: 100,
  },
  {
    name: 'Website builder development',
    manager: 'Sukumar rao',
    dueDate: 'Mar 15, 2024',
    status: 'On going',
    progress: 50,
  },
]
const statusColors = {
  Completed: 'bg-green-100 text-green-700',
  Delayed: 'bg-yellow-100 text-yellow-700',
  'At risk': 'bg-red-100 text-red-700',
  'On going': 'bg-orange-100 text-orange-700',
}
export function ProjectTable() {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1A1A1A]">Project summary</h2>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm">
            <span className="text-sm text-gray-700">Project</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm">
            <span className="text-sm text-gray-700">Project manager</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm">
            <span className="text-sm text-gray-700">Status</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Name
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Project manager
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Due date
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Progress
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-4 text-sm text-[#1A1A1A]">
                {project.name}
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">
                {project.manager}
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">
                {project.dueDate}
              </td>
              <td className="py-4 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}
                >
                  {project.status}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${project.progress}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {project.progress}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  )
}
