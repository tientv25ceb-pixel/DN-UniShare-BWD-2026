'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useStore } from '@/lib/store';
import { CATEGORY_LABELS, Category, CONDITION_LABELS, Condition, LOCATIONS } from '@/lib/data';
import { uploadImage } from '@/lib/api';
import { RefreshCw, Camera, MapPin, Loader, CheckCircle2, ArrowLeftRight } from 'lucide-react';
import VietMapSelector from '@/components/vietmap-selector';

export default function ExchangePage() {
  const router = useRouter();
  const addItem = useStore(s => s.addItem);
  const currentUser = useStore(s => s.currentUser);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', want: '',
    category: '' as Category | '', condition: '' as Condition | '',
    location: '', image: '',
  });

  if (!currentUser) return <AuthGate />;

  const isValid = form.title && form.description && form.want && form.category && form.condition && form.location && form.image;

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
      await addItem({
        title: form.title,
        description: JSON.stringify({ description: form.description, want: form.want, exchangeType: 'traodoi' }),
        category: form.category as Category,
        condition: form.condition as Condition,
        exchangeType: 'traodoi',
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
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6 text-blue-600"><CheckCircle2 size={40} /></div>
            <h2 className="text-2xl font-bold mb-3">Tin trao đổi đã được đăng!</h2>
            <p className="text-sm text-[var(--dn-text-secondary)] mb-8">Chúc bạn sớm tìm được đối tác ưng ý.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => router.push('/items')} className="dn-btn-primary justify-center w-full py-3">Xem danh sách</button>
              <button onClick={() => { setSubmitted(false); setForm({ title: '', description: '', want: '', category: '', condition: '', location: '', image: '' }); }} className="dn-btn-outline justify-center w-full py-3">Đăng tin khác</button>
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
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-10">
            <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <RefreshCw size={32} className="text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--dn-text-primary)] mb-2">Trao đổi</h1>
            <p className="text-sm text-[var(--dn-text-secondary)]">Bạn có gì — bạn cần gì? Cùng nhau đổi đồ nhé!</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="dn-card p-5 rounded-2xl border border-blue-500/10 bg-blue-500/[0.02]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <ArrowLeftRight size={16} className="text-blue-400" />
                  </div>
                  <span className="text-sm font-bold text-blue-400">Mình có</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--dn-text-secondary)] mb-1">Món đồ *</label>
                    <input type="text" required placeholder="VD: Bàn phím cơ Keychron" className="dn-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--dn-text-secondary)] mb-1">Mô tả *</label>
                    <textarea required rows={3} placeholder="Tình trạng, màu sắc, phụ kiện kèm theo..." className="dn-input resize-none" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--dn-text-secondary)] mb-1">Danh mục *</label>
                      <select required className="dn-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as Category }))}>
                        <option value="" disabled>Chọn</option>
                        {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--dn-text-secondary)] mb-1">Tình trạng *</label>
                      <select required className="dn-input" value={form.condition} onChange={e => setForm(p => ({ ...p, condition: e.target.value as Condition }))}>
                        <option value="" disabled>Chọn</option>
                        {Object.entries(CONDITION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--dn-text-secondary)] mb-1">Ảnh *</label>
                    <label className="w-full h-[100px] rounded-xl border-2 border-dashed border-[var(--dn-border-strong)] bg-transparent flex flex-col items-center justify-center text-[var(--dn-text-secondary)] cursor-pointer hover:border-blue-400 hover:bg-blue-500/5 transition-colors overflow-hidden">
                      <input type="file" accept="image/*" className="hidden" onChange={handleImage} disabled={uploading} />
                      {uploading ? <Loader size={20} className="animate-spin opacity-50" />
                      : form.image ? <img src={form.image} alt="" className="w-full h-full object-cover" />
                      : <><Camera size={20} className="mb-1 opacity-50" /><span className="text-xs">Tải ảnh</span></>}
                    </label>
                  </div>
                </div>
              </div>

              <div className="dn-card p-5 rounded-2xl border border-blue-500/10 bg-blue-500/[0.02]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <RefreshCw size={16} className="text-blue-400" />
                  </div>
                  <span className="text-sm font-bold text-blue-400">Mình muốn</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--dn-text-secondary)] mb-1">Món đồ muốn đổi *</label>
                    <input type="text" required placeholder="VD: USB hub, sách giáo trình..." className="dn-input" value={form.want} onChange={e => setForm(p => ({ ...p, want: e.target.value }))} />
                  </div>
                  <div className="pt-20">
                    <div className="rounded-xl border border-dashed border-blue-500/20 bg-blue-500/[0.03] p-6 text-center">
                      <p className="text-xs text-[var(--dn-text-secondary)]">Gợi ý: bạn có thể ghi rõ tình trạng mong muốn hoặc giá trị tương đương</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="dn-card p-5 rounded-2xl border border-[var(--dn-border-strong)] mb-6">
              <label className="block text-xs font-semibold text-[var(--dn-text-secondary)] uppercase tracking-wider mb-3 flex items-center gap-1.5"><MapPin size={14} className="text-blue-400" /> Địa điểm hẹn gặp *</label>
              <VietMapSelector selectedLocation={form.location} onSelectLocation={(name) => setForm(p => ({ ...p, location: name }))} />
              <select required className="dn-input mt-3" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}>
                <option value="" disabled>Chọn từ danh sách</option>
                {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>

            <button type="submit" disabled={!isValid}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isValid ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] cursor-pointer' : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'}`}>
              <RefreshCw size={16} />
              Đăng tin trao đổi
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
          <p className="text-sm text-[var(--dn-text-secondary)] mb-6">Bạn cần đăng nhập để trao đổi đồ.</p>
          <Link href="/" className="dn-btn-primary">Về trang chủ</Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
