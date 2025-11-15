import type { ReactNode } from 'react'

type DashboardHeaderProps = {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export const DashboardHeader = ({ title, subtitle, actions }: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b border-indigo-800/30 bg-slate-800/40 backdrop-blur-sm px-6 py-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-50">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-300">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

