import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

type ProtectedRouteProps = {
  allowedRoles?: Array<'admin' | 'user' | 'university'>
  redirectTo?: string
}

export const ProtectedRoute = ({
  allowedRoles,
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-secondary/70">
        Loading...
      </div>
    )
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

