import { motion } from 'framer-motion'

import type { SectionContent } from '../../components/sections/SectionGrid'
import { SectionGrid } from '../../components/sections/SectionGrid'

const sections: SectionContent[] = [
  {
    title: 'Founding Story',
    subtitle: 'Born from a coalition of educators, technologists, and community organisers.',
    bullets: [
      'Initiated during a Garissa innovation lab sprint in 2023.',
      'Pilot programme launched with three universities and five NGOs.',
      'Scaled through community advisory boards representing every sub-county.',
    ],
  },
  {
    title: 'Leadership Team',
    subtitle: 'A multidisciplinary crew aligned on impact and integrity.',
    bullets: [
      'Product, engineering, and research leads with global experience.',
      'Strategic partnerships team grounded in county-level realities.',
      'Community ambassadors bridging feedback loops with agility.',
    ],
  },
  {
    title: 'Design Philosophy',
    subtitle: 'Crafted with empathy, inclusivity, and future resilience.',
    bullets: [
      'Co-creation workshops with students, elders, and entrepreneurs.',
      'Rapid prototyping cycles that centre low-bandwidth considerations.',
      'Inclusive language guidelines and culturally-aware iconography.',
    ],
  },
  {
    title: 'Advisory Council',
    subtitle: 'Guided by voices spanning academia, healthcare, and civic tech.',
    bullets: [
      'Quarterly roundtables with county executives and policy makers.',
      'Subject matter experts in security, safeguarding, and logistics.',
      'Diaspora representatives expanding our global support network.',
    ],
  },
  {
    title: 'Culture Code',
    subtitle: 'What it feels like to build at Garissa Event Planner.',
    bullets: [
      'Radical transparency in communication and decision-making.',
      'Bias for action balanced with rigorous measurement.',
      'Wellbeing programmes that prioritise rest, learning, and mentorship.',
    ],
  },
  {
    title: 'Diversity & Inclusion',
    subtitle: 'Embedding representation into every layer of the organisation.',
    bullets: [
      'Recruitment pipelines across rural, peri-urban, and urban communities.',
      'Scholarships and internships targeting underrepresented groups.',
      'Inclusion audits informing continuous policy refinements.',
    ],
  },
  {
    title: 'Technology Partners',
    subtitle: 'Collaborators helping us deliver reliable, modern infrastructure.',
    bullets: [
      'Cloud providers offering scalable hosting and observability.',
      'Cybersecurity experts performing periodic penetration tests.',
      'Design studios supporting visual identity and storytelling.',
    ],
  },
  {
    title: 'Community Champions',
    subtitle: 'Individuals powering adoption at the grassroots level.',
    bullets: [
      'Event stewards in schools, community centres, and workplaces.',
      'Youth leaders organising thematic clubs and monthly meetups.',
      'Local influencers amplifying success stories across media.',
    ],
  },
  {
    title: 'Ethics Framework',
    subtitle: 'Principles safeguarding fairness, accountability, and trust.',
    bullets: [
      'Clear data governance policies with opt-in transparency.',
      'Zero tolerance stance on harassment, discrimination, or exploitation.',
      'Independent ombudsperson channel for anonymous escalation.',
    ],
  },
  {
    title: 'Join Our Team',
    subtitle: 'We are hiring builders, storytellers, and organisers.',
    bullets: [
      'Flexible roles for remote and hybrid contributors.',
      'Professional development stipends and conference budgets.',
      'Mission-driven culture with measurable impact outcomes.',
    ],
  },
]

export const WhoWeArePage = () => {
  return (
    <div className="space-y-16">
      <header className="space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl font-semibold sm:text-5xl"
        >
          Who We Are
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl text-lg text-secondary/80"
        >
          We are a collective of dreamers and doers shaping the future of event technology for
          Garissa County. Our organisation blends local wisdom with global best practices to design
          inclusive, impactful experiences.
        </motion.p>
      </header>

      <SectionGrid sections={sections} label="Story" />
    </div>
  )
}

