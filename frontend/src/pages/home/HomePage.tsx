import { motion } from 'framer-motion'

import { SectionGrid } from '../../components/sections/SectionGrid'

const sections = [
  {
    title: 'Welcome to Garissa Event Planner',
    subtitle: 'Connecting communities with unforgettable experiences.',
    bullets: [
      'Discover cultural festivals, innovation summits, and student showcases.',
      'Personalised recommendations tailored to your interests and location.',
      'Seamless ticketing with mobile-first access and instant notifications.',
    ],
  },
  {
    title: 'Featured Causes & Campaigns',
    subtitle: 'Highlighting initiatives that shape education and social impact.',
    bullets: [
      'Scholarship drives for bright minds in Garissa County.',
      'Community health outreach programs powered by local heroes.',
      'Climate resilience events focusing on sustainability and innovation.',
    ],
  },
  {
    title: 'Upcoming Highlights',
    subtitle: 'Plan ahead with a curated calendar of must-attend gatherings.',
    bullets: [
      'STEM innovation expo hosted by Garissa University partners.',
      'Regional entrepreneurship bootcamps with industry mentors.',
      'Cultural nights celebrating art, music, and storytelling.',
    ],
  },
  {
    title: 'Community Voices',
    subtitle: 'Real stories from attendees, organizers, and volunteers.',
    bullets: [
      'Testimonial hub spotlighting transformative experiences.',
      'Live feedback wall powered by real-time event sentiment.',
      'Share your journey and inspire others to engage.',
    ],
  },
  {
    title: 'University Spotlight',
    subtitle: 'A dedicated lane for higher-learning institutions.',
    bullets: [
      'Centralize campus events, alumni meetups, and career fairs.',
      'Streamlined event approvals coordinated with administrators.',
      'Analytics on student engagement, attendance, and feedback.',
    ],
  },
  {
    title: 'Volunteer Opportunities',
    subtitle: 'Make meaningful contributions before, during, and after events.',
    bullets: [
      'Access curated volunteer roles aligned with your skills.',
      'Track impact hours and earn digital recognition badges.',
      'Collaborate with NGOs and grassroots organisations effortlessly.',
    ],
  },
  {
    title: 'Digital Experience First',
    subtitle: 'Optimised for any device and built for low-bandwidth environments.',
    bullets: [
      'Progressive web app support with offline-ready agendas.',
      'Accessibility-first typography, contrast, and motion controls.',
      'Real-time updates powered by resilient infrastructure.',
    ],
  },
  {
    title: 'Security & Trust',
    subtitle: 'Enterprise-grade security practices baked into every workflow.',
    bullets: [
      'Role-based dashboards for users, universities, and administrators.',
      'Multi-factor authentication and OTP verification on critical flows.',
      'Continuous auditing with transparent activity logs.',
    ],
  },
  {
    title: 'Success Metrics',
    subtitle: 'Quantify growth, engagement, and satisfaction in one glance.',
    bullets: [
      'Visual dashboards for registrations, turnouts, and conversions.',
      'Heatmaps to identify trending topics and peak attendance.',
      'AI-driven insights that recommend next steps for organisers.',
    ],
  },
  {
    title: 'Join the Movement',
    subtitle: 'Be part of a resilient ecosystem empowering Garissa County.',
    bullets: [
      'Subscribe for curated updates and impact reports.',
      'Follow us on community channels for behind-the-scenes content.',
      'Host your own event and amplify voices that matter.',
    ],
  },
]

export const HomePage = () => {
  return (
    <div className="space-y-16">
      <header className="space-y-6 text-center sm:text-left">
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-semibold uppercase tracking-[0.4em] text-accent-light"
        >
          Garissa Event Planner
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl font-display text-4xl font-semibold sm:text-5xl lg:text-6xl"
        >
          Experience the pulse of Garissa — curated events, meaningful connections, lasting
          impact.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-lg text-secondary/80"
        >
          Discover events from universities, community leaders, and changemakers. Book with
          confidence, collaborate on campaigns, and access insights that accelerate growth.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-4"
        >
          <button type="button" className="btn-primary">
            Explore upcoming events
          </button>
          <button type="button" className="btn-secondary">
            Become a partner
          </button>
        </motion.div>
      </header>

      <SectionGrid sections={sections} label="Pillar" />
    </div>
  )
}

