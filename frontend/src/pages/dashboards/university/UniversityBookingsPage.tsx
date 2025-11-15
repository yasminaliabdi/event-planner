import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle, Filter, Eye } from 'lucide-react'

import { DashboardHeader } from '../../../components/dashboard/DashboardHeader'
import { useAuth } from '../../../context/AuthContext'
import { getEvents, type Event } from '../../../services/eventService'
import {
  getEventBookings,
  updateBookingStatus,
  type Booking,
  type BookingStatus,
} from '../../../services/bookingService'

export const UniversityBookingsPage = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')

  useEffect(() => {
    const loadEvents = async () => {
      if (!user?.id) return
      try {
        const data = await getEvents({
          organizer_id: user.id,
          page_size: 100,
        })
        setEvents(data.data || [])
        if (data.data && data.data.length > 0 && !selectedEventId) {
          setSelectedEventId(data.data[0].id)
        }
      } catch (err: unknown) {
        console.error('Failed to load events:', err)
      }
    }
    loadEvents()
  }, [user?.id])

  useEffect(() => {
    const loadBookings = async () => {
      if (!selectedEventId) return
      try {
        setLoading(true)
        setError(null)
        const data = await getEventBookings(selectedEventId, 1, 100)
        setBookings(data.data || [])
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Failed to load bookings'
        setError(message)
      } finally {
        setLoading(false)
      }
    }
    loadBookings()
  }, [selectedEventId])

  const handleStatusChange = async (bookingId: number, newStatus: BookingStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus)
      // Reload bookings
      if (selectedEventId) {
        const data = await getEventBookings(selectedEventId, 1, 100)
        setBookings(data.data || [])
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to update booking status'
      alert(message)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
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

  const selectedEvent = events.find((e) => e.id === selectedEventId)

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DashboardHeader
        title="Event Bookings"
        subtitle="Approve and manage bookings for your events"
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Event Selector */}
          {events.length > 0 && (
            <div className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-4">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Select Event
              </label>
              <select
                value={selectedEventId || ''}
                onChange={(e) => setSelectedEventId(Number(e.target.value))}
                className="w-full rounded-lg border border-indigo-800/30 bg-slate-700/50 px-4 py-2 text-sm"
              >
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title} - {formatDate(event.date)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedEvent && (
            <>
              {/* Event Info */}
              <div className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6">
                <h3 className="mb-2 text-lg font-semibold">{selectedEvent.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(selectedEvent.date)} at {selectedEvent.time}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {selectedEvent.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Capacity: {selectedEvent.capacity}
                  </span>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-5 w-5 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">Filter by status:</span>
                {(['all', 'pending', 'approved', 'rejected', 'cancelled'] as const).map(
                  (status) => (
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
                  ),
                )}
              </div>

              {/* Stats */}
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-4">
                  <p className="text-sm text-slate-300">Total Bookings</p>
                  <p className="mt-2 text-2xl font-semibold">{bookings.length}</p>
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
                  <p className="text-sm text-slate-300">Rejected</p>
                  <p className="mt-2 text-2xl font-semibold text-red-300">
                    {statusCounts.rejected}
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
                  <p className="text-slate-300">No bookings found for this event</p>
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
                          <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                              {booking.user?.name || 'User'}
                            </h3>
                            <span
                              className={`rounded-full border px-4 py-2 text-xs font-medium capitalize ${getStatusColor(booking.status)}`}
                            >
                              {booking.status}
                            </span>
                          </div>
                          <div className="mb-3 space-y-2 text-sm">
                            <div className="rounded-lg border border-indigo-800/30 bg-slate-700/50 p-3">
                              <p className="mb-2 text-xs font-semibold uppercase text-slate-400">Contact Information</p>
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-400">Name:</span>
                                  <span className="font-medium text-slate-50">{booking.user?.name || 'N/A'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-400">Email:</span>
                                  <span className="font-medium text-slate-50">{booking.user?.email || 'N/A'}</span>
                                </div>
                                {booking.user?.phone && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Phone:</span>
                                    <span className="font-medium text-slate-50">{booking.user.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <Users className="h-4 w-4" />
                              <span>
                                {booking.seats} seat{booking.seats !== 1 ? 's' : ''} requested
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <Calendar className="h-4 w-4" />
                              <span>Booked on {formatDate(booking.created_at)}</span>
                            </div>
                          </div>
                          {booking.notes && (
                            <div className="mt-3 rounded-lg border border-indigo-800/30 bg-slate-700/50 p-3">
                              <p className="text-xs font-medium text-slate-400">Notes:</p>
                              <p className="mt-1 text-sm text-slate-300">{booking.notes}</p>
                            </div>
                          )}
                        </div>
                        {booking.status === 'pending' && (
                          <div className="ml-4 flex flex-col gap-2">
                            <button
                              onClick={() => handleStatusChange(booking.id, 'approved')}
                              className="flex items-center gap-2 rounded-lg border border-green-500/40 bg-green-500/20 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/30"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(booking.id, 'rejected')}
                              className="flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/30"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {events.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-300">No events found</p>
              <p className="mt-2 text-sm text-slate-400">
                Create events to start receiving bookings
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


