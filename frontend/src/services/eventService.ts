import { api } from '../lib/api'

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed'

export type Event = {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
  price: number | string
  status: EventStatus
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

export type EventFilters = {
  status?: EventStatus
  organizer_id?: number
  university_id?: number
  start_date?: string
  end_date?: string
  order_by?: 'date' | 'created_at'
  direction?: 'asc' | 'desc'
  page?: number
  page_size?: number
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

export const getEvents = async (filters?: EventFilters) => {
  const params = new URLSearchParams()
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value))
      }
    })
  }
  const { data } = await api.get<PaginatedResponse<Event>>(
    `/events?${params.toString()}`,
  )
  return data
}

export const getEvent = async (id: number) => {
  const { data } = await api.get<Event>(`/events/${id}`)
  return data
}

export const createEvent = async (payload: {
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
  price: number | string
  university_id?: number
  image_url?: string
  status?: EventStatus
}) => {
  const { data } = await api.post<Event>('/events', payload)
  return data
}

export const updateEvent = async (id: number, payload: Partial<{
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
  price: number | string
  status: EventStatus
  image_url?: string
}>) => {
  const { data } = await api.put<Event>(`/events/${id}`, payload)
  return data
}

export const deleteEvent = async (id: number) => {
  const { data } = await api.delete<{ message: string }>(`/events/${id}`)
  return data
}

export const updateEventStatus = async (id: number, status: EventStatus) => {
  const { data } = await api.patch<Event>(`/events/${id}/status`, { status })
  return data
}

