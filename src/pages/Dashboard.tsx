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
    <div className="min-h-screen bg-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex flex-col lg:pl-[280px]">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

       
        <main className="p-4 sm:p-6 lg:p-10">
          <div className="space-y-8 bg-white rounded-3xl shadow-[0_15px_45px_rgba(15,23,42,0.06)] p-6 sm:p-8 lg:p-10 border border-gray-100">
            {/* Overview Section */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <h2 className="text-2xl font-bold text-[#102040]">Overview</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#eff2f8] hover:bg-white text-[#0f1f3d] transition-colors">
                <span className="text-sm font-medium">Last 30 days</span>
                <ChevronDown className="w-4 h-4 text-[#74809b]" />
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
                iconBgColor="from-[#4361ee] to-[#5ab9ff]"
              />
              <OverviewCard
                icon={<FolderKanban className="w-6 h-6 text-white" />}
                title="Projects"
                value="95"
                subtitle="/100"
                trend="down"
                trendValue="10% decrease from last month"
                iconBgColor="from-[#f97316] to-[#fbbf24]"
              />
              <OverviewCard
                icon={<Clock className="w-6 h-6 text-white" />}
                title="Time spent"
                value="1022"
                subtitle="/1300 Hrs"
                trend="up"
                trendValue="8% increase from last month"
                iconBgColor="from-[#0ea5e9] to-[#38bdf8]"
              />
              <OverviewCard
                icon={<Users className="w-6 h-6 text-white" />}
                title="Resources"
                value="101"
                subtitle="/120"
                trend="up"
                trendValue="2% increase from last month"
                iconBgColor="from-[#10b981] to-[#34d399]"
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
          </div>
        </main>
      </div>
    </div>
  )
}
