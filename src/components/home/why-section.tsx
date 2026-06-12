'use client';

import { useRef } from 'react';
import { Recycle, Users, Sparkles, BookOpen, Package, Heart, Check } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

const features = [
  {
    icon: Recycle,
    title: 'Giảm lãng phí',
    desc: 'Tái sử dụng đồ còn tốt thay vì vứt bỏ. Mỗi món đồ được trao đi là một bước tiến cho môi trường.',
  },
  {
    icon: Users,
    title: 'Kết nối cộng đồng',
    desc: 'Gặp gỡ, trao đổi và xây dựng tình bạn mới trong cùng làng Đại học Đà Nẵng.',
  },
  {
    icon: Sparkles,
    title: 'Lan tỏa tử tế',
    desc: 'Một hành động nhỏ có thể tạo nên tác động lớn. Cùng nhau xây dựng thói quen sẻ chia.',
  },
  {
    icon: BookOpen,
    title: 'Tri thức trong tầm tay',
    desc: 'Sách giáo trình, tài liệu học tập được chia sẻ — giúp giảm gánh nặng chi phí đầu năm.',
  },
  {
    icon: Package,
    title: 'Đồ dùng sinh hoạt',
    desc: 'Từ bàn ghế, đèn học đến quần áo — tất cả đều có thể tìm thấy miễn phí.',
  },
  {
    icon: Heart,
    title: 'Trao gửi yêu thương',
    desc: 'Không chỉ là đồ vật, mỗi món quà là một thông điệp tử tế giữa người với người.',
  },
];

export default function WhySection({ cinematic = false }: { cinematic?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();

  useScrollReveal(sectionRef, {
    selector: '.gsap-reveal',
    y: 36,
    stagger: 0.09,
    disabled: reduce,
  });

  const headingClass = cinematic ? 'text-white' : '';
  const bodyClass = cinematic ? 'text-white/70' : '';
  const cardClass = cinematic
    ? 'bg-white/5 border-white/10 backdrop-blur-md'
    : '';
  const subTextClass = cinematic ? 'text-white/60' : 'text-[var(--dn-text-secondary)]';

  return (
    <section ref={sectionRef} className="dn-section">
      <div className={`dn-container ${cinematic ? 'dn-cinematic-panel' : ''}`}>
        <div className="gsap-reveal text-center mb-4">
          <div className="dn-label mx-auto mb-5 w-fit">Nền tảng</div>
        </div>
        <h2
          className={`gsap-reveal dn-heading dn-heading--section text-center mb-4 ${headingClass}`}
        >
          Tại sao sinh viên chọn{' '}
          <span className="gradient-text">ĐN-UniShare?</span>
        </h2>
        <p className={`gsap-reveal dn-body text-center mx-auto mb-14 text-base ${bodyClass}`}>
          Hàng ngàn sinh viên Đà Nẵng đang cùng nhau xây dựng một cộng đồng tử tế — nơi đồ cũ
          tìm được chủ mới và tình bạn được thắp lên.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`gsap-reveal dn-card p-6 md:p-8 md:col-span-2 flex flex-col md:flex-row gap-6 justify-between items-center overflow-hidden group ${cardClass}`}>
            <div className="flex-1">
              <div className="h-11 w-11 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <Recycle size={22} className="text-emerald-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">{features[0].title}</h3>
              <p className={`text-sm leading-relaxed max-w-sm ${subTextClass}`}>{features[0].desc}</p>
            </div>
            <div className="relative w-40 h-40 flex items-center justify-center bg-[var(--dn-surface-strong)]/40 rounded-full border border-[var(--dn-border)] p-4 shrink-0">
              <div className="absolute inset-2 rounded-full border-4 border-dashed border-emerald-500/20 animate-spin" style={{ animationDuration: '20s' }} />
              <div className="text-center z-10">
                <p className="text-3xl font-extrabold text-emerald-500">340</p>
                <p className="text-[10px] text-[var(--dn-text-secondary)] uppercase tracking-wider font-semibold">kg CO2 giảm</p>
              </div>
            </div>
          </div>

          <div className={`gsap-reveal dn-card p-6 md:p-8 ${cardClass} md:col-span-1 flex flex-col justify-between group`}>
            <div>
              <div className="h-11 w-11 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <Users size={22} className="text-blue-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">{features[1].title}</h3>
              <p className="text-sm text-[var(--dn-text-secondary)] leading-relaxed">{features[1].desc}</p>
            </div>
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[var(--dn-border)]">
              <div className="flex -space-x-2.5">
                {['A', 'B', 'C', 'D'].map((char, i) => (
                  <div key={i} className="h-7 w-7 rounded-full bg-[var(--dn-surface-strong)] border-2 border-[var(--dn-surface-elevated)] flex items-center justify-center text-[9px] font-bold text-[var(--dn-text-secondary)]">
                    {char}
                  </div>
                ))}
              </div>
              <span className="text-[11px] text-[var(--dn-text-tertiary)] font-semibold">+1.2k Online</span>
            </div>
          </div>

          <div className={`gsap-reveal dn-card p-6 md:p-8 ${cardClass} md:col-span-1 flex flex-col justify-between group`}>
            <div>
              <div className="h-11 w-11 rounded-xl bg-rose-500/10 flex items-center justify-center mb-4">
                <Sparkles size={22} className="text-rose-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">{features[2].title}</h3>
              <p className="text-sm text-[var(--dn-text-secondary)] leading-relaxed">{features[2].desc}</p>
            </div>
            <div className="flex items-center justify-center mt-6 py-2 bg-[var(--dn-surface-strong)]/30 rounded-xl border border-[var(--dn-border)]">
              <Heart size={18} className="text-rose-500 animate-pulse" />
            </div>
          </div>

          <div className={`gsap-reveal dn-card p-6 md:p-8 ${cardClass} md:col-span-1 flex flex-col justify-between group`}>
            <div>
              <div className="h-11 w-11 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                <BookOpen size={22} className="text-indigo-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">{features[3].title}</h3>
              <p className="text-sm text-[var(--dn-text-secondary)] leading-relaxed">{features[3].desc}</p>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-6 pt-3">
              {['Giải tích 📚', 'IT 💻', 'Kinh tế 📊', 'Ngoại ngữ 🌐'].map((tag, i) => (
                <div key={i} className="px-2 py-1 rounded-lg bg-[var(--dn-surface-strong)] text-[10px] text-center border border-[var(--dn-border)] text-[var(--dn-text-secondary)]">
                  {tag}
                </div>
              ))}
            </div>
          </div>

          <div className={`gsap-reveal dn-card p-6 md:p-8 ${cardClass} md:col-span-2 flex flex-col md:flex-row gap-6 justify-between items-center group`}>
            <div className="flex-1">
              <div className="h-11 w-11 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <Package size={22} className="text-amber-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">{features[4].title}</h3>
              <p className="text-sm text-[var(--dn-text-secondary)] leading-relaxed max-w-sm">{features[4].desc}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full md:w-56 shrink-0 bg-[var(--dn-surface-strong)]/30 border border-[var(--dn-border)] p-4 rounded-xl">
              {['Ấm nước 🔌', 'Đèn học 💡', 'Bàn gấp 🪑', 'Quạt máy 🌬️'].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px] text-[var(--dn-text-secondary)] font-medium">
                  <div className="h-3.5 w-3.5 rounded-full bg-[var(--dn-accent-soft)] flex items-center justify-center shrink-0">
                    <Check size={9} className="text-[var(--dn-accent)]" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className={`gsap-reveal dn-card p-6 md:p-8 ${cardClass} md:col-span-3 flex flex-col md:flex-row gap-6 justify-between items-center overflow-hidden group`}>
            <div className="flex-1">
              <div className="h-11 w-11 rounded-xl bg-pink-500/10 flex items-center justify-center mb-4">
                <Heart size={22} className="text-pink-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">{features[5].title}</h3>
              <p className="text-sm text-[var(--dn-text-secondary)] leading-relaxed max-w-xl">{features[5].desc}</p>
            </div>
            <div className="w-full md:w-80 shrink-0 p-4 rounded-xl bg-[var(--dn-surface-strong)]/40 border border-[var(--dn-border)] relative">
              <span className="text-xs italic text-[var(--dn-text-secondary)]">
                "Nhờ ĐN-UniShare mình đã tặng lại được bộ giáo trình IT cho một bạn khóa dưới. Cảm giác sẻ chia thực sự rất tuyệt vời!"
              </span>
              <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-[var(--dn-border)]">
                <div className="w-5 h-5 rounded-full bg-[var(--dn-accent)] text-white text-[9px] font-bold flex items-center justify-center">N</div>
                <span className="text-[10px] font-semibold text-[var(--dn-text-secondary)]">Thu Trang · CNTT K24</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}