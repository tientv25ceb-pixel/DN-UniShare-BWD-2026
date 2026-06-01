'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Share2, Menu, X, User, LogOut, Heart, MessageCircle, ClipboardList, LogIn, Gift, RefreshCw, Coins, Search as SearchIcon, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import LoginModal from '@/components/auth/login-modal';
import PostDropdown from '@/components/layout/post-dropdown';
import { AnimatePresence, motion } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Tìm đồ', href: '/items' },
  { label: 'Radar Quét', href: '/radar' },
  { label: 'Tác động', href: '/impact' },
];

const POST_ACTIONS = [
  { type: 'mienphi', label: 'Tặng đồ', desc: 'Cho đi những món đồ còn tốt', icon: Gift, href: '/post/give', color: 'text-green-400', bg: 'hover:bg-green-500/8' },
  { type: 'traodoi', label: 'Trao đổi', desc: 'Đổi đồ với sinh viên khác', icon: RefreshCw, href: '/post/exchange', color: 'text-blue-400', bg: 'hover:bg-blue-500/8' },
  { type: 'sale', label: 'Bán đồ', desc: 'Thanh lý giá sinh viên', icon: Coins, href: '/post/sell', color: 'text-amber-400', bg: 'hover:bg-amber-500/8' },
  { type: 'lost', label: 'Tìm đồ', desc: 'Báo tin thất lạc trong làng ĐH', icon: SearchIcon, href: '/post/lost', color: 'text-red-400', bg: 'hover:bg-red-500/8' },
  { type: 'found', label: 'Nhặt được đồ', desc: 'Đăng tin tìm chủ cho vật phẩm', icon: Heart, href: '/post/found', color: 'text-cyan-400', bg: 'hover:bg-cyan-500/8' },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const currentUser = useStore(s => s.currentUser);
  const logout = useStore(s => s.logout);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
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

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-2.5 glass-premium shadow-lg' : 'py-4 bg-transparent'
      }`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <div className="h-10 md:h-12 w-auto relative transition-all duration-300 group-hover:scale-[1.02]">
              <Image
                src="/logo.png"
                alt="ĐN-UniShare Logo"
                width={200}
                height={48}
                className="h-full w-auto object-contain rounded-xl"
                priority
              />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item, idx) => (
              <div key={item.href} className="contents">
                {idx === 2 && <PostDropdown />}
                <Link
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/25'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] hover:shadow-sm'
                  }`}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[var(--secondary)] transition-colors"
                  aria-label="Menu người dùng"
                >
                  <div className="h-8 w-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-sm font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate">{currentUser.name}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 glass-premium rounded-2xl shadow-2xl py-2 animate-in">
                    <div className="px-4 py-3 border-b border-[var(--border)]">
                      <p className="font-bold text-sm">{currentUser.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)] truncate">{currentUser.email}</p>
                    </div>
                    <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--secondary)] transition-colors">
                      <User size={16} /> Trang cá nhân
                    </Link>
                    <Link href="/requests" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--secondary)] transition-colors">
                      <ClipboardList size={16} /> Yêu cầu
                    </Link>
                    <Link href="/favorites" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--secondary)] transition-colors">
                      <Heart size={16} /> Yêu thích
                    </Link>
                    <Link href="/chat" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--secondary)] transition-colors">
                      <MessageCircle size={16} /> Tin nhắn
                    </Link>
                    <div className="border-t border-[var(--border)] mt-1 pt-1">
                      <button onClick={() => { logout(); setIsProfileOpen(false); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full">
                        <LogOut size={16} /> Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="btn-outline text-sm">
                <LogIn size={14} /> Đăng nhập
              </button>
            )}
            <Link href="/post" className="btn-primary text-sm">
              <Share2 size={14} />
              Đăng
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden glass-premium border-t border-white/30 shadow-2xl animate-in">
            <nav className="flex flex-col p-4 gap-1">
              {currentUser && (
                <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] mb-2">
                  <div className="h-10 w-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{currentUser.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{currentUser.faculty}</p>
                  </div>
                </div>
              )}
              {NAV_ITEMS.map((item, idx) => (
                <div key={item.href}>
                  {idx === 2 ? (
                    <div>
                      <button
                        onClick={() => setIsPostOpen(!isPostOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--secondary)]"
                      >
                        <span>Đăng</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-300 ${isPostOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      <AnimatePresence>
                        {isPostOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pr-2 pb-2 flex flex-col gap-0.5">
                              {POST_ACTIONS.map(action => (
                                <Link
                                  key={action.type}
                                  href={action.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${action.bg}`}
                                >
                                  <action.icon size={16} className={action.color} />
                                  <div>
                                    <p className="text-sm font-medium">{action.label}</p>
                                    <p className="text-[11px] text-[var(--muted-foreground)]">{action.desc}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'bg-[var(--primary)] text-white'
                          : 'hover:bg-[var(--secondary)]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              {currentUser && (
                <>
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-[var(--secondary)] flex items-center gap-2">
                    <User size={16} /> Trang cá nhân
                  </Link>
                  <Link href="/requests" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-[var(--secondary)] flex items-center gap-2">
                    <ClipboardList size={16} /> Yêu cầu
                  </Link>
                  <Link href="/favorites" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-[var(--secondary)] flex items-center gap-2">
                    <Heart size={16} /> Yêu thích
                  </Link>
                  <Link href="/chat" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-[var(--secondary)] flex items-center gap-2">
                    <MessageCircle size={16} /> Tin nhắn
                  </Link>
                </>
              )}
              {currentUser ? (
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="mt-2 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 flex items-center gap-2">
                  <LogOut size={16} /> Đăng xuất
                </button>
              ) : (
                <button onClick={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }} className="mt-2 btn-outline justify-center">
                  <LogIn size={16} /> Đăng nhập
                </button>
              )}
              <Link
                href="/post"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-2 btn-primary justify-center"
              >
                <Share2 size={16} />
                Đăng
              </Link>
            </nav>
          </div>
        )}
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
