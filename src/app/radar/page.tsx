'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useStore } from '@/lib/store';
import { LOCATIONS, CATEGORY_MAP } from '@/lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, MapPin, Navigation, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const LOCATION_COORDS: Record<string, { lat: number; lng: number }> = {
  'Đại học Bách Khoa Đà Nẵng': { lat: 16.0738, lng: 108.1499 },
  'Đại học Kinh tế Đà Nẵng': { lat: 16.0544, lng: 108.2322 },
  'Đại học Sư phạm Đà Nẵng': { lat: 16.0772, lng: 108.1522 },
  'Đại học Ngoại ngữ Đà Nẵng': { lat: 16.0422, lng: 108.2222 },
  'Đại học Sư phạm Kỹ thuật Đà Nẵng': { lat: 16.0776, lng: 108.2215 },
  'Đại học Công nghệ Thông tin & TT Việt-Hàn (VKU)': { lat: 15.9752, lng: 108.2497 },
  'Đại học FPT Đà Nẵng': { lat: 15.9722, lng: 108.2515 },
  'Đại học Duy Tân': { lat: 16.0650, lng: 108.2100 },
  'Đại học Đông Á': { lat: 16.0580, lng: 108.2280 },
  'Đại học Kiến trúc Đà Nẵng': { lat: 16.0670, lng: 108.2210 },
  'Đại học Thể dục Thể thao Đà Nẵng': { lat: 16.0710, lng: 108.2160 },
};

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function RadarPage() {
  const { items, fetchItems } = useStore();
  const [myLocation, setMyLocation] = useState('Đại học Công nghệ Thông tin & TT Việt-Hàn (VKU)');
  const [isScanning, setIsScanning] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [detectedItems, setDetectedItems] = useState<any[]>([]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const centerCoords = LOCATION_COORDS[myLocation] || { lat: 15.9752, lng: 108.2497 };

  useEffect(() => {
    setIsScanning(true);
    setSelectedItem(null);

    const timer = setTimeout(() => {
      const processed = items.map((item, idx) => {
        let itemLat = item.latitude;
        let itemLng = item.longitude;

        if (itemLat === undefined || itemLng === undefined) {
          const base = LOCATION_COORDS[item.location] || { lat: 15.9752, lng: 108.2497 };
          const offsetSeedLat = Math.sin(idx + (item.title?.length || 0));
          const offsetSeedLng = Math.cos(idx * 2 + (item.description?.length || 0));
          itemLat = base.lat + offsetSeedLat * 0.0045;
          itemLng = base.lng + offsetSeedLng * 0.0045;
        }

        const distance = getDistance(centerCoords.lat, centerCoords.lng, itemLat, itemLng);
        const deltaLat = itemLat - centerCoords.lat;
        const deltaLng = itemLng - centerCoords.lng;
        const angle = Math.atan2(deltaLng, deltaLat);
        const maxRange = 1500;
        const ratio = Math.min(distance / maxRange, 1.0);
        const x = 50 + Math.sin(angle) * ratio * 45;
        const y = 50 - Math.cos(angle) * ratio * 45;

        return { ...item, distance, x, y, angle: (angle * 180) / Math.PI };
      })
      .filter(item => item.distance <= 1500)
      .sort((a, b) => a.distance - b.distance);

      setDetectedItems(processed);
      setIsScanning(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [items, myLocation, centerCoords.lat, centerCoords.lng]);

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden pb-safe">
      <Header />

      <div className="flex-grow pt-28 pb-16 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            
            <div className="w-full lg:w-7/12 flex flex-col space-y-6">
              
              <div className="dn-glass-premium p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2 text-[var(--dn-text-primary)]">
                    <Radar className="text-[var(--dn-border-strong)] animate-pulse" size={24} />
                    Radar Quét Đồ Lân Cận
                  </h1>
                  <p className="text-xs text-[var(--dn-text-secondary)] mt-1">Phát hiện vật phẩm chia sẻ, mua bán và tin thất lạc quanh bạn.</p>
                </div>
                <div className="w-full sm:w-auto flex items-center gap-2 shrink-0">
                  <span className="text-xs text-[var(--dn-text-secondary)] whitespace-nowrap">Vị trí:</span>
                  <select 
                    value={myLocation} 
                    onChange={(e) => setMyLocation(e.target.value)}
                    className="dn-input text-xs w-auto"
                  >
                    {LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="dn-glass-premium p-8 flex flex-col items-center justify-center relative min-h-[460px] overflow-hidden">
                
                <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full border border-[var(--dn-border-strong)]/20 bg-[var(--dn-surface-muted)] overflow-hidden flex items-center justify-center">
                  
                  <div className="absolute inset-0 rounded-full pointer-events-none z-10 origin-center"
                    style={{
                      background: 'conic-gradient(from 0deg, color-mix(in oklch, var(--dn-border-strong) 20%, transparent) 0deg, transparent 60deg)',
                      animation: 'spin 4s linear infinite',
                    }}
                  />

                  <div className="absolute w-[80%] h-[80%] rounded-full border border-[var(--dn-border-strong)]/10 flex items-center justify-center">
                    <span className="absolute -top-3 text-[8px] text-[var(--dn-border-strong)]/50 font-mono">300m</span>
                  </div>
                  <div className="absolute w-[60%] h-[60%] rounded-full border border-[var(--dn-border-strong)]/10 flex items-center justify-center">
                    <span className="absolute -top-3 text-[8px] text-[var(--dn-border-strong)]/50 font-mono">600m</span>
                  </div>
                  <div className="absolute w-[40%] h-[40%] rounded-full border border-[var(--dn-border-strong)]/10 flex items-center justify-center">
                    <span className="absolute -top-3 text-[8px] text-[var(--dn-border-strong)]/50 font-mono">900m</span>
                  </div>
                  <div className="absolute w-[20%] h-[20%] rounded-full border border-[var(--dn-border-strong)]/10 flex items-center justify-center">
                    <span className="absolute -top-3 text-[8px] text-[var(--dn-border-strong)]/50 font-mono">1200m</span>
                  </div>

                  <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[var(--dn-border-strong)]/10 pointer-events-none" />
                  <div className="absolute inset-y-0 left-1/2 w-[1px] bg-[var(--dn-border-strong)]/10 pointer-events-none" />

                  <div className="absolute h-4 w-4 rounded-full bg-[var(--dn-border-strong)] border-2 border-white flex items-center justify-center z-20 shadow-[0_0_15px_var(--dn-shadow-1)]">
                    <div className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                  </div>

                  {isScanning && (
                    <div className="absolute inset-0 bg-[var(--dn-surface-base)]/70 z-30 flex flex-col items-center justify-center gap-3">
                      <div className="w-10 h-10 border-4 border-[var(--dn-border-strong)]/20 border-t-[var(--dn-border-strong)] rounded-full animate-spin" />
                      <span className="text-[10px] text-[var(--dn-border-strong)] font-mono uppercase tracking-wider animate-pulse">ĐANG DÒ QUÉT SÓNG RADAR...</span>
                    </div>
                  )}

                  {!isScanning && detectedItems.map((item, idx) => {
                    const isSelected = selectedItem && selectedItem.id === item.id;
                    
                    let colorClass = 'bg-[var(--dn-border-strong)] shadow-[0_0_10px_color-mix(in_oklch,var(--dn-border-strong),transparent)]';
                    if (item.exchangeType === 'mienphi') colorClass = 'bg-[var(--dn-accent)] shadow-[0_0_10px_var(--dn-accent-glow)]';
                    else if (item.exchangeType === 'sale') colorClass = 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]';
                    else if (item.exchangeType === 'lost') colorClass = 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]';
                    else if (item.exchangeType === 'found') colorClass = 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]';

                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setSelectedItem(item)}
                        style={{ left: `${item.x}%`, top: `${item.y}%` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border border-white cursor-pointer z-20 transition-all hover:scale-150 ${colorClass} ${
                          isSelected ? 'scale-150 ring-4 ring-white/30 z-30' : ''
                        }`}
                        title={item.title}
                      >
                        {isSelected && <div className="absolute inset-0 rounded-full bg-white/40 animate-ping" />}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap justify-center gap-4 mt-6 text-[10px] text-[var(--dn-text-secondary)] font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[var(--dn-accent)]" /> Tặng miễn phí</div>
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[var(--dn-border-strong)]" /> Trao đổi đồ</div>
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Mua bán</div>
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Tin mất đồ</div>
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-cyan-500" /> Nhặt được đồ</div>
                </div>

                <AnimatePresence>
                  {selectedItem && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      className="absolute bottom-6 left-6 right-6 p-4 rounded-full bg-[var(--dn-surface-strong)] shadow-2xl flex gap-4 z-40 items-center"
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-[var(--dn-surface-muted)] shrink-0 relative">
                        <img src={selectedItem.image || ''} alt={selectedItem.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <span className="text-[10px] uppercase font-bold text-[var(--dn-border-strong)] tracking-wider">
                          {selectedItem.exchangeType === 'mienphi' ? '🍀 Tặng miễn phí' :
                           selectedItem.exchangeType === 'traodoi' ? '🔄 Trao đổi' :
                           selectedItem.exchangeType === 'sale' ? `💰 Bán: ${(selectedItem.price || 0).toLocaleString('vi-VN')} đ` :
                           selectedItem.exchangeType === 'lost' ? '🔍 Mất đồ' : '📢 Nhặt được'}
                        </span>
                        <h4 className="font-bold text-sm truncate mt-0.5">{selectedItem.title}</h4>
                        <p className="text-[10px] text-[var(--dn-text-secondary)] flex items-center gap-1 mt-1">
                          <MapPin size={10} /> {selectedItem.location} • Cách bạn {Math.round(selectedItem.distance)}m
                        </p>
                      </div>
                      <div className="flex flex-col justify-between shrink-0 text-right">
                        <button onClick={() => setSelectedItem(null)} className="text-xs text-[var(--dn-text-secondary)] hover:text-[var(--dn-text-primary)] font-bold mb-2">Ẩn</button>
                        <Link href={`/detail/${selectedItem.id}`} className="dn-btn-primary text-[10px] !py-1.5 !px-3">
                          Chi tiết <ArrowRight size={10} />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="w-full lg:w-5/12 flex flex-col space-y-6">
              <div className="dn-glass-premium p-6 flex-grow flex flex-col min-h-[500px]">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <Navigation className="text-[var(--dn-border-strong)] rotate-45" size={16} />
                    Vật phẩm quanh đây ({detectedItems.length})
                  </h3>
                  <span className="text-[10px] font-mono text-[var(--dn-text-secondary)]">Phạm vi: 1.5 km</span>
                </div>

                {isScanning ? (
                  <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-8 h-8 border-4 border-[var(--dn-border-strong)]/20 border-t-[var(--dn-border-strong)] rounded-full animate-spin" />
                    <p className="text-xs text-[var(--dn-text-secondary)]">Đang cập nhật danh sách vị trí...</p>
                  </div>
                ) : detectedItems.length > 0 ? (
                  <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1.5">
                    {detectedItems.map(item => {
                      const cat = CATEGORY_MAP[item.category] || { label: 'Khác', emoji: '📦' };
                      const isSelected = selectedItem && selectedItem.id === item.id;
                      
                      let typeLabel = 'Trao đổi';
                      let typeBg = 'bg-[var(--dn-border-strong)]/10 text-[var(--dn-border-strong)] border border-[var(--dn-border-strong)]/20';
                      if (item.exchangeType === 'mienphi') {
                        typeLabel = 'Miễn phí';
                        typeBg = 'bg-[var(--dn-accent-soft)] text-[var(--dn-accent)] border border-[var(--dn-accent)]/20';
                      } else if (item.exchangeType === 'sale') {
                        typeLabel = `${(item.price || 0).toLocaleString('vi-VN')} đ`;
                        typeBg = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                      } else if (item.exchangeType === 'lost') {
                        typeLabel = 'Mất đồ';
                        typeBg = 'bg-red-500/10 text-red-400 border border-red-500/20';
                      } else if (item.exchangeType === 'found') {
                        typeLabel = 'Nhặt được';
                        typeBg = 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
                      }

                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className={`w-full p-3.5 rounded-full text-left transition-all border flex gap-4 ${
                            isSelected 
                              ? 'border-[var(--dn-border-strong)] bg-[var(--dn-border-strong)]/10' 
                              : 'border-transparent bg-[var(--dn-surface-muted)] hover:bg-[var(--dn-surface-strong)]'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 relative bg-[var(--dn-surface-muted)]">
                            <img src={item.image || ''} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          
                          <div className="flex-grow min-w-0 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-[var(--dn-text-secondary)] flex items-center gap-0.5">
                                {cat.emoji} {cat.label}
                              </span>
                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${typeBg}`}>
                                {typeLabel}
                              </span>
                            </div>
                            <h4 className="font-bold text-xs truncate">{item.title}</h4>
                            <div className="flex justify-between items-center text-[10px] text-[var(--dn-text-secondary)]">
                              <span className="truncate max-w-[120px]">{item.location}</span>
                              <span className="font-mono text-[var(--dn-border-strong)] shrink-0 font-bold">Cách {Math.round(item.distance)}m</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center text-center space-y-3">
                    <div className="text-3xl">📡</div>
                    <p className="text-xs text-[var(--dn-text-secondary)]">Không tìm thấy vật phẩm nào trong bán kính 1.5km.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
