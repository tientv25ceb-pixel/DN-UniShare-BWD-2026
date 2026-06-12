'use client';

import { forwardRef, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, registerGsap } from '@/lib/gsap';
import { HERO_FALLBACK_IMAGE, HERO_VIDEO_SRC } from '@/lib/cinematic';

export const FireOverlay = forwardRef<HTMLDivElement, { intensity?: number }>(function FireOverlay(
  { intensity },
  ref
) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = scopeRef.current;
      if (!root) return;

      gsap.to(root.querySelectorAll('.fire-glow'), {
        scale: 1.08,
        opacity: 1,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(root.querySelectorAll('.fire-column'), {
        scaleY: 1.15,
        opacity: 1,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.15,
      });

      gsap.to(root.querySelectorAll('.fire-column--delayed'), {
        scaleY: 1.2,
        opacity: 0.9,
        duration: 0.75,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.2,
      });

      gsap.to(root.querySelectorAll('.fire-ember'), {
        y: -80,
        scale: 0.2,
        opacity: 0,
        duration: 1.4,
        repeat: -1,
        ease: 'power1.out',
        stagger: { each: 0.12, from: 'random' },
      });
    },
    { scope: scopeRef }
  );

  return (
    <div
      ref={(node) => {
        scopeRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className="absolute inset-0 z-[15] pointer-events-none overflow-hidden will-change-[opacity,transform]"
      style={{ opacity: intensity !== undefined ? (intensity > 0.01 ? intensity : 0) : 0 }}
      aria-hidden
    >
      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 w-[280px] h-[200px] sm:w-[420px] sm:h-[280px]">
        <div className="fire-glow absolute inset-0 bg-gradient-to-t from-orange-600/50 via-red-500/30 to-transparent blur-2xl" />
        <div className="fire-column absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-32 bg-gradient-to-t from-yellow-300 via-orange-500 to-transparent blur-md" />
        <div className="fire-column fire-column--delayed absolute bottom-0 left-[40%] w-10 h-24 bg-gradient-to-t from-orange-400 to-transparent blur-sm" />
        <div className="fire-column absolute bottom-0 left-[58%] w-12 h-28 bg-gradient-to-t from-red-400 to-transparent blur-md" />
      </div>
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="fire-ember absolute rounded-full bg-orange-400"
          style={{
            left: `${44 + (i % 6) * 2.5}%`,
            bottom: `${32 + (i % 4) * 2}%`,
            width: `${3 + (i % 3)}px`,
            height: `${3 + (i % 3)}px`,
            opacity: 0.4 + (i % 5) * 0.1,
          }}
        />
      ))}
    </div>
  );
});

export function CinematicVideoLayer({
  canvasRef,
  isReady,
  loadingProgress,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isReady: boolean;
  loadingProgress?: number;
}) {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40 z-10 pointer-events-none" />
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 55% 42%, transparent 20%, rgba(10,10,11,0.45) 92%)',
        }}
      />

      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover cinematic-video-bg"
        style={{
          opacity: isReady ? 1 : 0,
          filter: 'saturate(1.08) contrast(1.04)',
        }}
      />

      {!isReady && (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: 'rgba(255, 255, 255, 0.1)', borderTopColor: 'var(--dn-accent)' }} />
            <span className="text-xs text-[var(--dn-text-secondary)] font-mono tracking-wider animate-pulse uppercase">
              Đang tải hiệu ứng: {loadingProgress ?? 0}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}