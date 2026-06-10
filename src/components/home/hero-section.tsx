'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-[120dvh] flex flex-col justify-center items-center overflow-hidden py-20">
      {/* Background Image of Da Nang Dragon Bridge */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/dragon-bridge.png"
          alt="Cầu Rồng Đà Nẵng về đêm"
          className="w-full h-full object-cover opacity-35"
        />
        {/* Soft transitions to main layout background colors */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--dn-surface)]/20 via-transparent to-[var(--dn-surface)]" />
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 25%, var(--dn-surface) 90%)'
          }}
        />
        {/* Decorative background ambient glows */}
        <div className={`absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-[var(--dn-accent)]/6 blur-[130px] ${!reduce ? 'animate-pulse' : ''}`} style={{ animationDuration: '8s' }} />
        <div className={`absolute bottom-1/4 -left-32 w-[400px] h-[400px] rounded-full bg-[var(--dn-accent-dim)]/4 blur-[110px] ${!reduce ? 'animate-pulse' : ''}`} style={{ animationDuration: '10s' }} />
      </div>

      <div className="dn-container relative z-10 w-full mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="dn-label mx-auto mb-6 w-fit">
              <Sparkles size={14} />
              Cộng đồng sinh viên Đà Nẵng
            </div>
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="dn-heading dn-heading--hero mb-6"
          >
            Chia sẻ đồ dùng.{' '}
            <span className="gradient-text">Kết nối tử tế.</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="dn-body text-lg mx-auto mb-10"
          >
            Nền tảng kết nối sinh viên Làng Đại học Đà Nẵng — trao đi những món đồ còn tốt,
            nhận lại những gì bạn cần. Một hành động nhỏ, một tác động lớn.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/post" className="dn-btn dn-btn-primary text-base px-10 py-4">
              Bắt đầu chia sẻ
              <ArrowRight size={18} />
            </Link>
            <Link href="/items" className="dn-btn dn-btn-outline text-base px-10 py-4">
              Khám phá đồ miễn phí
            </Link>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 flex items-center justify-center gap-8 text-sm text-[var(--dn-text-tertiary)]"
          >
            <span className="flex items-center gap-2">
              <span className="text-[var(--dn-accent)] font-bold text-base">500+</span>
              Món đồ đã chia sẻ
            </span>
            <span className="w-px h-4 bg-[var(--dn-border)]" />
            <span className="flex items-center gap-2">
              <span className="text-[var(--dn-accent)] font-bold text-base">1.2k+</span>
              Sinh viên tham gia
            </span>
            <span className="w-px h-4 bg-[var(--dn-border)]" />
            <span className="flex items-center gap-2">
              <span className="text-[var(--dn-accent)] font-bold text-base">95%</span>
              Hài lòng
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
