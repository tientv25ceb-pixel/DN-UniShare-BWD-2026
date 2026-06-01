'use client';

import { use, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useStore } from '@/lib/store';
import { useRealtimeMessages } from '@/lib/realtime';
import { ArrowLeft, Send } from 'lucide-react';

export default function ChatRoom({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { currentUser, conversations, messages, fetchConversations, fetchMessages, sendMessage } = useStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useRealtimeMessages(id)

  useEffect(() => {
    fetchConversations()
    fetchMessages(id)
  }, [id])

  const convMessages = messages[id] || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convMessages.length]);

  if (!currentUser) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="auth-gate">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-xl font-bold mb-2">Vui lòng đăng nhập</h2>
            <Link href="/" className="btn-primary mt-6 inline-flex">Về trang chủ</Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const conversation = conversations.find(c => c.id === id);
  const otherName = conversation?.participantNames.find(n => n !== currentUser.name) || 'Người dùng';
  const isMyMessage = (senderId: string) => senderId === currentUser.id;

  if (!conversation) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-5xl mb-4">😢</div>
            <h2 className="text-xl font-bold mb-4">Không tìm thấy hội thoại</h2>
            <Link href="/chat" className="btn-primary inline-flex"><ArrowLeft size={18} /> Quay lại tin nhắn</Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(id, input.trim());
    setInput('');
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          {/* Chat header */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => router.push('/chat')} className="p-2 rounded-xl hover:bg-[var(--secondary)] transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="h-10 w-10 rounded-full bg-[color-mix(in_oklch,_var(--primary)_10%,_transparent)] flex items-center justify-center font-bold text-[var(--primary)]">
              {otherName.charAt(0)}
            </div>
            <div>
              <p className="font-bold">{otherName}</p>
              <p className="text-xs text-[var(--muted-foreground)]">
                Về: <Link href={`/detail/${conversation.itemId}`} className="text-[var(--primary)] hover:underline">{conversation.itemTitle}</Link>
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="card rounded-2xl p-6 min-h-[400px] max-h-[500px] overflow-y-auto flex flex-col gap-3 mb-4">
            {convMessages.length === 0 && (
              <div className="flex-grow flex items-center justify-center text-center">
                <div>
                  <div className="text-4xl mb-3">💬</div>
                  <p className="text-sm text-[var(--muted-foreground)]">Bắt đầu cuộc trò chuyện với {otherName}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Hãy gửi lời chào và thống nhất thời gian, địa điểm nhé!</p>
                </div>
              </div>
            )}
            {convMessages.map(msg => (
              <div key={msg.id} className={`flex ${isMyMessage(msg.senderId) ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMyMessage(msg.senderId)
                    ? 'bg-[var(--primary)] text-white rounded-br-lg'
                    : 'bg-[var(--secondary)] text-[var(--foreground)] rounded-bl-lg'
                }`}>
                  {msg.text}
                  <div className={`text-[10px] mt-1 ${isMyMessage(msg.senderId) ? 'text-white/60 text-right' : 'text-[var(--muted-foreground)]'}`}>
                    {formatTime(msg.createdAt)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-grow px-5 py-3 rounded-full border border-[var(--border)] bg-white text-sm focus:ring-2 focus:ring-[color-mix(in_oklch,_var(--primary)_30%,_transparent)] outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="h-12 w-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center hover:brightness-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
}
