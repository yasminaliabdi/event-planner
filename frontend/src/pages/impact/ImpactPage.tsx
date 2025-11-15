import { motion } from 'framer-motion'

import type { SectionContent } from '../../components/sections/SectionGrid'
import { SectionGrid } from '../../components/sections/SectionGrid'

const sections: SectionContent[] = [
  {
    title: 'Impact Dashboard',
    subtitle: 'Real-time indicators that illustrate county-wide engagement.',
    bullets: [
      'Aggregate registrations segmented by demographic and geography.',
      'Volunteer hours tracked across humanitarian, academic, and cultural events.',
      'Satisfaction scores benchmarked against national averages.',
    ],
  },
  {
    title: 'Education Outcomes',
    subtitle: 'Measuring the academic ripple effect of university-driven events.',
    bullets: [
      'Mentorship conversion rates from career fairs and alumni meetups.',
      'Scholarship applications catalysed by awareness campaigns.',
      'STEM interest uplift following innovation hackathons.',
    ],
  },
  {
    title: 'Economic Growth',
    subtitle: 'Capturing value created for local businesses and entrepreneurs.',
    bullets: [
      'Vendor revenue tracking with integrated point-of-sale reporting.',
      'Tourism upticks linked to marquee cultural festivals.',
      'Startup funding pledged during investor showcase events.',
    ],
  },
  {
    title: 'Health & Wellness Metrics',
    subtitle: 'Quantifying societal benefits across medical and wellness activations.',
    bullets: [
      'Screening numbers for community health caravans and clinics.',
      'Mental health workshop attendance and follow-up engagements.',
      'Blood donation drives with logistics supported by the platform.',
    ],
  },
  {
    title: 'Climate Action',
    subtitle: 'Tracking environmental stewardship within Garissa County.',
    bullets: [
      'Tree-planting campaigns mapped with geospatial dashboards.',
      'Waste reduction targets achieved through green event guidelines.',
      'Sustainable energy adoption showcased via innovation expos.',
    ],
  },
  {
    title: 'Gender Inclusion',
    subtitle: 'Ensuring equitable participation across every event vertical.',
    bullets: [
      'Speaker representation metrics with diversity scorecards.',
      'Women-led initiatives spotlighted through curated collections.',
      'Safety protocols audited with survivor-centred feedback loops.',
    ],
  },
  {
    title: 'Accessibility Impact',
    subtitle: 'Assessing how inclusive design choices reshape the attendee experience.',
    bullets: [
      'Assistive technology usage data across digital and physical touchpoints.',
      'Transportation partnerships enabling mobility support.',
      'Sign language interpretation and live captioning uptake rates.',
    ],
  },
  {
    title: 'Policy Influence',
    subtitle: 'How event insights inform county planning and resource allocation.',
    bullets: [
      'Whitepapers summarising lessons from civic forums and town halls.',
      'Open data portals that drive transparency and public trust.',
      'Collaborative policy labs aligning stakeholders on shared roadmaps.',
    ],
  },
  {
    title: 'Media & Awareness Reach',
    subtitle: 'Amplifying stories that matter through strategic communications.',
    bullets: [
      'Press coverage analytics with sentiment and reach breakdowns.',
      'Social listening dashboards tracking campaign hashtags.',
      'Content syndication with regional radio, TV, and digital outlets.',
    ],
  },
  {
    title: 'Impact Stories',
    subtitle: 'Case studies that champion resilience, innovation, and unity.',
    bullets: [
      'Documenting journeys of beneficiaries whose lives were transformed.',
      'Video diaries capturing behind-the-scenes moments and learnings.',
      'Annual impact report featuring community-authored narratives.',
    ],
  },
]

export const ImpactPage = () => {
  return (
    <div className="space-y-16">
      <header className="space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl font-semibold sm:text-5xl"
        >
          Our Impact
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl text-lg text-secondary/80"
        >
          Impact is more than attendance numbers. We evaluate outcomes across education,
          livelihoods, sustainability, and governance to ensure every event creates lasting value
          for Garissa County and beyond.
        </motion.p>
      </header>

      <SectionGrid sections={sections} label="Impact Area" />
    </div>
  )
}

