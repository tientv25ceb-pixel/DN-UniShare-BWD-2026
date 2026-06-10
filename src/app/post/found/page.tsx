'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useStore } from '@/lib/store';
import { CATEGORY_LABELS, Category, CONDITION_LABELS, Condition, LOCATIONS } from '@/lib/data';
import { uploadImage } from '@/lib/api';
import { Heart, Camera, MapPin, Loader, CheckCircle2, Phone, Calendar } from 'lucide-react';
import VietMapSelector from '@/components/vietmap-selector';

export default function FoundPage() {
  const router = useRouter();
  const addItem = useStore(s => s.addItem);
  const currentUser = useStore(s => s.currentUser);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', foundDate: '', contactPhone: '',
    location: '', image: '',
  });

  if (!currentUser) return <AuthGate />;

  const isValid = form.title && form.description && form.foundDate && form.contactPhone && form.location;

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
          description: form.description, exchangeType: 'found',
          lostDate: form.foundDate, contactPhone: form.contactPhone,
        }),
        category: 'khac' as Category,
        condition: 'kha' as Condition,
        exchangeType: 'found',
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
          <div className="dn-card p-10 rounded-2xl max-w-md w-full text-center animate-in">
            <div className="h-20 w-20 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-6 text-cyan-600"><CheckCircle2 size={40} /></div>
            <h2 className="text-2xl font-bold mb-3">Cảm ơn bạn!</h2>
            <p className="text-sm text-[var(--dn-text-secondary)] mb-8">Hành động tử tế của bạn sẽ giúp món đồ tìm lại chủ nhân.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => router.push('/items')} className="dn-btn-primary justify-center w-full py-3">Xem danh sách</button>
              <button onClick={() => { setSubmitted(false); setForm({ title: '', description: '', foundDate: '', contactPhone: '', location: '', image: '' }); }} className="dn-btn-outline justify-center w-full py-3">Đăng tin khác</button>
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
            <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Heart size={32} className="text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--dn-text-primary)] mb-2">Nhặt được đồ</h1>
            <p className="text-sm text-[var(--dn-text-secondary)]">Một hành động nhỏ — một niềm vui lớn cho người đánh rơi</p>
          </div>

          <form onSubmit={handleSubmit} className="dn-card p-6 md:p-8 rounded-2xl border border-cyan-500/10">
            <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-cyan-500/[0.04] border border-cyan-500/10">
              <Heart size={18} className="text-cyan-400 shrink-0" />
              <p className="text-xs text-[var(--dn-text-secondary)]">Bạn nhặt được đồ và muốn tìm chủ? Hãy điền thông tin bên dưới. Đừng lo — bạn không cần để lại thông tin cá nhân nếu chưa muốn.</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[var(--dn-text-secondary)] uppercase tracking-wider mb-1.5">Món đồ nhặt được *</label>
                <input type="text" required placeholder="VD: Thẻ sinh viên, Ví da, Điện thoại..." className="dn-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--dn-text-secondary)] uppercase tracking-wider mb-1.5">Mô tả chi tiết *</label>
                <textarea required rows={4} placeholder="Mô tả vật phẩm: màu sắc, thương hiệu, đặc điểm nhận dạng... (KHÔNG cần ghi thông tin nhạy cảm)" className="dn-input resize-none" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--dn-text-secondary)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Calendar size={14} className="text-cyan-400" /> Thời gian nhặt được *</label>
                  <input type="text" required placeholder="VD: Sáng ngày 29/05" className="dn-input" value={form.foundDate} onChange={e => setForm(p => ({ ...p, foundDate: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--dn-text-secondary)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><Phone size={14} className="text-cyan-400" /> SĐT liên hệ *</label>
                  <input type="tel" required placeholder="VD: 0987xxxxxx" className="dn-input" value={form.contactPhone} onChange={e => setForm(p => ({ ...p, contactPhone: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--dn-text-secondary)] uppercase tracking-wider mb-1.5">Hình ảnh (không bắt buộc)</label>
                <label className="w-full h-[100px] rounded-xl border-2 border-dashed border-[var(--dn-border-strong)] bg-[var(--dn-surface-muted)] flex flex-col items-center justify-center text-[var(--dn-text-secondary)] cursor-pointer hover:border-cyan-400 hover:bg-cyan-500/5 transition-colors overflow-hidden">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImage} disabled={uploading} />
                  {uploading ? <Loader size={20} className="animate-spin opacity-50" />
                  : form.image ? <img src={form.image} alt="" className="w-full h-full object-cover" />
                  : <><Camera size={20} className="mb-1 opacity-50" /><span className="text-xs">Thêm ảnh</span></>}
                </label>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--dn-border-strong)] space-y-3">
              <label className="block text-xs font-semibold text-[var(--dn-text-secondary)] uppercase tracking-wider flex items-center gap-1.5"><MapPin size={14} className="text-cyan-400" /> Nơi nhặt được *</label>
              <VietMapSelector selectedLocation={form.location} onSelectLocation={(name) => setForm(p => ({ ...p, location: name }))} />
              <select required className="dn-input" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}>
                <option value="" disabled>Chọn từ danh sách</option>
                {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>

            <button type="submit" disabled={!isValid}
              className={`w-full mt-6 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isValid ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-[1.02] cursor-pointer' : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'}`}>
              <Heart size={16} />
              Đăng tin tìm chủ
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
          <p className="text-sm text-[var(--dn-text-secondary)] mb-6">Bạn cần đăng nhập để đăng tin nhặt được đồ.</p>
          <Link href="/" className="dn-btn-primary">Về trang chủ</Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
