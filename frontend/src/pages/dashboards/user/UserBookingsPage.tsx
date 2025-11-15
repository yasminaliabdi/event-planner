import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, X, Filter } from 'lucide-react'

import { DashboardHeader } from '../../../components/dashboard/DashboardHeader'
import { getMyBookings, deleteBooking, type Booking, type BookingStatus } from '../../../services/bookingService'

export const UserBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const loadBookings = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getMyBookings(page, 10)
      setBookings(data.data || [])
      setTotalPages(data.meta?.pages || 1)
      setTotal(data.meta?.total || 0)
      setCurrentPage(page)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to load bookings'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings(1)
  }, [])

  const handleCancel = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      await deleteBooking(bookingId)
      await loadBookings(currentPage)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to cancel booking'
      alert(message)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-300 border-green-500/40'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/40'
      case 'cancelled':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/40'
      default:
        return 'bg-slate-700/50 text-secondary border-indigo-800/30'
    }
  }

  const filteredBookings =
    statusFilter === 'all'
      ? bookings
      : bookings.filter((booking) => booking.status === statusFilter)

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    approved: bookings.filter((b) => b.status === 'approved').length,
    rejected: bookings.filter((b) => b.status === 'rejected').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DashboardHeader title="My Bookings" subtitle="View and manage your event bookings" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-5 w-5 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">Filter by status:</span>
            {(['all', 'pending', 'approved', 'rejected', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={[
                  'rounded-full border px-4 py-2 text-sm font-medium capitalize transition',
                  statusFilter === status
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm text-slate-300 hover:border-indigo-600/50 hover:bg-slate-700/50',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {status} ({statusCounts[status]})
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-4">
              <p className="text-sm text-slate-300">Total Bookings</p>
              <p className="mt-2 text-2xl font-semibold">{total}</p>
            </div>
            <div className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-4">
              <p className="text-sm text-slate-300">Pending</p>
              <p className="mt-2 text-2xl font-semibold text-yellow-300">
                {statusCounts.pending}
              </p>
            </div>
            <div className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-4">
              <p className="text-sm text-slate-300">Approved</p>
              <p className="mt-2 text-2xl font-semibold text-green-300">
                {statusCounts.approved}
              </p>
            </div>
            <div className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-4">
              <p className="text-sm text-slate-300">Cancelled</p>
              <p className="mt-2 text-2xl font-semibold text-gray-300">
                {statusCounts.cancelled}
              </p>
            </div>
          </div>

          {/* Bookings List */}
          {error && (
            <div className="rounded-xl border border-red-400/60 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading bookings...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-300">No bookings found</p>
              {statusFilter !== 'all' && (
                <button
                  onClick={() => setStatusFilter('all')}
                  className="mt-4 text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Show all bookings
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {booking.event?.title || 'Event'}
                          </h3>
                          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-300">
                            <span className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {booking.event?.date ? formatDate(booking.event.date) : 'N/A'}
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {booking.event?.time || 'N/A'}
                            </span>
                            <span className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {booking.event?.location || 'N/A'}
                            </span>
                            <span className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {booking.seats} seat{booking.seats !== 1 ? 's' : ''}
                            </span>
                          </div>
                          {booking.notes && (
                            <p className="mt-3 text-sm text-slate-400">
                              <span className="font-medium">Notes:</span> {booking.notes}
                            </p>
                          )}
                          <p className="mt-2 text-xs text-slate-400">
                            Booked on {new Date(booking.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="ml-4 flex flex-col items-end gap-3">
                          <span
                            className={`rounded-full border px-4 py-2 text-xs font-medium capitalize ${getStatusColor(booking.status)}`}
                          >
                            {booking.status}
                          </span>
                          {booking.status !== 'cancelled' && booking.status !== 'rejected' && (
                            <button
                              onClick={() => handleCancel(booking.id)}
                              className="flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/30"
                            >
                              <X className="h-4 w-4" />
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => loadBookings(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm px-4 py-2 text-sm font-medium text-slate-300 transition disabled:opacity-50 hover:bg-slate-700/50"
              >
                Previous
              </button>
              <span className="text-sm text-slate-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => loadBookings(currentPage + 1)}
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


