import { Link } from 'react-router-dom'

import { Logo } from '../common/Logo'

const footerLinks = [
  { label: 'About', to: '/about' },
  { label: 'Get Involved', to: '/get-involved' },
  { label: 'Our Impact', to: '/our-impact' },
  { label: 'Who We Are', to: '/who-we-are' },
]

export const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-surface/40 bg-surface/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="text-sm text-secondary/80">
            Empowering Garissa County with inclusive event experiences.
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-secondary/80">
          {footerLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="transition hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-surface/40">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 text-xs text-secondary/70 sm:px-6 lg:px-8">
          <span>© {year} Garissa Event Planner. All rights reserved.</span>
          <span>Crafted with care for Garissa County.</span>
        </div>
      </div>
    </footer>
  )
}

