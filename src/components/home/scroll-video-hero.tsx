'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, ChevronDown, ArrowRight } from 'lucide-react';

export default function ScrollVideoHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative w-full min-h-[100dvh] bg-transparent overflow-hidden select-none flex flex-col justify-center items-center px-4">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-4xl mx-auto text-center z-10"
      >
        <div className="dn-label mx-auto mb-6 w-fit bg-white/5 border-white/15 text-white/80 backdrop-blur-md">
          <Sparkles size={14} className="text-blue-400" />
          Cộng đồng sinh viên Đà Nẵng
        </div>

        <h1 className="dn-heading dn-heading--hero text-white mb-6 leading-tight drop-shadow-2xl">
          Chia sẻ đồ dùng.{' '}
          <span className="gradient-text">Kết nối tử tế.</span>
        </h1>

        <p className="dn-body text-lg text-gray-200/90 mx-auto mb-10 max-w-2xl drop-shadow-md">
          Nền tảng kết nối sinh viên Làng Đại học Đà Nẵng — trao đi những món đồ còn tốt,
          nhận lại những gì bạn cần. Một hành động nhỏ, một tác động lớn.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/post"
            className="dn-btn dn-btn-primary text-base px-10 py-4 shadow-lg shadow-blue-500/20"
          >
            Bắt đầu chia sẻ
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/items"
            className="dn-btn dn-btn-outline text-base px-10 py-4 text-white border-white/30 bg-white/5 backdrop-blur-sm"
          >
            Khám phá đồ miễn phí
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-white/50">
          <span className="flex items-center gap-2">
            <span className="text-blue-400 font-bold text-base">500+</span>
            Món đồ đã chia sẻ
          </span>
          <span className="w-px h-4 bg-white/15 hidden sm:block" />
          <span className="flex items-center gap-2">
            <span className="text-blue-400 font-bold text-base">1.2k+</span>
            Sinh viên tham gia
          </span>
          <span className="w-px h-4 bg-white/15 hidden sm:block" />
          <span className="flex items-center gap-2">
            <span className="text-blue-400 font-bold text-base">95%</span>
            Hài lòng
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[25] flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-xs text-white/40 tracking-widest uppercase font-mono">Cuộn xuống để khám phá</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronDown size={20} className="text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}