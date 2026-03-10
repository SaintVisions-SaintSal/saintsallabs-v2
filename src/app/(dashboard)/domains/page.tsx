'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Search,
  Globe,
  Shield,
  RefreshCw,
  ExternalLink,
  Settings,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils/cn';

/* ─── Types ────────────────────────────────────────────────── */

interface Domain {
  name: string;
  status: 'active' | 'expired' | 'pending';
  expiryDate: string;
  dns: boolean;
  ssl: boolean;
  autoRenew: boolean;
}

/* ─── Placeholder data ─────────────────────────────────────── */

const INITIAL_DOMAINS: Domain[] = [
  {
    name: 'saintsallabs.com',
    status: 'active',
    expiryDate: '2027-03-15',
    dns: true,
    ssl: true,
    autoRenew: true,
  },
  {
    name: 'cookincapital.com',
    status: 'active',
    expiryDate: '2026-11-22',
    dns: true,
    ssl: true,
    autoRenew: true,
  },
  {
    name: 'sal-ai.dev',
    status: 'pending',
    expiryDate: '2026-06-01',
    dns: false,
    ssl: false,
    autoRenew: false,
  },
];

/* ─── Status badge ─────────────────────────────────────────── */

function StatusBadge({ status }: { status: Domain['status'] }) {
  const styles = {
    active: 'bg-sal-green/15 text-sal-green',
    expired: 'bg-sal-red/15 text-sal-red',
    pending: 'bg-sal-gold/15 text-sal-gold',
  };
  return (
    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium capitalize', styles[status])}>
      {status}
    </span>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */

export default function DomainsPage() {
  const setActivePage = useAppStore((s) => s.setActivePage);
  const [domains, setDomains] = useState<Domain[]>(INITIAL_DOMAINS);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setActivePage('domains');
  }, [setActivePage]);

  const toggleAutoRenew = useCallback((name: string) => {
    setDomains((prev) =>
      prev.map((d) =>
        d.name === name ? { ...d, autoRenew: !d.autoRenew } : d,
      ),
    );
  }, []);

  return (
    <div className="px-6 pb-32 pt-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-sal-text">Domains</h1>
      <p className="mt-1 text-sm text-sal-text-muted">Manage your web presence</p>

      {/* Search bar */}
      <div className="mt-6 flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-sal-border bg-sal-input px-3 py-2">
          <Search size={14} className="text-sal-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a domain…"
            className="flex-1 bg-transparent text-sm text-sal-text placeholder:text-sal-text-muted focus:outline-none"
          />
        </div>
        <button className="rounded-lg bg-sal-gold px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-sal-gold-hover">
          Search
        </button>
      </div>

      {/* Domain list */}
      <div className="mt-6">
        <div className="overflow-hidden rounded-lg border border-sal-border">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_80px_100px_60px_60px_80px_80px] gap-2 border-b border-sal-border bg-sal-surface2 px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-sal-text-muted">
            <span>Domain</span>
            <span>Status</span>
            <span>Expires</span>
            <span>DNS</span>
            <span>SSL</span>
            <span>Auto-Renew</span>
            <span />
          </div>

          {/* Rows */}
          {domains.map((domain) => (
            <div
              key={domain.name}
              className="grid grid-cols-[1fr_80px_100px_60px_60px_80px_80px] items-center gap-2 border-b border-sal-border px-4 py-3 last:border-b-0 hover:bg-[#1C1C26]"
            >
              <div className="flex items-center gap-2">
                <Globe size={14} className="shrink-0 text-sal-gold" />
                <span className="text-sm font-medium text-sal-text">{domain.name}</span>
              </div>
              <StatusBadge status={domain.status} />
              <span className="text-xs text-sal-text-muted">{domain.expiryDate}</span>
              <span>
                {domain.dns ? (
                  <CheckCircle size={14} className="text-sal-green" />
                ) : (
                  <XCircle size={14} className="text-sal-text-muted" />
                )}
              </span>
              <span>
                {domain.ssl ? (
                  <Shield size={14} className="text-sal-green" />
                ) : (
                  <XCircle size={14} className="text-sal-text-muted" />
                )}
              </span>
              <button
                onClick={() => toggleAutoRenew(domain.name)}
                className={cn(
                  'relative h-5 w-9 rounded-full transition-colors',
                  domain.autoRenew ? 'bg-sal-green' : 'bg-sal-border',
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform',
                    domain.autoRenew ? 'left-[18px]' : 'left-0.5',
                  )}
                />
              </button>
              <button className="flex items-center gap-1 text-xs text-sal-text-muted hover:text-sal-text">
                <Settings size={12} />
                Manage
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { icon: Settings, label: 'DNS Settings', desc: 'Configure DNS records' },
          { icon: Shield, label: 'SSL Certificates', desc: 'Manage SSL/TLS' },
          { icon: RefreshCw, label: 'Transfer Domain', desc: 'Transfer to SaintSal' },
        ].map(({ icon: Icon, label, desc }) => (
          <button
            key={label}
            className="flex items-center gap-3 rounded-lg border border-sal-border bg-sal-surface p-4 text-left transition-colors hover:bg-[#1C1C26]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sal-gold/10">
              <Icon size={16} className="text-sal-gold" />
            </div>
            <div>
              <div className="text-sm font-medium text-sal-text">{label}</div>
              <div className="text-xs text-sal-text-muted">{desc}</div>
            </div>
            <ExternalLink size={12} className="ml-auto text-sal-text-muted" />
          </button>
        ))}
      </div>

      {/* Register CTA */}
      <div className="mt-6 flex items-center justify-between rounded-lg border border-sal-gold/20 bg-sal-gold/5 p-5">
        <div>
          <div className="text-sm font-semibold text-sal-text">Register a New Domain</div>
          <div className="text-xs text-sal-text-muted">Find and register your perfect domain name</div>
        </div>
        <button className="rounded-md bg-sal-gold px-4 py-2 text-xs font-semibold text-black hover:bg-sal-gold-hover">
          Register Now
        </button>
      </div>

      {/* GoDaddy badge */}
      <div className="mt-6 text-center text-[10px] text-sal-text-muted">
        Powered by <span className="font-medium text-sal-text">GoDaddy</span>
      </div>
    </div>
  );
}
