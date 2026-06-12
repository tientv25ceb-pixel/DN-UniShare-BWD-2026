'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Gift, Search, MessageCircle, Heart } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HomeCinematicShell from '@/components/home/home-cinematic-shell';
import ScrollVideoHero from '@/components/home/scroll-video-hero';
import WhySection from '@/components/home/why-section';
import ImpactStrip from '@/components/home/impact-strip';
import ItemCard from '@/components/ui/item-card';
import { useStore } from '@/lib/store';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

const steps = [
  { icon: Gift, title: 'Đăng món đồ', desc: 'Chụp ảnh và mô tả món đồ bạn muốn chia sẻ. Chỉ mất 2 phút.' },
  { icon: Search, title: 'Tìm đồ cần thiết', desc: 'Khám phá hàng trăm vật phẩm từ sinh viên khác trong làng ĐH.' },
  { icon: MessageCircle, title: 'Gửi yêu cầu', desc: 'Nhấn yêu cầu, trò chuyện và chốt lịch nhận đồ.' },
  { icon: Heart, title: 'Nhận & Cảm ơn', desc: 'Nhận đồ tại điểm hẹn — và lan tỏa sự tử tế.' },
];

export default function Home() {
  const items = useStore(state => state.items);
  const featuredItems = items.filter(i => i.isFeatured).slice(0, 4);
  const reduce = usePrefersReducedMotion();

  const stepsRef = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useScrollReveal(stepsRef, {
    selector: '.gsap-reveal',
    y: 28,
    x: 0,
    stagger: 0.1,
    disabled: reduce,
  });

  useScrollReveal(featuredRef, {
    selector: '.gsap-reveal',
    y: 32,
    stagger: 0.09,
    disabled: reduce,
  });

  useScrollReveal(ctaRef, {
    selector: '.gsap-reveal',
    y: 24,
    scale: 0.97,
    stagger: 0.12,
    disabled: reduce,
  });

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <HomeCinematicShell>
        <ScrollVideoHero />

        <WhySection cinematic />

        <section ref={stepsRef} className="dn-section">
          <div className="dn-container dn-cinematic-panel">
            <div className="max-w-2xl">
              <div className="gsap-reveal">
                <div className="dn-label mb-5 w-fit">Cách hoạt động</div>
                <h2 className="dn-heading dn-heading--section mb-4 text-white">
                  Bắt đầu chỉ với{' '}
                  <span className="gradient-text">bốn bước</span>
                </h2>
                <p className="dn-body text-base mb-8 text-white/75">
                  ĐN-UniShare được thiết kế đơn giản nhất có thể. Đăng đồ, tìm đồ, gửi yêu cầu — mọi thứ đều miễn phí.
                </p>
              </div>

              <div className="space-y-6">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="gsap-reveal flex items-start gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                        <step.icon size={18} className="text-[var(--dn-accent)]" />
                      </div>
                      {idx < steps.length - 1 && (
                        <div className="w-px h-8 bg-white/15 mt-1" />
                      )}
                    </div>
                    <div className="pt-0.5">
                      <h3 className="font-semibold text-sm mb-1 text-white">{step.title}</h3>
                      <p className="text-sm text-white/60">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {featuredItems.length > 0 && (
          <section ref={featuredRef} className="dn-section">
            <div className="dn-container dn-cinematic-panel">
              <div className="gsap-reveal mb-4">
                <div className="dn-label mb-5 w-fit">Nổi bật</div>
              </div>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="gsap-reveal dn-heading dn-heading--section text-white">
                    Đang được{' '}
                    <span className="gradient-text">quan tâm</span>
                  </h2>
                </div>
                <Link href="/items" className="dn-btn dn-btn-outline text-sm hidden md:flex text-white border-white/25">
                  Xem tất cả <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {featuredItems.slice(0, 1).map((item, idx) => (
                  <div
                    key={item.id}
                    className="gsap-reveal md:col-span-2 lg:col-span-1"
                  >
                    <ItemCard item={item} idx={idx} />
                  </div>
                ))}
                {featuredItems.slice(1).map((item, idx) => (
                  <div key={item.id} className="gsap-reveal">
                    <ItemCard item={item} idx={idx + 1} />
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center md:hidden">
                <Link href="/items" className="dn-btn dn-btn-outline text-white border-white/25">
                  Xem tất cả <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>
        )}

        <ImpactStrip cinematic />

        <section ref={ctaRef} className="dn-section pb-24">
          <div className="dn-container">
            <div className="gsap-reveal relative overflow-hidden rounded-2xl p-10 md:p-16 text-center border border-white/15 bg-black/50 backdrop-blur-xl">
              <div className="absolute inset-0 gradient-bg opacity-80" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-[60px]" />

              <div className="relative z-10">
                <h2 className="gsap-reveal dn-heading text-white text-3xl md:text-4xl mb-4">
                  Sẵn sàng lan tỏa?
                </h2>
                <p className="gsap-reveal text-white/80 text-base md:text-lg mb-8 max-w-lg mx-auto">
                  Bắt đầu bằng một món đồ bạn không còn dùng đến. Một cuốn sách cũ có thể là khởi đầu cho một ước mơ mới.
                </p>
                <div className="gsap-reveal flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/post"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-[var(--dn-accent)] font-bold hover:bg-white/90 transition-all"
                  >
                    Bắt đầu chia sẻ ngay
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    href="/impact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-bold hover:bg-white/10 hover:border-white/50 transition-all"
                  >
                    Xem tác động
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </HomeCinematicShell>

      <Footer />
    </main>
  );
}