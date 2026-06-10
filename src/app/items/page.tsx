'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ItemCard from '@/components/ui/item-card';
import { ItemsPageSkeleton } from '@/components/ui/skeleton';
import { useStore } from '@/lib/store';
import { CATEGORY_LABELS, Category, CONDITION_LABELS, Condition } from '@/lib/data';
import { Search, Filter, X, Heart } from 'lucide-react';

function ItemsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, searchQuery, setSearchQuery } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(() => {
    const cat = searchParams.get('category');
    return (cat && Object.keys(CATEGORY_LABELS).includes(cat)) ? cat as Category : 'all';
  });
  const [selectedCondition, setSelectedCondition] = useState<Condition | 'all'>(() => {
    const cond = searchParams.get('condition');
    return (cond && Object.keys(CONDITION_LABELS).includes(cond)) ? cond as Condition : 'all';
  });
  const [showFilters, setShowFilters] = useState(searchParams.toString().length > 0);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const favorites = useStore(s => s.favorites);

  const updateURL = useCallback((cat: string, cond: string) => {
    const params = new URLSearchParams();
    if (cat !== 'all') params.set('category', cat);
    if (cond !== 'all') params.set('condition', cond);
    const qstr = params.toString();
    router.replace(`/items${qstr ? '?' + qstr : ''}`, { scroll: false });
  }, [router]);

  useEffect(() => {
    updateURL(selectedCategory, selectedCondition);
  }, [selectedCategory, selectedCondition, updateURL]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesCondition = selectedCondition === 'all' || item.condition === selectedCondition;
    const matchesFavorite = !showFavoritesOnly || favorites.includes(item.id);
    return matchesSearch && matchesCategory && matchesCondition && matchesFavorite;
  });

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden pb-safe">
      <Header />
      <div className="flex-grow pt-28 pb-16 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Khám phá món đồ</h1>
              <p className="text-sm text-[var(--dn-text-secondary)]">Hàng trăm vật phẩm đang chờ bạn khám phá tại Làng Đại học Đà Nẵng.</p>
            </div>
            <div className="w-full md:w-[380px] flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dn-text-secondary)]" size={18} />
                <input
                  type="text"
                  placeholder="Tìm kiếm sách, đồ dùng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="dn-input pl-10"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`dn-btn-icon dn-btn-ghost ${showFilters ? '!bg-[var(--dn-border-strong)] !text-[var(--dn-text-inverse)]' : ''}`}
                aria-label={showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
              >
                <Filter size={18} />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="dn-card p-6 mb-8 animate-in">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-sm">Bộ lọc tìm kiếm</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${showFavoritesOnly ? 'bg-red-100 text-red-600' : 'text-[var(--dn-text-secondary)] hover:text-[var(--dn-text-primary)]'}`}
                  >
                    <Heart size={14} className={showFavoritesOnly ? 'fill-red-500 text-red-500' : ''} /> Yêu thích
                  </button>
                  <button onClick={() => { setSelectedCategory('all'); setSelectedCondition('all'); setSearchQuery(''); setShowFavoritesOnly(false); }} className="text-xs text-[var(--dn-text-secondary)] hover:text-[var(--dn-border-strong)] flex items-center gap-1">
                    <X size={14} /> Xóa bộ lọc
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-semibold mb-2.5 text-[var(--dn-text-secondary)] uppercase tracking-wider">Danh mục</h4>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSelectedCategory('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === 'all' ? '!bg-[var(--dn-border-strong)] !text-[var(--dn-text-inverse)]' : 'hover:bg-[var(--dn-surface-strong)]'}`}>Tất cả</button>
                    {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === cat ? '!bg-[var(--dn-border-strong)] !text-[var(--dn-text-inverse)]' : 'hover:bg-[var(--dn-surface-strong)]'}`}>{CATEGORY_LABELS[cat]}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold mb-2.5 text-[var(--dn-text-secondary)] uppercase tracking-wider">Tình trạng</h4>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSelectedCondition('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCondition === 'all' ? '!bg-[var(--dn-border-strong)] !text-[var(--dn-text-inverse)]' : 'hover:bg-[var(--dn-surface-strong)]'}`}>Tất cả</button>
                    {(Object.keys(CONDITION_LABELS) as Condition[]).map(cond => (
                      <button key={cond} onClick={() => setSelectedCondition(cond)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCondition === cond ? '!bg-[var(--dn-border-strong)] !text-[var(--dn-text-inverse)]' : 'hover:bg-[var(--dn-surface-strong)]'}`}>{CONDITION_LABELS[cond]}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-sm text-[var(--dn-text-secondary)] mb-6">
            Tìm thấy <span className="font-bold text-[var(--dn-text-primary)]">{filteredItems.length}</span> món đồ
            {showFavoritesOnly && <span className="text-red-500 ml-1">♥ yêu thích</span>}
          </p>

          {filteredItems.length > 0 ? (
            <div className="dn-grid">
              {filteredItems.map((item, idx) => (
                <ItemCard key={item.id} item={item} idx={idx} />
              ))}
            </div>
          ) : (
            <div className="dn-empty-state">
              <div className="text-5xl mb-4">🔍</div>
              <h3>Không tìm thấy món đồ nào</h3>
              <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
              <button onClick={() => { setSelectedCategory('all'); setSelectedCondition('all'); setSearchQuery(''); setShowFavoritesOnly(false); }} className="dn-btn-primary">Xóa tất cả bộ lọc</button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function ItemsPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <ItemsPageSkeleton />
        <Footer />
      </>
    }>
      <ItemsPageContent />
    </Suspense>
  );
}
