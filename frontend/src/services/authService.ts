import { api } from '../lib/api'

export type AuthUser = {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'university'
  phone?: string | null
  is_active?: boolean
}

export type AuthResponse = {
  accessToken: string
  user: AuthUser
}

export const login = async (payload: { email: string; password: string }) => {
  const { data } = await api.post<AuthResponse>('/auth/login', payload)
  return data
}

export const register = async (payload: {
  name: string
  email: string
  password: string
  phone?: string
}) => {
  const { data } = await api.post<{ message: string; email: string }>('/auth/register', payload)
  return data
}

export const verifyOtp = async (payload: { email: string; code: string; purpose?: string }) => {
  const { data } = await api.post<AuthResponse>('/auth/verify', payload)
  return data
}

export const resendOtp = async (payload: { email: string; purpose?: string }) => {
  const { data } = await api.post<{ message: string }>('/auth/resend-otp', payload)
  return data
}

export const fetchProfile = async () => {
  const { data } = await api.get<AuthUser>('/auth/profile')
  return data
}

// Development only - get OTP for testing
export const getDevOtp = async (email: string) => {
  const { data } = await api.get<{ code: string; email: string; expires_at: string }>(
    `/auth/dev/otp/${encodeURIComponent(email)}`,
  )
  return data
}

