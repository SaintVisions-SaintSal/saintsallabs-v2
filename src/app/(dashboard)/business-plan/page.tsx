'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  FileDown,
  Share2,
  CheckCircle,
  Sparkles,
  Building2,
  UtensilsCrossed,
  ShoppingCart,
  Briefcase,
  Home,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils/cn';

/* ─── Constants ────────────────────────────────────────────── */

const STEPS = ['Business Details', 'Financial Projections', 'Generate & Review'] as const;

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'E-commerce',
  'Food & Beverage',
  'Real Estate',
  'Consulting',
  'Education',
  'Manufacturing',
  'Other',
];

interface Template {
  icon: LucideIcon;
  label: string;
}

const TEMPLATES: Template[] = [
  { icon: Building2, label: 'Tech Startup' },
  { icon: UtensilsCrossed, label: 'Restaurant' },
  { icon: ShoppingCart, label: 'E-commerce' },
  { icon: Briefcase, label: 'Consulting' },
  { icon: Home, label: 'Real Estate' },
];

/* ─── Page ─────────────────────────────────────────────────── */

export default function BusinessPlanPage() {
  const setActivePage = useAppStore((s) => s.setActivePage);

  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  // Step 1 fields
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('Technology');
  const [description, setDescription] = useState('');
  const [targetMarket, setTargetMarket] = useState('');

  // Step 2 fields
  const [investment, setInvestment] = useState('');
  const [revenue, setRevenue] = useState('');
  const [growthRate, setGrowthRate] = useState('');

  useEffect(() => {
    setActivePage('business-plan');
  }, [setActivePage]);

  const next = useCallback(() => {
    if (step === 2) {
      // Generate
      setGenerating(true);
      setTimeout(() => {
        setGenerating(false);
        setGenerated(true);
      }, 3000);
    } else {
      setStep((s) => Math.min(s + 1, 2));
    }
  }, [step]);

  const back = useCallback(() => {
    setGenerated(false);
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const applyTemplate = useCallback((label: string) => {
    setName(label);
    const templateMap: Record<string, string> = {
      'Tech Startup': 'Technology',
      Restaurant: 'Food & Beverage',
      'E-commerce': 'E-commerce',
      Consulting: 'Consulting',
      'Real Estate': 'Real Estate',
    };
    setIndustry(templateMap[label] ?? 'Technology');
  }, []);

  return (
    <div className="px-6 pb-32 pt-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-sal-text">Business Plan</h1>
      <p className="mt-1 text-sm text-sal-text-muted">Generate investor-ready business plans</p>

      {/* Templates */}
      <div className="mt-4 flex flex-wrap gap-2">
        {TEMPLATES.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.label}
              onClick={() => applyTemplate(t.label)}
              className="flex items-center gap-1.5 rounded-md border border-sal-border bg-sal-surface px-3 py-1.5 text-xs text-sal-text-muted transition-colors hover:bg-[#1C1C26] hover:text-sal-text"
            >
              <Icon size={12} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-6 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                i < step
                  ? 'bg-sal-green text-black'
                  : i === step
                    ? 'bg-sal-gold text-black'
                    : 'bg-sal-border text-sal-text-muted',
              )}
            >
              {i < step ? <CheckCircle size={12} /> : i + 1}
            </div>
            <span
              className={cn(
                'hidden text-xs sm:block',
                i === step ? 'font-medium text-sal-text' : 'text-sal-text-muted',
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'h-[2px] flex-1 rounded',
                  i < step ? 'bg-sal-green' : 'bg-sal-border',
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="mt-6 rounded-lg border border-sal-border bg-sal-surface p-6">
        {/* Step 1: Business Details */}
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-sal-text-muted">Business Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your business name"
                className="w-full rounded-lg border border-sal-border bg-sal-input px-3 py-2 text-sm text-sal-text placeholder:text-sal-text-muted focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-sal-text-muted">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-lg border border-sal-border bg-sal-input px-3 py-2 text-sm text-sal-text focus:outline-none"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-sal-text-muted">Business Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your business concept, products/services, and unique value proposition…"
                rows={4}
                className="w-full resize-none rounded-lg border border-sal-border bg-sal-input px-3 py-2 text-sm text-sal-text placeholder:text-sal-text-muted focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-sal-text-muted">Target Market</label>
              <input
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value)}
                placeholder="Who are your ideal customers?"
                className="w-full rounded-lg border border-sal-border bg-sal-input px-3 py-2 text-sm text-sal-text placeholder:text-sal-text-muted focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 2: Financial Projections */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-sal-text-muted">Initial Investment ($)</label>
              <input
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
                placeholder="50000"
                type="number"
                className="w-full rounded-lg border border-sal-border bg-sal-input px-3 py-2 text-sm text-sal-text placeholder:text-sal-text-muted focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-sal-text-muted">Monthly Revenue Target ($)</label>
              <input
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                placeholder="10000"
                type="number"
                className="w-full rounded-lg border border-sal-border bg-sal-input px-3 py-2 text-sm text-sal-text placeholder:text-sal-text-muted focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-sal-text-muted">Expected Monthly Growth Rate (%)</label>
              <input
                value={growthRate}
                onChange={(e) => setGrowthRate(e.target.value)}
                placeholder="15"
                type="number"
                className="w-full rounded-lg border border-sal-border bg-sal-input px-3 py-2 text-sm text-sal-text placeholder:text-sal-text-muted focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Generate & Review */}
        {step === 2 && !generated && !generating && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Sparkles size={32} className="text-sal-gold" />
            <h3 className="text-lg font-semibold text-sal-text">Ready to Generate</h3>
            <p className="max-w-md text-center text-xs text-sal-text-muted">
              SAL will analyze your inputs and generate a comprehensive, investor-ready business plan
              with executive summary, market analysis, financial projections, and more.
            </p>
          </div>
        )}

        {/* Generating state */}
        {generating && (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="h-8 w-8 animate-spin-fast rounded-full border-2 border-sal-gold border-t-transparent" />
            <p className="text-sm text-sal-text-muted">Generating your business plan…</p>
          </div>
        )}

        {/* Generated output */}
        {generated && (
          <div className="flex flex-col gap-6">
            {[
              {
                title: 'Executive Summary',
                content: `${name || 'Your Business'} is a ${industry.toLowerCase()} venture targeting ${targetMarket || 'modern consumers'}. ${description || 'The company offers innovative solutions in its market segment.'} With an initial investment of $${investment || '50,000'} and projected monthly revenue of $${revenue || '10,000'}, the company aims to achieve profitability within 12 months at a ${growthRate || '15'}% monthly growth rate.`,
              },
              {
                title: 'Market Analysis',
                content: `The ${industry} market is projected to grow at a CAGR of 12.4% through 2030. Key drivers include digital transformation, changing consumer preferences, and technological advancement. The target segment of ${targetMarket || 'the addressable market'} represents a $2.4B opportunity with significant room for disruption.`,
              },
              {
                title: 'Financial Projections',
                content: `Year 1: Revenue $${((parseFloat(revenue) || 10000) * 12).toLocaleString()} | Expenses $${((parseFloat(investment) || 50000) * 0.8).toLocaleString()} | Net Margin 18%\nYear 2: Revenue $${((parseFloat(revenue) || 10000) * 12 * 1.8).toLocaleString()} | Growth ${growthRate || 15}% MoM | Projected break-even Month 8\nYear 3: Revenue $${((parseFloat(revenue) || 10000) * 12 * 3.2).toLocaleString()} | Expansion into adjacent markets`,
              },
              {
                title: 'Competitive Advantage',
                content: 'Leveraging AI-powered insights and the SaintSal Labs HACP Protocol for data-driven decision making. First-mover advantage in AI-augmented business intelligence for the target segment. Strong founding team with domain expertise.',
              },
              {
                title: 'Go-to-Market Strategy',
                content: 'Phase 1: Direct sales and content marketing (Months 1-3). Phase 2: Partnership development and referral programs (Months 4-6). Phase 3: Paid acquisition and market expansion (Months 7-12). CAC target: $45, LTV target: $540, LTV:CAC ratio: 12:1.',
              },
            ].map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-sal-gold">{section.title}</h3>
                <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-sal-text-muted">
                  {section.content}
                </p>
              </div>
            ))}

            {/* Export buttons */}
            <div className="flex gap-2 border-t border-sal-border pt-4">
              <button className="flex items-center gap-1.5 rounded-md bg-sal-gold px-4 py-2 text-xs font-semibold text-black hover:bg-sal-gold-hover">
                <FileDown size={12} />
                Export to PDF
              </button>
              <button className="flex items-center gap-1.5 rounded-md border border-sal-border px-4 py-2 text-xs text-sal-text-muted hover:bg-[#1C1C26] hover:text-sal-text">
                <Share2 size={12} />
                Share
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={back}
          disabled={step === 0 && !generated}
          className={cn(
            'flex items-center gap-1 rounded-md border border-sal-border px-4 py-2 text-xs transition-colors',
            step === 0 && !generated
              ? 'cursor-not-allowed text-sal-text-muted opacity-40'
              : 'text-sal-text-muted hover:bg-[#1C1C26] hover:text-sal-text',
          )}
        >
          <ChevronLeft size={12} />
          Back
        </button>
        {!generated && (
          <button
            onClick={next}
            disabled={generating}
            className="flex items-center gap-1 rounded-md bg-sal-gold px-4 py-2 text-xs font-semibold text-black hover:bg-sal-gold-hover disabled:opacity-50"
          >
            {step === 2 ? 'Generate Plan' : 'Next'}
            {step === 2 ? <Sparkles size={12} /> : <ChevronRight size={12} />}
          </button>
        )}
      </div>
    </div>
  );
}
