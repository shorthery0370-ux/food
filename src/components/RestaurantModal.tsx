import { useState } from 'react';
import {
  X,
  Clock,
  MapPin,
  Phone,
  Bookmark,
  ExternalLink,
  Car,
  Compass,
  Check,
  Copy,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { Restaurant } from '../types';
import { CatchTableBadge } from './CatchTableBadge';

interface RestaurantModalProps {
  restaurant: Restaurant;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onClose: () => void;
}

export function RestaurantModal({
  restaurant,
  isBookmarked,
  onToggleBookmark,
  onClose,
}: RestaurantModalProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(restaurant.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const copyTravelSummary = () => {
    const text = `[제주 한식 맛집] ${restaurant.name} (${restaurant.category})
- 지역: ${restaurant.region} (${restaurant.address})
- 영업시간: ${restaurant.operatingHours.hours} (휴무: ${restaurant.operatingHours.closedDays})
- 캐치테이블: ${restaurant.catchTable.available ? '가능' : '불가(현장)'}
- 웨이팅 팁: ${restaurant.catchTable.tip}
- 대표메뉴: ${restaurant.menuList.map((m) => `${m.name}(${m.price})`).join(', ')}`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(restaurant.name + ' ' + restaurant.address)}`;
  const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(restaurant.name)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white border border-[#DDD9CE] shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Media Banner */}
        <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden bg-[#242A30]">
          <img
            src={restaurant.image}
            alt={restaurant.imageAlt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Close & Action Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleBookmark(restaurant.id)}
              aria-label={isBookmarked ? '저장 취소' : '맛집 저장'}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked
                  ? 'bg-[#E86034] text-white'
                  : 'bg-white/90 text-[#2B3037] hover:bg-white hover:text-black'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="p-2 rounded-full bg-white/90 text-[#2B3037] hover:bg-white hover:text-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title on Media Scrim */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 text-xs text-white/80 mb-1">
              <span className="text-[#FF8D66] font-medium">{restaurant.region}</span>
              <span aria-hidden="true">·</span>
              <span>{restaurant.category}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">★ {restaurant.rating.toFixed(1)} ({restaurant.reviewCount.toLocaleString()} 리뷰)</span>
            </div>
            <h2 id="modal-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {restaurant.name}
            </h2>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 space-y-7 max-h-[75vh] overflow-y-auto">
          {/* Story & Intro */}
          <div>
            <h3 className="text-sm font-semibold text-[#1E2022] uppercase tracking-wider mb-2">
              식당 소개
            </h3>
            <p className="text-sm sm:text-base text-[#444A52] leading-relaxed">
              {restaurant.story}
            </p>
          </div>

          {/* CatchTable & Waiting Strategy Module */}
          <div className="bg-[#FAF9F5] border border-[#E8E4DA] p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E4DA]">
              <div className="flex items-center gap-2.5">
                <CatchTableBadge catchTable={restaurant.catchTable} size="md" />
                <span className="text-xs text-[#6C747E]">({restaurant.catchTable.typeText})</span>
              </div>

              {restaurant.catchTable.available && restaurant.catchTable.bookingUrl && (
                <a
                  href={restaurant.catchTable.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#E86034] text-white text-xs font-semibold hover:bg-[#D45127] transition-colors"
                >
                  <span>캐치테이블 앱 바로가기</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="mt-3 text-xs sm:text-sm text-[#4E5661] leading-relaxed">
              <span className="font-semibold text-[#1F2328]">웨이팅 전략 & 예약 가이드:</span>
              <p className="mt-1">{restaurant.catchTable.tip}</p>
            </div>
          </div>

          {/* Menu & Pricing */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#1E2022] uppercase tracking-wider">
                대표 메뉴 및 가격
              </h3>
              <span className="text-xs text-[#7B838E]">매장 사정에 따라 변동될 수 있습니다</span>
            </div>

            <div className="divide-y divide-[#EFECE6] border-t border-b border-[#EFECE6]">
              {restaurant.menuList.map((item) => (
                <div key={item.name} className="py-3 flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#1E2022]">{item.name}</span>
                      {item.isMustTry && (
                        <span className="text-[11px] font-semibold text-[#E86034]">추천</span>
                      )}
                    </div>
                    <p className="text-xs text-[#636B75]">{item.description}</p>
                  </div>
                  <span className="text-sm font-bold text-[#1E2022] tabular-nums whitespace-nowrap shrink-0">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Operating Hours & Days */}
          <div>
            <h3 className="text-sm font-semibold text-[#1E2022] uppercase tracking-wider mb-3">
              영업 시간 및 정기 휴무
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm bg-[#F8F7F4] p-4">
              <div>
                <span className="text-[#767E8A] block mb-0.5">운영 시간</span>
                <span className="font-semibold text-[#1E2022]">{restaurant.operatingHours.hours}</span>
              </div>
              <div>
                <span className="text-[#767E8A] block mb-0.5">정기 휴무</span>
                <span className="font-semibold text-[#B33E1D]">{restaurant.operatingHours.closedDays}</span>
              </div>
              {restaurant.operatingHours.breakTime && (
                <div>
                  <span className="text-[#767E8A] block mb-0.5">브레이크타임</span>
                  <span className="font-medium text-[#1E2022]">{restaurant.operatingHours.breakTime}</span>
                </div>
              )}
              {restaurant.operatingHours.lastOrder && (
                <div>
                  <span className="text-[#767E8A] block mb-0.5">라스트오더</span>
                  <span className="font-medium text-[#1E2022]">{restaurant.operatingHours.lastOrder}</span>
                </div>
              )}
            </div>
          </div>

          {/* Location, Map & Transport */}
          <div>
            <h3 className="text-sm font-semibold text-[#1E2022] uppercase tracking-wider mb-3">
              위치 및 찾아가는 길
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-[#4E5661]">
              <div className="flex items-start justify-between gap-3 p-3.5 bg-[#FAF9F6] border border-[#EAE7DF]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#8A919C] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium text-[#1E2022] block">{restaurant.address}</span>
                    <span className="text-xs text-[#7B838F]">전화: {restaurant.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={copyAddress}
                    className="px-2.5 py-1 text-xs border border-[#D5D0C5] bg-white hover:bg-[#F2EFE8] text-[#2F343B] transition-colors flex items-center gap-1"
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#0F6F54]" />
                        <span>복사됨</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>주소 복사</span>
                      </>
                    )}
                  </button>
                  <a
                    href={`tel:${restaurant.phone}`}
                    className="px-2.5 py-1 text-xs border border-[#D5D0C5] bg-white hover:bg-[#F2EFE8] text-[#2F343B] transition-colors flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>전화</span>
                  </a>
                </div>
              </div>

              {/* Map Links */}
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={naverMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs bg-[#03C75A]/10 text-[#009E45] border border-[#03C75A]/30 hover:bg-[#03C75A]/20 transition-colors inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>네이버 지도에서 보기</span>
                </a>
                <a
                  href={kakaoMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs bg-[#FEE500]/30 text-[#3C1E1E] border border-[#FEE500] hover:bg-[#FEE500]/50 transition-colors inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>카카오맵에서 보기</span>
                </a>
              </div>

              {/* Parking & Transport */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="flex items-start gap-2 text-[#565E68]">
                  <Car className="w-3.5 h-3.5 text-[#88909A] mt-0.5 shrink-0" />
                  <span><strong>주차 안내: </strong>{restaurant.parkingInfo}</span>
                </div>
                <div className="flex items-start gap-2 text-[#565E68]">
                  <Compass className="w-3.5 h-3.5 text-[#88909A] mt-0.5 shrink-0" />
                  <span><strong>교통 팁: </strong>{restaurant.transportTip}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#F5F3ED] border-t border-[#E5E0D5] flex items-center justify-between">
          <button
            type="button"
            onClick={copyTravelSummary}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#464D57] hover:text-[#1E2022] transition-colors"
          >
            {copiedSummary ? (
              <>
                <Check className="w-4 h-4 text-[#0F6F54]" />
                <span className="text-[#0F6F54]">일정 요약 복사 완료!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>카톡/메모용 요약 복사</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#1E2022] hover:bg-black transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
