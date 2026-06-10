'use client';

import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Gift, Search, MessageCircle, Heart, Sparkles } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/home/hero-section';
import WhySection from '@/components/home/why-section';
import ImpactStrip from '@/components/home/impact-strip';
import ItemCard from '@/components/ui/item-card';
import { useStore } from '@/lib/store';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

const steps = [
  { icon: Gift, title: 'Đăng món đồ', desc: 'Chụp ảnh và mô tả món đồ bạn muốn chia sẻ. Chỉ mất 2 phút.' },
  { icon: Search, title: 'Tìm đồ cần thiết', desc: 'Khám phá hàng trăm vật phẩm từ sinh viên khác trong làng ĐH.' },
  { icon: MessageCircle, title: 'Gửi yêu cầu', desc: 'Nhấn yêu cầu, trò chuyện và chốt lịch nhận đồ.' },
  { icon: Heart, title: 'Nhận & Cảm ơn', desc: 'Nhận đồ tại điểm hẹn — và lan tỏa sự tử tế.' },
];

export default function Home() {
  const items = useStore(state => state.items);
  const featuredItems = items.filter(i => i.isFeatured).slice(0, 4);
  const reduce = useReducedMotion();

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <HeroSection />

      <div className="flex-grow relative z-10 bg-[var(--dn-surface)]">
        <WhySection />

        <section className="dn-section bg-[var(--dn-surface-elevated)]">
          <div className="dn-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={reduce ? false : { opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="dn-label mb-5 w-fit">Cách hoạt động</div>
                <h2 className="dn-heading dn-heading--section mb-4">
                  Bắt đầu chỉ với{' '}
                  <span className="gradient-text">bốn bước</span>
                </h2>
                <p className="dn-body text-base mb-8">
                  ĐN-UniShare được thiết kế đơn giản nhất có thể. Đăng đồ, tìm đồ, gửi yêu cầu — mọi thứ đều miễn phí.
                </p>

                <div className="space-y-6">
                  {steps.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={reduce ? false : { opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-start gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-[var(--dn-accent-soft)] flex items-center justify-center shrink-0">
                          <step.icon size={18} className="text-[var(--dn-accent)]" />
                        </div>
                        {idx < steps.length - 1 && (
                          <div className="w-px h-8 bg-[var(--dn-border)] mt-1" />
                        )}
                      </div>
                      <div className="pt-0.5">
                        <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                        <p className="text-sm text-[var(--dn-text-secondary)]">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={reduce ? false : { opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="dn-card p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--dn-accent)]/5 rounded-full blur-[60px]" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="h-8 w-8 rounded-full bg-[var(--dn-surface-raised)] border-2 border-[var(--dn-surface-elevated)] flex items-center justify-center text-[10px] font-bold text-[var(--dn-text-secondary)]"
                          >
                            {String.fromCharCode(64 + i)}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-[var(--dn-text-tertiary)]">
                        +128 sinh viên đang hoạt động
                      </span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { name: 'Minh Anh', action: 'đã đăng "Sách Kinh tế vi mô"', time: '2 phút trước' },
                        { name: 'Hoàng Nam', action: 'đã yêu cầu "Đèn bàn học"', time: '8 phút trước' },
                        { name: 'Lan Chi', action: 'đã nhận "Áo khoác giữ nhiệt"', time: '15 phút trước' },
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--dn-surface)] border border-[var(--dn-border)]">
                          <div className="h-8 w-8 rounded-full bg-[var(--dn-accent-soft)] flex items-center justify-center text-xs font-bold text-[var(--dn-accent)]">
                            {activity.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">
                              <span className="font-medium text-[var(--dn-text-primary)]">{activity.name}</span>{' '}
                              <span className="text-[var(--dn-text-secondary)]">{activity.action}</span>
                            </p>
                          </div>
                          <span className="text-xs text-[var(--dn-text-tertiary)] shrink-0">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {featuredItems.length > 0 && (
          <section className="dn-section">
            <div className="dn-container">
              <motion.div
                initial={reduce ? false : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={fadeUp}
                className="mb-4"
              >
                <div className="dn-label mb-5 w-fit">Nổi bật</div>
              </motion.div>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <motion.h2
                    initial={reduce ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="dn-heading dn-heading--section"
                  >
                    Đang được{' '}
                    <span className="gradient-text">quan tâm</span>
                  </motion.h2>
                </div>
                <Link href="/items" className="dn-btn dn-btn-outline text-sm hidden md:flex">
                  Xem tất cả <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {featuredItems.slice(0, 1).map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={reduce ? false : { opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="md:col-span-2 lg:col-span-1"
                  >
                    <ItemCard item={item} idx={idx} />
                  </motion.div>
                ))}
                {featuredItems.slice(1).map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={reduce ? false : { opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <ItemCard item={item} idx={idx + 1} />
                  </motion.div>
                ))}
              </div>

              {featuredItems.length === 0 && (
                <div className="dn-empty-state">
                  <h3>Chưa có món đồ nổi bật</h3>
                  <p>Hãy là người đầu tiên đăng!</p>
                </div>
              )}

              <div className="mt-8 text-center md:hidden">
                <Link href="/items" className="dn-btn dn-btn-outline">
                  Xem tất cả <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>
        )}

        <ImpactStrip />

        <section className="dn-section">
          <div className="dn-container">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-2xl p-10 md:p-16 text-center"
            >
              <div className="absolute inset-0 gradient-bg opacity-90" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-[60px]" />

              <div className="relative z-10">
                <motion.h2
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="dn-heading text-white text-3xl md:text-4xl mb-4"
                >
                  Sẵn sàng lan tỏa?
                </motion.h2>
                <p className="text-white/80 text-base md:text-lg mb-8 max-w-lg mx-auto">
                  Bắt đầu bằng một món đồ bạn không còn dùng đến. Một cuốn sách cũ có thể là khởi đầu cho một ước mơ mới.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
