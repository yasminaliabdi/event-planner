import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export const NotFoundPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-full border border-accent/40 bg-surface/60 px-6 py-2 text-sm font-semibold uppercase tracking-[0.4em] text-accent-light"
      >
        404
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-display text-4xl font-semibold sm:text-5xl"
      >
        We can’t find that page
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-base text-secondary/80"
      >
        The page you are looking for may have been moved or archived. Use the main navigation to
        continue exploring the platform.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        <Link to="/" className="btn-primary">
          Return home
        </Link>
        <Link to="/about" className="btn-secondary">
          Learn more about us
        </Link>
      </motion.div>
    </div>
  )
}

