import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { useNavigate } from 'react-router-dom'

import { fetchProfile, login as loginRequest, type AuthResponse, type AuthUser } from '../services/authService'

type AuthState = {
  user: AuthUser | null
  token: string | null
  loading: boolean
  error: string | null
  login: (payload: { email: string; password: string }) => Promise<AuthResponse>
  logout: () => void
  setSession: (data: AuthResponse) => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

const TOKEN_KEY = 'gep_token'
const USER_KEY = 'gep_user'

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const persistSession = useCallback((auth: AuthResponse) => {
    setToken(auth.accessToken)
    setUser(auth.user)
    window.localStorage.setItem(TOKEN_KEY, auth.accessToken)
    window.localStorage.setItem(USER_KEY, JSON.stringify(auth.user))
  }, [])

  const clearSession = useCallback(() => {
    setToken(null)
    setUser(null)
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(USER_KEY)
  }, [])

  useEffect(() => {
    const storedToken = window.localStorage.getItem(TOKEN_KEY)
    const storedUser = window.localStorage.getItem(USER_KEY)
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as AuthUser
        setToken(storedToken)
        setUser(parsedUser)
      } catch (err) {
        console.error('Failed to parse stored user', err)
        clearSession()
      }
    }
    setLoading(false)
  }, [clearSession])

  const login = useCallback(
    async (payload: { email: string; password: string }) => {
      try {
        setLoading(true)
        setError(null)
        const auth = await loginRequest(payload)
        persistSession(auth)
        return auth
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Unable to sign in. Please check your credentials and try again.'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [persistSession],
  )

  useEffect(() => {
    const initialise = async () => {
      const storedToken = window.localStorage.getItem(TOKEN_KEY)
      if (!storedToken) {
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const profile = await fetchProfile()
        setUser(profile)
      } catch {
        clearSession()
      } finally {
        setLoading(false)
      }
    }
    initialise().catch((error) => console.error('Failed to initialise auth', error))
  }, [clearSession])

  const logout = useCallback(() => {
    clearSession()
    navigate('/login')
  }, [clearSession, navigate])

  const value = useMemo<AuthState>(
    () => ({
      user,
      token,
      loading,
      error,
      login,
      logout,
      setSession: persistSession,
    }),
    [user, token, loading, error, login, logout, persistSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthState => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

