'use client';

import { useRef, useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leaf, Users, Gift, TrendingUp, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const IMPACT_STATS = [
  { label: 'Sinh viên tham gia', value: 1280, icon: Users, color: 'text-[var(--dn-border-strong)]', suffix: '+' },
  { label: 'Món đồ đã trao đổi', value: 856, icon: Gift, color: 'text-[var(--dn-accent)]', suffix: '' },
  { label: 'Lượng rác thải giảm', value: 340, icon: Leaf, color: 'text-emerald-500', suffix: 'kg' },
  { label: 'Chi phí tiết kiệm', value: 25000, icon: TrendingUp, color: 'text-amber-500', suffix: 'đ' },
];

const PLACEHOLDER_DATA = [40, 55, 45, 70, 65, 85, 95, 80, 110, 105, 125, 140];
const MONTHS = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        if (ref.current) {
          const formatted = Math.round(obj.val).toLocaleString('vi-VN');
          ref.current.textContent = formatted + (suffix === 'đ' ? ' đ' : suffix);
        }
      },
    });
  }, { scope: ref });

  return <span ref={ref}>0</span>;
}

export default function ImpactPage() {
  const maxVal = Math.max(...PLACEHOLDER_DATA);
  const chartRef = useRef<HTMLDivElement>(null);
  const [barDoms, setBarDoms] = useState<HTMLElement[]>([]);

  useGSAP(() => {
    barDoms.forEach((bar, idx) => {
      const val = PLACEHOLDER_DATA[idx];
      gsap.to(bar, {
        height: `${(val / maxVal) * 100}%`,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: chartRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    });
  }, { dependencies: [barDoms], scope: chartRef });

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden pb-safe">
      <Header />
      <div className="flex-grow pt-28 pb-16 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="dn-badge dn-badge-rose mb-5 mx-auto w-fit">
              <Heart size={14} /> Tác động cộng đồng
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="section-headline mb-4">
              Cùng nhau xây dựng Làng Đại học <span className="gradient-text">Xanh & Bền vững</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-sm text-[var(--dn-text-secondary)]">
              Mỗi cuốn sách được truyền tay, mỗi món đồ được tái sử dụng đều góp phần bảo vệ môi trường.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {IMPACT_STATS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.08 }}
                  className="dn-card p-6 text-center">
                  <div className="h-14 w-14 rounded-full bg-[var(--dn-surface-strong)] flex items-center justify-center mx-auto mb-4">
                    <Icon size={28} className={stat.color} />
                  </div>
                  <h3 className="text-3xl font-bold mb-1"><AnimatedNumber target={stat.value} suffix={stat.suffix} /></h3>
                  <p className="text-xs text-[var(--dn-text-secondary)] font-medium">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          <div ref={chartRef} className="dn-card p-6 md:p-10">
            <div className="mb-8">
              <h3 className="text-xl font-bold">Xu hướng trao đổi theo tháng</h3>
              <p className="text-xs text-[var(--dn-text-secondary)] mt-1">Tổng số món đồ được trao tay qua từng tháng</p>
            </div>

            <div className="flex items-end gap-1.5 md:gap-3 h-44 md:h-56 relative">
              {PLACEHOLDER_DATA.map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-bold text-[var(--dn-text-secondary)]">
                    {val}
                  </span>
                  <div
                    ref={(el) => { if (el && !barDoms[idx]) { setBarDoms(prev => { const n = [...prev]; n[idx] = el; return n; }); } }}
                    className="w-full rounded-md bg-gradient-to-t from-[var(--dn-border-strong)] to-[var(--dn-border-strong)]/50 relative group cursor-pointer"
                    style={{ height: 4, minHeight: 4 }}
                  />
                  <span className="text-[9px] text-[var(--dn-text-secondary)] opacity-50">{MONTHS[idx]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
