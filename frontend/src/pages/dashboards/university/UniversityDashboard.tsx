import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, BookOpen, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

import { DashboardHeader } from '../../../components/dashboard/DashboardHeader'
import { useAuth } from '../../../context/AuthContext'
import { getEvents, type Event } from '../../../services/eventService'
import { getEventBookings, type Booking } from '../../../services/bookingService'

export const UniversityDashboard = () => {
  const { user } = useAuth()
  const [myEvents, setMyEvents] = useState<Event[]>([])
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        // Get events organized by this university
        const eventsData = await getEvents({
          organizer_id: user?.id,
          page_size: 5,
          order_by: 'date',
          direction: 'desc',
        })
        setMyEvents(eventsData.data || [])

        // Get pending bookings for all events
        const allPendingBookings: Booking[] = []
        for (const event of eventsData.data || []) {
          try {
            const bookingsData = await getEventBookings(event.id, 1, 10)
            const pending = (bookingsData.data || []).filter((b) => b.status === 'pending')
            allPendingBookings.push(...pending)
          } catch (error) {
            console.error(`Failed to load bookings for event ${event.id}:`, error)
          }
        }
        setPendingBookings(allPendingBookings.slice(0, 5))
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    if (user?.id) {
      loadData()
    }
  }, [user?.id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const totalBookings = myEvents.reduce((sum, event) => sum + (event.capacity || 0), 0)
  const publishedEvents = myEvents.filter((e) => e.status === 'published').length

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DashboardHeader
        title={`${user?.name || 'University'} Dashboard`}
        subtitle="Manage your events and approve bookings"
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Total Events</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">{myEvents.length}</p>
                </div>
                <Calendar className="h-10 w-10 text-indigo-400/60" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Published</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">{publishedEvents}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-500/60" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Pending Bookings</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">{pendingBookings.length}</p>
                </div>
                <AlertCircle className="h-10 w-10 text-yellow-500/60" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Total Capacity</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">{totalBookings}</p>
                </div>
                <Users className="h-10 w-10 text-indigo-400/60" />
              </div>
            </motion.div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* My Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-50">My Events</h2>
                <Link
                  to="/dashboard/university/events"
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Manage all
                </Link>
              </div>
              {loading ? (
                <div className="text-center py-8 text-slate-400">Loading events...</div>
              ) : myEvents.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p>No events yet</p>
                  <Link
                    to="/dashboard/university/events/new"
                    className="mt-2 inline-block text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    Create your first event
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myEvents.map((event) => (
                    <Link
                      key={event.id}
                      to={`/dashboard/university/events/${event.id}`}
                      className="block rounded-lg border border-indigo-800/30 bg-slate-700/50 p-4 transition hover:border-indigo-600/50 hover:bg-slate-700/70"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-50">{event.title}</h3>
                          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(event.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                            event.status === 'published'
                              ? 'bg-green-500/20 text-green-300 border-green-500/40'
                              : event.status === 'draft'
                                ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                                : 'bg-gray-500/20 text-gray-300 border-gray-500/40'
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Pending Bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-50">Pending Bookings</h2>
                <Link
                  to="/dashboard/university/bookings"
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  View all
                </Link>
              </div>
              {loading ? (
                <div className="text-center py-8 text-slate-400">Loading bookings...</div>
              ) : pendingBookings.length === 0 ? (
                <div className="text-center py-8 text-slate-400">No pending bookings</div>
              ) : (
                <div className="space-y-4">
                  {pendingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-lg border border-indigo-800/30 bg-slate-700/50 p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-50">
                            {booking.event?.title || 'Event'}
                          </h3>
                          <p className="mt-1 text-sm text-slate-300">
                            {booking.user?.name || 'User'} - {booking.seats} seat{booking.seats !== 1 ? 's' : ''}
                          </p>
                          {booking.notes && (
                            <p className="mt-2 text-xs text-slate-400">{booking.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="rounded-lg bg-green-500/20 p-2 text-green-300 transition hover:bg-green-500/30"
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            className="rounded-lg bg-red-500/20 p-2 text-red-300 transition hover:bg-red-500/30"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

