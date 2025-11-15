import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Shield, User as UserIcon, Building2, Ban, CheckCircle, Filter } from 'lucide-react'

import { DashboardHeader } from '../../../components/dashboard/DashboardHeader'
import { getUsers, banUser, type User } from '../../../services/adminService'

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'university' | 'admin'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Ensure users is always an array
  const safeUsers = users || []

  const loadUsers = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      const role = roleFilter !== 'all' ? roleFilter : undefined
      const data = await getUsers(page, 10, role)
      console.log('Users API response:', data)
      setUsers(data.data || [])
      setTotalPages(data.meta?.pages || 1)
      setTotal(data.meta?.total || 0)
      setCurrentPage(page)
    } catch (err: unknown) {
      console.error('Error loading users:', err)
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to load users'
      setError(message)
      setUsers([]) // Ensure users is always an array
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers(1)
  }, [roleFilter])

  const handleBanToggle = async (userId: number, isActive: boolean) => {
    const action = isActive ? 'ban' : 'unban'
    const confirmMessage = isActive
      ? 'Are you sure you want to ban this user?'
      : 'Are you sure you want to unban this user?'
    if (!confirm(confirmMessage)) {
      return
    }

    try {
      await banUser(userId, action)
      await loadUsers(currentPage)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to update user status'
      alert(message)
    }
  }

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />
      case 'university':
        return <Building2 className="h-4 w-4" />
      default:
        return <UserIcon className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40'
      case 'university':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40'
      default:
        return 'bg-green-500/20 text-green-300 border-green-500/40'
    }
  }

  const filteredUsers = safeUsers.filter((user) => {
    const matchesSearch =
      searchQuery === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const roleCounts = {
    all: safeUsers.length,
    user: safeUsers.filter((u) => u.role === 'user').length,
    university: safeUsers.filter((u) => u.role === 'university').length,
    admin: safeUsers.filter((u) => u.role === 'admin').length,
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DashboardHeader title="Manage Users" subtitle="View and manage all user accounts" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-indigo-800/30 bg-slate-700/50 pl-10 pr-4 py-2 text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-5 w-5 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">Filter by role:</span>
            {(['all', 'user', 'university', 'admin'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={[
                  'rounded-full border px-4 py-2 text-sm font-medium capitalize transition',
                  roleFilter === role
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm text-slate-300 hover:border-indigo-600/50 hover:bg-slate-700/50',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {role} ({roleCounts[role]})
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-4">
              <p className="text-sm text-slate-300">Total Users</p>
              <p className="mt-2 text-2xl font-semibold">{total}</p>
            </div>
            <div className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-4">
              <p className="text-sm text-slate-300">Regular Users</p>
              <p className="mt-2 text-2xl font-semibold text-green-300">{roleCounts.user}</p>
            </div>
            <div className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-4">
              <p className="text-sm text-slate-300">Universities</p>
              <p className="mt-2 text-2xl font-semibold text-blue-300">{roleCounts.university}</p>
            </div>
            <div className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-4">
              <p className="text-sm text-slate-300">Admins</p>
              <p className="mt-2 text-2xl font-semibold text-purple-300">{roleCounts.admin}</p>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-400/60 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-300">No users found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-indigo-600/20 p-3">
                        {getRoleIcon(user.role)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-slate-400">{user.email}</p>
                        {user.phone && (
                          <p className="text-xs text-slate-400">{user.phone}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`rounded-full border px-4 py-2 text-xs font-medium capitalize ${getRoleColor(user.role)}`}
                      >
                        {user.role}
                      </span>
                      <span
                        className={`rounded-full border px-4 py-2 text-xs font-medium ${user.is_active
                          ? 'bg-green-500/20 text-green-300 border-green-500/40'
                          : 'bg-red-500/20 text-red-300 border-red-500/40'
                          }`}
                      >
                        {user.is_active ? 'Active' : 'Banned'}
                      </span>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleBanToggle(user.id, user.is_active)}
                          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${user.is_active
                            ? 'border-red-500/40 bg-red-500/20 text-red-300 hover:bg-red-500/30'
                            : 'border-green-500/40 bg-green-500/20 text-green-300 hover:bg-green-500/30'
                            }`}
                        >
                          {user.is_active ? (
                            <>
                              <Ban className="h-4 w-4" />
                              Ban
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Unban
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-slate-400">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => loadUsers(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm px-4 py-2 text-sm font-medium text-slate-300 transition disabled:opacity-50 hover:bg-slate-700/50"
              >
                Previous
              </button>
              <span className="text-sm text-slate-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => loadUsers(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm px-4 py-2 text-sm font-medium text-slate-300 transition disabled:opacity-50 hover:bg-slate-700/50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


