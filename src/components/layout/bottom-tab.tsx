'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home, Compass, MessageCircle, Heart, User,
  Plus, MoreHorizontal, Radio, Leaf, LogIn, X,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import LoginModal from '@/components/auth/login-modal';

const PRIMARY_TABS = [
  { label: 'Trang chủ', href: '/', icon: Home },
  { label: 'Khám phá', href: '/items', icon: Compass },
  { label: 'Đăng', href: '/post', icon: Plus, prominent: true },
  { label: 'Tin nhắn', href: '/chat', icon: MessageCircle },
  { label: 'Thêm', icon: MoreHorizontal },
];

const MORE_ITEMS = [
  { label: 'Radar', href: '/radar', icon: Radio },
  { label: 'Tác động', href: '/impact', icon: Leaf },
  { label: 'Yêu thích', href: '/favorites', icon: Heart },
  { label: 'Cá nhân', href: '/profile', icon: User },
];

export default function BottomTabBar() {
  const pathname = usePathname();
  const { conversations, currentUser } = useStore();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const unreadTotal = conversations.reduce((sum: number, c: any) => sum + (c.unread || 0), 0);

  return (
    <>
      <nav className="bottom-tab-bar md:hidden">
        {PRIMARY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.href && (pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href)));

          if (!tab.href) {
            return (
              <button
                key={tab.label}
                onClick={() => setIsMoreOpen(true)}
                className={`bottom-tab-item ${isMoreOpen ? 'bottom-tab-item--active' : ''}`}
                aria-label={tab.label}
              >
                <Icon size={22} />
                <span>{tab.label}</span>
              </button>
            );
          }

          if (tab.prominent) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="bottom-tab-item--prominent"
                aria-label={tab.label}
              >
                <Icon size={24} />
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`bottom-tab-item ${isActive ? 'bottom-tab-item--active' : ''}`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon size={22} />
                {tab.href === '/chat' && unreadTotal > 0 && (
                  <span className="absolute -top-1.5 -right-2 h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadTotal > 99 ? '99+' : unreadTotal}
                  </span>
                )}
              </div>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>

      <AnimatePresence>
        {isMoreOpen && (
          <>
            <motion.div
              key="more-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMoreOpen(false)}
            />
            <motion.div
              key="more-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300, mass: 0.8 }}
              className="fixed bottom-0 left-0 right-0 z-[201] rounded-t-3xl bg-[var(--dn-surface-base)] border-t border-[var(--dn-border-strong)]/10 shadow-2xl"
              style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}
            >
              <div className="flex items-center justify-between px-5 pt-4 pb-1">
                <h2 className="text-sm font-bold">Tiện ích</h2>
                <button
                  onClick={() => setIsMoreOpen(false)}
                  className="p-2 rounded-full hover:bg-[var(--dn-surface-muted)] transition-colors"
                  aria-label="Đóng"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 px-4 py-3">
                {MORE_ITEMS.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMoreOpen(false)}
                      className={`flex flex-col items-center gap-2 py-4 px-2 rounded-2xl transition-all duration-200 ${
                        isActive
                          ? 'text-[var(--dn-border-strong)] bg-[var(--dn-border-strong)]/8'
                          : 'text-[var(--dn-text-secondary)] hover:bg-[var(--dn-surface-muted)] hover:text-[var(--dn-text-primary)]'
                      }`}
                    >
                      <Icon size={24} />
                      <span className="text-xs font-semibold">{item.label}</span>
                    </Link>
                  );
                })}

                {!currentUser && (
                  <button
                    onClick={() => { setIsMoreOpen(false); setIsLoginOpen(true); }}
                    className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl text-[var(--dn-text-secondary)] hover:bg-[var(--dn-surface-muted)] hover:text-[var(--dn-text-primary)] transition-all duration-200"
                  >
                    <LogIn size={24} />
                    <span className="text-xs font-semibold">Đăng nhập</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
