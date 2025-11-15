import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login, error } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setFormError(null)
    try {
      const auth = await login(form)
      const target =
        auth.user.role === 'admin'
          ? '/dashboard/admin'
          : auth.user.role === 'university'
            ? '/dashboard/university'
            : '/dashboard/user'
      navigate(target, { replace: true })
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Unable to sign in. Please verify your credentials.'
      setFormError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 rounded-3xl border border-surface/40 bg-surface/70 p-8 shadow-xl shadow-black/10 backdrop-blur">
      <div className="space-y-3 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-display text-3xl font-semibold"
        >
          Welcome back
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-sm text-secondary/80"
        >
          Sign in to access your personalised dashboard, manage events, and track insights.
        </motion.p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-secondary/80">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-surface/40 bg-surface/60 px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-secondary/80">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-surface/40 bg-surface/60 px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {(formError || error) && (
        <div className="rounded-2xl border border-red-400/60 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {formError ?? error}
        </div>
      )}

      <div className="space-y-2 text-center text-xs text-secondary/80">
        <p>
          University accounts are provisioned by administrators. Need help?{' '}
          <Link to="/get-involved" className="text-accent-light hover:text-accent">
            Connect with our support team
          </Link>
          .
        </p>
        <p>
          New here?{' '}
          <Link to="/register" className="text-accent-light hover:text-accent">
            Create your account
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

