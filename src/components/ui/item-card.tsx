'use client';

import { CATEGORY_MAP, CONDITION_LABELS, Item } from '@/lib/data';
import { useStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Clock, Heart } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  idx?: number;
}

export default function ItemCard({ item, idx = 0 }: ItemCardProps) {
  const cat = CATEGORY_MAP[item.category];
  const { toggleFavorite, favorites } = useStore();
  const isFav = favorites.includes(item.id);

  let badgeClass = 'dn-badge-amber';
  let badgeText = '🔄 Trao đổi';

  if (item.exchangeType === 'mienphi') {
    badgeClass = 'dn-badge-green';
    badgeText = '🍀 Miễn phí';
  } else if (item.exchangeType === 'sale') {
    badgeClass = 'dn-badge-amber';
    badgeText = `💰 Bán: ${(item.price || 0).toLocaleString('vi-VN')} đ`;
  } else if (item.exchangeType === 'lost') {
    badgeClass = 'dn-badge-rose';
    badgeText = '🔍 Mất đồ';
  } else if (item.exchangeType === 'found') {
    badgeClass = 'dn-badge-amber';
    badgeText = '📢 Nhặt được';
  }

  const displayImage = item.image || 'https://images.unsplash.com/photo-1595787143151-e601da948ea8?auto=format&fit=crop&w=600&h=400&q=80';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1, duration: 0.5, type: 'spring', stiffness: 100 }}
    >
      <div className="dn-card overflow-hidden flex flex-col group relative">
        <Link href={`/detail/${item.id}`}>
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={displayImage}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-3 left-3 flex gap-2">
              <span className={`dn-badge text-white shadow-lg backdrop-blur-sm ${badgeClass}`}>
                {badgeText}
              </span>
            </div>
            {item.isFeatured && (
              <div className="absolute top-3 right-3">
                <span className="dn-badge bg-amber-400/90 text-amber-900 shadow-lg pulse-glow">⭐ Nổi bật</span>
              </div>
            )}
          </div>
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="dn-badge dn-badge-amber">
                {cat.emoji} {cat.label}
              </span>
              <span className="dn-badge dn-badge-green">
                ✨ {CONDITION_LABELS[item.condition]}
              </span>
            </div>
            <h3 className="font-bold text-base mb-2 line-clamp-1 group-hover:text-[var(--dn-border-strong)] transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-[var(--dn-text-secondary)] mb-4 line-clamp-2 flex-grow leading-relaxed">
              {item.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-[var(--dn-text-secondary)] mb-4">
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {item.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {item.createdAt}
              </span>
            </div>
            <div className="border-t pt-3 flex items-center justify-between" style={{ borderColor: 'color-mix(in oklch, var(--dn-text-secondary) 20%, transparent)' }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[var(--dn-border-strong)] flex items-center justify-center text-xs font-bold text-[var(--dn-text-inverse)] shadow-sm">
                  {item.postedBy.charAt(0)}
                </div>
                <span className="text-sm font-medium truncate max-w-[120px]">{item.postedBy}</span>
              </div>
              <span className="text-xs font-semibold text-[var(--dn-border-strong)]">
                {item.requestedCount} người quan tâm
              </span>
            </div>
          </div>
        </Link>
        <motion.button
          onClick={(e) => { e.preventDefault(); toggleFavorite(item.id); }}
          className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md z-20"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          aria-label={isFav ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
        >
          <Heart size={16} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
        </motion.button>
      </div>
    </motion.div>
  );
}
