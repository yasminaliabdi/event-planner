import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, BookOpen, Filter, Search } from 'lucide-react'

import { DashboardHeader } from '../../../components/dashboard/DashboardHeader'
import { useAuth } from '../../../context/AuthContext'
import { getEvents, type Event, type EventStatus } from '../../../services/eventService'
import { createBooking } from '../../../services/bookingService'

export const UserEventsPage = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showBookingModal, setShowBookingModal] = useState<Event | null>(null)
  const [bookingSeats, setBookingSeats] = useState('1')
  const [bookingNotes, setBookingNotes] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const filters: { status?: EventStatus; page_size?: number } = {
        page_size: 50,
      }
      if (statusFilter !== 'all') {
        filters.status = statusFilter
      }
      const data = await getEvents(filters)
      setEvents(data.data || [])
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to load events'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [statusFilter])

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showBookingModal) return

    try {
      setBookingLoading(true)
      await createBooking(showBookingModal.id, {
        seats: parseInt(bookingSeats, 10),
        notes: bookingNotes || undefined,
      })
      setShowBookingModal(null)
      setBookingSeats('1')
      setBookingNotes('')
      alert('Booking request submitted! The organizer will review it.')
      await loadEvents()
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to create booking'
      alert(message)
    } finally {
      setBookingLoading(false)
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

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DashboardHeader title="Browse Events" subtitle="Discover and book events" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-indigo-800/30 bg-slate-700/50 pl-10 pr-4 py-2 text-sm"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-5 w-5 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">Filter by status:</span>
              {(['all', 'published'] as const).map((status) => (
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
                  {status}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-400/60 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-300">No events found</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
                >
                  <h3 className="mb-2 text-xl font-semibold">{event.title}</h3>
                  <p className="mb-4 line-clamp-3 text-sm text-slate-300">
                    {event.description}
                  </p>
                  <div className="mb-4 space-y-2 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Capacity: {event.capacity} | Price: KES {Number(event.price).toFixed(2)}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBookingModal(event)}
                    className="btn-primary w-full"
                  >
                    <BookOpen className="mr-2 inline h-4 w-4" />
                    Book Event
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => {
              setShowBookingModal(null)
              setBookingSeats('1')
              setBookingNotes('')
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-indigo-800/30 bg-slate-800/90 backdrop-blur-sm p-6 shadow-xl"
            >
              <h2 className="mb-4 text-2xl font-semibold text-slate-50">Book Event</h2>
              <div className="mb-6 space-y-2 rounded-lg border border-indigo-800/30 bg-slate-700/50 p-4">
                <h3 className="text-lg font-medium text-slate-50">{showBookingModal.title}</h3>
                <p className="text-sm text-slate-300">
                  {formatDate(showBookingModal.date)} at {showBookingModal.time}
                </p>
                <p className="text-sm text-slate-300">{showBookingModal.location}</p>
                <p className="text-sm text-slate-300">
                  Capacity: {showBookingModal.capacity} | Price: KES{' '}
                  {Number(showBookingModal.price).toFixed(2)} per seat
                </p>
              </div>
              
              {/* User Information Section */}
              <div className="mb-6 space-y-3 rounded-lg border border-indigo-800/30 bg-slate-800/60 p-4">
                <h4 className="text-sm font-semibold text-slate-50">Your Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Name:</span>
                    <span className="font-medium text-slate-50">{user?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-medium text-slate-50">{user?.email || 'N/A'}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Phone:</span>
                      <span className="font-medium text-slate-50">{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-50">
                    Number of Seats <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={showBookingModal.capacity}
                    value={bookingSeats}
                    onChange={(e) => setBookingSeats(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-indigo-800/30 bg-slate-700/50 px-4 py-2 text-sm text-slate-50 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-50">
                    Notes (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Any special requirements or notes..."
                    className="mt-1 w-full rounded-lg border border-indigo-800/30 bg-slate-700/50 px-4 py-2 text-sm text-slate-50 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="btn-primary flex-1"
                  >
                    {bookingLoading ? 'Submitting...' : 'Submit Booking'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingModal(null)
                      setBookingSeats('1')
                      setBookingNotes('')
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


