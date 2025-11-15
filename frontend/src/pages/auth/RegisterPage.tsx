import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import { resendOtp, register, verifyOtp, getDevOtp } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'

type Step = 'details' | 'verify'

export const RegisterPage = () => {
  const { setSession } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('details')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  })
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      })
      setStep('verify')
      setMessage('OTP sent to your email. Enter the 6-digit code to verify.')
    } catch (err: unknown) {
      const axiosError = err as {
        response?: {
          data?: { message?: string; errors?: Record<string, string[]> }
          status?: number
        }
      }
      let errMessage = 'Failed to start registration. Please try again.'
      
      if (axiosError.response?.data) {
        const { message, errors } = axiosError.response.data
        if (errors) {
          // Handle validation errors
          const errorList = Object.entries(errors)
            .flatMap(([field, messages]) => messages.map((msg) => `${field}: ${msg}`))
          errMessage = errorList.join(', ') || message || errMessage
        } else if (message) {
          errMessage = message
        }
      }
      
      setError(errMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const auth = await verifyOtp({
        email: form.email,
        code: otp,
        purpose: 'registration',
      })
      setSession(auth)
      setMessage('Account verified! Redirecting you to login...')
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err: unknown) {
      const errMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Verification failed. Please check the code.'
      setError(errMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setLoading(true)
    setError(null)
    try {
      await resendOtp({ email: form.email, purpose: 'registration' })
      setMessage('A new OTP has been sent to your email address.')
    } catch (err: unknown) {
      const errMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Unable to resend code at this time.'
      setError(errMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8 rounded-3xl border border-surface/40 bg-surface/70 p-8 shadow-xl shadow-black/10 backdrop-blur">
      <div className="space-y-3 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-display text-3xl font-semibold"
        >
          Create your account
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-sm text-secondary/80"
        >
          Sign up to book events, manage dashboards, and collaborate with the Garissa community.
        </motion.p>
      </div>

      {step === 'details' && (
        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-secondary/80">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Amina Abdullahi"
                className="w-full rounded-2xl border border-surface/40 bg-surface/60 px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
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
                placeholder="StrongPassword123"
                className="w-full rounded-2xl border border-surface/40 bg-surface/60 px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
              />
              <p className="text-xs text-secondary/60">
                Must be at least 8 characters with letters, numbers, and both cases
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-secondary/80">
                Phone (optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+254 700 000 000"
                className="w-full rounded-2xl border border-surface/40 bg-surface/60 px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
              />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Continue'}
          </button>
        </form>
      )}

      {step === 'verify' && (
        <form className="space-y-4" onSubmit={handleVerify}>
          <div className="space-y-2">
            <label htmlFor="otp" className="block text-sm font-medium text-secondary/80">
              Enter verification code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              maxLength={6}
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder="123456"
              className="w-full rounded-2xl border border-surface/40 bg-surface/60 px-4 py-3 text-sm text-foreground tracking-[0.6em] outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading || otp.length < 6}>
            {loading ? 'Verifying...' : 'Verify & Sign in'}
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleResend}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Resend code
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  setLoading(true)
                  setError(null)
                  const otpData = await getDevOtp(form.email)
                  setMessage(`Your verification code is: ${otpData.code}`)
                } catch (err: unknown) {
                  const errMessage =
                    (err as { response?: { data?: { message?: string } } })?.response?.data
                      ?.message ?? 'Unable to retrieve code. Check backend terminal for OTP.'
                  setError(errMessage)
                } finally {
                  setLoading(false)
                }
              }}
              className="btn-secondary flex-1 text-xs"
              disabled={loading}
              title="Development: Get OTP from server"
            >
              Get OTP
            </button>
          </div>
        </form>
      )}

      {(message || error) && (
        <div
          className={[
            'rounded-2xl border px-4 py-3 text-sm',
            error
              ? 'border-red-400 bg-red-400/10 text-red-200'
              : 'border-brand/40 bg-brand/10 text-brand-light',
          ].join(' ')}
        >
          {error ?? message}
        </div>
      )}
    </div>
  )
}

