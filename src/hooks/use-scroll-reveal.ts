'use client';

import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap';

type RevealOptions = {
  selector?: string;
  y?: number;
  x?: number;
  scale?: number;
  stagger?: number;
  start?: string;
  once?: boolean;
  disabled?: boolean;
};

export function useScrollReveal(
  containerRef: React.RefObject<HTMLElement | null>,
  {
    selector = '.gsap-reveal',
    y = 40,
    x = 0,
    scale = 1,
    stagger = 0.08,
    start = 'top 88%',
    once = true,
    disabled = false,
  }: RevealOptions = {}
) {
  useGSAP(
    () => {
      registerGsap();

      const root = containerRef.current;
      if (!root || disabled) return;

      const targets = root.querySelectorAll<HTMLElement>(selector);
      if (!targets.length) return;

      gsap.set(targets, {
        autoAlpha: 0,
        y,
        x,
        scale,
        force3D: true,
      });

      ScrollTrigger.batch(targets, {
        start,
        once,
        onEnter: (elements) => {
          gsap.to(elements, {
            autoAlpha: 1,
            y: 0,
            x: 0,
            scale: 1,
            duration: 0.65,
            ease: 'power3.out',
            stagger,
            overwrite: true,
          });
        },
        onLeaveBack: once
          ? undefined
          : (elements) => {
              gsap.to(elements, {
                autoAlpha: 0,
                y,
                x,
                scale,
                duration: 0.35,
                ease: 'power2.in',
                overwrite: true,
              });
            },
      });
    },
    {
      scope: containerRef,
      dependencies: [selector, y, x, scale, stagger, start, once, disabled],
      revertOnUpdate: true,
    }
  );
}