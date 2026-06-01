'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Gift, RefreshCw, Coins, Search, Heart, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const POST_OPTIONS = [
  {
    type: 'mienphi',
    label: 'Tặng đồ',
    desc: 'Cho đi những món đồ còn tốt',
    icon: Gift,
    href: '/post/give',
    color: 'text-green-400',
    bg: 'hover:bg-green-500/8',
    dot: 'bg-green-400',
  },
  {
    type: 'traodoi',
    label: 'Trao đổi',
    desc: 'Đổi đồ với sinh viên khác',
    icon: RefreshCw,
    href: '/post/exchange',
    color: 'text-blue-400',
    bg: 'hover:bg-blue-500/8',
    dot: 'bg-blue-400',
  },
  {
    type: 'sale',
    label: 'Bán đồ',
    desc: 'Thanh lý giá sinh viên',
    icon: Coins,
    href: '/post/sell',
    color: 'text-amber-400',
    bg: 'hover:bg-amber-500/8',
    dot: 'bg-amber-400',
  },
  {
    type: 'lost',
    label: 'Tìm đồ',
    desc: 'Báo tin thất lạc trong làng ĐH',
    icon: Search,
    href: '/post/lost',
    color: 'text-red-400',
    bg: 'hover:bg-red-500/8',
    dot: 'bg-red-400',
  },
  {
    type: 'found',
    label: 'Nhặt được đồ',
    desc: 'Đăng tin tìm chủ cho vật phẩm',
    icon: Heart,
    href: '/post/found',
    color: 'text-cyan-400',
    bg: 'hover:bg-cyan-500/8',
    dot: 'bg-cyan-400',
  },
];

export default function PostDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(o => !o)}
        className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] hover:shadow-sm"
      >
        Đăng
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.94 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[260px] z-50"
          >
            <div className="glass-premium rounded-2xl shadow-2xl py-1.5 px-1.5 border border-white/10">
              <div className="flex flex-col gap-0.5">
                {POST_OPTIONS.map(opt => (
                  <Link
                    key={opt.type}
                    href={opt.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${opt.bg} group cursor-pointer`}
                  >
                    <div className={`relative ${opt.color} transition-transform duration-200 group-hover:scale-110`}>
                      <opt.icon size={18} />
                      <span className={`absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full ${opt.dot} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--foreground)]">{opt.label}</p>
                      <p className="text-[11px] text-[var(--muted-foreground)] truncate leading-tight">{opt.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
