import { Routes, Route } from 'react-router-dom'

import { AboutPage } from '../pages/about/AboutPage'
import { GetInvolvedPage } from '../pages/get-involved/GetInvolvedPage'
import { HomePage } from '../pages/home/HomePage'
import { ImpactPage } from '../pages/impact/ImpactPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { NotFoundPage } from '../pages/not-found/NotFoundPage'
import { AdminDashboard } from '../pages/dashboards/admin/AdminDashboard'
import { AdminUsersPage } from '../pages/dashboards/admin/AdminUsersPage'
import { AdminUniversitiesPage } from '../pages/dashboards/admin/AdminUniversitiesPage'
import { AdminEventsPage } from '../pages/dashboards/admin/AdminEventsPage'
import { AdminStatsPage } from '../pages/dashboards/admin/AdminStatsPage'
import { UniversityDashboard } from '../pages/dashboards/university/UniversityDashboard'
import { UniversityEventsPage } from '../pages/dashboards/university/UniversityEventsPage'
import { UniversityBookingsPage } from '../pages/dashboards/university/UniversityBookingsPage'
import { UserDashboard } from '../pages/dashboards/user/UserDashboard'
import { UserEventsPage } from '../pages/dashboards/user/UserEventsPage'
import { UserBookingsPage } from '../pages/dashboards/user/UserBookingsPage'
import { UserProfilePage } from '../pages/dashboards/user/UserProfilePage'
import { WhoWeArePage } from '../pages/who-we-are/WhoWeArePage'
import { ProtectedRoute } from './ProtectedRoute'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/get-involved" element={<GetInvolvedPage />} />
      <Route path="/our-impact" element={<ImpactPage />} />
      <Route path="/who-we-are" element={<WhoWeArePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute allowedRoles={['user']} />}>
        <Route path="/dashboard/user" element={<UserDashboard />} />
        <Route path="/dashboard/user/events" element={<UserEventsPage />} />
        <Route path="/dashboard/user/bookings" element={<UserBookingsPage />} />
        <Route path="/dashboard/user/profile" element={<UserProfilePage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['university']} />}>
        <Route path="/dashboard/university" element={<UniversityDashboard />} />
        <Route path="/dashboard/university/events" element={<UniversityEventsPage />} />
        <Route path="/dashboard/university/bookings" element={<UniversityBookingsPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/admin/users" element={<AdminUsersPage />} />
        <Route path="/dashboard/admin/universities" element={<AdminUniversitiesPage />} />
        <Route path="/dashboard/admin/events" element={<AdminEventsPage />} />
        <Route path="/dashboard/admin/stats" element={<AdminStatsPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

