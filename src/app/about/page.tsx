'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden pb-safe">
      <Header />
      <div className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-kicker">Câu chuyện của chúng mình</span>
            <h1 className="section-headline mt-3 mb-8">
              Về <span className="gradient-text">ĐN-UniShare</span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-3"
            >
              <div className="dn-card p-8 space-y-5 text-[var(--dn-text-secondary)] leading-relaxed">
                <p className="text-base">
                  <strong className="text-[var(--dn-text-primary)]">Làm thế nào để những món đồ sinh viên không dùng nữa có thể đến tay những người thực sự cần?</strong>
                </p>
                <p className="text-sm">
                  Mỗi năm, hàng tấn sách vở, giáo trình và đồ dùng ký túc xá bị vứt bỏ khi sinh viên tốt nghiệp hoặc chuyển trọ. Trong khi đó, hàng ngàn tân sinh viên lại phải chật vật chi trả cho những vật dụng tương tự.
                </p>
                <p className="text-sm">
                  Nhận thấy sự lãng phí này, chúng tôi xây dựng ĐN-UniShare — nền tảng kết nối sẻ chia dành riêng cho cộng đồng sinh viên tại Làng Đại học Đà Nẵng.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-2"
            >
              <div className="dn-card p-8 text-center">
                <div className="h-20 w-20 rounded-full gradient-bg flex items-center justify-center shadow-lg mx-auto mb-4">
                  <span className="text-white font-bold text-xl">ĐN</span>
                </div>
                <h3 className="font-bold text-base mb-4">Sứ mệnh</h3>
                <ul className="text-left space-y-3 text-sm text-[var(--dn-text-secondary)]">
                  {[
                    { label: 'Giảm thiểu rác thải', desc: 'Kéo dài vòng đời vật dụng sinh viên' },
                    { label: 'Hỗ trợ tài chính', desc: 'Giúp sinh viên tiết kiệm chi phí' },
                    { label: 'Xây dựng cộng đồng', desc: 'Môi trường tử tế, sẵn sàng giúp đỡ' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="h-5 w-5 rounded-full bg-[var(--dn-border-strong)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--dn-border-strong)]" />
                      </span>
                      <div>
                        <strong className="text-[var(--dn-text-primary)]">{item.label}:</strong>{' '}
                        {item.desc}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
