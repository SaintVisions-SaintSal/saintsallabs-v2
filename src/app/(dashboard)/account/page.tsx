'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  CreditCard,
  LogOut,
  Trash2,
  X,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useAppStore } from '@/stores/app-store';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';

export default function AccountPage() {
  const { setActivePage } = useAppStore();
  const { user, loading, signOut } = useAuth();

  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  useEffect(() => {
    setActivePage('account');
  }, [setActivePage]);

  useEffect(() => {
    if (user?.name) setEditName(user.name);
  }, [user?.name]);

  const handleSaveName = useCallback(async () => {
    if (!user || !editName.trim()) return;
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from('profiles')
      .update({ name: editName.trim() })
      .eq('id', user.id);
    setSaving(false);
  }, [user, editName]);

  const handleDeleteAccount = useCallback(async () => {
    if (deleteConfirm !== 'DELETE') return;
    const supabase = createClient();
    // Delete profile data, then sign out
    if (user) {
      await supabase.from('profiles').delete().eq('id', user.id);
    }
    await supabase.auth.signOut();
    window.location.href = '/login';
  }, [deleteConfirm, user]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin-fast rounded-full border-2 border-sal-gold border-t-transparent" />
      </div>
    );
  }

  const creditsUsed = 999999 - (user?.credits_remaining ?? 999999);
  const creditsPct =
    ((user?.credits_remaining ?? 999999) / 999999) * 100;

  const tierLabel = (user?.plan_tier ?? 'free').toUpperCase();
  const tierColors: Record<string, string> = {
    free: 'border-sal-text-muted text-sal-text-muted',
    starter: 'border-sal-green text-sal-green',
    pro: 'border-sal-gold text-sal-gold',
    teams: 'border-sal-purple text-sal-purple',
    enterprise: 'border-sal-purple text-sal-purple',
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 pb-32">
      <h1 className="mb-6 text-xl font-semibold text-sal-text">Account</h1>

      {/* Profile card */}
      <section className="mb-6 rounded-xl border border-sal-border bg-sal-surface p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-sal-text">
          <User size={14} />
          Profile
        </h2>

        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sal-gold to-sal-gold-dim text-xl font-bold text-black">
            {user?.name?.charAt(0).toUpperCase() ?? user?.email?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="text-sm font-medium text-sal-text">
              {user?.name ?? 'Anonymous'}
            </p>
            <p className="flex items-center gap-1 text-xs text-sal-text-muted">
              <Mail size={11} />
              {user?.email ?? '—'}
            </p>
          </div>
        </div>

        {/* Name edit */}
        <div className="flex items-center gap-2">
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Your name"
            className="flex-1 rounded-lg border border-sal-border2 bg-sal-input px-3 py-2 text-sm text-sal-text placeholder:text-sal-text-muted outline-none focus:border-sal-gold/50"
          />
          <button
            onClick={handleSaveName}
            disabled={saving}
            className="rounded-lg bg-sal-gold px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-sal-gold-hover disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </section>

      {/* Plan & Usage */}
      <section className="mb-6 rounded-xl border border-sal-border bg-sal-surface p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-sal-text">
          <Shield size={14} />
          Plan & Usage
        </h2>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-sal-text">Current Plan</span>
            <span
              className={cn(
                'rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                tierColors[user?.plan_tier ?? 'free'],
              )}
            >
              {tierLabel}
            </span>
          </div>
          <Link
            href="/pricing"
            className="rounded-lg border border-sal-gold/30 px-3 py-1.5 text-xs font-medium text-sal-gold transition-colors hover:bg-sal-gold/10"
          >
            Upgrade
          </Link>
        </div>

        {/* Credits */}
        <div className="mb-2 flex items-center justify-between text-xs text-sal-text-muted">
          <span>
            {creditsUsed.toLocaleString()} used
          </span>
          <span>
            {(user?.credits_remaining ?? 999999).toLocaleString()} remaining
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-sal-border">
          <div
            className="h-full rounded-full bg-sal-gold transition-all duration-500"
            style={{ width: `${creditsPct}%` }}
          />
        </div>
      </section>

      {/* Billing */}
      <section className="mb-6 rounded-xl border border-sal-border bg-sal-surface p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-sal-text">
          <CreditCard size={14} />
          Billing
        </h2>

        {user?.stripe_customer_id ? (
          <div className="flex items-center justify-between">
            <span className="text-xs text-sal-text-muted">
              Managed via Stripe
            </span>
            <button className="rounded-lg border border-sal-border2 px-3 py-1.5 text-xs text-sal-text-muted transition-colors hover:text-sal-text">
              Manage Subscription
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-xs text-sal-text-muted">
              No active subscription
            </span>
            <Link
              href="/pricing"
              className="rounded-lg bg-sal-gold px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-sal-gold-hover"
            >
              View Plans
            </Link>
          </div>
        )}
      </section>

      {/* Actions */}
      <section className="rounded-xl border border-sal-border bg-sal-surface p-5">
        <div className="flex flex-col gap-3">
          <button
            onClick={signOut}
            className="flex items-center gap-2 rounded-lg border border-sal-border2 px-4 py-2.5 text-sm text-sal-text-muted transition-colors hover:text-sal-text"
          >
            <LogOut size={14} />
            Sign Out
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 rounded-lg border border-sal-red/30 px-4 py-2.5 text-sm text-sal-red transition-colors hover:bg-sal-red/10"
          >
            <Trash2 size={14} />
            Delete Account
          </button>
        </div>
      </section>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
          <div className="w-full max-w-sm rounded-xl border border-sal-border bg-sal-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-sal-red">
                Delete Account
              </h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm('');
                }}
                className="rounded p-1 text-sal-text-muted hover:text-sal-text"
              >
                <X size={14} />
              </button>
            </div>

            <p className="mb-4 text-xs text-sal-text-muted">
              This action is permanent and cannot be undone. All your data,
              conversations, and projects will be deleted. Type{' '}
              <span className="font-mono font-bold text-sal-red">DELETE</span>{' '}
              to confirm.
            </p>

            <input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="mb-4 w-full rounded-lg border border-sal-red/30 bg-sal-input px-3 py-2 text-sm text-sal-text placeholder:text-sal-text-muted outline-none focus:border-sal-red/60"
            />

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm('');
                }}
                className="flex-1 rounded-lg border border-sal-border2 px-4 py-2 text-xs text-sal-text-muted transition-colors hover:text-sal-text"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE'}
                className="flex-1 rounded-lg bg-sal-red px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-40"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
