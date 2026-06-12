'use client';

import { useEffect, useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap';
import {
  TOTAL_HERO_FRAMES,
  fireIntensityAt,
} from '@/lib/cinematic';

const PROGRESS_LERP = 0.08;

export function useScrollVideoScrub(
  containerRef: React.RefObject<HTMLElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  images: HTMLImageElement[],
  options: {
    enabled: boolean;
    smooth?: boolean;
    fireOverlayRef?: React.RefObject<HTMLElement | null>;
    progressBarRef?: React.RefObject<HTMLElement | null>;
    isIntroPlaying?: boolean;
  }
) {
  const isReady = images.length === TOTAL_HERO_FRAMES;
  const targetRef = useRef(0);
  const smoothRef = useRef(0);
  const tickingRef = useRef(false);
  const [progress, setProgress] = useState(0);

  useGSAP(
    () => {
      registerGsap();

      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas || !options.enabled || !isReady) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas drawing buffer dimensions to 720p native aspect ratio
      canvas.width = 1280;
      canvas.height = 720;

      const fireEl = options.fireOverlayRef?.current ?? null;
      const barEl = options.progressBarRef?.current ?? null;
      const setFireOpacity = fireEl ? gsap.quickSetter(fireEl, 'opacity') : null;
      const setBarScale = barEl ? gsap.quickSetter(barEl, 'scaleX') : null;

      if (barEl) {
        gsap.set(barEl, { transformOrigin: 'left center', scaleX: 0, force3D: true });
      }
      if (fireEl) {
        gsap.set(fireEl, { opacity: 0 });
      }

      // Initial frame draw
      const initialImg = images[0];
      if (initialImg && initialImg.complete) {
        ctx.drawImage(initialImg, 0, 0, 1280, 720);
      }

      const st = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (!options.isIntroPlaying) {
            targetRef.current = self.progress;
            setProgress(self.progress);
          }
        },
      });

      const lerp = options.smooth === false ? 1 : PROGRESS_LERP;

      const tick = () => {
        const target = targetRef.current;
        let smooth = smoothRef.current;

        if (lerp >= 1) {
          smooth = target;
        } else {
          smooth += (target - smooth) * lerp;
          if (Math.abs(target - smooth) < 0.00008) smooth = target;
        }
        smoothRef.current = smooth;

        // Draw image frame to canvas
        const frameIndex = Math.min(TOTAL_HERO_FRAMES - 1, Math.max(0, Math.round(smooth * (TOTAL_HERO_FRAMES - 1))));
        const img = images[frameIndex];
        if (img && img.complete) {
          ctx.drawImage(img, 0, 0, 1280, 720);
        }

        const intensity = fireIntensityAt(smooth);
        setFireOpacity?.(intensity > 0.01 ? intensity : 0);
        setBarScale?.(smooth);
      };

      gsap.ticker.add(tick);
      tickingRef.current = true;

      return () => {
        st.kill();
        if (tickingRef.current) {
          gsap.ticker.remove(tick);
          tickingRef.current = false;
        }
      };
    },
    {
      scope: containerRef,
      dependencies: [options.enabled, options.smooth, isReady, images, options.isIntroPlaying],
      revertOnUpdate: true,
    }
  );

  return { isReady, progress, setProgress, targetRef, smoothRef };
}