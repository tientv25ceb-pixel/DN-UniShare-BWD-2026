'use client';

import Link from 'next/link';
import { Gift, RefreshCw, Coins, Search, Heart, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import MountainRange from '@/components/decorative/mountain-range';

const OPTIONS = [
  {
    slug: 'give',
    label: 'Tặng đồ',
    desc: 'Cho đi những món đồ còn tốt đến người cần',
    icon: Gift,
    color: 'text-green-400',
    border: 'border-green-500/20',
    bg: 'bg-green-500/5',
    hover: 'hover:border-green-500/40 hover:bg-green-500/10',
    gradient: 'from-green-500/20 to-emerald-500/10',
  },
  {
    slug: 'exchange',
    label: 'Trao đổi',
    desc: 'Đổi đồ với sinh viên khác trong làng ĐH',
    icon: RefreshCw,
    color: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/5',
    hover: 'hover:border-blue-500/40 hover:bg-blue-500/10',
    gradient: 'from-blue-500/20 to-cyan-500/10',
  },
  {
    slug: 'sell',
    label: 'Bán đồ',
    desc: 'Thanh lý đồ cũ với giá sinh viên',
    icon: Coins,
    color: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/5',
    hover: 'hover:border-amber-500/40 hover:bg-amber-500/10',
    gradient: 'from-amber-500/20 to-orange-500/10',
  },
  {
    slug: 'lost',
    label: 'Tìm đồ',
    desc: 'Báo tin thất lạc trong làng Đại học',
    icon: Search,
    color: 'text-red-400',
    border: 'border-red-500/20',
    bg: 'bg-red-500/5',
    hover: 'hover:border-red-500/40 hover:bg-red-500/10',
    gradient: 'from-red-500/20 to-rose-500/10',
  },
  {
    slug: 'found',
    label: 'Nhặt được đồ',
    desc: 'Đăng tin tìm chủ cho vật phẩm nhặt được',
    icon: Heart,
    color: 'text-cyan-400',
    border: 'border-cyan-500/20',
    bg: 'bg-cyan-500/5',
    hover: 'hover:border-cyan-500/40 hover:bg-cyan-500/10',
    gradient: 'from-cyan-500/20 to-teal-500/10',
  },
];

export default function PostLanding() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <Header />
      <MountainRange className="absolute bottom-0 left-0 w-full h-[80px] opacity-40" />
      <div className="flex-grow pt-28 pb-16 relative z-10">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-3">
              Bạn muốn đăng gì?
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] max-w-lg mx-auto">
              Chọn hình thức đăng tin phù hợp với nhu cầu của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
            {OPTIONS.map(opt => (
              <Link
                key={opt.slug}
                href={`/post/${opt.slug}`}
                className={`w-full max-w-sm group relative overflow-hidden rounded-2xl border ${opt.border} ${opt.bg} ${opt.hover} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${opt.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                <div className="relative z-10">
                  <div className={`h-12 w-12 rounded-xl ${opt.bg} border ${opt.border} flex items-center justify-center mb-4 ${opt.color} group-hover:scale-110 transition-transform duration-300`}>
                    <opt.icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--foreground)] mb-1.5">{opt.label}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{opt.desc}</p>
                  <div className={`flex items-center gap-1 mt-4 text-xs font-semibold ${opt.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    <span>Bắt đầu</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
