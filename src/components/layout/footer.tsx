'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Footer() {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const track = trackRef.current;
    if (!track) return;

    gsap.set(track, { x: '0%' });

    const marqueeTween = gsap.to(track, {
      x: '-50%',
      duration: 30,
      ease: 'none',
      repeat: -1,
    });

    track.addEventListener('mouseenter', () => marqueeTween.timeScale(0.3));
    track.addEventListener('mouseleave', () => marqueeTween.timeScale(1));

    ScrollTrigger.create({
      trigger: document.body,
      start: 'bottom bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const speed = 1 + Math.abs(self.getVelocity() / 2000);
        marqueeTween.timeScale(Math.min(speed, 4));
      },
    });

    return () => {
      marqueeTween.kill();
    };
  }, { scope: trackRef });

  return (
    <footer className="border-t border-[var(--dn-border)]">
      <div className="overflow-hidden border-b border-[var(--dn-border)]" aria-label="Footer tagline">
        <div ref={trackRef} className="flex gap-10 whitespace-nowrap py-3" aria-hidden="true">
          <span className="text-sm font-semibold text-[var(--dn-text-tertiary)] tracking-[0.08em]">
            CHIA SẺ HÔM NAY · GIÚP ĐỠ NGÀY MAI · CHIA SẺ HÔM NAY · GIÚP ĐỠ NGÀY MAI ·
          </span>
          <span className="text-sm font-semibold text-[var(--dn-text-tertiary)] tracking-[0.08em]">
            CHIA SẺ HÔM NAY · GIÚP ĐỠ NGÀY MAI · CHIA SẺ HÔM NAY · GIÚP ĐỠ NGÀY MAI ·
          </span>
        </div>
      </div>

      <div className="py-12">
        <div className="dn-container">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center group">
                <Image
                  src="/logo.png"
                  alt="ĐN-UniShare Logo"
                  width={160}
                  height={40}
                  className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </Link>
              <p className="text-sm text-[var(--dn-text-secondary)] leading-relaxed max-w-sm mt-3">
                Nền tảng chia sẻ đồ dùng, sách vở cho sinh viên tại Đà Nẵng.
                Mọi thứ đều miễn phí, bởi vì tử tế không cần giá.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-[var(--dn-text-secondary)]">
              <Link href="/about" className="hover:text-[var(--dn-text-primary)] transition-colors">Giới thiệu</Link>
              <Link href="/items" className="hover:text-[var(--dn-text-primary)] transition-colors">Tìm đồ</Link>
              <Link href="/impact" className="hover:text-[var(--dn-text-primary)] transition-colors">Tác động</Link>
              <Link href="/privacy" className="hover:text-[var(--dn-text-primary)] transition-colors">Chính sách</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-6 border-t border-[var(--dn-border)]">
            <p className="text-xs text-[var(--dn-text-tertiary)]">© 2025 ĐN-UniShare</p>
            <p className="text-xs text-[var(--dn-text-tertiary)]">
              Sẻ chia &middot; Kết nối &middot; Cộng đồng
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
