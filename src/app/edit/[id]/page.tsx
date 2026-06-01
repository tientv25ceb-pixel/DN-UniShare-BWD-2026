'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useStore } from '@/lib/store';
import { CATEGORY_LABELS, CONDITION_LABELS, LOCATIONS } from '@/lib/data';
import { uploadImage } from '@/lib/api';
import { Camera, MapPin, Loader, CheckCircle2, Save } from 'lucide-react';
import VietMapSelector from '@/components/vietmap-selector';

export default function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { items, currentUser, updateItem } = useStore();
  const item = items.find(i => i.id === id);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: '',
    image: '',
    lostDate: '',
    reward: '',
    contactPhone: '',
  });

  useEffect(() => {
    if (!item) return;
    setForm({
      title: item.title || '',
      description: item.description || '',
      price: item.price?.toString() || '',
      category: item.category || '',
      condition: item.condition || '',
      location: item.location || '',
      image: item.image || '',
      lostDate: item.lostDate || '',
      reward: item.reward || '',
      contactPhone: item.contactPhone || '',
    });
  }, [item]);

  if (!currentUser) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-xl font-bold mb-2">Vui lòng đăng nhập</h2>
            <button onClick={() => router.push('/')} className="btn-primary">Về trang chủ</button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-5xl mb-4">😢</div>
            <h2 className="text-xl font-bold mb-2">Không tìm thấy món đồ</h2>
            <button onClick={() => router.push('/profile')} className="text-sm text-[var(--primary)] hover:underline font-medium">← Quay lại trang cá nhân</button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (currentUser.id !== item.posterId) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-5xl mb-4">🚫</div>
            <h2 className="text-xl font-bold mb-2">Không có quyền truy cập</h2>
            <button onClick={() => router.push('/')} className="btn-primary">Về trang chủ</button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

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
    setSaving(true);
    try {
      const descPayload: Record<string, any> = { description: form.description, exchangeType: item.exchangeType };
      if (item.exchangeType === 'sale') descPayload.price = parseFloat(form.price);
      if (item.exchangeType === 'lost' || item.exchangeType === 'found') {
        if (form.lostDate) descPayload.lostDate = form.lostDate;
        if (form.reward) descPayload.reward = form.reward;
        if (form.contactPhone) descPayload.contactPhone = form.contactPhone;
      }

      await updateItem(id, {
        title: form.title,
        description: JSON.stringify(descPayload),
        category: form.category,
        condition: form.condition,
        location: form.location,
        image: form.image,
      });
      setSaved(true);
    } catch { alert('Cập nhật thất bại'); }
    finally { setSaving(false); }
  };

  if (saved) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="card p-10 rounded-2xl max-w-md w-full text-center">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 text-green-600"><CheckCircle2 size={40} /></div>
            <h2 className="text-2xl font-bold mb-3">Đã cập nhật!</h2>
            <p className="text-sm text-[var(--muted-foreground)] mb-8">Món đồ của bạn đã được cập nhật thành công.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => router.push(`/detail/${id}`)} className="btn-primary justify-center w-full py-3">Xem bài đăng</button>
              <button onClick={() => router.push('/profile')} className="btn-outline justify-center w-full py-3">Về trang cá nhân</button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const isLostOrFound = item.exchangeType === 'lost' || item.exchangeType === 'found';
  const isSale = item.exchangeType === 'sale';

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow pt-28 pb-16 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-medium mb-6 transition-colors">
            ← Quay lại
          </button>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Chỉnh sửa bài đăng</h1>
            <p className="text-sm text-[var(--muted-foreground)]">Cập nhật thông tin món đồ của bạn</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Tên món đồ *</label>
              <input type="text" required placeholder="VD: Giáo trình Giải tích 1" className="input-field" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Mô tả *</label>
              <textarea required rows={4} placeholder="Mô tả chi tiết món đồ..." className="input-field resize-none" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>

            {isSale && (
              <div>
                <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Giá bán *</label>
                <div className="flex items-center gap-2">
                  <input type="number" required min={0} placeholder="50000" className="w-full input-field" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
                  <span className="text-sm font-bold text-amber-400 shrink-0">₫</span>
                </div>
              </div>
            )}

            {isLostOrFound && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Thời gian mất/nhặt</label>
                  <input type="date" className="input-field" value={form.lostDate} onChange={e => setForm(p => ({ ...p, lostDate: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Hậu tạ / Thưởng</label>
                  <input type="text" placeholder="VD: 50.000đ" className="input-field" value={form.reward} onChange={e => setForm(p => ({ ...p, reward: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">SĐT liên hệ</label>
                  <input type="text" placeholder="VD: 0912345678" className="input-field" value={form.contactPhone} onChange={e => setForm(p => ({ ...p, contactPhone: e.target.value }))} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Danh mục *</label>
                <select required className="input-field" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  <option value="" disabled>Chọn danh mục</option>
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Tình trạng *</label>
                <select required className="input-field" value={form.condition} onChange={e => setForm(p => ({ ...p, condition: e.target.value }))}>
                  <option value="" disabled>Chọn tình trạng</option>
                  {Object.entries(CONDITION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5">Hình ảnh *</label>
              <label className="w-full h-[120px] rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--card)] flex flex-col items-center justify-center text-[var(--muted-foreground)] cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors overflow-hidden">
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} disabled={uploading} />
                {uploading ? <Loader size={24} className="animate-spin opacity-50" />
                : form.image ? <img src={form.image} alt="" className="w-full h-full object-cover" />
                : <><Camera size={24} className="mb-1.5 opacity-50" /><span className="text-xs">Nhấn để tải ảnh</span></>}
              </label>
            </div>

            <div className="space-y-3 pt-2 border-t border-[var(--border)]">
              <label className="block text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-1.5"><MapPin size={14} /> Địa điểm hẹn gặp *</label>
              <VietMapSelector selectedLocation={form.location} onSelectLocation={(name) => setForm(p => ({ ...p, location: name }))} />
              <select required className="input-field" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}>
                <option value="" disabled>Hoặc chọn từ danh sách</option>
                {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>

            <button type="submit" disabled={!isValid || saving}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isValid && !saving ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] cursor-pointer' : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'}`}>
              {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
}
