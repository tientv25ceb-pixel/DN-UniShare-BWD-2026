'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useStore } from '@/lib/store';
import { CATEGORY_LABELS, Category, CONDITION_LABELS, Condition, LOCATIONS } from '@/lib/data';
import { uploadImage } from '@/lib/api';
import { Gift, Camera, MapPin, Loader, CheckCircle2 } from 'lucide-react';
import VietMapSelector from '@/components/vietmap-selector';

export default function GivePage() {
  const router = useRouter();
  const addItem = useStore(s => s.addItem);
  const currentUser = useStore(s => s.currentUser);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: '' as Category | '',
    condition: '' as Condition | '', location: '', image: '',
  });

  if (!currentUser) return <AuthGate />;

  const isValid = form.title && form.description && form.category && form.condition && form.location && form.image;

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Ảnh không được quá 5MB'); return; }
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      setForm(p => ({ ...p, image: url }));
    } catch (err: any) { alert(`Upload thất bại: ${err.message}`); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !currentUser) return;
    try {
      await addItem({
        title: form.title,
        description: JSON.stringify({ description: form.description, exchangeType: 'mienphi' }),
        category: form.category as Category,
        condition: form.condition as Condition,
        exchangeType: 'mienphi',
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
          <div className="card p-10 rounded-2xl max-w-md w-full text-center animate-in">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 text-green-600"><CheckCircle2 size={40} /></div>
            <h2 className="text-2xl font-bold mb-3">Cảm ơn bạn!</h2>
            <p className="text-sm text-[var(--muted-foreground)] mb-8">Món đồ của bạn đang chờ chủ mới. Một hành động nhỏ, một niềm vui lớn.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => router.push('/items')} className="btn-primary justify-center w-full py-3">Xem danh sách</button>
              <button onClick={() => { setSubmitted(false); setForm({ title: '', description: '', category: '', condition: '', location: '', image: '' }); }} className="btn-outline justify-center w-full py-3">Tặng thêm món khác</button>
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
      <div className="flex-grow pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-green-500/3 blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 max-w-2xl relative">
          <div className="text-center mb-10">
            <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <Gift size={32} className="text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Tặng đồ</h1>
            <p className="text-sm text-[var(--muted-foreground)]">Cho đi những món đồ còn tốt — niềm vui sẽ nhân đôi</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Tên món đồ *</label>
              <input type="text" required placeholder="VD: Giáo trình Giải tích 1" className="input-field" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Mô tả *</label>
              <textarea required rows={4} placeholder="Tình trạng thế nào? Tại sao bạn muốn tặng?..." className="input-field resize-none" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Danh mục *</label>
                <select required className="input-field" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as Category }))}>
                  <option value="" disabled>Chọn danh mục</option>
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Tình trạng *</label>
                <select required className="input-field" value={form.condition} onChange={e => setForm(p => ({ ...p, condition: e.target.value as Condition }))}>
                  <option value="" disabled>Chọn tình trạng</option>
                  {Object.entries(CONDITION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Hình ảnh *</label>
              <label className="w-full h-[120px] rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--card)] flex flex-col items-center justify-center text-[var(--muted-foreground)] cursor-pointer hover:border-green-400 hover:bg-green-500/5 transition-colors overflow-hidden">
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} disabled={uploading} />
                {uploading ? <Loader size={24} className="animate-spin opacity-50" />
                : form.image ? <img src={form.image} alt="" className="w-full h-full object-cover" />
                : <><Camera size={24} className="mb-1.5 opacity-50" /><span className="text-xs">Nhấn để tải ảnh</span></>}
              </label>
            </div>

            <div className="space-y-3 pt-2 border-t border-[var(--border)]">
              <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-1.5"><MapPin size={14} className="text-green-400" /> Địa điểm hẹn gặp *</label>
              <VietMapSelector selectedLocation={form.location} onSelectLocation={(name) => setForm(p => ({ ...p, location: name }))} />
              <select required className="input-field" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}>
                <option value="" disabled>Hoặc chọn từ danh sách</option>
                {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>

            <button type="submit" disabled={!isValid}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isValid ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30 hover:scale-[1.02] cursor-pointer' : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'}`}>
              <Gift size={16} />
              Đăng tin tặng đồ
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
        <div className="auth-gate">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold mb-2">Vui lòng đăng nhập</h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-6">Bạn cần đăng nhập để tặng đồ.</p>
          <Link href="/" className="btn-primary">Về trang chủ</Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
