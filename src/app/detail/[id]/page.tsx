'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import QRModal from '@/components/qr-modal';
import GiftAnimation from '@/components/decorative/gift-animation';
import DragonBridge from '@/components/decorative/dragon-bridge';
import WaveBackground from '@/components/decorative/wave-background';
import { useStore } from '@/lib/store';
import { CATEGORY_MAP, CONDITION_LABELS } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowLeft, Share2, MessageCircle, AlertCircle, ShieldCheck, Heart, Check, X, QrCode, Phone, Pencil, Trash2 } from 'lucide-react';
import PaymentModal from '@/components/payment-modal';

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { items, currentUser, sendRequest, requests, favorites, toggleFavorite, startConversation, deleteItem } = useStore();
  const [toast, setToast] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const item = items.find(i => i.id === id);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  if (!item) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-5xl mb-4">😢</div>
            <h2 className="text-xl font-bold mb-2">Không tìm thấy món đồ</h2>
            <button onClick={() => router.push('/items')} className="text-sm text-[var(--primary)] hover:underline font-medium">← Quay lại trang khám phá</button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const cat = CATEGORY_MAP[item.category];
  const isOwner = currentUser && item.posterId === currentUser.id;
  const hasRequested = currentUser ? requests.some(r => r.itemId === item.id && r.requesterId === currentUser.id) : false;
  const myRequest = currentUser ? requests.find(r => r.itemId === item.id && r.requesterId === currentUser.id) : null;
  const isFavorited = favorites.includes(item.id);
  const requestStatus = myRequest?.status;

  const handleRequest = async () => {
    if (!currentUser) return;
    try {
      await sendRequest(item.id);
      setShowGift(true);
    } catch { showToast('Lỗi khi gửi yêu cầu'); }
  };

  const handleChat = async () => {
    if (!currentUser) return;
    try {
      const convId = await startConversation(item.posterId || '', item.postedBy, item.id, item.title);
      window.open(`/chat/${convId}`, '_blank');
    } catch { showToast('Lỗi khi tạo hội thoại'); }
  };

  const handleDeleteItem = async () => {
    if (!window.confirm(`Bạn có chắc muốn xóa "${item.title}"?`)) return;
    try {
      await deleteItem(item.id);
      router.push('/profile');
    } catch { showToast('Xóa thất bại'); }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: item.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      showToast('Đã copy link!');
    }
  };

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <Header />
      <DragonBridge className="absolute bottom-0 right-0 w-[180px] h-[80px] opacity-30 hidden md:block" />
      <WaveBackground className="absolute top-60 left-0 opacity-30" opacity={0.03} />

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium"
        >
          {toast}
        </motion.div>
      )}

      <div className="flex-grow pt-28 pb-16 relative z-10">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
              <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-medium mb-6 transition-colors">
            <ArrowLeft size={18} /> Quay lại
          </button>

          <div className="card rounded-2xl overflow-hidden flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 relative min-h-[350px] lg:min-h-[550px] bg-[var(--secondary)]">
              <Image src={item.image || 'https://images.unsplash.com/photo-1595787143151-e601da948ea8?auto=format&fit=crop&w=600&h=400&q=80'} alt={item.title} fill className="object-cover" priority />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`badge text-white shadow-lg ${
                  item.exchangeType === 'mienphi' ? 'bg-green-500' :
                  item.exchangeType === 'sale' ? 'bg-amber-500' :
                  item.exchangeType === 'lost' ? 'bg-red-500' :
                  item.exchangeType === 'found' ? 'bg-cyan-500' : 'bg-blue-500'
                }`}>
                  {item.exchangeType === 'mienphi' ? '🍀 Tặng Miễn Phí' :
                   item.exchangeType === 'sale' ? '💰 Mua Bán (Có phí)' :
                   item.exchangeType === 'lost' ? '🔍 Tìm Đồ Thất Lạc' :
                   item.exchangeType === 'found' ? '📢 Nhặt Được Đồ' : '🔄 Cần Trao Đổi'}
                </span>
                {item.isFeatured && <span className="badge bg-amber-400 text-amber-900 shadow-lg">⭐ Nổi bật</span>}
              </div>
              <button
                onClick={() => { toggleFavorite(item.id); showToast(isFavorited ? 'Đã bỏ yêu thích' : 'Đã thêm yêu thích'); }}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <Heart size={20} className={isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
              </button>
            </div>

            <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col">
              <div className="flex items-center gap-2 mb-5">
                <span className="badge badge-blue">{cat.emoji} {cat.label}</span>
                <span className="badge badge-green">✨ {CONDITION_LABELS[item.condition]}</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-3">{item.title}</h1>

              {item.exchangeType === 'sale' && (
                <div className="text-3xl font-black text-emerald-400 mb-5 flex items-baseline gap-1">
                  {(item.price || 0).toLocaleString('vi-VN')}
                  <span className="text-sm font-bold text-gray-400">đ</span>
                </div>
              )}

              {(item.exchangeType === 'lost' || item.exchangeType === 'found') && (
                <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6 text-sm space-y-3">
                  <p className="font-bold text-red-400 uppercase tracking-widest text-[10px] flex items-center gap-1.5">
                    🚨 {item.exchangeType === 'lost' ? 'Thông tin báo mất đồ' : 'Thông tin nhặt được đồ'}
                  </p>
                  {item.lostDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Thời gian:</span>
                      <span className="font-semibold text-gray-200">{item.lostDate}</span>
                    </div>
                  )}
                  {item.reward && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Hậu tạ / Cám ơn:</span>
                      <span className="font-semibold text-emerald-400">{item.reward}</span>
                    </div>
                  )}
                  {item.contactPhone && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Số điện thoại liên hệ:</span>
                      <span className="font-semibold text-blue-400">{item.contactPhone}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-5 text-xs text-[var(--muted-foreground)] font-medium mb-6 pb-6 border-b border-[var(--border)]">
                <span className="flex items-center gap-1.5"><Clock size={14} /> Đăng ngày: {item.createdAt}</span>
                <span className="flex items-center gap-1.5"><AlertCircle size={14} /> {item.requestedCount} người đã quan tâm</span>
              </div>

              <div className="mb-6 flex-grow">
                <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">Mô tả chi tiết</h3>
                <p className="text-sm leading-relaxed text-[color-mix(in_oklch,_var(--foreground)_80%,_transparent)]">{item.description}</p>
              </div>

              <div className="bg-[var(--secondary)] rounded-2xl p-5 mb-6">
                <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-4">Thông tin người đăng</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-base">{item.postedBy.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-sm">{item.postedBy}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{item.posterFaculty || 'Sinh viên Đà Nẵng'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={16} className="text-[var(--primary)] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-xs">Điểm hẹn</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{item.location}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-auto">
                {item.status === 'completed' ? (
                  <button disabled className="flex-1 py-3 rounded-xl bg-gray-700 text-gray-500 border border-white/5 font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                    {item.exchangeType === 'sale' ? '🛒 Đã bán thành công' : '🎉 Đã hoàn thành/Nhận lại'}
                  </button>
                ) : !currentUser ? (
                  <Link href="/" className="flex-1 btn-primary justify-center py-3 text-sm">
                    <MessageCircle size={18} /> Đăng nhập để giao dịch
                  </Link>
                ) : isOwner ? (
                  <div className="flex gap-2 flex-1">
                    <Link href="/requests" className="flex-1 btn-outline justify-center py-3 text-sm">
                      <ShieldCheck size={18} /> Quản lý
                    </Link>
                    <button onClick={() => router.push(`/edit/${item.id}`)} className="px-4 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors" aria-label="Sửa">
                      <Pencil size={18} />
                    </button>
                    <button onClick={handleDeleteItem} className="px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" aria-label="Xóa">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ) : item.exchangeType === 'sale' ? (
                  <button onClick={() => setShowPayment(true)} className="flex-1 btn-primary bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 justify-center py-3 text-sm font-bold shadow-lg shadow-blue-500/25">
                    💰 Mua ngay & Thanh toán
                  </button>
                ) : (item.exchangeType === 'lost' || item.exchangeType === 'found') ? (
                  item.contactPhone ? (
                    <a href={`tel:${item.contactPhone}`} className="flex-1 btn-primary bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 justify-center py-3 text-sm font-bold flex items-center justify-center gap-2">
                      <Phone size={18} /> Gọi điện liên hệ
                    </a>
                  ) : (
                    <button onClick={handleChat} className="flex-1 btn-primary justify-center py-3 text-sm">
                      <MessageCircle size={18} /> Nhắn tin liên hệ
                    </button>
                  )
                ) : hasRequested && requestStatus === 'pending' ? (
                  <button disabled className="flex-1 py-3 rounded-xl bg-green-100/10 text-green-400 border border-green-500/20 font-bold text-sm flex items-center justify-center gap-2">
                    <Clock size={20} /> Đã gửi yêu cầu
                  </button>
                ) : hasRequested && requestStatus === 'accepted' ? (
                  <button disabled className="flex-1 py-3 rounded-xl bg-blue-100/10 text-blue-400 border border-blue-500/20 font-bold text-sm flex items-center justify-center gap-2">
                    <Check size={20} /> Đã được duyệt
                  </button>
                ) : hasRequested && requestStatus === 'rejected' ? (
                  <button disabled className="flex-1 py-3 rounded-xl bg-red-100/10 text-red-400 border border-red-500/20 font-bold text-sm flex items-center justify-center gap-2">
                    <X size={20} /> Đã từ chối
                  </button>
                ) : (
                  <button onClick={handleRequest} className="flex-1 btn-primary justify-center py-3 text-sm">
                    <MessageCircle size={18} /> Gửi yêu cầu nhận
                  </button>
                )}

                {currentUser && !isOwner && (
                  <button onClick={handleChat} className="px-4 py-3 rounded-xl bg-[var(--secondary)] hover:bg-[var(--border)] transition-colors" aria-label="Nhắn tin cho người đăng">
                    <MessageCircle size={18} />
                  </button>
                )}
                <button onClick={() => setShowQR(true)} className="px-4 py-3 rounded-xl bg-[var(--secondary)] hover:bg-[var(--border)] transition-colors" aria-label="Xem mã QR">
                  <QrCode size={18} />
                </button>
                <button onClick={handleShare} className="px-4 py-3 rounded-xl bg-[var(--secondary)] hover:bg-[var(--border)] transition-colors" aria-label="Chia sẻ">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <QRModal isOpen={showQR} onClose={() => setShowQR(false)} url={typeof window !== 'undefined' ? window.location.href : ''} title={item.title} />
      <GiftAnimation show={showGift} onClose={() => setShowGift(false)} />
      {showPayment && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          item={item}
          onSuccess={() => {
            showToast('Giao dịch thanh toán thành công!');
            setShowPayment(false);
          }}
        />
      )}
    </main>
  );
}
