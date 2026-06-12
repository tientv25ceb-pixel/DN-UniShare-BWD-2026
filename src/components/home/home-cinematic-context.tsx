'use client';

import { createContext, useContext } from 'react';

export interface HomeCinematicState {
  progress: number;
  phase: 'loading' | 'intro' | 'complete';
  setPhase: (phase: 'loading' | 'intro' | 'complete') => void;
  isReady: boolean;
  loadingProgress: number;
  skipIntro: () => void;
  replayIntro: () => void;
}

const HomeCinematicContext = createContext<HomeCinematicState | null>(null);

export function HomeCinematicProvider({
  value,
  children,
}: {
  value: HomeCinematicState;
  children: React.ReactNode;
}) {
  return (
    <HomeCinematicContext.Provider value={value}>{children}</HomeCinematicContext.Provider>
  );
}

export function useHomeCinematic() {
  const ctx = useContext(HomeCinematicContext);
  if (!ctx) {
    throw new Error('useHomeCinematic must be used within HomeCinematicShell');
  }
  return ctx;
}