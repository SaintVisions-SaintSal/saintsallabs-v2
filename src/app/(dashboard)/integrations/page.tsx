'use client';

import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, ExternalLink, Key, Eye, EyeOff, Copy } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

/* ─── Integration data ─────────────────────────────────────── */

interface Integration {
  id: string;
  name: string;
  description: string;
  letter: string;
  letterColor: string;
  connected: boolean;
}

const INITIAL_INTEGRATIONS: Integration[] = [
  {
    id: 'godaddy',
    name: 'GoDaddy',
    description: 'Domain registration and DNS management',
    letter: 'G',
    letterColor: '#00A4A6',
    connected: true,
  },
  {
    id: 'corpnet',
    name: 'CorpNet',
    description: 'Business formation and compliance filing',
    letter: 'C',
    letterColor: '#4A90D9',
    connected: true,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing and subscriptions',
    letter: 'S',
    letterColor: '#635BFF',
    connected: true,
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'Voice AI and speech synthesis',
    letter: 'E',
    letterColor: '#000000',
    connected: true,
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Code repositories and CI/CD',
    letter: 'G',
    letterColor: '#F0F0F0',
    connected: false,
  },
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Deployment and edge functions',
    letter: 'V',
    letterColor: '#F0F0F0',
    connected: false,
  },
  {
    id: 'google',
    name: 'Google',
    description: 'OAuth, Calendar, and Drive integration',
    letter: 'G',
    letterColor: '#4285F4',
    connected: false,
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Notifications and workflow automation',
    letter: 'S',
    letterColor: '#E01E5A',
    connected: false,
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'CRM and marketing automation',
    letter: 'H',
    letterColor: '#FF7A59',
    connected: false,
  },
];

/* ─── Page ─────────────────────────────────────────────────── */

export default function IntegrationsPage() {
  const setActivePage = useAppStore((s) => s.setActivePage);
  const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setActivePage('integrations');
  }, [setActivePage]);

  const toggleConnection = useCallback((id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, connected: !i.connected } : i,
      ),
    );
  }, []);

  const connectedCount = integrations.filter((i) => i.connected).length;

  return (
    <div className="px-6 pb-32 pt-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-sal-text">Integrations</h1>
      <p className="mt-1 text-sm text-sal-text-muted">
        Connect your favorite tools — {connectedCount} of {integrations.length} connected
      </p>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((intg) => (
          <div
            key={intg.id}
            className="flex flex-col rounded-lg border border-sal-border bg-sal-surface p-5 transition-colors hover:bg-[#1C1C26]"
          >
            <div className="flex items-start gap-3">
              {/* Logo letter */}
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                style={{
                  backgroundColor: intg.letterColor + '20',
                  color: intg.letterColor === '#000000' ? '#E8E6E1' : intg.letterColor,
                }}
              >
                {intg.letter}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-sal-text">{intg.name}</h3>
                  {intg.connected && (
                    <CheckCircle size={12} className="text-sal-green" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-sal-text-muted">{intg.description}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              {intg.connected ? (
                <>
                  <span className="rounded-full bg-sal-green/15 px-2 py-0.5 text-[10px] font-medium text-sal-green">
                    Connected
                  </span>
                  <button
                    onClick={() => toggleConnection(intg.id)}
                    className="text-xs text-sal-text-muted hover:text-sal-red"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <>
                  <span className="rounded-full border border-sal-border px-2 py-0.5 text-[10px] text-sal-text-muted">
                    Not Connected
                  </span>
                  <button
                    onClick={() => toggleConnection(intg.id)}
                    className="flex items-center gap-1 rounded-md border border-sal-gold/30 px-3 py-1 text-xs font-medium text-sal-gold transition-colors hover:bg-sal-gold/10"
                  >
                    Connect
                    <ExternalLink size={10} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* API key management */}
      <div className="mt-8 rounded-lg border border-sal-border bg-sal-surface p-5">
        <div className="flex items-center gap-2">
          <Key size={16} className="text-sal-gold" />
          <h2 className="text-sm font-semibold text-sal-text">API Keys</h2>
        </div>
        <p className="mt-1 text-xs text-sal-text-muted">
          Manage API keys for external integrations
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {/* SAL API key */}
          <div className="flex items-center gap-2 rounded-lg border border-sal-border bg-sal-surface2 px-3 py-2">
            <span className="shrink-0 text-xs text-sal-text-muted">SAL API Key</span>
            <div className="flex-1 font-mono text-xs text-sal-text">
              {showKey ? 'sal_live_k7x9m2p4q8r1n5v3w6y0z' : '••••••••••••••••••••••••'}
            </div>
            <button
              onClick={() => setShowKey((v) => !v)}
              className="rounded p-1 text-sal-text-muted hover:text-sal-text"
            >
              {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
            <button
              onClick={() => navigator.clipboard.writeText('sal_live_k7x9m2p4q8r1n5v3w6y0z')}
              className="rounded p-1 text-sal-text-muted hover:text-sal-text"
            >
              <Copy size={13} />
            </button>
          </div>
        </div>

        <button className="mt-3 rounded-md border border-sal-border px-3 py-1.5 text-xs text-sal-text-muted hover:bg-[#1C1C26] hover:text-sal-text">
          Generate New Key
        </button>
      </div>
    </div>
  );
}
