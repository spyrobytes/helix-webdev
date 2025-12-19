import type { MenuItem, Service, HeroMetric, MissionItem, MissionPoint } from '@/types';

// Hero phrases
export const HERO_PHRASES = [
  "Full-stack architecture & delivery",
  "Intelligent web experiences with AI",
  "Cybersecurity baked into every layer",
  "Cloud-native, scalable, and resilient systems"
] as const;

// Hero metrics
export const HERO_METRICS: readonly HeroMetric[] = [
  { label: 'Delivery lifecycle', value: 'End-to-end' },
  { label: 'Intelligent interfaces', value: 'AI-native' },
  { label: 'Design principle', value: 'Security-first' }
] as const;

// Menu items (anchor-based for home page sections)
export const MENU_ITEMS: readonly MenuItem[] = [
  { id: 'home', label: 'Home', href: '#hero' },
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'approach', label: 'Approach', href: '#mission' },
  { id: 'why', label: 'Why Helixbytes', href: '#why' },
  { id: 'contact', label: "Let's Talk", href: '#contact' }
] as const;

// Navigation items for multi-page navigation
export const NAVIGATION_ITEMS: readonly MenuItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'services', label: 'Services', href: '/services' },
  { id: 'approach', label: 'Approach', href: '/approach' },
  { id: 'why', label: 'Why Helixbytes', href: '/why-helixbytes' },
  { id: 'blog', label: 'Blog', href: '/blog' },
  { id: 'contact', label: "Let's Talk", href: '/contact' }
] as const;

// Service icon SVG paths (matching reference codebase exactly)
export const SERVICE_ICONS = {
  fullstack: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  ai: 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83',
  intelligentWeb: 'M3 3h18v18H3zM3 9h18M9 21V9',
  security: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
  cloud: 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z',
  consulting: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
} as const;

// Services data (matching reference codebase for 100% feature parity)
export const SERVICES: readonly Service[] = [
  {
    id: 'fullstack',
    icon: SERVICE_ICONS.fullstack,
    title: 'Full-Stack Development',
    description: 'End-to-end application development across diverse language ecosystems. From robust backends to pixel-perfect frontends, we build scalable solutions that grow with your business.',
    tags: [
      { id: 'react', label: 'React' },
      { id: 'node', label: 'Node.js' },
      { id: 'python', label: 'Python' },
      { id: 'go', label: 'Go' }
    ],
    backIntro: 'Our full-stack team delivers comprehensive solutions:',
    backItems: [
      'Custom web & mobile applications',
      'API design & microservices',
      'Database architecture',
      'DevOps & CI/CD pipelines',
      'Performance optimization'
    ],
    ctaLabel: 'Start Your Project',
    ctaHref: '#contact'
  },
  {
    id: 'ai',
    icon: SERVICE_ICONS.ai,
    title: 'AI Integration',
    description: 'Harness the power of artificial intelligence. We integrate frontier models and open-source solutions to create intelligent applications that automate, predict, and innovate.',
    tags: [
      { id: 'llms', label: 'LLMs' },
      { id: 'mlops', label: 'ML Ops' },
      { id: 'rag', label: 'RAG' },
      { id: 'agents', label: 'Agents' }
    ],
    backIntro: 'Transform your business with AI:',
    backItems: [
      'Custom LLM fine-tuning',
      'RAG system implementation',
      'Intelligent chatbots & agents',
      'Computer vision solutions',
      'Predictive analytics'
    ],
    ctaLabel: 'Explore AI Solutions',
    ctaHref: '#contact'
  },
  {
    id: 'intelligent-web',
    icon: SERVICE_ICONS.intelligentWeb,
    title: 'Intelligent Web Apps',
    description: 'Progressive web applications enhanced with AI capabilities. Real-time data processing, smart interfaces, and seamless user experiences that set you apart.',
    tags: [
      { id: 'pwa', label: 'PWA' },
      { id: 'realtime', label: 'Real-time' },
      { id: 'smartui', label: 'Smart UI' }
    ],
    backIntro: 'Next-generation web experiences:',
    backItems: [
      'Progressive Web Apps (PWA)',
      'Real-time collaboration tools',
      'AI-powered recommendations',
      'Smart search & filtering',
      'Offline-first architecture'
    ],
    ctaLabel: 'Build Your App',
    ctaHref: '#contact'
  },
  {
    id: 'security',
    icon: SERVICE_ICONS.security,
    title: 'Cybersecurity',
    description: 'Protect your digital assets with enterprise-grade security. Penetration testing, vulnerability assessments, and 24/7 monitoring to keep threats at bay.',
    tags: [
      { id: 'pentest', label: 'Pen Test' },
      { id: 'soc', label: 'SOC' },
      { id: 'zerotrust', label: 'Zero Trust' }
    ],
    backIntro: 'Comprehensive security services:',
    backItems: [
      'Penetration testing & audits',
      '24/7 SOC monitoring',
      'Incident response planning',
      'Zero Trust implementation',
      'Compliance consulting'
    ],
    ctaLabel: 'Secure Your Assets',
    ctaHref: '#contact'
  },
  {
    id: 'cloud',
    icon: SERVICE_ICONS.cloud,
    title: 'Cloud Architecture',
    description: 'Scalable, resilient cloud infrastructure designed for performance. Multi-cloud strategies, serverless architectures, and cost-optimized deployments.',
    tags: [
      { id: 'aws', label: 'AWS' },
      { id: 'azure', label: 'Azure' },
      { id: 'gcp', label: 'GCP' },
      { id: 'k8s', label: 'K8s' }
    ],
    backIntro: 'Enterprise-grade cloud solutions:',
    backItems: [
      'Multi-cloud & hybrid strategies',
      'Kubernetes orchestration',
      'Serverless architecture',
      'Cost optimization & FinOps',
      'Disaster recovery planning'
    ],
    ctaLabel: 'Scale Your Infrastructure',
    ctaHref: '#contact'
  },
  {
    id: 'consulting',
    icon: SERVICE_ICONS.consulting,
    title: 'Strategic Consulting',
    description: 'Expert guidance for your digital transformation journey. Technology audits, roadmap planning, and implementation strategies tailored to your goals.',
    tags: [
      { id: 'strategy', label: 'Strategy' },
      { id: 'audit', label: 'Audit' },
      { id: 'planning', label: 'Planning' }
    ],
    backIntro: 'Expert guidance for success:',
    backItems: [
      'Technology audits & assessments',
      'Digital transformation roadmaps',
      'Vendor selection & management',
      'Team training & upskilling',
      'Process optimization'
    ],
    ctaLabel: 'Book a Consultation',
    ctaHref: '#contact'
  }
] as const;

// Mission items
export const MISSION_ITEMS: readonly MissionItem[] = [
  {
    id: 'discovery',
    title: 'Discovery & Alignment.',
    description: 'We work with you to understand objectives, constraints, and success metrics before we architect solutions.'
  },
  {
    id: 'architecture',
    title: 'Architecture & Design.',
    description: 'We propose scalable, secure patterns matched to your stack, team, and growth plans.'
  },
  {
    id: 'delivery',
    title: 'Iterative Delivery.',
    description: 'We ship in well-defined increments, ensuring transparency, feedback, and measurable progress at every stage.'
  },
  {
    id: 'security',
    title: 'Security & Reliability.',
    description: 'We embed security and resilience—from code to infrastructure—rather than treating them as add-ons.'
  }
] as const;

// Mission points
export const MISSION_POINTS: readonly MissionPoint[] = [
  {
    id: 'innovation',
    heading: 'Innovation Grounded in Reality',
    description: 'We love frontier technologies—but only when they solve real problems. Every solution is anchored in business outcomes, not hype.'
  },
  {
    id: 'security-default',
    heading: 'Security as a Default',
    description: 'In a hostile digital landscape, security cannot be optional. We design systems assuming threats will happen—and prepare accordingly.'
  },
  {
    id: 'future-ready',
    heading: 'Future-Ready by Design',
    description: 'Clean architecture, clear boundaries, and thoughtful abstractions ensure your systems evolve with your roadmap, not against it.'
  },
  {
    id: 'versatile',
    heading: 'From Startups to Public Sector',
    description: 'Whether you\'re a small business, an enterprise, or a government agency, we adapt our engagement model to match your scale and governance needs.'
  }
] as const;

// Why section pills
export const WHY_PILLS = ['AI-native', 'Security-first', 'Cloud-ready', 'Human-centered UX'] as const;

// Client sectors
export const CLIENT_SECTORS = [
  {
    id: 'small-business',
    label: 'Small Businesses',
    description: 'Growing companies ready to scale',
    icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
    accentVar: '--accent-3', // Green - growth
  },
  {
    id: 'enterprises',
    label: 'Enterprises',
    description: 'Large-scale digital transformation',
    icon: 'M2 7h20v14a2 2 0 01-2 2H4a2 2 0 01-2-2V7z M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16',
    accentVar: '--accent-6', // Blue - trust/stability
  },
  {
    id: 'government',
    label: 'Government Agencies',
    description: 'Secure, compliant solutions',
    icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
    accentVar: '--accent-2', // Purple - authority
  },
  {
    id: 'global',
    label: 'Global Organizations',
    description: 'International reach and impact',
    icon: 'M12 2a10 10 0 100 20 10 10 0 000-20z M2 12h20 M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z',
    accentVar: '--accent-1', // Cyan - innovation/reach
  },
] as const;
