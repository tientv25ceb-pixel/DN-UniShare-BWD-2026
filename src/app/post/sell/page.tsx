'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useStore } from '@/lib/store';
import { CATEGORY_LABELS, Category, CONDITION_LABELS, Condition, LOCATIONS } from '@/lib/data';
import { uploadImage } from '@/lib/api';
import { Coins, Camera, MapPin, Loader, CheckCircle2, Tag } from 'lucide-react';
import VietMapSelector from '@/components/vietmap-selector';

export default function SellPage() {
  const router = useRouter();
  const addItem = useStore(s => s.addItem);
  const currentUser = useStore(s => s.currentUser);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', price: '',
    category: '' as Category | '', condition: '' as Condition | '',
    location: '', image: '',
  });

  if (!currentUser) return <AuthGate />;

  const isValid = form.title && form.description && form.price && form.category && form.condition && form.location && form.image;

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Ảnh không được quá 5MB'); return; }
    setUploading(true);
    try { const { url } = await uploadImage(file); setForm(p => ({ ...p, image: url })); }
    catch (err: any) { alert(`Upload thất bại: ${err.message}`); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !currentUser) return;
    try {
      const payload = JSON.stringify({
        description: form.description, price: parseFloat(form.price), exchangeType: 'sale',
      });
      await addItem({
        title: form.title,
        description: payload,
        category: form.category as Category,
        condition: form.condition as Condition,
        exchangeType: 'sale',
        location: form.location,
        image: form.image,
      });
      setSubmitted(true);
    } catch { alert('Đăng bài thất bại'); }
  };

  if (submitted) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="dn-card p-10 rounded-2xl max-w-md w-full text-center animate-in">
            <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6 text-amber-600"><CheckCircle2 size={40} /></div>
            <h2 className="text-2xl font-bold mb-3">Đã đăng bán!</h2>
            <p className="text-sm text-[var(--dn-text-secondary)] mb-8">Món đồ của bạn đang được rao bán. Chúc bạn sớm tìm được người mua.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => router.push('/items')} className="dn-btn-primary justify-center w-full py-3">Xem danh sách</button>
              <button onClick={() => { setSubmitted(false); setForm({ title: '', description: '', price: '', category: '', condition: '', location: '', image: '' }); }} className="dn-btn-outline justify-center w-full py-3">Đăng bán món khác</button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <div className="text-center mb-10">
            <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Coins size={32} className="text-amber-400" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--dn-text-primary)] mb-2">Bán đồ</h1>
            <p className="text-sm text-[var(--dn-text-secondary)]">Thanh lý đồ cũ — giá sinh viên thân thiện</p>
          </div>

          <form onSubmit={handleSubmit} className="dn-card p-6 md:p-8 rounded-2xl border border-amber-500/10">
            <div className="mb-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <label className="block text-xs font-semibold text-[var(--dn-text-secondary)] uppercase tracking-wider mb-2">Giá bán *</label>
              <div className="flex items-center gap-2">
                <Tag size={20} className="text-amber-400 shrink-0" />
                <input type="number" required min={0} placeholder="50000" className="w-full text-2xl font-bold bg-transparent border-b-2 border-amber-500/30 focus:border-amber-400 outline-none py-1 text-[var(--dn-text-primary)] placeholder:text-gray-600" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
                <span className="text-sm font-bold text-amber-400 shrink-0">₫</span>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[var(--dn-text-secondary)] uppercase tracking-wider mb-1.5">Tên món đồ *</label>
                <input type="text" required placeholder="VD: Tai nghe Sony WH-1000XM4" className="dn-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--dn-text-secondary)] uppercase tracking-wider mb-1.5">Mô tả *</label>
                <textarea required rows={4} placeholder="Mô tả chi tiết: tình trạng, lý do bán, thời gian sử dụng..." className="dn-input resize-none" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--dn-text-secondary)] uppercase tracking-wider mb-1.5">Danh mục *</label>
                  <select required className="dn-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as Category }))}>
                    <option value="" disabled>Chọn</option>
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--dn-text-secondary)] uppercase tracking-wider mb-1.5">Tình trạng *</label>
                  <select required className="dn-input" value={form.condition} onChange={e => setForm(p => ({ ...p, condition: e.target.value as Condition }))}>
                    <option value="" disabled>Chọn</option>
                    {Object.entries(CONDITION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--dn-text-secondary)] uppercase tracking-wider mb-1.5">Hình ảnh *</label>
                <label className="w-full h-[120px] rounded-xl border-2 border-dashed border-[var(--dn-border-strong)] bg-[var(--dn-surface-muted)] flex flex-col items-center justify-center text-[var(--dn-text-secondary)] cursor-pointer hover:border-amber-400 hover:bg-amber-500/5 transition-colors overflow-hidden">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImage} disabled={uploading} />
                  {uploading ? <Loader size={24} className="animate-spin opacity-50" />
                  : form.image ? <img src={form.image} alt="" className="w-full h-full object-cover" />
                  : <><Camera size={24} className="mb-1.5 opacity-50" /><span className="text-xs">Nhấn để tải ảnh</span></>}
                </label>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--dn-border-strong)] space-y-3">
              <label className="block text-xs font-semibold text-[var(--dn-text-secondary)] uppercase tracking-wider flex items-center gap-1.5"><MapPin size={14} className="text-amber-400" /> Địa điểm gặp mặt *</label>
              <VietMapSelector selectedLocation={form.location} onSelectLocation={(name) => setForm(p => ({ ...p, location: name }))} />
              <select required className="dn-input" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}>
                <option value="" disabled>Chọn từ danh sách</option>
                {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>

            <button type="submit" disabled={!isValid}
              className={`w-full mt-6 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isValid ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] cursor-pointer' : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'}`}>
              <Coins size={16} />
              Đăng tin bán
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function AuthGate() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="dn-auth-gate">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold mb-2">Vui lòng đăng nhập</h2>
          <p className="text-sm text-[var(--dn-text-secondary)] mb-6">Bạn cần đăng nhập để bán đồ.</p>
          <Link href="/" className="dn-btn-primary">Về trang chủ</Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
