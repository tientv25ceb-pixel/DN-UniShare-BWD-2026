'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ItemCard from '@/components/ui/item-card';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';

export default function FavoritesPage() {
  const { items, favorites, currentUser } = useStore();

  if (!currentUser) {
    return (
      <main className="min-h-screen flex flex-col pb-safe">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="dn-auth-gate">
            <div className="text-5xl mb-4">🔒</div>
            <h2>Vui lòng đăng nhập</h2>
            <p>Bạn cần đăng nhập để xem danh sách yêu thích.</p>
            <Link href="/" className="dn-btn-primary">Về trang chủ</Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const favoriteItems = items.filter(i => favorites.includes(i.id));

  return (
    <main className="min-h-screen flex flex-col pb-safe">
      <Header />
      <div className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <Link href="/items" className="inline-flex items-center gap-1.5 text-sm text-[var(--dn-text-secondary)] hover:text-[var(--dn-text-primary)] font-medium mb-4 transition-colors">
              <ArrowLeft size={16} /> Quay lại khám phá
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Heart size={28} className="text-red-500" /> Món đồ yêu thích
            </h1>
            <p className="text-sm text-[var(--dn-text-secondary)] mt-1">Những món đồ bạn đã lưu lại</p>
          </div>

          {favoriteItems.length > 0 ? (
            <div className="dn-grid">
              {favoriteItems.map((item, idx) => (
                <ItemCard key={item.id} item={item} idx={idx} />
              ))}
            </div>
          ) : (
            <div className="dn-empty-state">
              <div className="text-5xl mb-4">💔</div>
              <h3>Chưa có món đồ yêu thích</h3>
              <p>Nhấn vào trái tim trên món đồ để lưu lại.</p>
              <Link href="/items" className="dn-btn-primary">Khám phá món đồ</Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
