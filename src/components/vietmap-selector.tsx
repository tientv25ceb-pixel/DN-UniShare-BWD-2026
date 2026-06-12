'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { MapPin, Info, AlertTriangle, Navigation, Loader2, Search } from 'lucide-react';

interface VietMapSelectorProps {
  selectedLocation: string;
  onSelectLocation: (name: string, lat: number, lng: number) => void;
}

const MAP_HOTSPOTS = [
  { name: 'Đại học Bách Khoa Đà Nẵng', lat: 16.0738, lng: 108.1499, tag: 'ĐH Bách Khoa', safety: 'An toàn • Khuôn viên rộng • Bảo vệ cổng trường' },
  { name: 'Đại học Kinh tế Đà Nẵng', lat: 16.0544, lng: 108.2322, tag: 'ĐH Kinh tế', safety: 'An toàn • Gần đường chính • Nhiều sinh viên' },
  { name: 'Đại học Sư phạm Đà Nẵng', lat: 16.0772, lng: 108.1522, tag: 'ĐH Sư phạm', safety: 'An toàn • Cơ sở khang trang • Camera' },
  { name: 'Đại học Ngoại ngữ Đà Nẵng', lat: 16.0422, lng: 108.2222, tag: 'ĐH Ngoại ngữ', safety: 'An toàn • Khu vực yên tĩnh • Thư viện' },
  { name: 'Đại học Sư phạm Kỹ thuật Đà Nẵng', lat: 16.0776, lng: 108.2215, tag: 'ĐH SP Kỹ thuật', safety: 'An toàn • Khu vực trung tâm • Sáng sủa' },
  { name: 'Đại học Công nghệ Thông tin & TT Việt-Hàn (VKU)', lat: 15.9752, lng: 108.2497, tag: 'VKU', safety: 'An toàn • Cơ sở mới • Camera an ninh' },
  { name: 'Đại học FPT Đà Nẵng', lat: 15.9722, lng: 108.2515, tag: 'FPT Đà Nẵng', safety: 'An toàn • Cơ sở hiện đại • Bảo vệ nghiêm ngặt' },
  { name: 'Đại học Thể dục Thể thao Đà Nẵng', lat: 16.0710, lng: 108.2160, tag: 'ĐH TDTT', safety: 'An toàn • Sân vận động rộng • Nhiều người' },
  { name: 'Đại học Duy Tân', lat: 16.0650, lng: 108.2100, tag: 'Duy Tân', safety: 'An toàn • Trung tâm thành phố • Nhiều sinh viên' },
  { name: 'Đại học Đông Á', lat: 16.0580, lng: 108.2280, tag: 'Đông Á', safety: 'An toàn • Gần trung tâm • Đường lớn' },
  { name: 'Đại học Kiến trúc Đà Nẵng', lat: 16.0670, lng: 108.2210, tag: 'Kiến trúc', safety: 'An toàn • Khu vực sầm uất • Gần chợ' },
];

export default function VietMapSelector({ selectedLocation, onSelectLocation }: VietMapSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const customMarkerRef = useRef<any>(null);
  const markersListRef = useRef<any[]>([]);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Address search & geolocation states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Helper to place/update custom marker
  const updateCustomMarker = (lat: number, lng: number, mapInstance: any) => {
    if (!mapInstance) return;

    if (customMarkerRef.current) {
      customMarkerRef.current.setLngLat([lng, lat]);
    } else {
      const el = document.createElement('div');
      el.className = 'custom-map-user-pin';
      el.innerHTML = `
        <div class="relative flex h-8 w-8 items-center justify-center animate-bounce">
          <span class="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white shadow-xl shadow-rose-500/50"></span>
        </div>
      `;
      // @ts-ignore
      const marker = new window.vietmapgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(mapInstance);
      customMarkerRef.current = marker;
    }
  };

  // Autocomplete search via free Nominatim OpenStreetMap API
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchingAddress(true);
    setShowResults(true);
    try {
      let query = searchQuery;
      // Append "Đà Nẵng" if not present to ensure local relevance
      if (!query.toLowerCase().includes('đà nẵng') && !query.toLowerCase().includes('da nang')) {
        query += ', Đà Nẵng';
      }

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
          query
        )}&limit=5`,
        {
          headers: {
            'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
          },
        }
      );
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Geocoding search error:', err);
    } finally {
      setIsSearchingAddress(false);
    }
  };

  // Select a search result
  const handleSelectResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    // Zoom and pan map
    if (mapRef.current) {
      mapRef.current.easeTo({ center: [lng, lat], zoom: 16 });
      updateCustomMarker(lat, lng, mapRef.current);
    }

    const shortName = result.display_name.split(',')[0];
    onSelectLocation(`${shortName} (Tọa độ: [${lat.toFixed(5)}, ${lng.toFixed(5)}])`, lat, lng);
    setShowResults(false);
    setSearchQuery(shortName);
  };

  // Geolocation trigger
  const handleLocateMe = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ định vị GPS.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setIsLocating(false);

        if (mapRef.current) {
          mapRef.current.easeTo({ center: [longitude, latitude], zoom: 16 });
          updateCustomMarker(latitude, longitude, mapRef.current);
        }

        onSelectLocation(`Vị trí hiện tại (Tọa độ: [${latitude.toFixed(5)}, ${longitude.toFixed(5)}])`, latitude, longitude);
      },
      (error) => {
        setIsLocating(false);
        console.error('GPS Geolocation error:', error);
        let msg = 'Không thể lấy vị trí hiện tại.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Vui lòng mở cài đặt trình duyệt để cho phép quyền truy cập vị trí.';
        }
        alert(msg);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Auto locate user on first mount when map is ready
  useEffect(() => {
    if (!isMapReady || !mapRef.current || !navigator.geolocation) return;
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (mapRef.current) {
          mapRef.current.easeTo({ center: [longitude, latitude], zoom: 15 });
          updateCustomMarker(latitude, longitude, mapRef.current);
          onSelectLocation(`Vị trí hiện tại (Tọa độ: [${latitude.toFixed(5)}, ${longitude.toFixed(5)}])`, latitude, longitude);
        }
      },
      (err) => {
        console.log('Auto-geolocation permission denied or skipped.');
      },
      { timeout: 4000 }
    );
  }, [isMapReady]);

  // Close search results when clicking elsewhere
  useEffect(() => {
    const handleOutsideClick = () => {
      setShowResults(false);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('click', handleOutsideClick);
      }
    };
  }, []);

  // Check if script is already loaded globally (important for hot-reloads/spa navigations)
  useEffect(() => {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.vietmapgl) {
      setIsScriptLoaded(true);
    }
  }, []);

  // Read API Key from environment variable
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_VIETMAP_API_KEY || null;
    setApiKey(key);
  }, []);

  // Initialize Map when Script is loaded
  useEffect(() => {
    // @ts-ignore
    if (!isScriptLoaded || !containerRef.current || !window.vietmapgl) return;

    // Destroy existing map instance to avoid re-renders
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Stylesheet fallback if no API key is specified
    const styleUrl = apiKey 
      ? `https://maps.vietmap.vn/maps/styles/tm/style.json?apikey=${apiKey}`
      : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

    try {
      // @ts-ignore
      const map = new window.vietmapgl.Map({
        container: containerRef.current,
        style: styleUrl,
        center: [108.2000, 16.0500], // Trung tâm Đà Nẵng coordinates [lng, lat]
        zoom: 12,
        pitch: 30, // 3D tilt look
      });

      mapRef.current = map;

      map.on('load', () => {
        setIsMapReady(true);
        
        // Add navigation controls
        // @ts-ignore
        map.addControl(new window.vietmapgl.NavigationControl(), 'top-right');

        // Add pins for predefined points of interest
        MAP_HOTSPOTS.forEach(spot => {
          const el = document.createElement('div');
          el.className = 'custom-map-marker-pin';
          el.style.cursor = 'pointer';
          
          const isCurrent = selectedLocation === spot.name;
          
          el.innerHTML = `
            <div class="relative flex h-6 w-6 items-center justify-center">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${isCurrent ? 'bg-cyan-400' : 'bg-blue-400'}"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 border border-white/80 shadow-md ${isCurrent ? 'bg-cyan-300 scale-125' : 'bg-blue-600'}"></span>
            </div>
          `;

          // @ts-ignore
          const marker = new window.vietmapgl.Marker(el)
            .setLngLat([spot.lng, spot.lat])
            .addTo(map);

          // Add click listener
          el.addEventListener('click', (e) => {
            e.stopPropagation();
            onSelectLocation(spot.name, spot.lat, spot.lng);
            
            // Pan map to marker center
            map.easeTo({ center: [spot.lng, spot.lat], zoom: 15 });
          });

          markersListRef.current.push({ name: spot.name, marker, element: el });
        });
      });

      // Handle map clicks to place custom custom pin
      map.on('click', (e: any) => {
        const { lng, lat } = e.lngLat;
        updateCustomMarker(lat, lng, map);
        onSelectLocation(`Tọa độ: [${lat.toFixed(5)}, ${lng.toFixed(5)}]`, lat, lng);
        map.easeTo({ center: [lng, lat] });
      });

    } catch (e) {
      console.error('Failed to initialize VietMap GL:', e);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersListRef.current = [];
      customMarkerRef.current = null;
    };
  }, [isScriptLoaded, apiKey]);

  // Update styles of markers when selectedLocation changes
  useEffect(() => {
    if (!isMapReady) return;
    
    markersListRef.current.forEach(item => {
      const isCurrent = selectedLocation === item.name;
      const dot = item.element.querySelector('.relative.inline-flex');
      const ping = item.element.querySelector('.animate-ping');
      
      if (dot && ping) {
        if (isCurrent) {
          dot.className = 'relative inline-flex rounded-full h-3 w-3 border border-white/80 shadow-md bg-cyan-300 scale-125 transition-all';
          ping.className = 'animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-cyan-400';
        } else {
          dot.className = 'relative inline-flex rounded-full h-3 w-3 border border-white/80 shadow-md bg-blue-600 transition-all';
          ping.className = 'animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-blue-400';
        }
      }
    });

    // Remove custom marker pin if a preset hotspot is selected
    const isPreset = MAP_HOTSPOTS.some(s => s.name === selectedLocation);
    if (isPreset && customMarkerRef.current) {
      customMarkerRef.current.remove();
      customMarkerRef.current = null;
    }
  }, [selectedLocation, isMapReady]);

  return (
    <div className="space-y-4">
      {/* Stylesheet CDN tag */}
      <link href="https://unpkg.com/@vietmap/vietmap-gl-js@6.0.1/dist/vietmap-gl.css" rel="stylesheet" />
      
      {/* Script Loader CDN */}
      <Script 
        src="https://unpkg.com/@vietmap/vietmap-gl-js@6.0.1/dist/vietmap-gl.js" 
        strategy="afterInteractive"
        onLoad={() => setIsScriptLoaded(true)}
      />

      <div className="relative w-full h-[280px] md:h-[350px] bg-[#070c18] rounded-2xl border border-white/10 overflow-hidden shadow-inner flex items-center justify-center">
        {!isScriptLoaded && (
          <div className="absolute inset-0 bg-slate-950/80 z-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-blue-500" size={28} />
            <span className="text-xs text-blue-400 font-mono tracking-wider animate-pulse">ĐANG TẢI THƯ VIỆN BẢN ĐỒ VIETMAP...</span>
          </div>
        )}

        <div ref={containerRef} className="w-full h-full" />

        {/* Absolute Address Search Bar */}
        {isScriptLoaded && (
          <div className="absolute top-3 left-3 z-10 w-72 max-w-[calc(100%-80px)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-1.5 p-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/15 shadow-xl">
              <input 
                type="text" 
                placeholder="Tìm địa chỉ, tòa nhà..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowResults(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSearch();
                  }
                }}
                className="flex-grow bg-transparent px-3.5 py-1.5 text-xs text-white placeholder-gray-400 outline-none border-none"
              />
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSearch();
                }}
                className="h-7 w-7 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all shrink-0 shadow-lg shadow-blue-600/35"
              >
                {isSearchingAddress ? (
                  <Loader2 className="animate-spin" size={12} />
                ) : (
                  <Search size={12} />
                )}
              </button>
            </div>

            {/* Search results dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 p-1.5 rounded-2xl bg-slate-950/95 backdrop-blur-md border border-white/10 shadow-2xl max-h-48 overflow-y-auto z-50 divide-y divide-white/5" onClick={(e) => e.stopPropagation()}>
                {searchResults.map((result: any, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectResult(result)}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-[11px] text-gray-300 hover:text-white hover:bg-white/5 transition-all truncate block"
                    title={result.display_name}
                  >
                    📍 {result.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Locate Me GPS Button */}
        {isScriptLoaded && (
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            className="absolute bottom-12 right-3 z-10 p-2.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-blue-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all shadow-lg flex items-center justify-center group disabled:opacity-50"
            title="Định vị vị trí hiện tại"
          >
            {isLocating ? (
              <Loader2 className="animate-spin text-blue-400" size={16} />
            ) : (
              <Navigation className="rotate-45 group-hover:scale-110 transition-transform" size={16} />
            )}
          </button>
        )}

        {/* API Key status indicator tag */}
        <div className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-wide z-10 flex items-center gap-1.5 backdrop-blur-md border uppercase shadow-lg ${
          apiKey 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        }`}>
          {apiKey ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              VietMap Tiles Live
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Demo Map Mode (No key)
            </>
          )}
        </div>
      </div>

      {/* Selected Location info display card */}
      {selectedLocation && (
        <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-3 text-xs animate-in">
          <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-white">Điểm hẹn đã chọn: <span className="text-blue-400">{selectedLocation}</span></p>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              <span className="font-bold text-emerald-400">Chỉ số an toàn:</span> {
                MAP_HOTSPOTS.find(s => s.name === selectedLocation)?.safety || 'Tọa độ tùy chỉnh bên ngoài điểm hẹn cố định. Vui lòng đảm bảo liên hệ gặp gỡ ở nơi công cộng an toàn.'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
