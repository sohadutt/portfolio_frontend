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
  shortName: 'SD',
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

export const heroMetrics = [
  { value: '2024', label: 'started backend and config automation work at Imagine.io' },
  { value: '70%', label: 'reduction in dependency on backend engineers for routine config updates' },
  { value: '3', label: 'core tracks across backend, frontend, and production workflows' },
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
    summary:
      'Designed Django management commands for controlled database updates, automated product configurator workflows through Python scripts and REST APIs, and validated PostgreSQL-backed configuration integrity across deployments.',
  },
  {
    period: '2025 - Present',
    title: 'Frontend Developer',
    company: 'Board & Benchers | Delhi, India',
    summary:
      'Built reusable UI components with React and Tailwind CSS, integrated backend APIs with reliable error handling, and delivered responsive performance-optimized interfaces.',
  },
  {
    period: '2023 - 2024',
    title: 'VFX Artist',
    company: 'Whizzy Entertainment Studios | Gujarat, India',
    summary:
      'Created reusable production pipelines and templates, collaborating across teams to improve delivery speed and maintain technical quality standards.',
  },
]

export const showcaseCategories = [
  {
    title: 'Display & Feedback',
    icon: Sparkles,
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
    body: 'Highlights your backend work around Django management commands, data safety, and automation of production configuration flows.',
  },
  {
    title: 'Frontend delivery',
    icon: FolderGit2,
    body: 'Shows your React and Tailwind work in a more polished interface while still fitting the portfolio into a single clean page.',
  },
  {
    title: 'Cross-functional workflow',
    icon: MessageSquareQuote,
    body: 'Connects backend, frontend, QA, and production experience into one narrative instead of splitting them into isolated roles.',
  },
  {
    title: 'Scalable portfolio system',
    icon: Blocks,
    body: 'Keeps room for the larger component system you asked for, while the visible content now reflects your resume and links.',
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
