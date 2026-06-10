'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useStore } from '@/lib/store';
import { MessageCircle, ArrowRight, Clock } from 'lucide-react';

export default function ChatListPage() {
  const { currentUser, conversations, items, fetchConversations, fetchItems } = useStore();

  useEffect(() => {
    fetchConversations()
    fetchItems()
  }, [])

  if (!currentUser) {
    return (
      <main className="min-h-screen flex flex-col pb-safe">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="auth-gate">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-xl font-bold mb-2">Vui lòng đăng nhập</h2>
            <p className="text-sm text-[var(--muted-foreground)] mb-6">Bạn cần đăng nhập để xem tin nhắn.</p>
            <Link href="/" className="btn-primary">Về trang chủ</Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const myConversations = conversations.filter(c => c.participantIds.includes(currentUser.id));

  return (
    <main className="min-h-screen flex flex-col pb-safe">
      <Header />
      <div className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <MessageCircle size={28} className="text-[var(--primary)]" /> Tin nhắn
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">Trao đổi với người đăng về món đồ</p>
          </div>

          {myConversations.length === 0 ? (
            <div className="empty-state">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">Chưa có tin nhắn</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-5">Khi bạn nhắn tin với người đăng món đồ, hội thoại sẽ hiển thị ở đây.</p>
              <Link href="/items" className="btn-primary">Khám phá món đồ</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {myConversations.map(conv => {
                const otherName = conv.participantNames.find(n => n !== currentUser.name) || '';
                const relatedItem = items.find(i => i.id === conv.itemId);
                return (
                  <Link
                    key={conv.id}
                    href={`/chat/${conv.id}`}
                    className="card rounded-2xl p-5 flex items-center gap-4 hover:translate-y-0"
                  >
                    <div className="h-12 w-12 rounded-full bg-[color-mix(in_oklch,_var(--primary)_10%,_transparent)] flex items-center justify-center font-bold text-[var(--primary)] shrink-0">
                      {otherName.charAt(0)}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm">{otherName}</span>
                        {conv.lastMessageTime && (
                          <span className="text-xs text-[var(--muted-foreground)]">
                            {new Date(conv.lastMessageTime).toLocaleDateString('vi-VN')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)] truncate">
                        {conv.itemTitle && <>Về: <span className="font-medium text-[var(--foreground)]">{conv.itemTitle}</span> • </>}
                        {conv.lastMessage || 'Nhắn tin...'}
                      </p>
                    </div>
                    {conv.unread > 0 && (
                      <div className="h-6 w-6 rounded-full bg-[var(--primary)] text-white text-xs font-bold flex items-center justify-center">
                        {conv.unread}
                      </div>
                    )}
                    <ArrowRight size={18} className="text-[var(--muted-foreground)] shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
