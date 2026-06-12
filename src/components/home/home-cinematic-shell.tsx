'use client';

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { TOTAL_HERO_FRAMES } from '@/lib/cinematic';
import { useScrollVideoScrub } from '@/hooks/use-scroll-video-scrub';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { CinematicVideoLayer, FireOverlay } from './cinematic-overlays';
import { HomeCinematicProvider } from './home-cinematic-context';

interface HomeCinematicShellProps {
  children: React.ReactNode;
}

export default function HomeCinematicShell({ children }: HomeCinematicShellProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'intro' | 'complete'>('loading');

  const isReady = images.length === TOTAL_HERO_FRAMES && loadedCount === TOTAL_HERO_FRAMES;
  const loadingProgress = isReady ? 100 : Math.round((loadedCount / TOTAL_HERO_FRAMES) * 100);

  // Preload images on mount
  useEffect(() => {
    let loaded = 0;
    const list: HTMLImageElement[] = [];
    for (let i = 1; i <= TOTAL_HERO_FRAMES; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(3, '0');
      img.src = `/images/hero-frames/frame-${paddedIndex}.jpg`;
      
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
      };
      
      img.onerror = () => {
        // Count even if load fails to avoid hanging the progress screen
        loaded++;
        setLoadedCount(loaded);
      };
      
      list.push(img);
    }
    setImages(list);
  }, []);

  const { progress, setProgress, targetRef, smoothRef } = useScrollVideoScrub(
    pageRef,
    canvasRef,
    images,
    {
      enabled: isReady,
      smooth: !reduce,
      fireOverlayRef: fireRef,
      progressBarRef,
      isIntroPlaying: false,
    }
  );

  // Set phase to complete once assets are ready
  useEffect(() => {
    if (isReady && phase === 'loading') {
      setPhase('complete');
    }
  }, [isReady, phase]);

  const skipIntro = useCallback(() => {}, []);
  const replayIntro = useCallback(() => {}, []);

  const cinematicValue = useMemo(
    () => ({
      progress,
      phase,
      setPhase,
      isReady,
      loadingProgress,
      skipIntro,
      replayIntro,
    }),
    [progress, phase, isReady, loadingProgress, skipIntro, replayIntro]
  );

  return (
    <HomeCinematicProvider value={cinematicValue}>
      <div ref={pageRef} className="relative">
        <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden bg-[#030303]">
          <CinematicVideoLayer
            canvasRef={canvasRef}
            isReady={isReady}
            loadingProgress={loadingProgress}
          />
          <FireOverlay ref={fireRef} />
          <div className="absolute inset-0 z-[12] bg-gradient-to-b from-black/15 via-black/10 to-black/35 pointer-events-none" />
        </div>

        <div className="fixed bottom-0 left-0 w-full h-[3px] bg-white/10 z-[30] pointer-events-none overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left bg-gradient-to-r from-orange-500 via-blue-500 to-emerald-400 shadow-[0_0_10px_rgba(59,130,246,0.45)] will-change-transform"
          />
        </div>

        <div className="relative z-[10]">{children}</div>
      </div>
    </HomeCinematicProvider>
  );
}