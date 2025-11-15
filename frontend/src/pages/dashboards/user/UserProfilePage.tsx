import { DashboardHeader } from '../../../components/dashboard/DashboardHeader'

export const UserProfilePage = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DashboardHeader title="My Profile" subtitle="Manage your account settings" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-slate-300">Profile settings page - Coming soon</p>
        </div>
      </div>
    </div>
  )
}

