'use client';

import { motion, useReducedMotion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function ImpactStrip() {
  const reduce = useReducedMotion();

  return (
    <section className="dn-section bg-[var(--dn-surface-elevated)]">
      <div className="dn-container">
        <div className="text-center max-w-2xl mx-auto">
          <motion.div
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <div className="dn-label mx-auto mb-5 w-fit">Tác động</div>
          </motion.div>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="dn-heading dn-heading--section mb-4"
          >
            Tử tế —{' '}
            <span className="gradient-text">vòng tròn lớn dần</span>
          </motion.h2>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="dn-body mx-auto text-base mb-10"
          >
            Mỗi món đồ được trao đi không chỉ giúp một người — nó truyền cảm hứng
            để người đó tiếp tục cho đi. Đó là cách chúng mình xây dựng một cộng đồng
            sinh viên Đà Nẵng biết sẻ chia.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-6 p-8 rounded-2xl border border-[var(--dn-border)] bg-[var(--dn-surface)]"
          >
            {[
              { number: '500+', label: 'Món đồ đã trao' },
              { number: '1.2k+', label: 'Thành viên' },
              { number: '98%', label: 'Phản hồi tích cực' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="dn-heading text-3xl md:text-4xl gradient-text">{stat.number}</p>
                <p className="text-sm text-[var(--dn-text-secondary)] mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
