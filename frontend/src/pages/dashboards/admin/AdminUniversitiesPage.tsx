import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Building2, Mail, Phone, MapPin, Users, Trash2 } from 'lucide-react'

import { DashboardHeader } from '../../../components/dashboard/DashboardHeader'
import {
  getUniversities,
  createUniversity,
  deleteUniversity,
  type University,
} from '../../../services/adminService'

type UniversityFormData = {
  name: string
  email: string
  password: string
  phone: string
  university_name: string
  address: string
  contact: string
  description: string
  logo_url: string
}

export const AdminUniversitiesPage = () => {
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState<UniversityFormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    university_name: '',
    address: '',
    contact: '',
    description: '',
    logo_url: '',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Ensure universities is always an array
  const safeUniversities = universities || []

  const loadUniversities = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getUniversities(page, 10)
      console.log('Universities API response:', data)
      setUniversities(data.data || [])
      setTotalPages(data.meta?.pages || 1)
      setTotal(data.meta?.total || 0)
      setCurrentPage(page)
    } catch (err: unknown) {
      console.error('Error loading universities:', err)
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to load universities'
      setError(message)
      setUniversities([]) // Ensure universities is always an array
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUniversities(1)
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createUniversity({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        university_name: formData.university_name,
        address: formData.address || undefined,
        contact: formData.contact || undefined,
        description: formData.description || undefined,
        logo_url: formData.logo_url || undefined,
      })
      setShowCreateModal(false)
      resetForm()
      await loadUniversities(currentPage)
      alert('University account created successfully!')
    } catch (err: unknown) {
      const errorResponse = err as {
        response?: {
          data?: {
            message?: string
            errors?: Record<string, string[]>
          }
        }
      }
      
      let errorMessage = 'Failed to create university'
      if (errorResponse.response?.data?.message) {
        errorMessage = errorResponse.response.data.message
      } else if (errorResponse.response?.data?.errors) {
        // Format validation errors with better formatting
        const errors = errorResponse.response.data.errors
        const errorList = Object.entries(errors)
          .map(([field, messages]) => {
            const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ')
            const messageList = Array.isArray(messages) ? messages.join(', ') : String(messages)
            return `• ${fieldName}: ${messageList}`
          })
          .join('\n')
        errorMessage = `Validation errors:\n\n${errorList}\n\nPlease check:\n- Name must be 2-120 characters\n- Email must be valid\n- Password must be at least 8 characters with uppercase, lowercase, and numbers\n- University name must be 2-200 characters`
      }
      alert(errorMessage)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      university_name: '',
      address: '',
      contact: '',
      description: '',
      logo_url: '',
    })
  }

  const handleDelete = async (universityId: number, universityName: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${universityName}"? This will also delete the associated user account. This action cannot be undone.`)) {
      return
    }

    try {
      await deleteUniversity(universityId)
      alert('University account deleted successfully.')
      await loadUniversities(currentPage)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to delete university'
      alert(message)
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DashboardHeader
        title="Manage Universities"
        subtitle="View and manage all university accounts"
        actions={
          <button
            onClick={() => {
              resetForm()
              setShowCreateModal(true)
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create University
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Stats */}
          <div className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-4">
            <p className="text-sm text-slate-300">Total Universities</p>
            <p className="mt-2 text-3xl font-semibold">{total}</p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-400/60 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading universities...</div>
          ) : safeUniversities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-300">No universities found</p>
              <button
                onClick={() => {
                  resetForm()
                  setShowCreateModal(true)
                }}
                className="mt-4 btn-primary"
              >
                Create your first university
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {safeUniversities.map((university) => (
                <motion.div
                  key={university.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm p-6"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-indigo-600/20 p-2">
                        <Building2 className="h-5 w-5 text-brand" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{university.name}</h3>
                        {university.user && (
                          <p className="text-sm text-slate-400">{university.user.name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {university.description && (
                    <p className="mb-4 line-clamp-2 text-sm text-slate-300">
                      {university.description}
                    </p>
                  )}
                  <div className="space-y-2 text-xs text-slate-400">
                    {university.user?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {university.user.email}
                      </div>
                    )}
                    {university.user?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {university.user.phone}
                      </div>
                    )}
                    {university.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {university.address}
                      </div>
                    )}
                    {university.contact && (
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        {university.contact}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      Created {new Date(university.created_at).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => handleDelete(university.id, university.name)}
                      className="flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-500/30"
                      title="Delete university"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => loadUniversities(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm px-4 py-2 text-sm font-medium text-slate-300 transition disabled:opacity-50 hover:bg-slate-700/50"
              >
                Previous
              </button>
              <span className="text-sm text-slate-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => loadUniversities(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-indigo-800/30 bg-slate-800/60 backdrop-blur-sm px-4 py-2 text-sm font-medium text-slate-300 transition disabled:opacity-50 hover:bg-slate-700/50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => {
              setShowCreateModal(false)
              resetForm()
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-indigo-800/30 bg-surface p-6 shadow-xl"
            >
              <h2 className="mb-6 text-2xl font-semibold">Create University Account</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-300">
                      Contact Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-indigo-800/30 bg-slate-700/50 px-4 py-2 text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-indigo-800/30 bg-slate-700/50 px-4 py-2 text-sm"
                      placeholder="university@example.com"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-300">
                      Password <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-indigo-800/30 bg-slate-700/50 px-4 py-2 text-sm"
                      placeholder="Minimum 8 characters"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-indigo-800/30 bg-slate-700/50 px-4 py-2 text-sm"
                      placeholder="+254..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300">
                    University Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.university_name}
                    onChange={(e) =>
                      setFormData({ ...formData, university_name: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-indigo-800/30 bg-slate-700/50 px-4 py-2 text-sm"
                    placeholder="Garissa University"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-indigo-800/30 bg-slate-700/50 px-4 py-2 text-sm"
                    placeholder="Street address, City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300">Contact Info</label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-indigo-800/30 bg-slate-700/50 px-4 py-2 text-sm"
                    placeholder="Additional contact information"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-indigo-800/30 bg-slate-700/50 px-4 py-2 text-sm"
                    placeholder="Brief description of the university"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300">Logo URL</label>
                  <input
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-indigo-800/30 bg-slate-700/50 px-4 py-2 text-sm"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary flex-1">
                    Create University
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      resetForm()
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


