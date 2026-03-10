import type { Vertical } from '@/types';

export interface VerticalArticle {
  cat: string;
  catColor: string;
  title: string;
  imgUrl: string;
  prompt: string;
}

export interface VerticalConfig {
  accent: string;
  tagline: string;
  systemPrompt: string;
  articles: [VerticalArticle, VerticalArticle, VerticalArticle];
  starters: [string, string, string];
}

/* ─── System Prompts ────────────────────────────────────────── */

const SYS: Record<Vertical | 'builder', string> = {
  search:
    'You are SAL, the AI research engine for SaintSal™ Labs (saintsallabs.com), backed by US Patent #10,290,222 HACP Protocol. You deliver deeply researched, citation-rich answers across every domain. Structure every response with clear headers, bullet points, and a Sources section. If the user asks for code, provide production-ready examples. Always be thorough, precise, and authoritative.',

  sports:
    'You are SAL Sports — elite sports intelligence for SaintSal™ Labs, backed by US Patent #10,290,222 HACP Protocol. You provide expert-level analysis on games, players, stats, odds, fantasy, and betting markets. Always include relevant stats, historical context, and data-driven projections. Format responses with clear sections and tables when appropriate.',

  news:
    'You are SAL News — breaking news and geopolitical intelligence for SaintSal™ Labs, backed by US Patent #10,290,222 HACP Protocol. You deliver real-time news analysis, fact-checked reporting, and geopolitical context. Always provide multiple perspectives, source attribution, and timeline context. Separate facts from analysis clearly.',

  tech:
    'You are SAL Tech — deep technical intelligence for SaintSal™ Labs, backed by US Patent #10,290,222 HACP Protocol. You provide expert analysis on software engineering, AI/ML, cybersecurity, cloud infrastructure, and emerging technologies. Always include code examples, architecture recommendations, and practical implementation guidance.',

  finance:
    'You are SAL Finance — institutional-grade financial intelligence for SaintSal™ Labs, backed by US Patent #10,290,222 HACP Protocol. You deliver professional-tier analysis on markets, equities, crypto, macro economics, and investment strategies. Always include relevant data points, risk factors, and structured analysis. Not financial advice.',

  realestate:
    'You are SAL Real Estate — comprehensive real estate intelligence for SaintSal™ Labs, backed by US Patent #10,290,222 HACP Protocol and CookinCapital deal analysis methodology. You provide expert analysis on property valuations, market trends, investment analysis, deal structuring, and development feasibility. Always include comparable data, ROI projections, and market context.',

  medical:
    'You are SAL Medical — clinical intelligence for SaintSal™ Labs, backed by US Patent #10,290,222 HACP Protocol. You provide evidence-based medical information, clinical research analysis, drug interactions, and health guidance. Always cite medical literature, include confidence levels, and note when professional consultation is recommended. Not medical advice.',

  builder:
    'You are SAL Builder — the full-stack AI developer for SaintSal™ Labs, backed by US Patent #10,290,222 HACP Protocol. You generate production-ready applications from natural-language prompts. Always output complete, runnable code files wrapped in markdown code blocks with filenames. Use modern frameworks (React, Next.js, Tailwind CSS) by default. Structure code cleanly with proper imports, types, and error handling.',
};

/* ─── Vertical Configs ──────────────────────────────────────── */

export const VERTICAL_CONFIG: Record<Vertical, VerticalConfig> = {
  search: {
    accent: '#F59E0B',
    tagline: 'Research anything with patent-backed AI intelligence',
    systemPrompt: SYS.search,
    articles: [
      {
        cat: 'Research',
        catColor: '#F59E0B',
        title: 'How HACP Protocol Transforms AI Search',
        imgUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&q=80',
        prompt: 'Explain how the HACP Protocol (US Patent #10,290,222) improves AI search accuracy',
      },
      {
        cat: 'Science',
        catColor: '#3B82F6',
        title: 'Quantum Computing Breakthroughs in 2026',
        imgUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80',
        prompt: 'What are the latest quantum computing breakthroughs and their practical implications?',
      },
      {
        cat: 'Analysis',
        catColor: '#8B5CF6',
        title: 'The Future of AI-Powered Research',
        imgUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80',
        prompt: 'How is AI transforming academic and commercial research in 2026?',
      },
    ],
    starters: [
      'Compare the top 5 AI models by capability and pricing',
      'Explain blockchain consensus mechanisms with examples',
      'What are the most promising renewable energy technologies?',
    ],
  },

  sports: {
    accent: '#22C55E',
    tagline: 'Elite sports intelligence and analytics',
    systemPrompt: SYS.sports,
    articles: [
      {
        cat: 'NFL',
        catColor: '#22C55E',
        title: 'NFL Draft Prospects: AI Scouting Report',
        imgUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&q=80',
        prompt: 'Give me an AI-powered scouting report on the top 10 NFL draft prospects',
      },
      {
        cat: 'NBA',
        catColor: '#F97316',
        title: 'NBA Playoff Predictions with Advanced Stats',
        imgUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80',
        prompt: 'Predict the NBA playoff bracket using advanced analytics',
      },
      {
        cat: 'Fantasy',
        catColor: '#8B5CF6',
        title: 'Fantasy Football Sleepers to Target',
        imgUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80',
        prompt: 'Who are the best fantasy football sleepers to target this season?',
      },
    ],
    starters: [
      'Break down tonight\'s NBA games with betting analysis',
      'Who are the top MLB free agents and where should they sign?',
      'Give me a weekly fantasy football start/sit analysis',
    ],
  },

  news: {
    accent: '#EF4444',
    tagline: 'Breaking news and geopolitical intelligence',
    systemPrompt: SYS.news,
    articles: [
      {
        cat: 'Geopolitics',
        catColor: '#EF4444',
        title: 'Global Power Shifts: AI Analysis',
        imgUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&q=80',
        prompt: 'Analyze the current global geopolitical landscape and emerging power dynamics',
      },
      {
        cat: 'Economy',
        catColor: '#F59E0B',
        title: 'Economic Outlook: What Markets Signal',
        imgUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80',
        prompt: 'What are the key economic indicators signaling about the global economy?',
      },
      {
        cat: 'Policy',
        catColor: '#3B82F6',
        title: 'AI Regulation: Global Policy Tracker',
        imgUrl: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=400&q=80',
        prompt: 'What AI regulations are being proposed or enacted worldwide?',
      },
    ],
    starters: [
      'Summarize the top 5 global news stories today with context',
      'What are the key geopolitical risks to watch this quarter?',
      'Analyze recent trade policy changes and their market impact',
    ],
  },

  tech: {
    accent: '#818CF8',
    tagline: 'Deep technical intelligence and engineering',
    systemPrompt: SYS.tech,
    articles: [
      {
        cat: 'AI/ML',
        catColor: '#818CF8',
        title: 'LLM Architecture Deep Dive',
        imgUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=80',
        prompt: 'Explain transformer architecture and attention mechanisms in detail with code',
      },
      {
        cat: 'Security',
        catColor: '#EF4444',
        title: 'Zero-Trust Architecture Implementation',
        imgUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=400&q=80',
        prompt: 'How do I implement a zero-trust security architecture for a modern SaaS app?',
      },
      {
        cat: 'Cloud',
        catColor: '#3B82F6',
        title: 'Multi-Cloud Strategy Best Practices',
        imgUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80',
        prompt: 'What are the best practices for a multi-cloud infrastructure strategy?',
      },
    ],
    starters: [
      'Build a production-ready REST API with Next.js and Prisma',
      'Explain microservices vs monolith with real-world tradeoffs',
      'How do I set up CI/CD with GitHub Actions for a Next.js app?',
    ],
  },

  finance: {
    accent: '#22C55E',
    tagline: 'Institutional-grade financial intelligence',
    systemPrompt: SYS.finance,
    articles: [
      {
        cat: 'Markets',
        catColor: '#22C55E',
        title: 'Market Analysis: Sector Rotation Signals',
        imgUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&q=80',
        prompt: 'Analyze current sector rotation patterns and what they signal for investors',
      },
      {
        cat: 'Crypto',
        catColor: '#F59E0B',
        title: 'Crypto Market: Institutional Adoption',
        imgUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&q=80',
        prompt: 'What is the current state of institutional crypto adoption and its market impact?',
      },
      {
        cat: 'Macro',
        catColor: '#8B5CF6',
        title: 'Fed Policy Impact on Growth Stocks',
        imgUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&q=80',
        prompt: 'How will current Fed monetary policy impact growth stocks and tech valuations?',
      },
    ],
    starters: [
      'Build a diversified portfolio for a 30-year-old with $50k to invest',
      'Analyze the bull and bear case for NVIDIA stock',
      'Explain options trading strategies for generating income',
    ],
  },

  realestate: {
    accent: '#EC4899',
    tagline: 'Comprehensive real estate intelligence powered by CookinCapital',
    systemPrompt: SYS.realestate,
    articles: [
      {
        cat: 'Investment',
        catColor: '#EC4899',
        title: 'CookinCapital Deal Analysis Framework',
        imgUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80',
        prompt: 'Explain the CookinCapital deal analysis methodology for real estate investing',
      },
      {
        cat: 'Market',
        catColor: '#22C55E',
        title: 'Top US Markets for Cash Flow in 2026',
        imgUrl: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&q=80',
        prompt: 'What are the best US real estate markets for cash flow investing in 2026?',
      },
      {
        cat: 'Development',
        catColor: '#3B82F6',
        title: 'Multifamily Development Feasibility',
        imgUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80',
        prompt: 'Walk me through a multifamily development feasibility analysis step by step',
      },
    ],
    starters: [
      'Analyze a rental property: $350k purchase, $2,400/mo rent, 20% down',
      'Compare house hacking strategies for a first-time investor',
      'What are the key metrics to evaluate a commercial real estate deal?',
    ],
  },

  medical: {
    accent: '#818CF8',
    tagline: 'Evidence-based clinical intelligence',
    systemPrompt: SYS.medical,
    articles: [
      {
        cat: 'Research',
        catColor: '#818CF8',
        title: 'AI in Clinical Diagnostics: Latest Advances',
        imgUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80',
        prompt: 'What are the latest advances in AI-powered clinical diagnostics?',
      },
      {
        cat: 'Pharma',
        catColor: '#22C55E',
        title: 'Drug Discovery Pipeline Analysis',
        imgUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&q=80',
        prompt: 'Analyze the current drug discovery pipeline and promising therapies in development',
      },
      {
        cat: 'Health',
        catColor: '#EF4444',
        title: 'Preventive Health: Evidence-Based Guide',
        imgUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&q=80',
        prompt: 'Create an evidence-based preventive health screening guide by age group',
      },
    ],
    starters: [
      'Explain the mechanism of action of GLP-1 receptor agonists',
      'Compare SSRI vs SNRI medications for anxiety disorders',
      'What are the latest clinical guidelines for hypertension management?',
    ],
  },
};

export const BUILDER_SYSTEM_PROMPT = SYS.builder;
