import {
  ArrowUpRight,
  Blocks,
  BriefcaseBusiness,
  Code2,
  Component,
  Database,
  FolderGit2,
  Globe,
  LayoutPanelTop,
  Mail,
  MessageSquareQuote,
  Sparkles,
  Workflow,
} from 'lucide-react'

export const personalInfo = {
  name: 'Soham Dutta',
  shortName: 'sohadutt',
  title: 'Full-stack Developer',
  subtitle: 'JavaScript, Python, Django, React',
  location: 'India',
  email: 'sohadutt@outlook.com',
  github: 'https://github.com/sohadutt',
  linkedin: 'https://linkedin.com/in/sohadutt',
}

export const navigationLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'UI System', href: '#components' },
  { label: 'Contact', href: '#contact' },
]

export const heroContent = {
  eyebrow: 'Soham Dutta',
  title: 'Backend-focused full-stack developer building reliable systems and polished frontend experiences.',
  description:
    'I work across Django, Python automation, PostgreSQL, REST APIs, React, and Tailwind CSS. My recent work focuses on safer configuration tooling, reusable UI, and product-first engineering that removes manual friction for teams.',
}

export const heroActions = {
  primary: {
    label: 'View projects',
    href: '#projects',
  },
  secondary: {
    label: 'GitHub',
    href: 'https://github.com/sohadutt',
  },
}

export const heroMetrics = [
  { value: '2024', label: 'started backend and config automation work at Imagine.io' },
  { value: '70%', label: 'reduction in dependency on backend engineers for routine config updates' },
  { value: '3', label: 'core tracks across backend, frontend, and production workflows' },
]

export const heroFocus = {
  eyebrow: 'Current focus',
  title: 'Automation + product delivery',
  areas: [
    { label: 'Backend systems', value: 78 },
    { label: 'Frontend delivery', value: 92 },
    { label: 'Workflow thinking', value: 64 },
  ],
}

export const heroBadges = [
  { label: 'Full-stack' },
  { label: 'Product-minded' },
]

export const heroHighlights = [
  {
    title: 'Backend systems',
    description: 'Django, APIs, automation workflows and scalable backend logic.',
  },
  {
    title: 'Frontend delivery',
    description: 'React, Tailwind and modern UI systems integrated with APIs.',
  },
]

export const aboutContent = {
  title: 'A portfolio shaped around your actual engineering profile.',
  description:
    'This version now reflects the resume directly: backend and configuration automation at Imagine.io, frontend development at Board & Benchers, and a workflow mindset shaped by production experience in VFX. The structure stays modular, but the content is now yours.',
}

export const skillGroups = [
  {
    title: 'Backend & APIs',
    description: 'Building Django services, safe admin tooling, and API-driven automation for production systems.',
    items: ['Python', 'Django', 'Node JS', 'REST APIs', 'Automation scripts'],
  },
  {
    title: 'Data & Infra',
    description: 'Keeping systems dependable through sound data handling, deployment awareness, and operational care.',
    items: ['PostgreSQL', 'MongoDB', 'AWS', 'Jenkins', 'Linux'],
  },
  {
    title: 'Frontend & Product',
    description: 'Translating product needs into reusable interfaces with responsive implementation and consistent UX.',
    items: ['React', 'Tailwind CSS', 'Angular', 'Figma', 'Git'],
  },
]

export const projects = [
  {
    title: 'Internal Config Management Tool',
    eyebrow: 'Backend automation',
    description:
      'Developed Django management commands and Python API scripts for secure configuration management, abstracting direct database access to improve operational safety for production systems.',
    stack: ['Django', 'Python', 'REST APIs'],
    stat: '70% fewer routine config requests',
  },
  {
    title: 'Custom Product Configurator Platform',
    eyebrow: 'Config systems',
    description:
      'Built scalable configuration logic using structured JSON and Excel schemas for multi-client deployments, then coordinated QA and deployment processes for zero-downtime releases.',
    stack: ['JSON schemas', 'Excel workflows', 'QA and deployment'],
    stat: 'Multi-client rollout',
  },
  {
    title: 'Board & Benchers Frontend Work',
    eyebrow: 'Frontend delivery',
    description:
      'Built reusable React and Tailwind CSS components, integrated frontend flows with backend APIs, and delivered responsive interfaces across multiple devices.',
    stack: ['React', 'Tailwind CSS', 'API integration'],
    stat: 'Reusable UI components',
  },
]

export const experience = [
  {
    period: '2024 - Present',
    title: 'Associate - Backend & Config Automation',
    company: 'Imagine.io | Delhi, India',
    relation: 'automation',
    summary:
      'Designed Django management commands for controlled database updates, automated product configurator workflows through Python scripts and REST APIs, and validated PostgreSQL-backed configuration integrity across deployments.',
    highlights: [
      'Controlled config changes through safe Django command flows instead of direct production edits.',
      'Connected REST automation, PostgreSQL validation, and deployment checks into one repeatable path.',
      'Reduced manual operational risk while keeping product teams moving faster.',
    ],
    relatedComponents: ['Command', 'Alert Dialog', 'Data Table', 'Toast'],
  },
  {
    period: '2025 - Present',
    title: 'Frontend Developer',
    company: 'Board & Benchers | Delhi, India',
    relation: 'frontend',
    summary:
      'Built reusable UI components with React and Tailwind CSS, integrated backend APIs with reliable error handling, and delivered responsive performance-optimized interfaces.',
    highlights: [
      'Created reusable interface pieces that scale across pages instead of one-off screens.',
      'Focused on responsive behavior, API feedback states, and smoother user flows on multiple devices.',
      'Turned backend capability into UI that feels polished and dependable.',
    ],
    relatedComponents: ['Drawer', 'Tabs', 'Tooltip', 'Toast'],
  },
  {
    period: '2023 - 2024',
    title: 'VFX Artist',
    company: 'Whizzy Entertainment Studios | Gujarat, India',
    relation: 'workflow',
    summary:
      'Created reusable production pipelines and templates, collaborating across teams to improve delivery speed and maintain technical quality standards.',
    highlights: [
      'Brought a pipeline mindset that values repeatability, naming consistency, and handoff clarity.',
      'Worked across teams where timing and technical quality both mattered for delivery.',
      'That production discipline now carries into engineering workflows and QA.',
    ],
    relatedComponents: ['Progress', 'Calendar', 'Table', 'Badge'],
  },
]

export const showcaseCategories = [
  {
    title: 'Display & Feedback',
    icon: Sparkles,
    relation: 'workflow',
    preview:
      'Feedback-heavy components help workflow-driven systems communicate status, QA progress, and delivery confidence.',
    items: [
      'Alert',
      'Badge',
      'Card',
      'Chart',
      'Empty',
      'Progress',
      'Skeleton',
      'Sonner',
      'Spinner',
      'Toast',
      'Tooltip',
      'Typography',
    ],
  },
  {
    title: 'Navigation & Layout',
    icon: LayoutPanelTop,
    relation: 'frontend',
    preview:
      'Layout and navigation patterns support the frontend track, especially when interfaces need to expand without feeling crowded.',
    items: [
      'Accordion',
      'Aspect Ratio',
      'Breadcrumb',
      'Button Group',
      'Carousel',
      'Collapsible',
      'Context Menu',
      'Drawer',
      'Dropdown Menu',
      'Hover Card',
      'Menubar',
      'Navigation Menu',
      'Pagination',
      'Popover',
      'Resizable',
      'Scroll Area',
      'Separator',
      'Sheet',
      'Sidebar',
      'Tabs',
    ],
  },
  {
    title: 'Data & Forms',
    icon: Workflow,
    relation: 'automation',
    preview:
      'Forms and data controls connect directly to the automation work, where safe input, validation, and review matter most.',
    items: [
      'Calendar',
      'Checkbox',
      'Combobox',
      'Command',
      'Data Table',
      'Date Picker',
      'Dialog',
      'Direction',
      'Field',
      'Input',
      'Input Group',
      'Input OTP',
      'Item',
      'Kbd',
      'Label',
      'Native Select',
      'Radio Group',
      'Select',
      'Switch',
      'Table',
      'Textarea',
      'Toggle',
      'Toggle Group',
      'Alert Dialog',
      'Avatar',
      'Button',
    ],
  },
]

export const featuredModules = [
  {
    title: 'Config automation',
    icon: Database,
    relation: 'automation',
    body: 'Highlights your backend work around Django management commands, data safety, and automation of production configuration flows.',
    details:
      'When this card is active, the system emphasizes data-heavy components and safer review patterns that match your backend automation story.',
  },
  {
    title: 'Frontend delivery',
    icon: FolderGit2,
    relation: 'frontend',
    body: 'Shows your React and Tailwind work in a more polished interface while still fitting the portfolio into a single clean page.',
    details:
      'This state pulls navigation and layout patterns forward so the portfolio visibly reflects your UI delivery strengths.',
  },
  {
    title: 'Cross-functional workflow',
    icon: MessageSquareQuote,
    relation: 'workflow',
    body: 'Connects backend, frontend, QA, and production experience into one narrative instead of splitting them into isolated roles.',
    details:
      'The expanded view leans into status, coordination, and delivery cues that show how you work across disciplines.',
  },
  {
    title: 'Scalable portfolio system',
    icon: Blocks,
    relation: 'portfolio-system',
    body: 'Keeps room for the larger component system you asked for, while the visible content now reflects your resume and links.',
    details:
      'This stays as its own focused module so the linked hover system only expands one related card at a time.',
  },
]

export const contactMethods = [
  {
    label: 'Email',
    value: 'sohadutt@outlook.com',
    href: 'mailto:sohadutt@outlook.com',
    icon: Mail,
  },
  {
    label: 'GitHub',
    value: 'github.com/sohadutt',
    href: 'https://github.com/sohadutt',
    icon: FolderGit2,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/sohadutt',
    href: 'https://linkedin.com/in/sohadutt',
    icon: Globe,
  },
  {
    label: 'Current Role',
    value: 'Associate - Backend & Config Automation',
    href: '#experience',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Core Focus',
    value: 'Django, automation, APIs, and React UI',
    href: '#projects',
    icon: Code2,
  },
]

export const footerLinks = [
  { label: 'GitHub', href: 'https://github.com/sohadutt' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/sohadutt' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export const statusPills = [
  { label: 'Backend and config automation', icon: ArrowUpRight },
  { label: 'React and Tailwind delivery', icon: Component },
]

export const sectionCopy = {
  about: {
    eyebrow: 'About',
    title: aboutContent.title,
    description: aboutContent.description,
  },
  projects: {
    eyebrow: 'Projects',
    title: 'Selected work from configuration systems to frontend delivery.',
    description:
      'These cards now reflect the projects and outcomes from your resume, with emphasis on secure configuration tooling, deployment reliability, and reusable UI work.',
  },
  experience: {
    eyebrow: 'Experience',
    title: 'Experience across backend automation, frontend delivery, and production workflows.',
    description:
      'Hover a role to expand the story, pull its orange spotlight forward, and surface the component direction connected to that work.',
  },
  components: {
    eyebrow: 'UI System',
    title: 'Related components now respond to the same hover story.',
    description:
      'The orange spotlight moves between engineering tracks and the UI patterns they influence, so the page feels connected instead of sectioned off.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Open to roles and collaborations where backend reliability meets strong product thinking.',
    description:
      'Reach out for backend automation, Django and API work, or frontend implementation with React and Tailwind CSS.',
  },
}

export const pageCopy = {
  loadingTitle: 'Loading portfolio',
  loadingDescription: 'Preparing the showcase experience.',
}

export const defaultPortfolioDocument = {
  new_order_index: 1,
  is_enabled: true,
  personalInfo: { ...personalInfo },
  navigationLinks: navigationLinks.map((item) => ({ ...item })),
  heroContent: { ...heroContent },
  heroActions: {
    primary: { ...heroActions.primary },
    secondary: { ...heroActions.secondary },
  },
  heroMetrics: heroMetrics.map((item) => ({ ...item })),
  heroFocus: {
    ...heroFocus,
    areas: heroFocus.areas.map((item) => ({ ...item })),
  },
  heroBadges: heroBadges.map((item) => ({ ...item })),
  heroHighlights: heroHighlights.map((item) => ({ ...item })),
  aboutContent: { ...aboutContent },
  skillGroups: skillGroups.map((item) => ({
    ...item,
    items: [...item.items],
  })),
  projects: projects.map((item) => ({
    ...item,
    stack: [...item.stack],
  })),
  experience: experience.map((item) => ({
    ...item,
    highlights: [...item.highlights],
    relatedComponents: [...item.relatedComponents],
  })),
  showcaseCategories: showcaseCategories.map((item) => ({
    ...item,
    icon: item.icon.name,
    items: [...item.items],
  })),
  featuredModules: featuredModules.map((item) => ({
    ...item,
    icon: item.icon.name,
  })),
  contactMethods: contactMethods.map((item) => ({
    ...item,
    icon: item.icon.name,
  })),
  footerLinks: footerLinks.map((item) => ({ ...item })),
  statusPills: statusPills.map((item) => ({
    ...item,
    icon: item.icon.name,
  })),
  sectionCopy: JSON.parse(JSON.stringify(sectionCopy)),
  pageCopy: { ...pageCopy },
}
