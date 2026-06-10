'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Share2, User, LogOut, Heart, MessageCircle, ClipboardList, LogIn, Menu, X, Home, Compass, Radio, Leaf } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import LoginModal from '@/components/auth/login-modal';
import { AnimatePresence, motion } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Trang chủ', href: '/', icon: Home },
  { label: 'Khám phá', href: '/items', icon: Compass },
  { label: 'Radar', href: '/radar', icon: Radio },
  { label: 'Tác động', href: '/impact', icon: Leaf },
  { label: 'Yêu thích', href: '/favorites', icon: Heart },
  { label: 'Tin nhắn', href: '/chat', icon: MessageCircle },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const currentUser = useStore(s => s.currentUser);
  const logout = useStore(s => s.logout);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div className={`flex items-center gap-1 px-2 py-1.5 rounded-2xl bg-[var(--dn-surface)]/70 backdrop-blur-2xl border border-[var(--dn-border)] shadow-2xl transition-all duration-500 ${isScrolled ? 'shadow-lg bg-[var(--dn-surface)]/85' : ''}`}>
          <Link href="/" className="flex items-center gap-2 px-3 py-1 mr-1 shrink-0">
            <Image
              src="/logo.png"
              alt="ĐN-UniShare Logo"
              width={120}
              height={32}
              className="h-7 w-auto object-contain rounded-lg"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[var(--dn-accent-soft)] text-[var(--dn-accent)]'
                      : 'text-[var(--dn-text-secondary)] hover:text-[var(--dn-text-primary)] hover:bg-[var(--dn-surface-elevated)]'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-[var(--dn-accent)]' : ''} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 ml-1">
            {currentUser ? (
              <div className="relative hidden md:block" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-[var(--dn-surface-elevated)] transition-colors"
                  aria-label="Menu người dùng"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                >
                  <div className="h-7 w-7 rounded-full bg-[var(--dn-accent)] ring-2 ring-[var(--dn-accent-glow)] flex items-center justify-center text-white text-xs font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium max-w-[80px] truncate hidden lg:block">{currentUser.name}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 py-2 backdrop-blur-2xl bg-[var(--dn-surface)]/90 border border-[var(--dn-border)] shadow-2xl rounded-2xl">
                    <div className="px-4 py-3 border-b border-[var(--dn-border)]">
                      <p className="font-semibold text-sm">{currentUser.name}</p>
                      <p className="text-xs text-[var(--dn-text-secondary)] truncate">{currentUser.email}</p>
                    </div>
                    <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--dn-surface-elevated)] transition-colors rounded-xl mx-1">
                      <User size={16} /> Trang cá nhân
                    </Link>
                    <Link href="/requests" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--dn-surface-elevated)] transition-colors rounded-xl mx-1">
                      <ClipboardList size={16} /> Yêu cầu
                    </Link>
                    <Link href="/favorites" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--dn-surface-elevated)] transition-colors rounded-xl mx-1">
                      <Heart size={16} /> Yêu thích
                    </Link>
                    <Link href="/chat" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--dn-surface-elevated)] transition-colors rounded-xl mx-1">
                      <MessageCircle size={16} /> Tin nhắn
                    </Link>
                    <div className="border-t border-[var(--dn-border)] mt-1 pt-1 mx-2">
                      <button onClick={() => { logout(); setIsProfileOpen(false); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full rounded-xl">
                        <LogOut size={16} /> Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm font-medium text-[var(--dn-text-secondary)] hover:text-[var(--dn-text-primary)] hover:bg-[var(--dn-surface-elevated)] transition-all">
                <LogIn size={15} />
                <span className="hidden lg:inline">Đăng nhập</span>
              </button>
            )}
            <Link href="/post" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium bg-[var(--dn-accent)] text-white hover:brightness-110 transition-all shadow-lg shadow-[var(--dn-accent-glow)]">
              <Share2 size={14} />
              <span className="hidden sm:inline">Đăng</span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-[var(--dn-surface-elevated)] transition-colors"
              aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              key="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-20 left-4 right-4 z-50 md:hidden rounded-2xl bg-[var(--dn-surface)]/95 backdrop-blur-2xl border border-[var(--dn-border)] shadow-2xl overflow-hidden"
            >
              <div className="p-2 space-y-0.5">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-[var(--dn-accent-soft)] text-[var(--dn-accent)]'
                          : 'text-[var(--dn-text-secondary)] hover:text-[var(--dn-text-primary)] hover:bg-[var(--dn-surface-elevated)]'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-[var(--dn-accent)]' : ''} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              <div className="border-t border-[var(--dn-border)] p-2">
                {currentUser ? (
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-3 px-4 py-2.5">
                      <div className="h-8 w-8 rounded-full bg-[var(--dn-accent)] ring-2 ring-[var(--dn-accent-glow)] flex items-center justify-center text-white text-sm font-bold">
                        {currentUser.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{currentUser.name}</p>
                        <p className="text-xs text-[var(--dn-text-secondary)]">{currentUser.email}</p>
                      </div>
                    </div>
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[var(--dn-text-secondary)] hover:text-[var(--dn-text-primary)] hover:bg-[var(--dn-surface-elevated)] transition-all">
                      <User size={18} /> Trang cá nhân
                    </Link>
                    <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 w-full transition-all">
                      <LogOut size={18} /> Đăng xuất
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); setIsLoginOpen(true); }}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[var(--dn-text-secondary)] hover:text-[var(--dn-text-primary)] hover:bg-[var(--dn-surface-elevated)] transition-all w-full"
                  >
                    <LogIn size={18} /> Đăng nhập
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-16 md:hidden" />
      <div className="hidden md:block h-20" />

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
