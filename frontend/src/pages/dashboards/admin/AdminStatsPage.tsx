import { DashboardHeader } from '../../../components/dashboard/DashboardHeader'

export const AdminStatsPage = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DashboardHeader title="Statistics" subtitle="Platform-wide analytics and insights" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-slate-300">Statistics page - Coming soon</p>
        </div>
      </div>
    </div>
  )
}

