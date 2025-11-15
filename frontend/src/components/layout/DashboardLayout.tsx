import type { PropsWithChildren } from 'react'

import { DashboardSidebar } from '../dashboard/DashboardSidebar'

export const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-slate-50">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}

