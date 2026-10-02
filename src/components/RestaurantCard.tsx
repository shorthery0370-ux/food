import { useState } from 'react';
import { Bookmark, Clock, MapPin, Phone, Utensils, ChevronRight, Check } from 'lucide-react';
import { Restaurant } from '../types';
import { CatchTableBadge } from './CatchTableBadge';

interface RestaurantCardProps {
  restaurant: Restaurant;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onSelect: (restaurant: Restaurant) => void;
}

export function RestaurantCard({
  restaurant,
  isBookmarked,
  onToggleBookmark,
  onSelect,
}: RestaurantCardProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(restaurant.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const signatureMustTries = restaurant.menuList.filter((m) => m.isMustTry).slice(0, 2);

  return (
    <article
      onClick={() => onSelect(restaurant)}
      className="group relative flex flex-col bg-white border border-[#E7E5E0] hover:border-[#1E2022]/40 transition-colors duration-200 cursor-pointer overflow-hidden shadow-xs hover:shadow-sm"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EFECE6]">
        {!imgError ? (
          <img
            src={restaurant.image}
            alt={restaurant.imageAlt}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#E5E2DC] text-[#636A73]">
            <Utensils className="w-8 h-8 opacity-40" />
          </div>
        )}

        {/* CatchTable Status overlay strip (clean minimal corner indicator) */}
        <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 text-xs border border-black/5 shadow-xs">
          <CatchTableBadge catchTable={restaurant.catchTable} size="sm" />
        </div>

        {/* Bookmark action */}
        <button
          type="button"
          aria-label={isBookmarked ? '저장 해제' : '맛집 저장'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(restaurant.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isBookmarked
              ? 'bg-[#E86034] text-white shadow-xs'
              : 'bg-white/90 text-[#4B525B] hover:text-[#1E2022] hover:bg-white'
          }`}
        >
          <Bookmark className="w-4 h-4 fill-current" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Unboxed Metadata Header (Zero-Pill Discipline) */}
        <div className="flex items-center gap-2 text-xs text-[#6F7680] mb-1.5">
          <span className="font-medium text-[#E86034]">{restaurant.region}</span>
          <span aria-hidden="true">·</span>
          <span>{restaurant.category}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">★ {restaurant.rating.toFixed(1)}</span>
        </div>

        {/* Restaurant Name */}
        <h3 className="text-lg font-bold text-[#1E2022] tracking-tight group-hover:text-[#E86034] transition-colors">
          {restaurant.name}
        </h3>

        {/* Summary */}
        <p className="mt-1.5 text-sm text-[#4A5059] leading-relaxed line-clamp-2">
          {restaurant.summary}
        </p>

        {/* Key Info Row: Operating Hours */}
        <div className="mt-4 pt-3 border-t border-[#F0EEEA] space-y-2 text-xs text-[#525962]">
          <div className="flex items-start gap-2">
            <Clock className="w-3.5 h-3.5 text-[#88909A] mt-0.5 shrink-0" />
            <div className="flex-1 leading-snug">
              <span className="font-medium text-[#2A2E33]">{restaurant.operatingHours.hours}</span>
              {restaurant.operatingHours.breakTime && (
                <span className="text-[#7A828C] ml-1.5">
                  (휴게 {restaurant.operatingHours.breakTime})
                </span>
              )}
              <div className="text-[#8C5E35] mt-0.5">휴무: {restaurant.operatingHours.closedDays}</div>
            </div>
          </div>

          {/* Signature Menu Highlight */}
          <div className="flex items-start gap-2 pt-1">
            <Utensils className="w-3.5 h-3.5 text-[#88909A] mt-0.5 shrink-0" />
            <div className="flex-1 leading-snug">
              <span className="text-[#7A828C]">대표메뉴: </span>
              {signatureMustTries.map((menu, idx) => (
                <span key={menu.name} className="text-[#202327]">
                  {idx > 0 && <span className="text-[#9CA3AF] mx-1">/</span>}
                  <span className="font-medium">{menu.name}</span>
                  <span className="text-[#717A84] ml-1 text-[11px] tabular-nums">({menu.price})</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CatchTable waiting note / tip */}
        <div className="mt-3 text-xs bg-[#FAF9F6] p-2.5 border-l-2 border-[#E86034]/60 text-[#4E555E]">
          <p className="line-clamp-2">
            <span className="font-semibold text-[#22262B]">웨이팅 팁: </span>
            {restaurant.catchTable.tip}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-[#F0EEEA] flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleCopyAddress}
            className="flex items-center gap-1.5 text-[#5F6670] hover:text-[#1E2022] transition-colors py-1"
          >
            {copiedAddress ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#0F6F54]" />
                <span className="text-[#0F6F54] font-medium">주소 복사됨</span>
              </>
            ) : (
              <>
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate max-w-[140px]">{restaurant.region}</span>
              </>
            )}
          </button>

          <span className="flex items-center gap-0.5 text-[#E86034] font-semibold group-hover:translate-x-0.5 transition-transform">
            상세 보기
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
