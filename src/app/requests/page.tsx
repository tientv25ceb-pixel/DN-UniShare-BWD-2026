'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useStore } from '@/lib/store';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock, CheckCircle, Package, ArrowRight, MessageCircle } from 'lucide-react';

gsap.registerPlugin(useGSAP);

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending: { label: 'Đang chờ', className: 'bg-amber-100 text-amber-700' },
  accepted: { label: 'Đã duyệt', className: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'Đã từ chối', className: 'bg-red-100 text-red-700' },
  collected: { label: 'Đã nhận', className: 'bg-blue-100 text-blue-700' },
};

function celebrate(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const colors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#a855f7', '#ec4899'];

  for (let i = 0; i < 30; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed; width: 8px; height: 8px; border-radius: 50%;
      background: ${colors[i % colors.length]}; pointer-events: none; z-index: 9999;
      left: ${cx}px; top: ${cy}px;
    `;
    document.body.appendChild(dot);

    gsap.to(dot, {
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      opacity: 0,
      scale: 0,
      duration: 0.8 + Math.random() * 0.6,
      ease: 'power3.out',
      onComplete: () => dot.remove(),
    });
  }
}

export default function RequestsPage() {
  const { currentUser, requests, fetchRequests, updateRequestStatus, startConversation } = useStore();
  const [tab, setTab] = useState<'sent' | 'received'>('received');

  useEffect(() => {
    if (currentUser) fetchRequests()
  }, [currentUser, fetchRequests])

  if (!currentUser) {
    return (
      <main className="min-h-screen flex flex-col pb-safe">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="dn-auth-gate">
            <div className="text-5xl mb-4">🔒</div>
            <h2>Vui lòng đăng nhập</h2>
            <p>Bạn cần đăng nhập để quản lý yêu cầu.</p>
            <Link href="/" className="dn-btn-primary">Về trang chủ</Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const sentRequests = requests.filter(r => r.requesterId === currentUser.id);
  const receivedRequests = requests.filter(r => r.requesterId !== currentUser.id);
  const displayedRequests = tab === 'sent' ? sentRequests : receivedRequests;

  const listRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = listRef.current?.querySelectorAll('.gsap-req-item');
    if (items) {
      gsap.fromTo(items,
        { opacity: 0, y: 30, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, { dependencies: [displayedRequests.length, tab], scope: listRef });

  const handleChat = async (otherUserId: string, otherUserName: string, itemId: string, itemTitle: string) => {
    const convId = await startConversation(otherUserId, otherUserName, itemId, itemTitle);
    window.open(`/chat/${convId}`, '_blank');
  };

  return (
    <main className="min-h-screen flex flex-col pb-safe">
      <Header />
      <div className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Quản lý yêu cầu</h1>
              <p className="text-sm text-[var(--dn-text-secondary)]">Theo dõi và duyệt các yêu cầu nhận đồ</p>
            </div>
          </div>

          <div className="flex gap-1 mb-8 bg-[var(--dn-surface-muted)] p-1 rounded-full w-fit">
            <button
              onClick={() => setTab('received')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${tab === 'received' ? 'bg-[var(--dn-surface-strong)] shadow-sm' : 'hover:text-[var(--dn-text-primary)] text-[var(--dn-text-secondary)]'}`}
            >
              Yêu cầu đến ({receivedRequests.length})
            </button>
            <button
              onClick={() => setTab('sent')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${tab === 'sent' ? 'bg-[var(--dn-surface-strong)] shadow-sm' : 'hover:text-[var(--dn-text-primary)] text-[var(--dn-text-secondary)]'}`}
            >
              Yêu cầu đã gửi ({sentRequests.length})
            </button>
          </div>

          {displayedRequests.length === 0 ? (
            <div className="dn-empty-state">
              <div className="text-5xl mb-4">📋</div>
              <h3>Chưa có yêu cầu nào</h3>
              <p>
                {tab === 'received' ? 'Khi có người yêu cầu nhận đồ của bạn, họ sẽ hiển thị ở đây.' : 'Bạn chưa gửi yêu cầu nhận món đồ nào.'}
              </p>
              <Link href="/items" className="dn-btn-primary inline-flex mt-6">Khám phá món đồ</Link>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div ref={listRef} className="space-y-4">
                {displayedRequests.map((req, idx) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    layout
                    className="gsap-req-item dn-card p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_BADGE[req.status].className}`}>
                            {req.status === 'pending' && <Clock size={12} className="inline mr-1" />}
                            {req.status === 'accepted' && <Check size={12} className="inline mr-1" />}
                            {req.status === 'collected' && <Package size={12} className="inline mr-1" />}
                            {req.status === 'rejected' && <X size={12} className="inline mr-1" />}
                            {STATUS_BADGE[req.status].label}
                          </div>
                          <span className="text-xs text-[var(--dn-text-secondary)]">{new Date(req.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>

                        <Link href={`/detail/${req.itemId}`} className="text-lg font-bold hover:text-[var(--dn-border-strong)] transition-colors mb-1 block">
                          {req.itemTitle}
                        </Link>

                        <p className="text-sm text-[var(--dn-text-secondary)]">
                          {tab === 'received'
                            ? <><span className="font-medium text-[var(--dn-text-primary)]">{req.requesterName}</span> muốn nhận món đồ này</>
                            : <span>Gửi đến <span className="font-medium text-[var(--dn-text-primary)]">{req.posterName}</span></span>
                          }
                        </p>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        {tab === 'received' && req.status === 'pending' && (
                          <>
                            <button
                              onClick={(e) => { celebrate(e.currentTarget); updateRequestStatus(req.id, 'accepted'); }}
                              className="dn-btn text-sm !py-2 bg-green-500 text-white hover:bg-green-600"
                            >
                              <Check size={16} /> Duyệt
                            </button>
                            <button
                              onClick={() => updateRequestStatus(req.id, 'rejected')}
                              className="dn-btn text-sm !py-2 bg-red-100 text-red-600 hover:bg-red-200"
                            >
                              <X size={16} /> Từ chối
                            </button>
                          </>
                        )}
                        {tab === 'received' && req.status === 'accepted' && (
                          <>
                            <button
                              onClick={(e) => { celebrate(e.currentTarget); updateRequestStatus(req.id, 'collected'); }}
                              className="dn-btn text-sm !py-2 bg-blue-500 text-white hover:bg-blue-600"
                            >
                              <Package size={16} /> Xác nhận đã nhận
                            </button>
                            <button
                              onClick={() => handleChat(req.requesterId, req.requesterName, req.itemId, req.itemTitle)}
                              className="dn-btn-icon dn-btn-ghost"
                            >
                              <MessageCircle size={16} />
                            </button>
                          </>
                        )}
                        {tab === 'sent' && req.status === 'pending' && (
                          <span className="text-xs text-[var(--dn-text-secondary)] italic flex items-center">Đang chờ phản hồi</span>
                        )}
                        {tab === 'sent' && req.status === 'accepted' && (
                          <span className="text-xs text-green-600 font-medium flex items-center"><CheckCircle size={16} className="mr-1" /> Đã duyệt</span>
                        )}
                        {req.status === 'collected' && (
                          <span className="text-xs text-blue-600 font-medium flex items-center"><Package size={16} className="mr-1" /> Hoàn tất</span>
                        )}
                        <Link href={`/detail/${req.itemId}`} className="dn-btn-icon dn-btn-ghost">
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
