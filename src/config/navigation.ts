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
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
      { id: 'search', label: 'Search', icon: 'Search', href: '/search' },
      { id: 'sports', label: 'Sports', icon: 'Trophy', href: '/sports' },
      { id: 'news', label: 'News', icon: 'Newspaper', href: '/news' },
      { id: 'tech', label: 'Tech', icon: 'Cpu', href: '/tech' },
      { id: 'finance', label: 'Finance', icon: 'TrendingUp', href: '/finance' },
      { id: 'realestate', label: 'Real Estate', icon: 'Building2', href: '/realestate' },
      { id: 'medical', label: 'Medical', icon: 'HeartPulse', href: '/medical' },
      { id: 'cookin-cards', label: 'CookinCards', icon: 'ChefHat', href: '/cookin-cards' },
    ],
  },
  {
    title: 'CREATE',
    items: [
      { id: 'builder', label: 'Builder', icon: 'Code2', href: '/builder' },
      { id: 'social-studio', label: 'Social Studio', icon: 'Share2', href: '/social-studio' },
      { id: 'domains', label: 'Domains', icon: 'Globe', href: '/domains' },
      { id: 'business-center', label: 'Business Center', icon: 'Briefcase', href: '/business-center' },
    ],
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { id: 'career-suite', label: 'Career Suite', icon: 'GraduationCap', href: '/career-suite', pro: true },
      { id: 'voice-ai', label: 'Voice AI', icon: 'Mic', href: '/voice-ai', pro: true },
      { id: 'business-plan', label: 'Business Plan', icon: 'FileText', href: '/business-plan' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { id: 'my-sal', label: 'My SAL', icon: 'User', href: '/my-sal' },
      { id: 'integrations', label: 'Integrations', icon: 'Plug', href: '/integrations' },
      { id: 'pricing', label: 'Pricing', icon: 'CreditCard', href: '/pricing' },
      { id: 'account', label: 'Account', icon: 'User', href: '/account' },
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
