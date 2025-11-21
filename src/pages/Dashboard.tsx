import { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Header } from '../components/Header'
import { OverviewCard } from '../components/OverviewCard'
import { ProjectTable } from '../components/ProjectTable'
import { ProgressGauge } from '../components/ProgressGauge'
import { TaskList } from '../components/TaskList'
import { ProjectsWorkload } from '../components/ProjectWorkload'
import {
  BarChart3,
  FolderKanban,
  Clock,
  Users,
  ChevronDown,
} from 'lucide-react'
export function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#E8DDD3]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex flex-col lg:pl-[280px]">
        <Header onToggleSidebar={() => setIsSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Overview Section */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Overview</h2>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <span className="text-sm text-gray-700">Last 30 days</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Overview Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <OverviewCard
              icon={<BarChart3 className="w-6 h-6 text-white" />}
              title="Total revenue"
              value="$53,00989"
              subtitle=""
              trend="up"
              trendValue="12% increase from last month"
              iconBgColor="bg-purple-400"
            />
            <OverviewCard
              icon={<FolderKanban className="w-6 h-6 text-white" />}
              title="Projects"
              value="95"
              subtitle="/100"
              trend="down"
              trendValue="10% decrease from last month"
              iconBgColor="bg-orange-400"
            />
            <OverviewCard
              icon={<Clock className="w-6 h-6 text-white" />}
              title="Time spent"
              value="1022"
              subtitle="/1300 Hrs"
              trend="up"
              trendValue="8% increase from last month"
              iconBgColor="bg-blue-400"
            />
            <OverviewCard
              icon={<Users className="w-6 h-6 text-white" />}
              title="Resources"
              value="101"
              subtitle="/120"
              trend="up"
              trendValue="2% increase from last month"
              iconBgColor="bg-yellow-400"
            />
          </div>

          {/* Project Summary and Progress */}
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <ProjectTable />
            </div>
            <div>
              <ProgressGauge />
            </div>
          </div>

          {/* Today Task and Projects Workload */}
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <TaskList />
            </div>
            <div>
              <ProjectsWorkload />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
