'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAppStore } from '@/stores/app-store';
import type { UserProfile, PlanTier } from '@/types';

export function useAuth() {
  const router = useRouter();
  const { user, setUser } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Fetch profile from profiles table
    async function fetchProfile(userId: string, email: string) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        const profile: UserProfile = {
          id: data.id,
          email: data.email ?? email,
          name: data.name ?? undefined,
          avatar_url: data.avatar_url ?? undefined,
          plan_tier: (data.plan_tier as PlanTier) ?? 'free',
          credits_remaining: data.credits_remaining ?? 999999,
          stripe_customer_id: data.stripe_customer_id ?? undefined,
        };
        setUser(profile);
      } else {
        // No profile row yet — set a default
        const profile: UserProfile = {
          id: userId,
          email,
          plan_tier: 'free',
          credits_remaining: 999999,
        };
        setUser(profile);
      }
    }

    // Check initial session
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        fetchProfile(authUser.id, authUser.email ?? '');
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email ?? '');
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  }, [setUser, router]);

  return { user, loading, signOut };
}
