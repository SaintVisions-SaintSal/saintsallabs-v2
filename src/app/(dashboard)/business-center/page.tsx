'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Building2,
  Landmark,
  FileText,
  Shield,
  Calendar,
  ArrowRight,
  Search,
  Check,
  Loader2,
  ChevronDown,
  Globe2,
  Scale,
  Stamp,
  BookOpen,
  Pen,
  XCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils/cn';

/* ─── US States ────────────────────────────────────────────── */

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois',
  'Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts',
  'Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota',
  'Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina',
  'South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington',
  'West Virginia','Wisconsin','Wyoming',
];

/* ─── Formation products ───────────────────────────────────── */

interface Tier {
  id: string;
  name: string;
  price: number;
  fee: string;
  features: string[];
}

interface FormationProduct {
  id: string;
  icon: LucideIcon;
  name: string;
  description: string;
  popular?: boolean;
  tiers: Tier[];
}

const FORMATION_PRODUCTS: FormationProduct[] = [
  {
    id: 'llc',
    icon: Building2,
    name: 'LLC Formation',
    description: 'Form a limited liability company in any state with registered agent service.',
    popular: true,
    tiers: [
      { id: 'basic', name: 'Basic', price: 0, fee: 'State fee only', features: ['Name availability check', 'Articles of Organization', 'Standard processing'] },
      { id: 'deluxe', name: 'Deluxe', price: 99, fee: '+ state fee', features: ['Everything in Basic', 'EIN / Tax ID', 'Operating Agreement', 'Banking Resolution', 'Expedited processing'] },
      { id: 'complete', name: 'Complete', price: 249, fee: '+ state fee', features: ['Everything in Deluxe', 'Registered Agent (1 year)', 'Compliance alerts', 'Business License research', 'Priority processing'] },
    ],
  },
  {
    id: 'corporation',
    icon: Landmark,
    name: 'Corporation',
    description: 'Incorporate your business as a C-Corp or S-Corp with full compliance.',
    tiers: [
      { id: 'basic', name: 'Basic', price: 0, fee: 'State fee only', features: ['Name availability check', 'Articles of Incorporation', 'Standard processing'] },
      { id: 'deluxe', name: 'Deluxe', price: 99, fee: '+ state fee', features: ['Everything in Basic', 'EIN / Tax ID', 'Bylaws & Resolutions', 'Stock Certificates', 'Expedited processing'] },
      { id: 'complete', name: 'Complete', price: 249, fee: '+ state fee', features: ['Everything in Deluxe', 'Registered Agent (1 year)', 'Compliance alerts', 'S-Corp election prep', 'Priority processing'] },
    ],
  },
];

/* ─── Additional services ──────────────────────────────────── */

interface AdditionalService {
  id: string;
  icon: LucideIcon;
  name: string;
  price: string;
  description: string;
}

const ADDITIONAL_SERVICES: AdditionalService[] = [
  { id: 'dba', icon: FileText, name: 'DBA / Trade Name', price: '$99', description: 'Register a "Doing Business As" name' },
  { id: 'registered_agent', icon: Shield, name: 'Registered Agent', price: '$119/yr', description: 'Required in all states for legal documents' },
  { id: 'scorp_election', icon: Scale, name: 'S-Corp Election', price: '$149', description: 'File IRS Form 2553 for S-Corp tax status' },
  { id: 'annual_report', icon: Calendar, name: 'Annual Report', price: '$99+', description: 'State-required annual compliance filing' },
  { id: 'foreign_llc', icon: Globe2, name: 'Foreign LLC', price: '$199+', description: 'Register your LLC in another state' },
  { id: 'business_license', icon: Stamp, name: 'Business License', price: '$99', description: 'Research and file required licenses' },
  { id: 'nonprofit', icon: BookOpen, name: 'Nonprofit', price: '$149+', description: 'Form a 501(c)(3) nonprofit organization' },
  { id: 'amendment', icon: Pen, name: 'Amendment', price: '$99', description: 'Amend your Articles of Organization/Incorporation' },
  { id: 'dissolution', icon: XCircle, name: 'Dissolution', price: '$149', description: 'Formally dissolve your business entity' },
];

/* ─── Page ─────────────────────────────────────────────────── */

export default function BusinessCenterPage() {
  const setActivePage = useAppStore((s) => s.setActivePage);
  const [selectedState, setSelectedState] = useState('Delaware');
  const [entitySearch, setEntitySearch] = useState('');
  const [checking, setChecking] = useState(false);
  const [availability, setAvailability] = useState<{
    available: boolean;
    suggestions: string[];
  } | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [loadingOrder, setLoadingOrder] = useState<string | null>(null);

  useEffect(() => {
    setActivePage('business-center');
  }, [setActivePage]);

  /* ─── Check name availability ────────────────────────────── */

  const checkAvailability = useCallback(async () => {
    if (!entitySearch.trim()) return;
    setChecking(true);
    setAvailability(null);

    try {
      const res = await fetch('/api/corpnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check-availability',
          entityName: entitySearch.trim(),
          state: selectedState,
          entityType: 'llc',
        }),
      });
      const data = await res.json();
      setAvailability({
        available: data.available ?? false,
        suggestions: data.suggestions ?? [],
      });
    } catch {
      setAvailability(null);
    } finally {
      setChecking(false);
    }
  }, [entitySearch, selectedState]);

  /* ─── Order with Stripe ──────────────────────────────────── */

  const handleOrder = useCallback(async (product: string, tier: string) => {
    setLoadingOrder(`${product}-${tier}`);
    try {
      const res = await fetch('/api/corpnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-order',
          product,
          tier,
          state: selectedState,
          entityName: entitySearch.trim() || undefined,
          successUrl: `${window.location.origin}/business-center?success=true`,
          cancelUrl: `${window.location.origin}/business-center`,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Order error:', err);
    } finally {
      setLoadingOrder(null);
    }
  }, [selectedState, entitySearch]);

  return (
    <div className="px-6 pb-32 pt-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-sal-text">Business Center</h1>
      <p className="mt-1 text-sm text-sal-text-muted">Form and manage your business entity</p>

      {/* State selector + entity search */}
      <div className="mt-6 rounded-lg border border-sal-border bg-sal-surface p-5">
        <h2 className="text-sm font-semibold text-sal-text">Check Name Availability</h2>
        <p className="mt-1 text-xs text-sal-text-muted">
          Search for your desired business name before filing.
        </p>
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          {/* State dropdown */}
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="appearance-none rounded-lg border border-sal-border bg-sal-input px-3 py-2.5 pr-8 text-sm text-sal-text focus:border-sal-gold/50 focus:outline-none"
            >
              {US_STATES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-sal-text-muted" />
          </div>

          {/* Name input */}
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-sal-border bg-sal-input px-3 py-2">
            <Search size={14} className="text-sal-text-muted" />
            <input
              value={entitySearch}
              onChange={(e) => setEntitySearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkAvailability()}
              placeholder="Enter business name…"
              className="flex-1 bg-transparent text-sm text-sal-text placeholder:text-sal-text-muted focus:outline-none"
            />
          </div>

          <button
            onClick={checkAvailability}
            disabled={checking}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-sal-gold px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-sal-gold-hover disabled:opacity-60"
          >
            {checking && <Loader2 size={12} className="animate-spin" />}
            Check Availability
          </button>
        </div>

        {/* Availability result */}
        {availability && (
          <div className="mt-4 rounded-md border border-sal-border bg-sal-surface2 p-3">
            <div className="flex items-center gap-2">
              {availability.available ? (
                <>
                  <Check size={14} className="text-sal-green" />
                  <span className="text-sm font-medium text-sal-green">
                    &quot;{entitySearch}&quot; is available in {selectedState}!
                  </span>
                </>
              ) : (
                <>
                  <XCircle size={14} className="text-sal-red" />
                  <span className="text-sm font-medium text-sal-red">
                    &quot;{entitySearch}&quot; is not available in {selectedState}.
                  </span>
                </>
              )}
            </div>
            {availability.suggestions.length > 0 && (
              <div className="mt-2">
                <p className="text-[10px] font-medium uppercase tracking-wider text-sal-text-muted">
                  Suggested names
                </p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {availability.suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setEntitySearch(s)}
                      className="rounded-md border border-sal-border bg-sal-surface px-2 py-1 text-xs text-sal-text hover:border-sal-gold/30"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Formation products with tiers */}
      <h2 className="mt-8 text-lg font-bold text-sal-text">Business Formation</h2>
      <p className="mt-1 text-sm text-sal-text-muted">
        Choose your entity type and package — filing in {selectedState}
      </p>

      <div className="mt-4 space-y-4">
        {FORMATION_PRODUCTS.map((product) => {
          const Icon = product.icon;
          const isExpanded = expandedProduct === product.id;

          return (
            <div
              key={product.id}
              className="rounded-lg border border-sal-border bg-sal-surface overflow-hidden"
            >
              {/* Product header */}
              <button
                onClick={() => setExpandedProduct(isExpanded ? null : product.id)}
                className="flex w-full items-center gap-3 p-5 text-left transition-colors hover:bg-[#1C1C26]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sal-gold/10">
                  <Icon size={20} className="text-sal-gold" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-sal-text">{product.name}</h3>
                    {product.popular && (
                      <span className="rounded-full bg-sal-gold/15 px-2 py-0.5 text-[9px] font-bold uppercase text-sal-gold">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-sal-text-muted">{product.description}</p>
                </div>
                <ChevronDown
                  size={16}
                  className={cn(
                    'text-sal-text-muted transition-transform',
                    isExpanded && 'rotate-180',
                  )}
                />
              </button>

              {/* Tier cards */}
              {isExpanded && (
                <div className="grid grid-cols-1 gap-3 border-t border-sal-border p-5 md:grid-cols-3">
                  {product.tiers.map((tier) => {
                    const orderKey = `${product.id}-${tier.id}`;
                    const isLoading = loadingOrder === orderKey;

                    return (
                      <div
                        key={tier.id}
                        className={cn(
                          'rounded-lg border p-4',
                          tier.id === 'complete'
                            ? 'border-sal-gold bg-sal-gold/[0.03]'
                            : 'border-sal-border bg-sal-surface2',
                        )}
                      >
                        <h4 className="text-sm font-semibold text-sal-text">{tier.name}</h4>
                        <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-xl font-bold text-sal-gold">
                            {tier.price === 0 ? '$0' : `$${tier.price}`}
                          </span>
                          <span className="text-[10px] text-sal-text-muted">{tier.fee}</span>
                        </div>
                        <ul className="mt-3 space-y-1.5">
                          {tier.features.map((f) => (
                            <li key={f} className="flex items-start gap-1.5 text-xs text-sal-text-muted">
                              <Check size={10} className="mt-0.5 shrink-0 text-sal-green" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => handleOrder(product.id, tier.id)}
                          disabled={isLoading}
                          className={cn(
                            'mt-4 flex w-full items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-60',
                            tier.id === 'complete'
                              ? 'bg-sal-gold text-black hover:bg-sal-gold-hover'
                              : 'bg-sal-gold/10 text-sal-gold hover:bg-sal-gold/20',
                          )}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              Redirecting…
                            </>
                          ) : (
                            <>
                              Get Started
                              <ArrowRight size={12} />
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Additional services */}
      <h2 className="mt-8 text-lg font-bold text-sal-text">Additional Services</h2>
      <p className="mt-1 text-sm text-sal-text-muted">
        Compliance, filings, and business management
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {ADDITIONAL_SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <button
              key={service.id}
              onClick={() => handleOrder(service.id, 'standard')}
              disabled={loadingOrder === `${service.id}-standard`}
              className="group flex items-center gap-3 rounded-lg border border-sal-border bg-sal-surface p-4 text-left transition-colors hover:bg-[#1C1C26] disabled:opacity-60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sal-gold/10">
                <Icon size={16} className="text-sal-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-sal-text">{service.name}</h3>
                  <span className="shrink-0 text-xs font-bold text-sal-gold">{service.price}</span>
                </div>
                <p className="mt-0.5 truncate text-[10px] text-sal-text-muted">{service.description}</p>
              </div>
              {loadingOrder === `${service.id}-standard` ? (
                <Loader2 size={12} className="shrink-0 animate-spin text-sal-gold" />
              ) : (
                <ArrowRight size={12} className="shrink-0 text-sal-text-muted group-hover:text-sal-gold" />
              )}
            </button>
          );
        })}
      </div>

      {/* CorpNet badge */}
      <div className="mt-6 text-center text-[10px] text-sal-text-muted">
        Powered by <span className="font-medium text-sal-text">CorpNet</span>
      </div>
    </div>
  );
}
