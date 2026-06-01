'use client';

import { useState, useEffect, useRef } from 'react';
import { motion as framerMotion, AnimatePresence as FramerAnimatePresence } from 'framer-motion';
import { X, CreditCard, Landmark, QrCode, Wallet, ShieldCheck, CheckCircle2, ChevronRight, MapPin, Truck, HelpCircle, Loader2 } from 'lucide-react';
import QRCode from 'qrcode';
import { useStore } from '@/lib/store';
import { updateItem } from '@/lib/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, item, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState(1); // 1: Delivery & Method, 2: Payment Action, 3: Processing, 4: Success
  const [shippingMethod, setShippingMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'card' | 'wallet'>('qr');
  const [loadingText, setLoadingText] = useState('Đang kết nối cổng thanh toán...');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [walletBalance, setWalletBalance] = useState(150000); // 150,000đ mock balance
  
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const { fetchItems } = useStore();

  const price = item.price || 0;
  const shippingFee = shippingMethod === 'delivery' ? 15000 : 0;
  const totalAmount = price + shippingFee;

  // Generate QR Code dynamically
  useEffect(() => {
    if (step === 2 && paymentMethod === 'qr' && qrCanvasRef.current) {
      // Mock VietQR string standard payload
      const qrPayload = `00020101021138540010A00000072701240006970422011009876543210208QRIBFTTA53037045406${totalAmount}5802VN62250821${encodeURIComponent(item.title)}`;
      QRCode.toCanvas(qrCanvasRef.current, qrPayload, {
        width: 200,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' },
      }).catch(err => console.error('Failed to generate QR:', err));
    }
  }, [step, paymentMethod, totalAmount, item.title]);

  const handleStartPayment = () => {
    if (paymentMethod === 'wallet' && walletBalance < totalAmount) {
      alert('Số dư ví UniPay không đủ! Vui lòng chọn phương thức khác.');
      return;
    }
    setStep(2);
  };

  const handleMockPay = async () => {
    setStep(3);
    setLoadingText('Đang kết nối cổng thanh toán bảo mật...');
    
    setTimeout(() => {
      setLoadingText('Đang xác minh số dư tài khoản...');
    }, 1200);

    setTimeout(() => {
      setLoadingText('Đang hoàn tất giao dịch và chuyển nhượng sở hữu...');
    }, 2400);

    setTimeout(async () => {
      try {
        // Mark item as completed in Supabase DB via our API helpers
        await updateItem(item.id, { status: 'completed' });
        await fetchItems();
        if (paymentMethod === 'wallet') {
          setWalletBalance(prev => prev - totalAmount);
        }
        setStep(4);
      } catch (err) {
        console.error('Error updating item status:', err);
        setStep(1);
        alert('Giao dịch lỗi, vui lòng thử lại.');
      }
    }, 3600);
  };

  const handleFinish = () => {
    onSuccess();
    onClose();
    // Reset modal
    setStep(1);
    setShippingMethod('pickup');
    setPaymentMethod('qr');
  };

  return (
    <FramerAnimatePresence>
      {isOpen && (
        <framerMotion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        >
          <framerMotion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-full max-w-lg bg-[#0a0f1d]/90 border border-blue-500/20 text-white rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.15)] relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Header border light */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400" />
            
            {/* Background glowing gradients */}
            <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-blue-500/10 blur-[60px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-cyan-500/10 blur-[60px] pointer-events-none" />

            {/* Close Button */}
            {step !== 3 && (
              <button 
                onClick={onClose} 
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all z-10"
              >
                <X size={16} />
              </button>
            )}

            {/* STEP 1: Details and Payment Options */}
            {step === 1 && (
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Thanh toán an toàn</h3>
                  <p className="text-xs text-gray-400 mt-1">Xác nhận thông tin giao hàng và chọn phương thức thanh toán.</p>
                </div>

                {/* Item Brief Info */}
                <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
                  <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Món đồ đang mua</span>
                    <h4 className="font-bold text-sm truncate mt-0.5">{item.title}</h4>
                    <p className="text-xs text-emerald-400 font-bold mt-1">
                      {price.toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                </div>

                {/* Delivery Options */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Hình thức giao nhận</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setShippingMethod('pickup')}
                      className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
                        shippingMethod === 'pickup' 
                          ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <MapPin className={`shrink-0 ${shippingMethod === 'pickup' ? 'text-blue-400' : 'text-gray-400'}`} size={20} />
                      <div>
                        <p className="text-xs font-bold">Hẹn lấy trực tiếp</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Miễn phí • Tại điểm hẹn</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setShippingMethod('delivery')}
                      className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
                        shippingMethod === 'delivery' 
                          ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <Truck className={`shrink-0 ${shippingMethod === 'delivery' ? 'text-blue-400' : 'text-gray-400'}`} size={20} />
                      <div>
                        <p className="text-xs font-bold">Giao hàng (Ship)</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">+15k • Ship tận phòng trọ</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Phương thức thanh toán</label>
                  <div className="space-y-2">
                    {[
                      { id: 'qr', icon: <QrCode size={18} />, label: 'Chuyển khoản VietQR động (Quét mã)', desc: 'Tự động nhập số tiền & nội dung, xử lý nhanh gọn' },
                      { id: 'card', icon: <CreditCard size={18} />, label: 'Thẻ Quốc tế (Visa / Mastercard)', desc: 'Thanh toán trực tiếp bằng thẻ tín dụng/ghi nợ' },
                      { id: 'wallet', icon: <Wallet size={18} />, label: 'Ví điện tử UniPay học viên', desc: `Thanh toán qua ví nội bộ (Số dư: ${walletBalance.toLocaleString('vi-VN')}đ)` },
                    ].map(method => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`w-full p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
                          paymentMethod === method.id 
                            ? 'border-blue-500 bg-blue-500/10' 
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${paymentMethod === method.id ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                          {method.icon}
                        </div>
                        <div className="flex-grow">
                          <p className="text-xs font-bold">{method.label}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{method.desc}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          paymentMethod === method.id ? 'border-blue-400 bg-blue-500' : 'border-gray-600'
                        }`}>
                          {paymentMethod === method.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total Invoice */}
                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Giá vật phẩm</span>
                    <span>{price.toLocaleString('vi-VN')} đ</span>
                  </div>
                  {shippingMethod === 'delivery' && (
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Phí giao hàng</span>
                      <span>15.000 đ</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end pt-2 border-t border-white/5">
                    <span className="text-sm font-bold">Tổng thanh toán</span>
                    <span className="text-lg font-black text-blue-400">
                      {totalAmount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  onClick={handleStartPayment}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all font-bold text-sm shadow-[0_0_20px_rgba(59,130,246,0.25)] flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={18} />
                  Tiến hành thanh toán
                </button>
              </div>
            )}

            {/* STEP 2: Payment Execution (QR or Credit Card or Wallet Confirmation) */}
            {step === 2 && (
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Thực hiện thanh toán</h3>
                  <p className="text-xs text-gray-400 mt-1">Hoàn tất các bước dưới đây để kết thúc đơn hàng.</p>
                </div>

                {/* QR Method */}
                {paymentMethod === 'qr' && (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <p className="text-xs text-gray-300 max-w-sm">Mở ứng dụng Ngân hàng hoặc Ví điện tử quét mã bên dưới để chuyển khoản tự động.</p>
                    
                    <div className="bg-white rounded-2xl p-4 shadow-xl border border-white/10 relative overflow-hidden flex flex-col items-center">
                      <canvas ref={qrCanvasRef} />
                      <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
                    </div>

                    <div className="w-full p-4 rounded-xl bg-white/5 border border-white/5 text-left text-xs space-y-1.5">
                      <div className="flex justify-between"><span className="text-gray-400">Ngân hàng nhận:</span><span className="font-bold">MB Bank (Quân Đội)</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Số tài khoản:</span><span className="font-bold">9704220110098765</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Tên người nhận:</span><span className="font-bold">DN-UNISHARE SERVICE</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Số tiền chuyển:</span><span className="font-bold text-emerald-400">{totalAmount.toLocaleString('vi-VN')} đ</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Nội dung chuyển:</span><span className="font-bold text-blue-400">UNI {item.title.slice(0, 10).toUpperCase()} PAY</span></div>
                    </div>

                    <div className="w-full flex gap-3 pt-2">
                      <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-bold text-xs text-gray-300">Quay lại</button>
                      <button onClick={handleMockPay} className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20">Xác nhận Đã chuyển khoản</button>
                    </div>
                  </div>
                )}

                {/* Credit Card Method */}
                {paymentMethod === 'card' && (
                  <div className="space-y-6">
                    {/* Visual Card Mockup */}
                    <div className="flex justify-center perspective-1000">
                      <framerMotion.div
                        animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-72 h-44 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-800 to-blue-900 border border-white/15 p-5 shadow-2xl relative preserve-3d"
                      >
                        {/* Front Side */}
                        <div className="absolute inset-0 p-5 flex flex-col justify-between backface-hidden">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-white/60">SECURE CREDIT CARD</span>
                            <div className="h-6 w-10 bg-white/20 rounded flex items-center justify-center font-bold text-[10px] text-white">VISA</div>
                          </div>
                          <div className="space-y-4">
                            <p className="text-base tracking-[0.25em] font-mono text-center text-white/95">
                              {cardNumber || '•••• •••• •••• ••••'}
                            </p>
                            <div className="flex justify-between text-[9px] font-mono uppercase text-white/60">
                              <div className="min-w-0 flex-grow pr-3">
                                <p className="text-[7px] text-white/40">Chủ thẻ</p>
                                <p className="font-bold truncate text-white/90">{cardName || 'YOUR FULL NAME'}</p>
                              </div>
                              <div className="shrink-0 text-right">
                                <p className="text-[7px] text-white/40">Hạn dùng</p>
                                <p className="font-bold text-white/90">{cardExpiry || 'MM/YY'}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Back Side */}
                        <div className="absolute inset-0 py-5 flex flex-col justify-between bg-slate-900 rounded-2xl border border-white/15 rotateY-180 backface-hidden">
                          <div className="w-full h-8 bg-black mt-2" />
                          <div className="px-5 flex justify-end items-center gap-3">
                            <span className="text-[6px] text-white/40 font-mono">SECURE SIGNATURE</span>
                            <div className="w-12 h-6 bg-white rounded flex items-center justify-center font-bold text-xs text-black font-mono">
                              {cardCvv || '•••'}
                            </div>
                          </div>
                        </div>
                      </framerMotion.div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Số thẻ *</label>
                        <input
                          type="text"
                          required
                          maxLength={19}
                          placeholder="4111 2222 3333 4444"
                          value={cardNumber}
                          onFocus={() => setIsCardFlipped(false)}
                          onChange={e => {
                            const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                            const matches = v.match(/\d{4,16}/g);
                            const match = (matches && matches[0]) || '';
                            const parts: string[] = [];
                            for (let i = 0, len = match.length; i < len; i += 4) {
                              parts.push(match.substring(i, i + 4));
                            }
                            setCardNumber(parts.length > 0 ? parts.join(' ') : v);
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-600 text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Tên trên thẻ *</label>
                        <input
                          type="text"
                          required
                          placeholder="NGUYEN VAN A"
                          value={cardName}
                          onFocus={() => setIsCardFlipped(false)}
                          onChange={e => setCardName(e.target.value.toUpperCase())}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-600 text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Hạn dùng *</label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onFocus={() => setIsCardFlipped(false)}
                            onChange={e => {
                              let v = e.target.value.replace(/[^0-9]/gi, '');
                              if (v.length > 2) {
                                v = `${v.substring(0, 2)}/${v.substring(2, 4)}`;
                              }
                              setCardExpiry(v);
                            }}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-600 text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Mã CVV *</label>
                          <input
                            type="text"
                            required
                            maxLength={3}
                            placeholder="123"
                            value={cardCvv}
                            onFocus={() => setIsCardFlipped(true)}
                            onBlur={() => setIsCardFlipped(false)}
                            onChange={e => setCardCvv(e.target.value.replace(/[^0-9]/gi, ''))}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-600 text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex gap-3 pt-2">
                      <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-bold text-xs text-gray-300">Quay lại</button>
                      <button 
                        onClick={handleMockPay} 
                        disabled={!cardNumber || !cardName || !cardExpiry || !cardCvv}
                        className={`flex-1 py-3 rounded-xl font-bold text-xs shadow-lg ${
                          cardNumber && cardName && cardExpiry && cardCvv
                            ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/25'
                            : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                        }`}
                      >
                        Thanh toán ngay
                      </button>
                    </div>
                  </div>
                )}

                {/* Wallet Confirmation Method */}
                {paymentMethod === 'wallet' && (
                  <div className="space-y-6 text-center">
                    <div className="h-16 w-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
                      <Wallet size={32} />
                    </div>

                    <div className="max-w-md mx-auto space-y-2">
                      <p className="text-sm font-semibold">Xác nhận thanh toán bằng ví điện tử UniPay</p>
                      <p className="text-xs text-gray-400">Số tiền thanh toán sẽ được trừ trực tiếp từ số dư ví sinh viên của bạn.</p>
                    </div>

                    <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 text-left text-xs space-y-2 max-w-sm mx-auto">
                      <div className="flex justify-between"><span className="text-gray-400">Ví thanh toán:</span><span className="font-bold">UniPay Student Wallet</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Số dư khả dụng:</span><span className="font-bold text-emerald-400">{walletBalance.toLocaleString('vi-VN')} đ</span></div>
                      <div className="h-px bg-white/10 my-2" />
                      <div className="flex justify-between"><span className="text-gray-400">Tổng thanh toán:</span><span className="font-bold text-orange-400">-{totalAmount.toLocaleString('vi-VN')} đ</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Số dư sau khi trừ:</span><span className="font-bold">{(walletBalance - totalAmount).toLocaleString('vi-VN')} đ</span></div>
                    </div>

                    <div className="w-full flex gap-3 pt-2">
                      <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-bold text-xs text-gray-300">Quay lại</button>
                      <button onClick={handleMockPay} className="flex-1 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/25">Thanh toán bằng ví</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Loading Processing */}
            {step === 3 && (
              <div className="p-10 flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative flex items-center justify-center">
                  <div className="absolute h-16 w-16 rounded-full border-4 border-blue-500/10" />
                  <Loader2 size={48} className="animate-spin text-blue-500 relative z-10" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-base">Đang xử lý giao dịch an toàn</h4>
                  <p className="text-xs text-gray-400 animate-pulse">{loadingText}</p>
                </div>
                <p className="text-[10px] text-gray-500 max-w-xs">UniShare mã hóa đầu cuối và tuân thủ các quy tắc bảo mật giao dịch PCI-DSS trong Làng Đại học Đà Nẵng.</p>
              </div>
            )}

            {/* STEP 4: Success Receipt */}
            {step === 4 && (
              <div className="p-8 text-center space-y-6">
                <framerMotion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="h-16 w-16 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400"
                >
                  <CheckCircle2 size={36} className="animate-bounce" />
                </framerMotion.div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-emerald-400">Thanh toán thành công!</h3>
                  <p className="text-xs text-gray-400">Đơn hàng của bạn đã được ghi nhận. Chủ sở hữu món đồ sẽ sớm liên hệ điểm hẹn.</p>
                </div>

                {/* Receipt details */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-left text-xs space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 text-[8px] bg-emerald-500/10 text-emerald-400 font-bold border-bl border-white/5 rounded-bl-xl uppercase">HÓA ĐƠN ĐÃ THANH TOÁN</div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-400">Mã giao dịch:</span>
                    <p className="font-mono text-white/90">TXN-{Math.floor(10000000 + Math.random() * 90000000)}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-400">Món đồ:</span>
                    <p className="font-bold text-white/90">{item.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-gray-400">Giao nhận:</span>
                      <p className="font-semibold text-white/90">{shippingMethod === 'pickup' ? 'Lấy tại điểm hẹn' : 'Ship tận phòng trọ'}</p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-gray-400">Địa chỉ:</span>
                      <p className="font-semibold text-white/90 truncate">{item.location}</p>
                    </div>
                  </div>
                  <div className="border-t border-white/5 pt-3 flex justify-between items-end">
                    <span className="text-[9px] uppercase font-bold text-gray-400">Số tiền:</span>
                    <span className="text-sm font-black text-emerald-400">{totalAmount.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>

                <button
                  onClick={handleFinish}
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 transition-all font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center justify-center gap-1.5"
                >
                  Xác nhận Hoàn tất
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </framerMotion.div>
        </framerMotion.div>
      )}
    </FramerAnimatePresence>
  );
}
