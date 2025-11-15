import { motion } from 'framer-motion'

import type { SectionContent } from '../../components/sections/SectionGrid'
import { SectionGrid } from '../../components/sections/SectionGrid'

const sections: SectionContent[] = [
  {
    title: 'Our Mission',
    subtitle: 'Empower every resident of Garissa County to discover, host, and celebrate events.',
    bullets: [
      'Bridge the gap between universities, communities, and local government.',
      'Enable transparent storytelling around the region’s cultural and social progress.',
      'Champion inclusive design so every citizen can participate fully.',
    ],
  },
  {
    title: 'Guiding Principles',
    subtitle: 'Values that steer our product decisions and partnerships.',
    bullets: [
      'Human-centred design rooted in empathy and co-creation.',
      'Data responsibility with strict compliance to privacy regulations.',
      'Continuous collaboration with public and private stakeholders.',
    ],
  },
  {
    title: 'Why Garissa',
    subtitle: 'Celebrating a vibrant county with a unique story and global ambitions.',
    bullets: [
      'A young population hungry for opportunities and innovation.',
      'A crossroads of cultures with deep pastoral heritage.',
      'A resilient ecosystem eager to showcase community impact.',
    ],
  },
  {
    title: 'Platform Architecture',
    subtitle: 'A scalable stack engineered for security, speed, and flexibility.',
    bullets: [
      'React + Tailwind frontends optimised for accessibility.',
      'Flask microservices with JWT authentication and role-based guards.',
      'SQLite for rapid iterations with a clear path to PostgreSQL in production.',
    ],
  },
  {
    title: 'Inclusive Storytelling',
    subtitle: 'Elevating voices from every ward, campus, and neighbourhood.',
    bullets: [
      'Multilingual content strategy for Somali, Swahili, and English.',
      'Flexible templates for photo essays, recap blogs, and highlight reels.',
      'Collaborations with local media houses to widen reach.',
    ],
  },
  {
    title: 'Operational Excellence',
    subtitle: 'Internal workflows that keep our releases reliable and transparent.',
    bullets: [
      'Automated testing pipeline covering API and UI layers.',
      'Structured release cadences with changelog transparency.',
      'Real-time observability dashboards for uptime and performance.',
    ],
  },
  {
    title: 'Strategic Partnerships',
    subtitle: 'Leveraging collaborations to amplify every programme.',
    bullets: [
      'Universities co-design curricula-linked events and mentorship.',
      'County government aligns civic celebrations and policy forums.',
      'NGOs host thematic drives integrating health, education, and climate.',
    ],
  },
  {
    title: 'Sustainability Roadmap',
    subtitle: 'Balancing impact with resilient business models.',
    bullets: [
      'Freemium tiers for community organisers with premium analytics add-ons.',
      'Corporate sponsorship slots tied to measurable social outcomes.',
      'Grant funding focused on digital inclusion and youth empowerment.',
    ],
  },
  {
    title: 'Product Governance',
    subtitle: 'Structures that ensure ethical use and community oversight.',
    bullets: [
      'Advisory council comprising educators, youth leaders, and business owners.',
      'Transparent code of conduct for event organisers and attendees.',
      'Escalation matrix for content moderation and security incidents.',
    ],
  },
  {
    title: 'Future Vision',
    subtitle: 'A long-term outlook grounded in community prosperity.',
    bullets: [
      'Cross-border knowledge exchange with neighbouring counties.',
      'Integrated tooling for hybrid and fully virtual event formats.',
      'Data-driven insights informing policy and infrastructure investments.',
    ],
  },
]

export const AboutPage = () => {
  return (
    <div className="space-y-16">
      <header className="space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl font-semibold sm:text-5xl"
        >
          About Garissa Event Planner
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl text-lg text-secondary/80"
        >
          We are building the connective tissue that accelerates learning, collaboration, and
          celebration across Garissa County. Every design decision is rooted in community needs,
          inclusive technology, and measurable social dividends.
        </motion.p>
      </header>

      <SectionGrid sections={sections} label="Insight" />
    </div>
  )
}

