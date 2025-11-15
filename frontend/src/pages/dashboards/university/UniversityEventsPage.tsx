import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2, Eye, EyeOff, Filter } from 'lucide-react'

import { DashboardHeader } from '../../../components/dashboard/DashboardHeader'
import { useAuth } from '../../../context/AuthContext'
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  updateEventStatus,
  type Event,
  type EventStatus,
} from '../../../services/eventService'

type EventFormData = {
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: string
  price: string
  image_url: string
  status: EventStatus
}

export const UniversityEventsPage = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    price: '',
    image_url: '',
    status: 'draft',
  })

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getEvents({
        organizer_id: user?.id,
        page_size: 50,
        order_by: 'date',
        direction: 'desc',
      })
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
    if (user?.id) {
      loadEvents()
    }
  }, [user?.id])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Validate form data
      if (formData.title.length < 3) {
        alert('Title must be at least 3 characters long')
        return
      }
      if (formData.description.length < 10) {
        alert('Description must be at least 10 characters long')
        return
      }
      if (formData.location.length < 3) {
        alert('Location must be at least 3 characters long')
        return
      }
      const capacity = parseInt(formData.capacity, 10)
      if (isNaN(capacity) || capacity < 1) {
        alert('Capacity must be at least 1')
        return
      }
      const price = parseFloat(formData.price)
      if (isNaN(price) || price < 0) {
        alert('Price must be a valid number (0 or greater)')
        return
      }

      await createEvent({
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date,
        time: formData.time,
        location: formData.location.trim(),
        capacity,
        price: parseFloat(price.toFixed(2)), // Ensure 2 decimal places as number
        image_url: formData.image_url.trim() || undefined,
        status: formData.status,
      })
      setShowCreateModal(false)
      resetForm()
      await loadEvents()
    } catch (err: unknown) {
      const errorResponse = err as {
        response?: {
          data?: {
            message?: string
            errors?: Record<string, string[]>
          }
        }
      }

      let errorMessage = 'Failed to create event'
      if (errorResponse.response?.data?.message) {
        errorMessage = errorResponse.response.data.message
      } else if (errorResponse.response?.data?.errors) {
        // Format validation errors
        const errors = Object.entries(errorResponse.response.data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n')
        errorMessage = `Validation errors:\n${errors}`
      }
      alert(errorMessage)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEvent) return

    try {
      // Validate form data
      if (formData.title.length < 3) {
        alert('Title must be at least 3 characters long')
        return
      }
      if (formData.description.length < 10) {
        alert('Description must be at least 10 characters long')
        return
      }
      if (formData.location.length < 3) {
        alert('Location must be at least 3 characters long')
        return
      }
      const capacity = parseInt(formData.capacity, 10)
      if (isNaN(capacity) || capacity < 1) {
        alert('Capacity must be at least 1')
        return
      }
      const price = parseFloat(formData.price)
      if (isNaN(price) || price < 0) {
        alert('Price must be a valid number (0 or greater)')
        return
      }

      await updateEvent(editingEvent.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date,
        time: formData.time,
        location: formData.location.trim(),
        capacity,
        price: parseFloat(price.toFixed(2)), // Ensure 2 decimal places as number
        image_url: formData.image_url.trim() || undefined,
        status: formData.status,
      })
      setEditingEvent(null)
      resetForm()
      await loadEvents()
    } catch (err: unknown) {
      const errorResponse = err as {
        response?: {
          data?: {
            message?: string
            errors?: Record<string, string[]>
          }
        }
      }

      let errorMessage = 'Failed to update event'
      if (errorResponse.response?.data?.message) {
        errorMessage = errorResponse.response.data.message
      } else if (errorResponse.response?.data?.errors) {
        // Format validation errors
        const errors = Object.entries(errorResponse.response.data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n')
        errorMessage = `Validation errors:\n${errors}`
      }
      alert(errorMessage)
    }
  }

  const handleDelete = async (eventId: number) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }

    try {
      await deleteEvent(eventId)
      await loadEvents()
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to delete event'
      alert(message)
    }
  }

  const handleStatusChange = async (eventId: number, newStatus: EventStatus) => {
    try {
      await updateEventStatus(eventId, newStatus)
      await loadEvents()
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to update event status'
      alert(message)
    }
  }

  const startEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      capacity: String(event.capacity),
      price: String(event.price),
      image_url: event.image_url || '',
      status: event.status,
    })
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      capacity: '',
      price: '',
      image_url: '',
      status: 'draft',
    })
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

  const filteredEvents =
    statusFilter === 'all' ? events : events.filter((event) => event.status === statusFilter)

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DashboardHeader
        title="My Events"
        subtitle="Create and manage your events"
        actions={
          <button
            onClick={() => {
              resetForm()
              setShowCreateModal(true)
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
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
                {status}
              </button>
            ))}
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
              <button
                onClick={() => {
                  resetForm()
                  setShowCreateModal(true)
                }}
                className="mt-4 btn-primary"
              >
                Create your first event
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusColor(event.status)}`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <p className="mb-4 line-clamp-2 text-sm text-slate-300">
                    {event.description}
                  </p>
                  <div className="mb-4 space-y-2 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {formatDate(event.date)} at {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      Capacity: {event.capacity} | Price: KES {Number(event.price).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => startEdit(event)}
                      className="flex-1 rounded-lg border border-indigo-800/30 bg-slate-700/50 px-3 py-2 text-xs font-medium transition hover:bg-slate-700/70"
                    >
                      <Edit className="mr-1 inline h-3 w-3" />
                      Edit
                    </button>
                    {event.status === 'draft' ? (
                      <button
                        onClick={() => handleStatusChange(event.id, 'published')}
                        className="flex-1 rounded-lg border border-green-500/40 bg-green-500/20 px-3 py-2 text-xs font-medium text-green-300 transition hover:bg-green-500/30"
                      >
                        <Eye className="mr-1 inline h-3 w-3" />
                        Publish
                      </button>
                    ) : event.status === 'published' ? (
                      <button
                        onClick={() => handleStatusChange(event.id, 'draft')}
                        className="flex-1 rounded-lg border border-yellow-500/40 bg-yellow-500/20 px-3 py-2 text-xs font-medium text-yellow-300 transition hover:bg-yellow-500/30"
                      >
                        <EyeOff className="mr-1 inline h-3 w-3" />
                        Unpublish
                      </button>
                    ) : null}
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="rounded-lg border border-red-500/40 bg-red-500/20 p-2 text-red-300 transition hover:bg-red-500/30"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(showCreateModal || editingEvent) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => {
              setShowCreateModal(false)
              setEditingEvent(null)
              resetForm()
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-[90vh] w-full max-w-2xl flex-col rounded-2xl border-2 border-indigo-800/30 bg-slate-800/90 backdrop-blur-sm shadow-2xl"
            >
              <div className="flex-shrink-0 border-b border-indigo-800/30 bg-slate-800/80 px-6 py-4">
                <h2 className="text-2xl font-semibold text-slate-50">
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <form
                  onSubmit={editingEvent ? handleUpdate : handleCreate}
                  className="space-y-5"
                >
                <div>
                  <label className="block text-sm font-semibold text-slate-50 mb-2">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border-2 border-indigo-800/30 bg-slate-700/50 px-4 py-3 text-sm text-slate-50 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                    placeholder="Enter event title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-50 mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-lg border-2 border-indigo-800/30 bg-slate-700/50 px-4 py-3 text-sm text-slate-50 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition resize-none"
                    placeholder="Describe your event..."
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-50 mb-2">
                      Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full rounded-lg border-2 border-indigo-800/30 bg-slate-700/50 px-4 py-3 text-sm text-slate-50 focus:border-indigo-500 focus:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-50 mb-2">
                      Time <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full rounded-lg border-2 border-indigo-800/30 bg-slate-700/50 px-4 py-3 text-sm text-slate-50 focus:border-indigo-500 focus:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-50 mb-2">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-lg border-2 border-indigo-800/30 bg-slate-700/50 px-4 py-3 text-sm text-slate-50 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                    placeholder="Event venue address"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-50 mb-2">
                      Capacity <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="w-full rounded-lg border-2 border-indigo-800/30 bg-slate-700/50 px-4 py-3 text-sm text-slate-50 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                      placeholder="Number of seats"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-50 mb-2">
                      Price (KES) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full rounded-lg border-2 border-indigo-800/30 bg-slate-700/50 px-4 py-3 text-sm text-slate-50 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-50 mb-2">
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full rounded-lg border-2 border-indigo-800/30 bg-slate-700/50 px-4 py-3 text-sm text-slate-50 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-50 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as EventStatus })
                    }
                    className="w-full rounded-lg border-2 border-surface/60 bg-surface/80 px-4 py-3 text-sm text-slate-50 focus:border-indigo-500 focus:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4 border-t border-indigo-800/30">
                  <button type="submit" className="btn-primary flex-1">
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      setEditingEvent(null)
                      resetForm()
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


