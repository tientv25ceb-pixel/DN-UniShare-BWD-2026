'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useStore } from '@/lib/store';
import { Gift, Heart, ClipboardList, Mail, Building2, Calendar, ArrowRight, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, items, requests, fetchItems, fetchRequests, deleteItem } = useStore();

  useEffect(() => {
    fetchItems()
    if (currentUser) fetchRequests()
  }, [currentUser, fetchItems, fetchRequests])

  if (!currentUser) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="auth-gate">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-xl font-bold mb-2">Vui lòng đăng nhập</h2>
            <p className="text-sm text-[var(--muted-foreground)] mb-6">Bạn cần đăng nhập để xem trang cá nhân.</p>
            <Link href="/" className="btn-primary">Về trang chủ</Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const myItems = items.filter(i => i.postedBy === currentUser.name);

  const handleDelete = async (itemId: string, itemTitle: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa "${itemTitle}"?`)) return;
    try {
      await deleteItem(itemId);
    } catch { alert('Xóa thất bại'); }
  };
  const sentRequests = requests.filter(r => r.requesterId === currentUser.id);
  const receivedRequests = requests.filter(r => r.requesterId !== currentUser.id);
  const acceptedRequests = [...sentRequests, ...receivedRequests].filter(r => r.status === 'accepted' || r.status === 'collected');
  const myFavorites = items.filter(i => useStore.getState().favorites.includes(i.id));

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <Header />
      <div className="flex-grow pt-28 pb-16 relative z-10">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="card rounded-2xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="h-24 w-24 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow-lg">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-center md:text-left flex-grow">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{currentUser.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-[var(--muted-foreground)]">
                  <span className="flex items-center gap-1.5"><Mail size={14} /> {currentUser.email}</span>
                  <span className="flex items-center gap-1.5"><Building2 size={14} /> {currentUser.faculty}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> Tham gia từ 2025</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/post" className="btn-primary text-sm">Đăng món đồ</Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card rounded-2xl p-5 text-center hover:translate-y-0">
              <div className="text-3xl font-bold text-[var(--primary)] mb-1">{myItems.length}</div>
              <div className="text-xs text-[var(--muted-foreground)]">Món đã đăng</div>
            </div>
            <div className="card rounded-2xl p-5 text-center hover:translate-y-0">
              <div className="text-3xl font-bold text-green-600 mb-1">{acceptedRequests.length}</div>
              <div className="text-xs text-[var(--muted-foreground)]">Đã trao đổi</div>
            </div>
            <div className="card rounded-2xl p-5 text-center hover:translate-y-0">
              <div className="text-3xl font-bold text-amber-600 mb-1">{myFavorites.length}</div>
              <div className="text-xs text-[var(--muted-foreground)]">Yêu thích</div>
            </div>
            <div className="card rounded-2xl p-5 text-center hover:translate-y-0">
              <div className="text-3xl font-bold text-rose-600 mb-1">{sentRequests.length}</div>
              <div className="text-xs text-[var(--muted-foreground)]">Yêu cầu đã gửi</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold flex items-center gap-2"><Gift size={18} className="text-[var(--primary)]" /> Món đồ đã đăng</h2>
                {myItems.length > 3 && <Link href="/items" className="text-xs text-[var(--primary)] font-medium">Xem tất cả →</Link>}
              </div>
              {myItems.length > 0 ? (
                <div className="space-y-3">
                    {myItems.slice(0, 4).map(item => (
                    <div key={item.id} className="group flex items-center gap-2 p-2 rounded-xl hover:bg-[var(--secondary)] transition-colors">
                      <Link href={`/detail/${item.id}`} className="flex items-center gap-3 flex-grow min-w-0">
                        <div className="h-12 w-12 rounded-lg bg-[var(--secondary)] overflow-hidden shrink-0">
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">{item.requestedCount} lượt yêu cầu</p>
                        </div>
                      </Link>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={() => router.push(`/edit/${item.id}`)}
                          className="h-8 w-8 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center transition-colors"
                          aria-label="Sửa"
                        >
                          <Pencil size={14} className="text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="h-8 w-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                          aria-label="Xóa"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">📦</div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-3">Bạn chưa đăng món đồ nào</p>
                  <Link href="/post" className="btn-primary text-xs">Đăng ngay</Link>
                </div>
              )}
            </div>

            <div className="card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold flex items-center gap-2"><ClipboardList size={18} className="text-[var(--primary)]" /> Yêu cầu gần đây</h2>
                <Link href="/requests" className="text-xs text-[var(--primary)] font-medium">Xem tất cả →</Link>
              </div>
              {sentRequests.length > 0 ? (
                <div className="space-y-3">
                  {sentRequests.slice(0, 4).map(req => (
                    <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--secondary)]">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        req.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        req.status === 'collected' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {req.status === 'accepted' ? '✓' : req.status === 'rejected' ? '✗' : req.status === 'collected' ? '✓' : '?'}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-medium truncate">{req.itemTitle}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {req.status === 'pending' ? 'Đang chờ duyệt' :
                           req.status === 'accepted' ? 'Đã được duyệt' :
                           req.status === 'rejected' ? 'Đã từ chối' : 'Đã nhận'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">📋</div>
                  <p className="text-sm text-[var(--muted-foreground)]">Chưa có yêu cầu nào</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
