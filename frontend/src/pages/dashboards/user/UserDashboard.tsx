import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

import { DashboardHeader } from '../../../components/dashboard/DashboardHeader'
import { useAuth } from '../../../context/AuthContext'
import { getEvents, type Event } from '../../../services/eventService'
import { getMyBookings, type Booking } from '../../../services/bookingService'

export const UserDashboard = () => {
  const { user } = useAuth()
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [eventsData, bookingsData] = await Promise.all([
          getEvents({ status: 'published', page_size: 6, order_by: 'date', direction: 'asc' }),
          getMyBookings(1, 5),
        ])
        setUpcomingEvents(eventsData.data || [])
        setRecentBookings(bookingsData.data || [])
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
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

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DashboardHeader
        title={`Welcome back, ${user?.name || 'User'}!`}
        subtitle="Discover events and manage your bookings"
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Total Bookings</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">{recentBookings.length}</p>
                </div>
                <BookOpen className="h-10 w-10 text-indigo-400/60" />
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
                  <p className="text-sm text-slate-300">Upcoming Events</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">{upcomingEvents.length}</p>
                </div>
                <Calendar className="h-10 w-10 text-indigo-400/60" />
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
                  <p className="text-sm text-slate-300">Pending Approvals</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-50">
                    {recentBookings.filter((b) => b.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-10 w-10 text-indigo-400/60" />
              </div>
            </motion.div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-50">Upcoming Events</h2>
                <Link
                  to="/dashboard/user/events"
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  View all
                </Link>
              </div>
              {loading ? (
                <div className="text-center py-8 text-slate-400">Loading events...</div>
              ) : upcomingEvents.length === 0 ? (
                <div className="text-center py-8 text-slate-400">No upcoming events</div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <Link
                      key={event.id}
                      to={`/dashboard/user/events/${event.id}`}
                      className="block rounded-lg border border-indigo-800/30 bg-slate-700/50 p-4 transition hover:border-indigo-600/50 hover:bg-slate-700/70"
                    >
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
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Recent Bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-50">Recent Bookings</h2>
                <Link
                  to="/dashboard/user/bookings"
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  View all
                </Link>
              </div>
              {loading ? (
                <div className="text-center py-8 text-slate-400">Loading bookings...</div>
              ) : recentBookings.length === 0 ? (
                <div className="text-center py-8 text-slate-400">No bookings yet</div>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-lg border border-indigo-800/30 bg-slate-700/50 p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-50">
                            {booking.event?.title || 'Event'}
                          </h3>
                          <div className="mt-2 flex items-center gap-4 text-xs text-slate-300">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {booking.seats} seat{booking.seats !== 1 ? 's' : ''}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {booking.event?.date
                                ? formatDate(booking.event.date)
                                : 'N/A'}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusColor(booking.status)}`}
                        >
                          {booking.status}
                        </span>
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

