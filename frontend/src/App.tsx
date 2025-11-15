import { BrowserRouter, useLocation } from 'react-router-dom'

import { AppLayout } from './components/layout/AppLayout'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { AuthProvider } from './context/AuthContext'
import { AppRoutes } from './routes/AppRoutes'

function LayoutWrapper() {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')

  if (isDashboard) {
    return (
      <DashboardLayout>
        <AppRoutes />
      </DashboardLayout>
    )
  }

  return (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LayoutWrapper />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
