import { Link } from 'react-router-dom'

export const Logo = () => {
  return (
    <Link to="/" className="group flex items-center gap-2">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-base font-semibold text-surface shadow-glow transition group-hover:scale-105">
        GE
      </span>
      <div className="flex flex-col leading-tight">
        <span className="font-display text-lg font-semibold tracking-wide">
          Garissa Event Planner
        </span>
        <span className="text-xs uppercase text-secondary/70">
          Events · Community · Impact
        </span>
      </div>
    </Link>
  )
}

