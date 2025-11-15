import type { PropsWithChildren } from 'react'

import { Footer } from './Footer'
import { MainNav } from '../navigation/MainNav'

export const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen bg-surface text-foreground">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#0ea5e9,transparent_45%),radial-gradient(circle_at_bottom,#10b981,transparent_55%)] opacity-30 blur-3xl" />
        <MainNav />
        <main className="mx-auto mt-20 w-full max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}

