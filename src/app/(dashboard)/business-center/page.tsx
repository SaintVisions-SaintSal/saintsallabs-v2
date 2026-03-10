'use client';

import { useEffect, useState } from 'react';
import {
  Building2,
  Landmark,
  FileText,
  Hash,
  Shield,
  Calendar,
  ArrowRight,
  Search,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

/* ─── Service data ─────────────────────────────────────────── */

interface Service {
  icon: LucideIcon;
  title: string;
  price: string;
  description: string;
  popular?: boolean;
}

const SERVICES: Service[] = [
  {
    icon: Building2,
    title: 'LLC Formation',
    price: '$99+',
    description: 'Form a limited liability company in any state with registered agent service.',
    popular: true,
  },
  {
    icon: Landmark,
    title: 'Corporation',
    price: '$149+',
    description: 'Incorporate your business as a C-Corp or S-Corp with full compliance.',
  },
  {
    icon: FileText,
    title: 'DBA / Trade Name',
    price: '$49+',
    description: 'Register a "Doing Business As" name for your business entity.',
  },
  {
    icon: Hash,
    title: 'EIN / Tax ID',
    price: 'Free with formation',
    description: 'Obtain your federal Employer Identification Number from the IRS.',
  },
  {
    icon: Shield,
    title: 'Registered Agent',
    price: '$119/yr',
    description: 'Required in all states — receive legal documents on behalf of your business.',
  },
  {
    icon: Calendar,
    title: 'Annual Reports',
    price: '$99+',
    description: 'Stay compliant with state-required annual report filings.',
  },
];

/* ─── Page ─────────────────────────────────────────────────── */

export default function BusinessCenterPage() {
  const setActivePage = useAppStore((s) => s.setActivePage);
  const [entitySearch, setEntitySearch] = useState('');

  useEffect(() => {
    setActivePage('business-center');
  }, [setActivePage]);

  return (
    <div className="px-6 pb-32 pt-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-sal-text">Business Center</h1>
      <p className="mt-1 text-sm text-sal-text-muted">Form and manage your business entity</p>

      {/* Services grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.title}
              className="group relative rounded-lg border border-sal-border bg-sal-surface p-5 transition-colors hover:bg-[#1C1C26]"
            >
              {service.popular && (
                <span className="absolute right-3 top-3 rounded-full bg-sal-gold/15 px-2 py-0.5 text-[9px] font-bold uppercase text-sal-gold">
                  Popular
                </span>
              )}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sal-gold/10">
                <Icon size={20} className="text-sal-gold" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-sal-text">{service.title}</h3>
              <div className="mt-1 text-lg font-bold text-sal-gold">{service.price}</div>
              <p className="mt-2 text-xs leading-relaxed text-sal-text-muted">
                {service.description}
              </p>
              <button className="mt-4 flex items-center gap-1.5 rounded-md border border-sal-gold/30 px-3 py-1.5 text-xs font-medium text-sal-gold transition-colors hover:bg-sal-gold/10">
                Get Started
                <ArrowRight size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Entity lookup */}
      <div className="mt-8 rounded-lg border border-sal-border bg-sal-surface p-5">
        <h2 className="text-sm font-semibold text-sal-text">Already have a business?</h2>
        <p className="mt-1 text-xs text-sal-text-muted">
          Look up your existing entity to manage compliance and filings.
        </p>
        <div className="mt-4 flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-sal-border bg-sal-input px-3 py-2">
            <Search size={14} className="text-sal-text-muted" />
            <input
              value={entitySearch}
              onChange={(e) => setEntitySearch(e.target.value)}
              placeholder="Enter business name or EIN…"
              className="flex-1 bg-transparent text-sm text-sal-text placeholder:text-sal-text-muted focus:outline-none"
            />
          </div>
          <button className="rounded-md bg-sal-gold px-4 py-2 text-xs font-semibold text-black hover:bg-sal-gold-hover">
            Look Up
          </button>
        </div>
      </div>

      {/* CorpNet badge */}
      <div className="mt-6 text-center text-[10px] text-sal-text-muted">
        Powered by <span className="font-medium text-sal-text">CorpNet</span>
      </div>
    </div>
  );
}
