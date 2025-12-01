import { OverviewCard } from '../global/OverviewCard';
import {BarChart3, FolderKanban, Clock,Users, ChevronDown} from 'lucide-react';

export function Stats() {
    return(
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
    )
}