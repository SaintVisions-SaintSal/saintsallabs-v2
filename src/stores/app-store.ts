'use client';

import { create } from 'zustand';
import type { UserProfile } from '@/types';

interface AppState {
  activePage: string;
  setActivePage: (page: string) => void;

  sidebarOpen: boolean;
  toggleSidebar: () => void;

  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  model: string;
  setModel: (model: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activePage: 'search',
  setActivePage: (page) => set({ activePage: page }),

  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  user: null,
  setUser: (user) => set({ user }),

  model: 'SAL Pro',
  setModel: (model) => set({ model }),
}));
