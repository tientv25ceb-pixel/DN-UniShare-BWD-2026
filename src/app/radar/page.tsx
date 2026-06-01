'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import GlobeSection from '@/components/home/globe-section'; // reuse the 3D globe background
import { useStore } from '@/lib/store';
import { LOCATIONS, CATEGORY_MAP } from '@/lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, MapPin, Search, Navigation, Info, AlertCircle, ArrowRight, Eye, Phone, Coins } from 'lucide-react';
import Link from 'next/link';

const LOCATION_COORDS: Record<string, { lat: number; lng: number }> = {
  'KTX Làng Đại học':        { lat: 15.9752, lng: 108.2497 },
  'Thư viện ĐH Bách Khoa':   { lat: 16.0738, lng: 108.1499 },
  'Cổng chính Làng Đại học': { lat: 15.9772, lng: 108.2522 },
  'Căn-tin ĐH Sư phạm':      { lat: 16.0772, lng: 108.1522 },
  'Sảnh ĐH Kinh tế':         { lat: 16.0544, lng: 108.2322 },
  'Thư viện ĐH Ngoại ngữ':   { lat: 16.0422, lng: 108.2222 },
  'Khu tự học Làng Đại học': { lat: 15.9742, lng: 108.2482 },
  'Nhà ăn ĐH Bách Khoa':     { lat: 16.0722, lng: 108.1482 },
};

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in meters
}

export default function RadarPage() {
  const { items, fetchItems } = useStore();
  const [myLocation, setMyLocation] = useState('KTX Làng Đại học');
  const [isScanning, setIsScanning] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [detectedItems, setDetectedItems] = useState<any[]>([]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const centerCoords = LOCATION_COORDS[myLocation] || { lat: 15.9752, lng: 108.2497 };

  // Generate or read coordinates for all items, then calculate distances
  useEffect(() => {
    setIsScanning(true);
    setSelectedItem(null);

    const timer = setTimeout(() => {
      const processed = items.map((item, idx) => {
        let itemLat = item.latitude;
        let itemLng = item.longitude;

        // If item doesn't have coordinates, derive them from location with minor pseudo-random offset
        if (itemLat === undefined || itemLng === undefined) {
          const base = LOCATION_COORDS[item.location] || { lat: 15.9752, lng: 108.2497 };
          // deterministic random offset based on item title length/index
          const offsetSeedLat = Math.sin(idx + (item.title?.length || 0));
          const offsetSeedLng = Math.cos(idx * 2 + (item.description?.length || 0));
          itemLat = base.lat + offsetSeedLat * 0.0045;
          itemLng = base.lng + offsetSeedLng * 0.0045;
        }

        const distance = getDistance(centerCoords.lat, centerCoords.lng, itemLat, itemLng);
        
        // Calculate radar position coordinates
        const deltaLat = itemLat - centerCoords.lat;
        const deltaLng = itemLng - centerCoords.lng;
        const angle = Math.atan2(deltaLng, deltaLat); // in radians
        const maxRange = 1500; // max 1.5km scanner range
        const ratio = Math.min(distance / maxRange, 1.0);
        
        // Convert to percentage (center is 50%, radius is 45%)
        const x = 50 + Math.sin(angle) * ratio * 45;
        const y = 50 - Math.cos(angle) * ratio * 45;

        return {
          ...item,
          distance,
          x,
          y,
          angle: (angle * 180) / Math.PI,
        };
      })
      .filter(item => item.distance <= 1500) // only items within 1.5km range
      .sort((a, b) => a.distance - b.distance);

      setDetectedItems(processed);
      setIsScanning(false);
    }, 2000); // 2 seconds simulated sweep scanning

    return () => clearTimeout(timer);
  }, [items, myLocation, centerCoords.lat, centerCoords.lng]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMyLocation(e.target.value);
  };

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden text-white bg-[#050a15]">
      {/* 3D background globe underlaying radar */}
      <GlobeSection />
      
      <Header />

      <div className="flex-grow pt-28 pb-16 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            
            {/* LEFT PANEL: Controls & Radar Display */}
            <div className="w-full lg:w-7/12 flex flex-col space-y-6">
              
              {/* Controls bar */}
              <div className="glass-premium p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent flex items-center gap-2">
                    <Radar className="text-blue-500 animate-pulse" size={24} />
                    Radar Quét Đồ Lân Cận
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">Phát hiện vật phẩm chia sẻ, mua bán và tin thất lạc quanh bạn.</p>
                </div>
                <div className="w-full sm:w-auto flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-400 whitespace-nowrap">Vị trí của bạn:</span>
                  <select 
                    value={myLocation} 
                    onChange={handleLocationChange}
                    className="w-full sm:w-auto px-3.5 py-2 rounded-full border border-white/10 bg-[#0a0f1d] text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                  >
                    {LOCATIONS.map(loc => (
                      <option key={loc} value={loc} className="bg-[#0a0f1d]">{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* RADAR SCREEN PANEL */}
              <div className="glass-premium rounded-3xl p-8 border border-white/10 flex flex-col items-center justify-center relative min-h-[460px] overflow-hidden">
                
                {/* Radar Grid and Animation */}
                <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full border border-blue-500/20 bg-slate-950/40 backdrop-blur-md overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.1)] flex items-center justify-center">
                  
                  {/* Sweep Line */}
                  <div className="absolute inset-0 rounded-full pointer-events-none z-10 origin-center rotate-sweep" 
                    style={{
                      background: 'conic-gradient(from 0deg, rgba(59,130,246,0.2) 0deg, rgba(59,130,246,0.02) 60deg, transparent 90deg)',
                      animation: 'spin 4s linear infinite',
                    }}
                  />

                  {/* Concentric rings */}
                  <div className="absolute w-[80%] h-[80%] rounded-full border border-blue-500/10 flex items-center justify-center">
                    <span className="absolute -top-3 text-[8px] text-blue-500/50 font-mono">300m</span>
                  </div>
                  <div className="absolute w-[60%] h-[60%] rounded-full border border-blue-500/10 flex items-center justify-center">
                    <span className="absolute -top-3 text-[8px] text-blue-500/50 font-mono">600m</span>
                  </div>
                  <div className="absolute w-[40%] h-[40%] rounded-full border border-blue-500/10 flex items-center justify-center">
                    <span className="absolute -top-3 text-[8px] text-blue-500/50 font-mono">900m</span>
                  </div>
                  <div className="absolute w-[20%] h-[20%] rounded-full border border-blue-500/10 flex items-center justify-center">
                    <span className="absolute -top-3 text-[8px] text-blue-500/50 font-mono">1200m</span>
                  </div>

                  {/* Crosshairs */}
                  <div className="absolute inset-x-0 top-1/2 h-[1px] bg-blue-500/10 pointer-events-none" />
                  <div className="absolute inset-y-0 left-1/2 w-[1px] bg-blue-500/10 pointer-events-none" />

                  {/* Center Dot (User) */}
                  <div className="absolute h-4 w-4 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center z-20 shadow-[0_0_15px_rgba(59,130,246,0.6)]">
                    <div className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                  </div>

                  {/* Scanning HUD Overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-slate-950/70 z-30 flex flex-col items-center justify-center gap-3">
                      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                      <span className="text-[10px] text-blue-400 font-mono uppercase tracking-wider animate-pulse">ĐANG DÒ QUÉT SÓNG RADAR...</span>
                    </div>
                  )}

                  {/* Blips (Detected Items) */}
                  {!isScanning && detectedItems.map((item, idx) => {
                    const isSelected = selectedItem && selectedItem.id === item.id;
                    
                    let colorClass = 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]';
                    if (item.exchangeType === 'mienphi') colorClass = 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]';
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

                {/* Legend Indicators */}
                <div className="flex flex-wrap justify-center gap-4 mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Tặng miễn phí</div>
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Trao đổi đồ</div>
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Mua bán</div>
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Tin mất đồ</div>
                  <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-cyan-500" /> Nhặt được đồ</div>
                </div>

                {/* Floating Item quick-card */}
                <AnimatePresence>
                  {selectedItem && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl border border-white/10 bg-[#0a0f1d]/95 backdrop-blur-md shadow-2xl flex gap-4 z-40"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0 relative">
                        <img src={selectedItem.image || 'https://images.unsplash.com/photo-1595787143151-e601da948ea8?auto=format&fit=crop&w=600&h=400&q=80'} alt={selectedItem.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                          {selectedItem.exchangeType === 'mienphi' ? '🍀 Tặng miễn phí' :
                           selectedItem.exchangeType === 'traodoi' ? '🔄 Trao đổi' :
                           selectedItem.exchangeType === 'sale' ? `💰 Bán: ${(selectedItem.price || 0).toLocaleString('vi-VN')} đ` :
                           selectedItem.exchangeType === 'lost' ? '🔍 Mất đồ' : '📢 Nhặt được'}
                        </span>
                        <h4 className="font-bold text-sm truncate mt-0.5">{selectedItem.title}</h4>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                          <MapPin size={10} className="text-blue-500" /> {selectedItem.location} • Cách bạn {Math.round(selectedItem.distance)}m
                        </p>
                      </div>
                      <div className="flex flex-col justify-between shrink-0 text-right">
                        <button onClick={() => setSelectedItem(null)} className="text-xs text-gray-500 hover:text-white font-bold mb-2">Ẩn</button>
                        <Link href={`/detail/${selectedItem.id}`} className="btn-primary text-[10px] px-3 py-1.5 rounded-full flex items-center gap-1">
                          Chi tiết <ArrowRight size={10} />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

            {/* RIGHT PANEL: List of detected items sorted by distance */}
            <div className="w-full lg:w-5/12 flex flex-col space-y-6">
              
              <div className="glass-premium rounded-3xl p-6 border border-white/10 flex-grow flex flex-col min-h-[500px]">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <Navigation className="text-blue-500 rotate-45" size={16} />
                    Vật phẩm quanh đây ({detectedItems.length})
                  </h3>
                  <span className="text-[10px] font-mono text-gray-500">Phạm vi: 1.5 km</span>
                </div>

                {isScanning ? (
                  <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                    <p className="text-xs text-gray-400">Đang cập nhật danh sách vị trí...</p>
                  </div>
                ) : detectedItems.length > 0 ? (
                  <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1.5 scrollbar-thin">
                    {detectedItems.map(item => {
                      const cat = CATEGORY_MAP[item.category] || { label: 'Khác', emoji: '📦' };
                      const isSelected = selectedItem && selectedItem.id === item.id;
                      
                      let typeLabel = 'Trao đổi';
                      let typeBg = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
                      if (item.exchangeType === 'mienphi') {
                        typeLabel = 'Miễn phí';
                        typeBg = 'bg-green-500/10 text-green-400 border border-green-500/20';
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
                          className={`w-full p-3.5 rounded-2xl text-left transition-all border flex gap-4 ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                              : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 relative bg-slate-800">
                            <img src={item.image || 'https://images.unsplash.com/photo-1595787143151-e601da948ea8?auto=format&fit=crop&w=600&h=400&q=80'} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          
                          <div className="flex-grow min-w-0 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                                {cat.emoji} {cat.label}
                              </span>
                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${typeBg}`}>
                                {typeLabel}
                              </span>
                            </div>
                            <h4 className="font-bold text-xs truncate text-white">{item.title}</h4>
                            <div className="flex justify-between items-center text-[10px] text-gray-400">
                              <span className="truncate max-w-[120px]">{item.location}</span>
                              <span className="font-mono text-blue-400 shrink-0 font-bold">Cách {Math.round(item.distance)}m</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center text-center space-y-3">
                    <div className="text-3xl">📡</div>
                    <p className="text-xs text-gray-400">Không tìm thấy vật phẩm nào trong bán kính 1.5km.</p>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
      
      {/* Embedded Radar Sweep Keyframe animation */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}

// Simple loader helper since we don't have it imported
function Loader2({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <div className={`border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin ${className}`} style={{ width: size, height: size }} />
  );
}
