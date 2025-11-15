import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { Logo } from '../common/Logo'

const publicNav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Get Involved', to: '/get-involved' },
  { label: 'Our Impact', to: '/our-impact' },
  { label: 'Who We Are', to: '/who-we-are' },
]

export const MainNav = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const dashboardLink =
    user?.role === 'admin'
      ? '/dashboard/admin'
      : user?.role === 'university'
        ? '/dashboard/university'
        : '/dashboard/user'

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-surface/40 bg-surface/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-secondary/80 md:flex">
          {publicNav.concat(user ? [] : [{ label: 'Login', to: '/login' }, { label: 'Register', to: '/register' }]).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'relative transition hover:text-foreground',
                  isActive ? 'text-foreground' : '',
                ]
                  .filter(Boolean)
                  .join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-2 mx-auto h-1 w-8 rounded-full bg-brand" />
                  )}
                </>
              )}
            </NavLink>
          ))}
          {user && (
            <>
              <button
                type="button"
                onClick={() => navigate(dashboardLink)}
                className="btn-secondary"
              >
                Dashboard
              </button>
              <button type="button" onClick={logout} className="btn-primary">
                Logout
              </button>
            </>
          )}
        </nav>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-secondary/40 p-2 text-secondary transition hover:text-foreground md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden"
          >
            <ul className="space-y-2 border-t border-surface/40 bg-surface/95 px-4 py-6 text-sm font-medium text-secondary/90">
              {publicNav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      [
                        'block rounded-lg px-3 py-2 transition hover:bg-muted/70 hover:text-foreground',
                        isActive ? 'bg-muted/80 text-foreground' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              {!user && (
                <>
                  <li>
                    <NavLink
                      to="/login"
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        [
                          'block rounded-lg px-3 py-2 transition hover:bg-muted/70 hover:text-foreground',
                          isActive ? 'bg-muted/80 text-foreground' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')
                      }
                    >
                      Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/register"
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        [
                          'block rounded-lg px-3 py-2 transition hover:bg-muted/70 hover:text-foreground',
                          isActive ? 'bg-muted/80 text-foreground' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')
                      }
                    >
                      Register
                    </NavLink>
                  </li>
                </>
              )}
              {user && (
                <>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        navigate(dashboardLink)
                        setOpen(false)
                      }}
                      className="w-full rounded-lg border border-secondary/20 bg-muted/60 px-3 py-2 text-left text-foreground transition hover:bg-muted/70"
                    >
                      Dashboard
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        logout()
                        setOpen(false)
                      }}
                      className="w-full rounded-lg border border-brand/30 bg-brand px-3 py-2 text-left text-surface transition hover:bg-brand-light"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

