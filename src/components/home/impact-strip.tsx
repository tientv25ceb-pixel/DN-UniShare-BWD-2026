'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

export default function ImpactStrip({ cinematic = false }: { cinematic?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();

  useScrollReveal(sectionRef, {
    selector: '.gsap-reveal',
    y: 32,
    stagger: 0.1,
    disabled: reduce,
  });

  return (
    <section ref={sectionRef} className="dn-section">
      <div className={`dn-container ${cinematic ? 'dn-cinematic-panel' : ''}`}>
        <div className="text-center max-w-2xl mx-auto">
          <div className="gsap-reveal">
            <div className="dn-label mx-auto mb-5 w-fit">Tác động</div>
          </div>
          <h2 className={`gsap-reveal dn-heading dn-heading--section mb-4 ${cinematic ? 'text-white' : ''}`}>
            Tử tế —{' '}
            <span className="gradient-text">vòng tròn lớn dần</span>
          </h2>
          <p className={`gsap-reveal dn-body mx-auto text-base mb-10 ${cinematic ? 'text-white/70' : ''}`}>
            Mỗi món đồ được trao đi không chỉ giúp một người — nó truyền cảm hứng
            để người đó tiếp tục cho đi. Đó là cách chúng mình xây dựng một cộng đồng
            sinh viên Đà Nẵng biết sẻ chia.
          </p>

          <div className="gsap-reveal grid grid-cols-3 gap-6 p-8 rounded-2xl border border-[var(--dn-border)] bg-[var(--dn-surface)]">
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
          </div>
        </div>
      </div>
    </section>
  );
}