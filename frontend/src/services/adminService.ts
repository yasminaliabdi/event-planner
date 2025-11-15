import { api } from '../lib/api'

export type AdminStats = {
  total_users: number
  total_universities: number
  total_events: number
  total_bookings: number
  active_events: number
  pending_bookings: number
}

export type PaginatedResponse<T> = {
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    pages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export const getAdminStats = async () => {
  const { data } = await api.get<AdminStats>('/admin/stats')
  return data
}

export type User = {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'university'
  phone?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export const getUsers = async (page?: number, page_size?: number, role?: string) => {
  const params = new URLSearchParams()
  if (page) params.append('page', String(page))
  if (page_size) params.append('page_size', String(page_size))
  if (role) params.append('role', role)
  const { data } = await api.get<PaginatedResponse<User>>(`/admin/users?${params.toString()}`)
  return data
}

export const banUser = async (userId: number, action: 'ban' | 'unban') => {
  const { data } = await api.put<User>(`/admin/users/${userId}/ban?action=${action}`)
  return data
}

export const deleteUser = async (userId: number) => {
  const { data } = await api.delete<{ message: string }>(`/admin/users/${userId}`)
  return data
}

export type University = {
  id: number
  name: string
  address?: string | null
  contact?: string | null
  description?: string | null
  logo_url?: string | null
  user_id: number
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
    email: string
    phone?: string | null
  }
}

export const getUniversities = async (page?: number, page_size?: number) => {
  const params = new URLSearchParams()
  if (page) params.append('page', String(page))
  if (page_size) params.append('page_size', String(page_size))
  const { data } = await api.get<PaginatedResponse<University>>(
    `/admin/universities?${params.toString()}`,
  )
  return data
}

export const createUniversity = async (payload: {
  name: string
  email: string
  password: string
  phone?: string
  university_name: string
  address?: string
  contact?: string
  description?: string
  logo_url?: string
}) => {
  const { data } = await api.post<University>('/admin/universities', payload)
  return data
}

export const deleteUniversity = async (universityId: number) => {
  const { data } = await api.delete<{ message: string }>(`/admin/universities/${universityId}`)
  return data
}

export type Event = {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
  price: number | string
  status: 'draft' | 'published' | 'cancelled'
  organizer_id: number
  university_id?: number | null
  image_url?: string | null
  created_at: string
  updated_at: string
  organizer?: {
    id: number
    name: string
    email: string
  }
  university?: {
    id: number
    name: string
  }
}

export const getAdminEvents = async (page?: number, page_size?: number, status?: string) => {
  const params = new URLSearchParams()
  if (page) params.append('page', String(page))
  if (page_size) params.append('page_size', String(page_size))
  if (status) params.append('status', status)
  const { data } = await api.get<PaginatedResponse<Event>>(`/admin/events?${params.toString()}`)
  return data
}

export const updateAdminEventStatus = async (eventId: number, status: 'draft' | 'published' | 'cancelled') => {
  const { data } = await api.patch<Event>(`/admin/events/${eventId}/status`, { status })
  return data
}

export const deleteAdminEvent = async (eventId: number) => {
  const { data } = await api.delete<{ message: string }>(`/admin/events/${eventId}`)
  return data
}

