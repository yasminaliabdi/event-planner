import { motion, type Variants } from 'framer-motion'

export type SectionContent = {
  title: string
  subtitle: string
  bullets: string[]
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

type SectionGridProps = {
  sections: SectionContent[]
  label?: string
}

export const SectionGrid = ({ sections, label = 'Section' }: SectionGridProps) => (
  <div className="grid gap-10">
    {sections.map((section, index) => (
      <motion.section
        key={section.title}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={cardVariants}
        transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.05 }}
        className="grid gap-8 rounded-3xl border border-surface/40 bg-surface/70 p-8 shadow-xl shadow-black/5 backdrop-blur-lg md:grid-cols-2"
      >
        <div className="space-y-4">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent-light">
            {label} {index + 1}
          </span>
          <h2 className="font-display text-2xl font-semibold md:text-3xl">{section.title}</h2>
          <p className="text-base text-secondary/80">{section.subtitle}</p>
        </div>
        <ul className="space-y-3 text-sm text-secondary/80">
          {section.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-3 rounded-2xl border border-surface/40 bg-surface/60 p-4 shadow-inner shadow-black/10"
            >
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </motion.section>
    ))}
  </div>
)

