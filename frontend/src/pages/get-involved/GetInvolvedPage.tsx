import { motion } from 'framer-motion'

import type { SectionContent } from '../../components/sections/SectionGrid'
import { SectionGrid } from '../../components/sections/SectionGrid'

const sections: SectionContent[] = [
  {
    title: 'Volunteer Pathways',
    subtitle: 'Opportunities for individuals, student clubs, and professional cohorts.',
    bullets: [
      'Front-of-house hosting, logistics coordination, and attendee support roles.',
      'Skills-based volunteering in branding, photography, and digital strategy.',
      'Peer mentorship circles guiding first-time organisers and speakers.',
    ],
  },
  {
    title: 'University Collaborations',
    subtitle: 'Blueprints for faculties and student unions to co-create experiences.',
    bullets: [
      'Curriculum-aligned hackathons and industry immersion trips.',
      'Joint research showcases and knowledge-sharing symposiums.',
      'Campus ambassadors programme with leadership accelerators.',
    ],
  },
  {
    title: 'Community Organisers',
    subtitle: 'Toolkits for grassroots leaders to translate ideas into impact.',
    bullets: [
      'Simplified event templates with budgeting and vendor management tips.',
      'Micro-grant directory connecting organisers to financing partners.',
      'Safety playbooks covering crowd control, compliance, and insurance.',
    ],
  },
  {
    title: 'Sponsor Experiences',
    subtitle: 'High-visibility packages linked to tangible social outcomes.',
    bullets: [
      'Branded zones featuring product demos, XR lounges, and recruitment pods.',
      'Data-rich post-event reports with sentiment analysis and reach metrics.',
      'Long-term partnership tiers co-designed with corporate CSR teams.',
    ],
  },
  {
    title: 'Learning Tracks',
    subtitle: 'Modular curricula to sharpen event strategy and storytelling.',
    bullets: [
      'Micro-courses on inclusive design, digital marketing, and fundraising.',
      'Certification tracks for event producers and volunteer leaders.',
      'Monthly masterclasses hosted by regional and international experts.',
    ],
  },
  {
    title: 'Tech Ambassador Programme',
    subtitle: 'Champion digital adoption inside your organisation or campus.',
    bullets: [
      'Early access to new features with product roadmap influence.',
      'Dedicated slack community for Q&A, beta feedback, and co-creation.',
      'Recognition badges, swag, and invites to exclusive meetups.',
    ],
  },
  {
    title: 'Content Contributors',
    subtitle: 'Amplify events through articles, photo stories, and livestreams.',
    bullets: [
      'Editorial guidelines plus pitch desk for storytellers and journalists.',
      'Integrated media hub with embeddable widgets and API endpoints.',
      'Revenue-sharing opportunities for premium content creators.',
    ],
  },
  {
    title: 'Accessibility Advocates',
    subtitle: 'Ensure every experience is barrier-free before, during, and after events.',
    bullets: [
      'Audit checklists covering venue layouts, signage, and translation services.',
      'Digital accessibility sprints to evaluate colour contrast and navigation.',
      'Community panel discussions spotlighting inclusive best practices.',
    ],
  },
  {
    title: 'Ambassador Recognition',
    subtitle: 'Celebrate contributors making a difference on the platform.',
    bullets: [
      'Seasonal awards highlighting top volunteers, organisers, and partners.',
      'Impact leaderboard visualising hours donated and funds raised.',
      'Story-driven newsletters featuring milestones and community wins.',
    ],
  },
  {
    title: 'How to Get Started',
    subtitle: 'Three simple steps to play your part today.',
    bullets: [
      'Create a profile with your interests, skills, and availability.',
      'Browse the partnership playbook and select a collaboration track.',
      'Kick off with a discovery call — our team will support every step.',
    ],
  },
]

export const GetInvolvedPage = () => {
  return (
    <div className="space-y-16">
      <header className="space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl font-semibold sm:text-5xl"
        >
          Get Involved
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl text-lg text-secondary/80"
        >
          Whether you are an individual volunteer, a student society, or a corporate changemaker,
          Garissa Event Planner provides frameworks, tools, and community to make your contribution
          count.
        </motion.p>
      </header>

      <SectionGrid sections={sections} label="Opportunity" />
    </div>
  )
}

