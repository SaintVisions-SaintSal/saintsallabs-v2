'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils/cn';

/* ─── Types ────────────────────────────────────────────────── */

interface TranscriptEntry {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

/* ─── Audio Visualizer Bars ────────────────────────────────── */

function AudioBars({ active }: { active: boolean }) {
  return (
    <div className="flex items-end justify-center gap-[3px]">
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-[3px] rounded-full transition-all',
            active ? 'bg-sal-gold' : 'bg-sal-border',
          )}
          style={{
            height: active
              ? `${12 + Math.sin(i * 0.7 + Date.now() * 0.003) * 20 + 20}px`
              : '4px',
            animationName: active ? 'audioBar' : 'none',
            animationDuration: `${0.3 + Math.random() * 0.5}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDirection: 'alternate',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes audioBar {
          0% { height: 4px; }
          100% { height: ${32 + Math.random() * 20}px; }
        }
      `}</style>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */

export default function VoiceAIPage() {
  const { setActivePage, user } = useAppStore();
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [muted, setMuted] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [barTick, setBarTick] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActivePage('voice-ai');
  }, [setActivePage]);

  // Animate bars while connected
  useEffect(() => {
    if (status !== 'connected') return;
    const id = setInterval(() => setBarTick((t) => t + 1), 100);
    return () => clearInterval(id);
  }, [status]);

  // Auto-scroll transcript
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [transcript]);

  const connect = useCallback(() => {
    const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
    setStatus('connecting');

    // ElevenLabs WebSocket integration placeholder
    // Requires @11labs/client — logs connection intent for now
    console.log('[VoiceAI] Connecting to ElevenLabs agent:', agentId);

    // Simulate connection after brief delay
    const timer = setTimeout(() => {
      setStatus('connected');
      setTranscript([
        {
          id: 'welcome',
          role: 'assistant',
          text: 'Hello! I\'m SAL Voice. How can I help you today?',
        },
      ]);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const disconnect = useCallback(() => {
    console.log('[VoiceAI] Disconnecting');
    setStatus('disconnected');
  }, []);

  const isFreePlan = !user || user.plan_tier === 'free';

  // suppress unused barTick warning — it drives re-renders for animation
  void barTick;

  return (
    <div className="flex h-full flex-col items-center px-4 pb-32 pt-8">
      {/* PRO badge */}
      {isFreePlan && (
        <div className="mb-4 rounded-full border border-sal-gold/30 bg-sal-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sal-gold">
          PRO Feature
        </div>
      )}

      {/* Title */}
      <h1 className="text-2xl font-bold text-sal-text">Voice AI</h1>
      <p className="mt-1 text-sm text-sal-text-muted">Talk to SAL</p>

      {/* Connection status */}
      <div className="mt-4 flex items-center gap-2">
        <span
          className={cn(
            'h-2 w-2 rounded-full',
            status === 'connected' && 'bg-sal-green',
            status === 'connecting' && 'animate-pulse-dot bg-sal-gold',
            status === 'disconnected' && 'bg-sal-red',
          )}
        />
        <span className="text-xs capitalize text-sal-text-muted">{status}</span>
      </div>

      {/* Main button */}
      <div className="mt-8 flex flex-col items-center gap-6">
        {status === 'disconnected' ? (
          <button
            onClick={connect}
            disabled={isFreePlan}
            className={cn(
              'group relative flex h-32 w-32 items-center justify-center rounded-full transition-all',
              isFreePlan
                ? 'cursor-not-allowed bg-sal-surface opacity-50'
                : 'bg-gradient-to-br from-sal-gold to-sal-gold-dim shadow-lg shadow-sal-gold/20 hover:shadow-xl hover:shadow-sal-gold/30',
            )}
          >
            <Phone size={36} className={isFreePlan ? 'text-sal-text-muted' : 'text-black'} />
            {!isFreePlan && (
              <span className="absolute inset-0 animate-ping rounded-full bg-sal-gold/20" />
            )}
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {/* Audio visualizer */}
            <div className="h-16">
              <AudioBars active={status === 'connected' && !muted} />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMuted((m) => !m)}
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full border transition-colors',
                  muted
                    ? 'border-sal-red/50 bg-sal-red/10 text-sal-red'
                    : 'border-sal-border bg-sal-surface text-sal-text',
                )}
              >
                {muted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button
                onClick={disconnect}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-sal-red text-white shadow-lg shadow-sal-red/30 transition-transform hover:scale-105"
              >
                <PhoneOff size={22} />
              </button>
            </div>
          </div>
        )}

        <span className="text-xs text-sal-text-muted">
          {status === 'disconnected'
            ? 'Press to start a conversation'
            : status === 'connecting'
              ? 'Connecting to SAL Voice…'
              : 'Listening…'}
        </span>
      </div>

      {/* Transcript */}
      {transcript.length > 0 && (
        <div
          ref={scrollRef}
          className="mt-8 w-full max-w-lg flex-1 overflow-y-auto rounded-lg border border-sal-border bg-sal-surface p-4"
        >
          <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-sal-text-muted">
            Transcript
          </div>
          <div className="flex flex-col gap-3">
            {transcript.map((entry) => (
              <div
                key={entry.id}
                className={cn(
                  'flex gap-2 text-sm',
                  entry.role === 'user' ? 'justify-end' : 'justify-start',
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg px-3 py-2',
                    entry.role === 'user'
                      ? 'bg-sal-gold/15 text-sal-text'
                      : 'bg-sal-surface2 text-sal-text',
                  )}
                >
                  {entry.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ElevenLabs badge */}
      <div className="mt-6 text-[10px] text-sal-text-muted">
        Powered by <span className="font-medium text-sal-text">ElevenLabs</span>
      </div>
    </div>
  );
}
