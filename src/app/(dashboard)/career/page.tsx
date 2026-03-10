'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  FileText,
  PenTool,
  MessageSquare,
  Linkedin,
  Search,
  DollarSign,
  Upload,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils/cn';

/* ─── Tool data ────────────────────────────────────────────── */

interface CareerTool {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const TOOLS: CareerTool[] = [
  {
    id: 'resume',
    icon: FileText,
    title: 'Resume Builder',
    description: 'Upload your resume and a job description — AI rewrites it for a perfect match.',
  },
  {
    id: 'cover-letter',
    icon: PenTool,
    title: 'Cover Letter Generator',
    description: 'Generate personalized, compelling cover letters tailored to any role.',
  },
  {
    id: 'interview',
    icon: MessageSquare,
    title: 'Interview Prep',
    description: 'AI-powered mock interviews with real-time feedback and coaching.',
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    title: 'LinkedIn Optimizer',
    description: 'Optimize your LinkedIn profile for recruiter visibility and engagement.',
  },
  {
    id: 'job-search',
    icon: Search,
    title: 'Job Search',
    description: 'AI-powered job matching based on your skills, experience, and preferences.',
  },
  {
    id: 'salary',
    icon: DollarSign,
    title: 'Salary Negotiation',
    description: 'Data-driven salary insights and negotiation strategies for your target role.',
  },
];

/* ─── Expanded forms ───────────────────────────────────────── */

function ResumeForm() {
  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-sal-border pt-4">
      <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-sal-border bg-sal-surface2">
        <div className="flex flex-col items-center gap-1 text-sal-text-muted">
          <Upload size={20} />
          <span className="text-xs">Drop resume here or click to upload</span>
        </div>
      </div>
      <textarea
        placeholder="Paste the job description here…"
        rows={3}
        className="w-full resize-none rounded-lg border border-sal-border bg-sal-input px-3 py-2 text-sm text-sal-text placeholder:text-sal-text-muted focus:outline-none"
      />
      <button className="flex items-center justify-center gap-1.5 self-start rounded-md bg-sal-gold px-4 py-2 text-xs font-semibold text-black hover:bg-sal-gold-hover">
        <Sparkles size={12} />
        Optimize Resume
      </button>
    </div>
  );
}

function CoverLetterForm() {
  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-sal-border pt-4">
      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="Job title"
          className="rounded-lg border border-sal-border bg-sal-input px-3 py-2 text-sm text-sal-text placeholder:text-sal-text-muted focus:outline-none"
        />
        <input
          placeholder="Company name"
          className="rounded-lg border border-sal-border bg-sal-input px-3 py-2 text-sm text-sal-text placeholder:text-sal-text-muted focus:outline-none"
        />
      </div>
      <textarea
        placeholder="Key qualifications or additional context…"
        rows={3}
        className="w-full resize-none rounded-lg border border-sal-border bg-sal-input px-3 py-2 text-sm text-sal-text placeholder:text-sal-text-muted focus:outline-none"
      />
      <button className="flex items-center justify-center gap-1.5 self-start rounded-md bg-sal-gold px-4 py-2 text-xs font-semibold text-black hover:bg-sal-gold-hover">
        <Sparkles size={12} />
        Generate Letter
      </button>
    </div>
  );
}

function InterviewForm() {
  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-sal-border pt-4">
      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="Target role"
          className="rounded-lg border border-sal-border bg-sal-input px-3 py-2 text-sm text-sal-text placeholder:text-sal-text-muted focus:outline-none"
        />
        <input
          placeholder="Company name"
          className="rounded-lg border border-sal-border bg-sal-input px-3 py-2 text-sm text-sal-text placeholder:text-sal-text-muted focus:outline-none"
        />
      </div>
      <button className="flex items-center justify-center gap-1.5 self-start rounded-md bg-sal-gold px-4 py-2 text-xs font-semibold text-black hover:bg-sal-gold-hover">
        <MessageSquare size={12} />
        Start Mock Interview
      </button>
    </div>
  );
}

const TOOL_FORMS: Record<string, React.FC> = {
  resume: ResumeForm,
  'cover-letter': CoverLetterForm,
  interview: InterviewForm,
};

/* ─── Page ─────────────────────────────────────────────────── */

export default function CareerSuitePage() {
  const { setActivePage, user } = useAppStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setActivePage('career-suite');
  }, [setActivePage]);

  const toggle = useCallback(
    (id: string) => setExpanded((prev) => (prev === id ? null : id)),
    [],
  );

  const isFreePlan = !user || user.plan_tier === 'free';

  return (
    <div className="px-6 pb-32 pt-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-sal-text">Career Suite</h1>
        {isFreePlan && (
          <span className="rounded-full border border-sal-gold/30 bg-sal-gold/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sal-gold">
            PRO
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-sal-text-muted">AI-powered career intelligence</p>

      {/* Tool cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isExpanded = expanded === tool.id;
          const FormComponent = TOOL_FORMS[tool.id];
          const Chevron = isExpanded ? ChevronUp : ChevronDown;

          return (
            <div
              key={tool.id}
              className={cn(
                'rounded-lg border border-sal-border bg-sal-surface p-5 transition-colors',
                isExpanded && 'col-span-1 md:col-span-2 lg:col-span-3',
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sal-gold/10">
                  <Icon size={20} className="text-sal-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-sal-text">{tool.title}</h3>
                  <p className="mt-1 text-xs text-sal-text-muted">{tool.description}</p>
                </div>
                <button
                  onClick={() => toggle(tool.id)}
                  className={cn(
                    'flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                    isExpanded
                      ? 'border-sal-gold/30 text-sal-gold'
                      : 'border-sal-border text-sal-text-muted hover:bg-[#1C1C26] hover:text-sal-text',
                  )}
                >
                  {isExpanded ? 'Close' : 'Launch'}
                  <Chevron size={12} />
                </button>
              </div>
              {isExpanded && FormComponent && <FormComponent />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
