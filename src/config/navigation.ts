export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  pro?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV: NavSection[] = [
  {
    title: 'SEARCH & AI',
    items: [
      { id: 'dashboard',   label: 'Dashboard',   icon: 'LayoutDashboard', href: '/' },
      { id: 'search',      label: 'Search',       icon: 'Search',          href: '/chat/search' },
      { id: 'sports',      label: 'Sports',       icon: 'Trophy',          href: '/chat/sports' },
      { id: 'news',        label: 'News',         icon: 'Newspaper',       href: '/chat/news' },
      { id: 'tech',        label: 'Tech',         icon: 'Cpu',             href: '/chat/tech' },
      { id: 'finance',     label: 'Finance',      icon: 'TrendingUp',      href: '/chat/finance' },
      { id: 'realestate',  label: 'Real Estate',  icon: 'Building2',       href: '/chat/realestate' },
      { id: 'medical',     label: 'Medical',      icon: 'HeartPulse',      href: '/chat/medical' },
      { id: 'cookin-cards',label: 'CookinCards',  icon: 'ChefHat',         href: '/cookin-cards' },
    ],
  },
  {
    title: 'CREATE',
    items: [
      { id: 'builder',        label: 'Builder',        icon: 'Code2',     href: '/builder' },
      { id: 'social-studio',  label: 'Social Studio',  icon: 'Share2',    href: '/social' },
      { id: 'domains',        label: 'Domains',        icon: 'Globe',     href: '/domains' },
      { id: 'business-center',label: 'Business Center',icon: 'Briefcase', href: '/business-center' },
    ],
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { id: 'career-suite',  label: 'Career Suite',  icon: 'GraduationCap', href: '/career',       pro: true },
      { id: 'voice-ai',      label: 'Voice AI',       icon: 'Mic',           href: '/voice',        pro: true },
      { id: 'business-plan', label: 'Business Plan',  icon: 'FileText',      href: '/business-plan' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { id: 'my-sal',       label: 'My SAL',       icon: 'User',       href: '/my-sal' },
      { id: 'integrations', label: 'Integrations', icon: 'Plug',       href: '/integrations' },
      { id: 'pricing',      label: 'Pricing',      icon: 'CreditCard', href: '/pricing' },
      { id: 'account',      label: 'Account',      icon: 'User',       href: '/account' },
    ],
  },
];

export const VERTICALS = [
  'search',
  'sports',
  'news',
  'tech',
  'finance',
  'realestate',
  'medical',
] as const;
