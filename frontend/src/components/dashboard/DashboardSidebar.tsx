import { Link, useLocation } from 'react-router-dom'
import { Calendar, Home, LogOut, Settings, Users, BookOpen, BarChart3 } from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

type NavItem = {
  label: string
  icon: React.ReactNode
  path: string
  roles?: ('user' | 'university' | 'admin')[]
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <Home className="h-5 w-5" />,
    path: '/dashboard/user',
    roles: ['user'],
  },
  {
    label: 'Events',
    icon: <Calendar className="h-5 w-5" />,
    path: '/dashboard/user/events',
    roles: ['user'],
  },
  {
    label: 'My Bookings',
    icon: <BookOpen className="h-5 w-5" />,
    path: '/dashboard/user/bookings',
    roles: ['user'],
  },
  {
    label: 'Profile',
    icon: <Settings className="h-5 w-5" />,
    path: '/dashboard/user/profile',
    roles: ['user'],
  },
  {
    label: 'Dashboard',
    icon: <Home className="h-5 w-5" />,
    path: '/dashboard/university',
    roles: ['university'],
  },
  {
    label: 'My Events',
    icon: <Calendar className="h-5 w-5" />,
    path: '/dashboard/university/events',
    roles: ['university'],
  },
  {
    label: 'Bookings',
    icon: <BookOpen className="h-5 w-5" />,
    path: '/dashboard/university/bookings',
    roles: ['university'],
  },
  {
    label: 'Dashboard',
    icon: <Home className="h-5 w-5" />,
    path: '/dashboard/admin',
    roles: ['admin'],
  },
  {
    label: 'Users',
    icon: <Users className="h-5 w-5" />,
    path: '/dashboard/admin/users',
    roles: ['admin'],
  },
  {
    label: 'Universities',
    icon: <Users className="h-5 w-5" />,
    path: '/dashboard/admin/universities',
    roles: ['admin'],
  },
  {
    label: 'Events',
    icon: <Calendar className="h-5 w-5" />,
    path: '/dashboard/admin/events',
    roles: ['admin'],
  },
  {
    label: 'Statistics',
    icon: <BarChart3 className="h-5 w-5" />,
    path: '/dashboard/admin/stats',
    roles: ['admin'],
  },
]

export const DashboardSidebar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  )

  const handleLogout = () => {
    logout()
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-indigo-800/30 bg-slate-800/40 backdrop-blur-sm">
      <div className="flex h-16 items-center border-b border-indigo-800/30 px-6">
        <h2 className="font-display text-xl font-semibold text-slate-50">Garissa Event Planner</h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={[
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition',
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-50',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-indigo-800/30 p-4">
        <div className="mb-2 px-4 py-2 text-xs">
          <div className="font-medium text-slate-50">{user?.name}</div>
          <div className="text-slate-400">{user?.email}</div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-700/50 hover:text-slate-50"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}

