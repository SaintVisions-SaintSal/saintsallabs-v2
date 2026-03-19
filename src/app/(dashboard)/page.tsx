'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search, Code2, LayoutDashboard, Zap, Trophy,
  TrendingUp, Building2, Newspaper, ChevronRight,
  X, Sparkles, Globe, Users, Cpu,
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { useAuth } from '@/hooks/use-auth';

/* ─── 3 Primary Launch Tiles ───────────────────────────────── */
const LAUNCH = [
  {
    id: 'chat',
    icon: Search,
    label: 'SAL Chat',
    sub: 'Ask anything. Every vertical.',
    href: '/chat/search',
    accent: '#D4AF37',
    glow: 'rgba(212,175,55,0.15)',
    badge: 'Most Used',
    tips: ['Search · Sports · Finance · Real Estate', 'Patent-backed HACP intelligence', 'Real-time data across all verticals'],
  },
  {
    id: 'builder',
    icon: Code2,
    label: 'Builder',
    sub: 'Describe it. Ship it.',
    href: '/builder',
    accent: '#818CF8',
    glow: 'rgba(129,140,248,0.15)',
    badge: 'AI-Powered',
    tips: ['Full-stack app generation', 'Claude-powered code engine', 'Deploy to Vercel in one click'],
  },
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    label: 'Command Center',
    sub: 'Your data. Your control.',
    href: '/account',
    accent: '#22C55E',
    glow: 'rgba(34,197,94,0.15)',
    badge: 'Your Hub',
    tips: ['Usage metrics & billing', 'Team management', 'API keys & integrations'],
  },
];

/* ─── Quick verticals ──────────────────────────────────────── */
const VERTICALS = [
  { label: 'Sports', href: '/chat/sports', icon: Trophy, color: '#22C55E' },
  { label: 'Finance', href: '/chat/finance', icon: TrendingUp, color: '#F59E0B' },
  { label: 'Real Estate', href: '/chat/realestate', icon: Building2, color: '#EC4899' },
  { label: 'News', href: '/chat/news', icon: Newspaper, color: '#EF4444' },
  { label: 'Tech', href: '/chat/tech', icon: Cpu, color: '#818CF8' },
  { label: 'Global', href: '/chat/search', icon: Globe, color: '#06B6D4' },
];

/* ─── Platform tips ────────────────────────────────────────── */
const TOUR_TIPS = [
  { icon: Zap, text: 'Type any question in the bar below — SAL routes it to the right model automatically' },
  { icon: Users, text: 'Set up your Business DNA in Account → it personalizes every response to your industry' },
  { icon: Sparkles, text: 'Builder generates production-ready code — describe the app, get the files' },
  { icon: Globe, text: '8 intelligence verticals: Search, Sports, Finance, Real Estate, News, Tech, Medical, Social' },
];

/* ─── Greeting helper ──────────────────────────────────────── */
function greeting(name?: string) {
  const h = new Date().getHours();
  const time = h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
  const who = name ? name.split(' ')[0] : 'Cap';
  return `Good ${time}, ${who}`;
}

export default function DashboardHome() {
  const { setActivePage } = useAppStore();
  const { user } = useAuth();
  const router = useRouter();

  const [showTour, setShowTour] = useState(false);
  const [activeTile, setActiveTile] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setActivePage('dashboard');
    setMounted(true);
    // Show tour only if user hasn't dismissed it this session
    const dismissed = sessionStorage.getItem('sal_tour_dismissed');
    if (!dismissed) setShowTour(true);
  }, [setActivePage]);

  function dismissTour() {
    sessionStorage.setItem('sal_tour_dismissed', '1');
    setShowTour(false);
  }

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100%', background: '#080808', padding: '0', overflowY: 'auto' }}>

      {/* ── Tour overlay ─────────────────────────────────── */}
      {showTour && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #111 0%, #0d0d0d 100%)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '20px',
            padding: '36px',
            maxWidth: '520px',
            width: '100%',
            position: 'relative',
          }}>
            {/* Close */}
            <button
              onClick={dismissTour}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#D4AF37', marginBottom: 10 }}>
                SaintSal™ Labs
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: 8 }}>
                {greeting(user?.name)}
              </div>
              <div style={{ fontSize: 14, color: '#888', lineHeight: 1.6 }}>
                You&apos;re in. Here&apos;s everything at your fingertips — no red tape.
              </div>
            </div>

            {/* Tips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
              {TOUR_TIPS.map((tip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: 'rgba(212,175,55,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <tip.icon size={15} color="#D4AF37" />
                  </div>
                  <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.5, paddingTop: 6 }}>{tip.text}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={dismissTour}
                style={{
                  flex: 1, padding: '14px 0', borderRadius: 10,
                  background: 'linear-gradient(135deg,#D4AF37,#8A7129)',
                  color: '#080808', fontWeight: 900, fontSize: 14,
                  border: 'none', cursor: 'pointer', letterSpacing: 0.5,
                }}
              >
                Let&apos;s Go →
              </button>
              <button
                onClick={dismissTour}
                style={{
                  padding: '14px 20px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#888', fontWeight: 600, fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────── */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 20px 120px' }}>

        {/* Greeting bar */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#D4AF37', marginBottom: 8 }}>
            SaintSal™ Labs · Responsible Intelligence™
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: 'white', margin: 0, letterSpacing: -0.5 }}>
                {greeting(user?.name)}
              </h1>
              <p style={{ fontSize: 13, color: '#666', margin: '4px 0 0', letterSpacing: 1 }}>
                {user?.plan_tier ? user.plan_tier.toUpperCase() + ' PLAN' : 'FREE PLAN'} · US Patent #10,290,222
              </p>
            </div>
            <button
              onClick={() => {
                sessionStorage.removeItem('sal_tour_dismissed');
                setShowTour(true);
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(212,175,55,0.1)',
                border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: 8, padding: '8px 14px',
                color: '#D4AF37', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', letterSpacing: 0.5,
              }}
            >
              <Sparkles size={13} /> Quick Tour
            </button>
          </div>
        </div>

        {/* ── 3 Launch tiles ────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
          {LAUNCH.map((tile) => {
            const Icon = tile.icon;
            const isActive = activeTile === tile.id;
            return (
              <Link
                key={tile.id}
                href={tile.href}
                onMouseEnter={() => setActiveTile(tile.id)}
                onMouseLeave={() => setActiveTile(null)}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 0,
                  background: isActive
                    ? `linear-gradient(135deg, ${tile.glow}, rgba(255,255,255,0.03))`
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isActive ? tile.accent + '40' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 16, padding: '22px 18px',
                  textDecoration: 'none', cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Badge */}
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  fontSize: 9, fontWeight: 700, letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  color: tile.accent,
                  background: `${tile.accent}18`,
                  border: `1px solid ${tile.accent}30`,
                  borderRadius: 20, padding: '2px 8px',
                }}>
                  {tile.badge}
                </div>

                {/* Icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: 12, marginBottom: 16,
                  background: `${tile.accent}18`,
                  border: `1px solid ${tile.accent}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={22} color={tile.accent} />
                </div>

                {/* Label */}
                <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 4 }}>
                  {tile.label}
                </div>
                <div style={{ fontSize: 12, color: '#777', marginBottom: 18, lineHeight: 1.4 }}>
                  {tile.sub}
                </div>

                {/* Tips */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {tile.tips.map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 3, height: 3, borderRadius: '50%', background: tile.accent, flexShrink: 0 }} />
                      <span style={{ fontSize: 10, color: '#666', lineHeight: 1.3 }}>{t}</span>
                    </div>
                  ))}
                </div>

                {/* Arrow */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  marginTop: 20, color: tile.accent, fontSize: 12, fontWeight: 700,
                  opacity: isActive ? 1 : 0.5, transition: 'opacity 0.18s',
                }}>
                  Launch <ChevronRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Verticals strip ───────────────────────────── */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#555', marginBottom: 12 }}>
            Intelligence Verticals
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
            {VERTICALS.map((v) => {
              const Icon = v.icon;
              return (
                <Link
                  key={v.label}
                  href={v.href}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 12, padding: '14px 8px',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = v.color + '40';
                    (e.currentTarget as HTMLElement).style.background = v.color + '0f';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
                  }}
                >
                  <Icon size={18} color={v.color} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#777', textAlign: 'center' }}>{v.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Platform status bar ───────────────────────── */}
        <div style={{
          marginTop: 28,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 12, padding: '14px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E' }} />
            <span style={{ fontSize: 12, color: '#666' }}>All systems operational</span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Claude', 'Gemini', 'Grok', 'Perplexity'].map(m => (
              <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E' }} />
                <span style={{ fontSize: 10, color: '#555', fontWeight: 600 }}>{m}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push('/pricing')}
            style={{
              background: 'none', border: '1px solid rgba(212,175,55,0.2)',
              borderRadius: 6, padding: '5px 12px',
              color: '#D4AF37', fontSize: 11, fontWeight: 700,
              cursor: 'pointer', letterSpacing: 0.5,
            }}
          >
            UPGRADE →
          </button>
        </div>
      </div>
    </div>
  );
}
