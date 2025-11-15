import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Building2, Calendar, BookOpen, TrendingUp, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

import { DashboardHeader } from '../../../components/dashboard/DashboardHeader'
import { useAuth } from '../../../context/AuthContext'
import { getAdminStats, type AdminStats } from '../../../services/adminService'

export const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        const data = await getAdminStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to load admin stats:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DashboardHeader
        title="Admin Dashboard"
        subtitle="Monitor and manage the entire platform"
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Total Users</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">
                    {loading ? '...' : stats?.total_users || 0}
                  </p>
                </div>
                <Users className="h-10 w-10 text-blue-500/60" />
              </div>
              <Link
                to="/dashboard/admin/users"
                className="mt-4 block text-sm text-indigo-400 hover:text-indigo-300"
              >
                Manage users →
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Universities</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">
                    {loading ? '...' : stats?.total_universities || 0}
                  </p>
                </div>
                <Building2 className="h-10 w-10 text-purple-500/60" />
              </div>
              <Link
                to="/dashboard/admin/universities"
                className="mt-4 block text-sm text-indigo-400 hover:text-indigo-300"
              >
                Manage universities →
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Total Events</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">
                    {loading ? '...' : stats?.total_events || 0}
                  </p>
                </div>
                <Calendar className="h-10 w-10 text-green-500/60" />
              </div>
              <Link
                to="/dashboard/admin/events"
                className="mt-4 block text-sm text-indigo-400 hover:text-indigo-300"
              >
                Manage events →
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Total Bookings</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">
                    {loading ? '...' : stats?.total_bookings || 0}
                  </p>
                </div>
                <BookOpen className="h-10 w-10 text-yellow-500/60" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Active Events</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">
                    {loading ? '...' : stats?.active_events || 0}
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-500/60" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Pending Bookings</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">
                    {loading ? '...' : stats?.pending_bookings || 0}
                  </p>
                </div>
                <AlertCircle className="h-10 w-10 text-yellow-500/60" />
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
          >
            <h2 className="mb-4 text-lg font-semibold text-slate-50">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                to="/dashboard/admin/users"
                className="rounded-lg border border-indigo-800/30 bg-slate-700/50 p-4 transition hover:border-indigo-600/50 hover:bg-slate-700/70"
              >
                <Users className="mb-2 h-6 w-6 text-indigo-400" />
                <h3 className="font-medium text-slate-50">Manage Users</h3>
                <p className="mt-1 text-sm text-slate-300">
                  View, edit, and manage user accounts
                </p>
              </Link>
              <Link
                to="/dashboard/admin/universities"
                className="rounded-lg border border-indigo-800/30 bg-slate-700/50 p-4 transition hover:border-indigo-600/50 hover:bg-slate-700/70"
              >
                <Building2 className="mb-2 h-6 w-6 text-brand" />
                <h3 className="font-medium">Manage Universities</h3>
                <p className="mt-1 text-sm text-slate-300">
                  View and manage university profiles
                </p>
              </Link>
              <Link
                to="/dashboard/admin/events"
                className="rounded-lg border border-indigo-800/30 bg-slate-700/50 p-4 transition hover:border-indigo-600/50 hover:bg-slate-700/70"
              >
                <Calendar className="mb-2 h-6 w-6 text-brand" />
                <h3 className="font-medium">Manage Events</h3>
                <p className="mt-1 text-sm text-slate-300">
                  Moderate and manage all events
                </p>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

