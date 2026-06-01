'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useStore } from '@/lib/store';
import { CATEGORY_LABELS, Category, CONDITION_LABELS, Condition, LOCATIONS } from '@/lib/data';
import { uploadImage } from '@/lib/api';
import { Search, Camera, MapPin, Loader, CheckCircle2, Phone, Calendar, AlertTriangle } from 'lucide-react';
import VietMapSelector from '@/components/vietmap-selector';

export default function LostPage() {
  const router = useRouter();
  const addItem = useStore(s => s.addItem);
  const currentUser = useStore(s => s.currentUser);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', lostDate: '', contactPhone: '', reward: '',
    location: '', image: '',
  });

  if (!currentUser) return <AuthGate />;

  const isValid = form.title && form.description && form.lostDate && form.contactPhone && form.location;

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
        description: JSON.stringify({
          description: form.description, exchangeType: 'lost',
          lostDate: form.lostDate, contactPhone: form.contactPhone,
          reward: form.reward || undefined,
        }),
        category: 'khac' as Category,
        condition: 'kha' as Condition,
        exchangeType: 'mienphi',
        location: form.location,
        image: form.image || '',
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
            <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6 text-red-600"><CheckCircle2 size={40} /></div>
            <h2 className="text-2xl font-bold mb-3">Đã đăng tin thất lạc!</h2>
            <p className="text-sm text-[var(--muted-foreground)] mb-8">Cộng đồng sẽ giúp bạn tìm lại món đồ. Hy vọng bạn sớm nhận được tin tốt.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => router.push('/items')} className="btn-primary justify-center w-full py-3">Xem danh sách</button>
              <button onClick={() => { setSubmitted(false); setForm({ title: '', description: '', lostDate: '', contactPhone: '', reward: '', location: '', image: '' }); }} className="btn-outline justify-center w-full py-3">Đăng tin khác</button>
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
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-red-500/3 blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 max-w-2xl relative">
          <div className="flex items-start gap-4 mb-10 p-4 rounded-2xl border border-red-500/15 bg-red-500/[0.03]">
            <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">Báo tin thất lạc</h1>
              <p className="text-sm text-[var(--muted-foreground)]">Đừng lo! Hãy cung cấp thông tin chi tiết, cộng đồng sẽ giúp bạn tìm lại.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Món đồ bị mất / Tiêu đề *</label>
              <input type="text" required placeholder="VD: Ví da màu đen, Balo Laptop..." className="input-field border-red-500/20 focus:border-red-400" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Mô tả nhận dạng *</label>
              <textarea required rows={4} placeholder="Màu sắc, thương hiệu, vật dụng bên trong, dấu hiệu nhận biết..." className="input-field resize-none border-red-500/20 focus:border-red-400" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Calendar size={14} className="text-red-400" /> Thời gian mất *</label>
                <input type="text" required placeholder="VD: Tối ngày 30/05, khoảng 7h" className="input-field" value={form.lostDate} onChange={e => setForm(p => ({ ...p, lostDate: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Phone size={14} className="text-red-400" /> Số điện thoại *</label>
                <input type="tel" required placeholder="VD: 0987xxxxxx" className="input-field" value={form.contactPhone} onChange={e => setForm(p => ({ ...p, contactPhone: e.target.value }))} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Hậu tạ / Phần thưởng</label>
              <input type="text" placeholder="VD: Xin hậu tạ 100.000đ hoặc cốc trà sữa" className="input-field" value={form.reward} onChange={e => setForm(p => ({ ...p, reward: e.target.value }))} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Hình ảnh (nếu có)</label>
              <label className="w-full h-[100px] rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--card)] flex flex-col items-center justify-center text-[var(--muted-foreground)] cursor-pointer hover:border-red-400 hover:bg-red-500/5 transition-colors overflow-hidden">
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} disabled={uploading} />
                {uploading ? <Loader size={20} className="animate-spin opacity-50" />
                : form.image ? <img src={form.image} alt="" className="w-full h-full object-cover" />
                : <><Camera size={20} className="mb-1 opacity-50" /><span className="text-xs">Thêm ảnh (không bắt buộc)</span></>}
              </label>
            </div>

            <div className="space-y-3 pt-2 border-t border-[var(--border)]">
              <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-1.5"><MapPin size={14} className="text-red-400" /> Nơi có khả năng đánh rơi *</label>
              <VietMapSelector selectedLocation={form.location} onSelectLocation={(name) => setForm(p => ({ ...p, location: name }))} />
              <select required className="input-field" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}>
                <option value="" disabled>Chọn từ danh sách</option>
                {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>

            <button type="submit" disabled={!isValid}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isValid ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:scale-[1.02] cursor-pointer' : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'}`}>
              <Search size={16} />
              Báo tin thất lạc
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
          <p className="text-sm text-[var(--muted-foreground)] mb-6">Bạn cần đăng nhập để báo tin thất lạc.</p>
          <Link href="/" className="btn-primary">Về trang chủ</Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
