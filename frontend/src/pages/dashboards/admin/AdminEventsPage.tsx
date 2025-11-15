import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Filter,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  Search,
} from 'lucide-react'

import { DashboardHeader } from '../../../components/dashboard/DashboardHeader'
import {
  getAdminEvents,
  updateAdminEventStatus,
  deleteAdminEvent,
  type Event,
} from '../../../services/adminService'

type EventStatus = 'draft' | 'published' | 'cancelled'

export const AdminEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const loadEvents = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      const status = statusFilter !== 'all' ? statusFilter : undefined
      const data = await getAdminEvents(page, 20, status)
      setEvents(data.data || [])
      setTotalPages(data.meta?.pages || 1)
      setTotal(data.meta?.total || 0)
      setCurrentPage(page)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to load events'
      setError(message)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents(1)
  }, [statusFilter])

  const handleStatusChange = async (eventId: number, newStatus: EventStatus) => {
    try {
      await updateAdminEventStatus(eventId, newStatus)
      await loadEvents(currentPage)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to update event status'
      alert(message)
    }
  }

  const handleDelete = async (eventId: number) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }

    try {
      await deleteAdminEvent(eventId)
      await loadEvents(currentPage)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to delete event'
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

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/20 text-green-300 border-green-500/40'
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/40'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/40'
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer?.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const statusCounts = {
    all: events.length,
    draft: events.filter((e) => e.status === 'draft').length,
    published: events.filter((e) => e.status === 'published').length,
    cancelled: events.filter((e) => e.status === 'cancelled').length,
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DashboardHeader title="Manage Events" subtitle="View and moderate all events" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search events by title, description, location, or organizer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-indigo-800/30 bg-slate-700/50 pl-10 pr-4 py-2 text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-5 w-5 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">Filter by status:</span>
            {(['all', 'draft', 'published', 'cancelled'] as const).map((status) => (
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
              <p className="text-sm text-slate-300">Total Events</p>
              <p className="mt-2 text-2xl font-semibold">{total}</p>
            </div>
            <div className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-4">
              <p className="text-sm text-slate-300">Published</p>
              <p className="mt-2 text-2xl font-semibold text-green-300">
                {statusCounts.published}
              </p>
            </div>
            <div className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-4">
              <p className="text-sm text-slate-300">Draft</p>
              <p className="mt-2 text-2xl font-semibold text-yellow-300">{statusCounts.draft}</p>
            </div>
            <div className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-4">
              <p className="text-sm text-slate-300">Cancelled</p>
              <p className="mt-2 text-2xl font-semibold text-red-300">
                {statusCounts.cancelled}
              </p>
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
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          <p className="mt-1 text-sm text-slate-400">
                            by {event.organizer?.name || 'Unknown'} •{' '}
                            {event.university?.name || 'No university'}
                          </p>
                        </div>
                        <span
                          className={`ml-4 rounded-full border px-4 py-2 text-xs font-medium capitalize ${getStatusColor(event.status)}`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <p className="mb-4 line-clamp-2 text-sm text-slate-300">
                        {event.description}
                      </p>
                      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(event.date)} at {event.time}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </span>
                        <span className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Capacity: {event.capacity} | Price: KES {Number(event.price).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Created {new Date(event.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="ml-4 flex flex-col gap-2">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="rounded-lg border border-indigo-800/30 bg-slate-700/50 px-4 py-2 text-xs font-medium transition hover:bg-slate-700/70"
                      >
                        <Eye className="mr-1 inline h-3 w-3" />
                        View
                      </button>
                      {event.status === 'draft' ? (
                        <button
                          onClick={() => handleStatusChange(event.id, 'published')}
                          className="rounded-lg border border-green-500/40 bg-green-500/20 px-4 py-2 text-xs font-medium text-green-300 transition hover:bg-green-500/30"
                        >
                          <Eye className="mr-1 inline h-3 w-3" />
                          Publish
                        </button>
                      ) : event.status === 'published' ? (
                        <button
                          onClick={() => handleStatusChange(event.id, 'draft')}
                          className="rounded-lg border border-yellow-500/40 bg-yellow-500/20 px-4 py-2 text-xs font-medium text-yellow-300 transition hover:bg-yellow-500/30"
                        >
                          <EyeOff className="mr-1 inline h-3 w-3" />
                          Unpublish
                        </button>
                      ) : null}
                      <button
                        onClick={() => handleStatusChange(event.id, 'cancelled')}
                        className="rounded-lg border border-red-500/40 bg-red-500/20 px-4 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/30"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="rounded-lg border border-red-500/40 bg-red-500/20 p-2 text-red-300 transition hover:bg-red-500/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
                onClick={() => loadEvents(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm px-4 py-2 text-sm font-medium text-slate-300 transition disabled:opacity-50 hover:bg-slate-700/50"
              >
                Previous
              </button>
              <span className="text-sm text-slate-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => loadEvents(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm px-4 py-2 text-sm font-medium text-slate-300 transition disabled:opacity-50 hover:bg-slate-700/50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-indigo-800/30 bg-surface p-6 shadow-xl"
            >
              <div className="mb-6 flex items-start justify-between">
                <h2 className="text-2xl font-semibold">{selectedEvent.title}</h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="rounded-lg p-2 hover:bg-slate-700/50"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-300">Status</p>
                  <span
                    className={`mt-1 inline-block rounded-full border px-4 py-2 text-xs font-medium capitalize ${getStatusColor(selectedEvent.status)}`}
                  >
                    {selectedEvent.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">Description</p>
                  <p className="mt-1 text-sm text-slate-400">{selectedEvent.description}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-slate-300">Date & Time</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {formatDate(selectedEvent.date)} at {selectedEvent.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300">Location</p>
                    <p className="mt-1 text-sm text-slate-400">{selectedEvent.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300">Capacity</p>
                    <p className="mt-1 text-sm text-slate-400">{selectedEvent.capacity} seats</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300">Price</p>
                    <p className="mt-1 text-sm text-slate-400">
                      KES {Number(selectedEvent.price).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">Organizer</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {selectedEvent.organizer?.name} ({selectedEvent.organizer?.email})
                  </p>
                </div>
                {selectedEvent.university && (
                  <div>
                    <p className="text-sm font-medium text-slate-300">University</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {selectedEvent.university.name}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-slate-300">Created</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {new Date(selectedEvent.created_at).toLocaleString()}
                  </p>
                </div>
                {selectedEvent.image_url && (
                  <div>
                    <p className="text-sm font-medium text-slate-300">Image</p>
                    <img
                      src={selectedEvent.image_url}
                      alt={selectedEvent.title}
                      className="mt-2 max-h-64 w-full rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


