import { api } from '../lib/api'

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

export type Booking = {
  id: number
  event_id: number
  user_id: number
  seats: number
  status: BookingStatus
  notes?: string | null
  created_at: string
  updated_at: string
  event?: {
    id: number
    title: string
    date: string
    time: string
    location: string
  }
  user?: {
    id: number
    name: string
    email: string
    phone?: string | null
  }
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

export const getMyBookings = async (page?: number, page_size?: number) => {
  const params = new URLSearchParams()
  if (page) params.append('page', String(page))
  if (page_size) params.append('page_size', String(page_size))
  const { data } = await api.get<PaginatedResponse<Booking>>(
    `/bookings/me?${params.toString()}`,
  )
  return data
}

export const getEventBookings = async (eventId: number, page?: number, page_size?: number) => {
  const params = new URLSearchParams()
  if (page) params.append('page', String(page))
  if (page_size) params.append('page_size', String(page_size))
  const { data } = await api.get<PaginatedResponse<Booking>>(
    `/bookings/event/${eventId}?${params.toString()}`,
  )
  return data
}

export const createBooking = async (eventId: number, payload: {
  seats: number
  notes?: string
}) => {
  const { data } = await api.post<Booking>(`/events/${eventId}/book`, payload)
  return data
}

export const updateBookingStatus = async (id: number, status: BookingStatus) => {
  const { data } = await api.put<Booking>(`/bookings/${id}`, { status })
  return data
}

export const deleteBooking = async (id: number) => {
  const { data } = await api.delete<{ message: string }>(`/bookings/${id}`)
  return data
}

