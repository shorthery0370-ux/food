import { useState, useMemo, useEffect } from 'react';
import {
  Code,
  Github,
  Compass,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Flame,
  Award,
  CalendarCheck,
  MapPinned,
} from 'lucide-react';
import { JEJU_RESTAURANTS, HERO_IMAGE } from './data/restaurants';
import { Restaurant } from './types';
import { RestaurantCard } from './components/RestaurantCard';
import { RestaurantModal } from './components/RestaurantModal';
import { SummaryTable } from './components/SummaryTable';
import { FilterBar } from './components/FilterBar';
import { GithubExportModal } from './components/GithubExportModal';

export default function App() {
  const [selectedDistrict, setSelectedDistrict] = useState<'all' | 'jeju-si' | 'seogwipo-si'>('all');
  const [catchTableFilter, setCatchTableFilter] = useState<'all' | 'available'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);

  // Local storage for bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jeju_food_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('jeju_food_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedIds]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered restaurants
  const filteredRestaurants = useMemo(() => {
    return JEJU_RESTAURANTS.filter((r) => {
      // District filter
      if (selectedDistrict !== 'all' && r.district !== selectedDistrict) {
        return false;
      }
      // CatchTable filter
      if (catchTableFilter === 'available' && !r.catchTable.available) {
        return false;
      }
      // Bookmarked filter
      if (showBookmarkedOnly && !bookmarkedIds.includes(r.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = r.name.toLowerCase().includes(query);
        const matchesRegion = r.region.toLowerCase().includes(query);
        const matchesAddress = r.address.toLowerCase().includes(query);
        const matchesCategory = r.category.toLowerCase().includes(query);
        const matchesMenu = r.menuList.some(
          (m) =>
            m.name.toLowerCase().includes(query) ||
            m.description.toLowerCase().includes(query)
        );
        return matchesName || matchesRegion || matchesAddress || matchesCategory || matchesMenu;
      }
      return true;
    });
  }, [selectedDistrict, catchTableFilter, showBookmarkedOnly, bookmarkedIds, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F4] text-[#1E2022] font-sans selection:bg-[#E86034] selection:text-white">
      {/* Top Bar Contract: 3 zones strictly */}
      <header className="sticky top-0 z-40 bg-[#F8F7F4]/95 backdrop-blur-md border-b border-[#E8E4DA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="/"
            className="text-lg sm:text-xl font-bold tracking-tight text-[#1E2022] hover:text-[#E86034] transition-colors"
          >
            JEJU TASTE
          </a>

          {/* Zone 2: 4 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#555C66]">
            <a href="#restaurants" className="hover:text-[#1E2022] transition-colors">
              맛집 5선
            </a>
            <a href="#comparison" className="hover:text-[#1E2022] transition-colors">
              요약 비교표
            </a>
            <a href="#waiting-guide" className="hover:text-[#1E2022] transition-colors">
              웨이팅 공략법
            </a>
            <a href="#travel-route" className="hover:text-[#1E2022] transition-colors">
              추천 일정 동선
            </a>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsGithubModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1E2022] hover:bg-[#E86034] transition-colors whitespace-nowrap"
            >
              <Github className="w-3.5 h-3.5" />
              <span>깃허브 코드 복사</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative border-b border-[#E8E4DA] overflow-hidden bg-[#1E2328]">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 z-10 text-white space-y-4">
            {/* Zero-Pill text metadata */}
            <div className="flex items-center gap-2 text-xs text-[#FF9E7D] tracking-wide font-medium">
              <span>제주 향토 한식 큐레이션</span>
              <span aria-hidden="true">·</span>
              <span>2026 최신 업데이트</span>
              <span aria-hidden="true">·</span>
              <span>현장 & 캐치테이블 검증</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.2] text-balance">
              제주 현지인이 인정한<br />한식 맛집 BEST 5
            </h1>

            <p className="text-sm sm:text-base text-[#D0D6DF] max-w-xl leading-relaxed">
              제주 여행에서 절대 실패하지 않는 대표 한식 5곳의 <strong>지역, 대표 메뉴 및 가격, 영업시간 및 휴무, 캐치테이블 원격 줄서기 가능 여부</strong>를 한눈에 확인하세요.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#restaurants"
                className="px-5 py-2.5 text-xs font-semibold bg-[#E86034] text-white hover:bg-[#D45127] transition-colors inline-flex items-center gap-1.5"
              >
                <span>5대 맛집 리스트 보기</span>
                <ChevronRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => setIsGithubModalOpen(true)}
                className="px-4 py-2.5 text-xs font-semibold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors inline-flex items-center gap-1.5"
              >
                <Code className="w-3.5 h-3.5" />
                <span>README & JSON 내보내기</span>
              </button>
            </div>
          </div>

          {/* Hero visual frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/10 shadow-2xl bg-[#14181C]">
              <img
                src={HERO_IMAGE}
                alt="제주 전통 한식과 평화로운 제주의 정취"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                <span className="text-[#FF8D66] font-semibold block">제주 미식 탐방</span>
                <span className="text-white/80">흑돼지 · 은갈치조림 · 돔베고기 · 전복돌솥밥 · 성게해물물회</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-14">
        {/* Curated Key Metric Strip (Unboxed, clean editorial) */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 border-b border-[#E8E4DA] text-center">
          <div className="p-4 bg-white border border-[#E7E4DC]">
            <div className="text-2xl font-bold text-[#1E2022] tabular-nums">5곳</div>
            <div className="text-xs text-[#6F7680] mt-1">엄선된 대표 한식당</div>
          </div>
          <div className="p-4 bg-white border border-[#E7E4DC]">
            <div className="text-2xl font-bold text-[#E86034] tabular-nums">3곳</div>
            <div className="text-xs text-[#6F7680] mt-1">캐치테이블 원격 줄서기 지원</div>
          </div>
          <div className="p-4 bg-white border border-[#E7E4DC]">
            <div className="text-2xl font-bold text-[#1E2022] tabular-nums">2개 구역</div>
            <div className="text-xs text-[#6F7680] mt-1">제주시 & 서귀포시 전역 커버</div>
          </div>
          <div className="p-4 bg-white border border-[#E7E4DC]">
            <div className="text-2xl font-bold text-[#0F6F54] tabular-nums">100%</div>
            <div className="text-xs text-[#6F7680] mt-1">현장 검증 리뷰 & 메뉴가</div>
          </div>
        </section>

        {/* Section: Restaurants List */}
        <section id="restaurants" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#E86034] font-semibold">
                <Flame className="w-3.5 h-3.5" />
                <span>CURATED SELECTION</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#1E2022] mt-1">
                제주 한식 맛집 5선
              </h2>
            </div>
            <span className="text-xs text-[#717883] tabular-nums">
              총 {filteredRestaurants.length}개의 식당이 표시됩니다
            </span>
          </div>

          {/* Interactive Filter Bar */}
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedDistrict={selectedDistrict}
            onDistrictChange={setSelectedDistrict}
            catchTableFilter={catchTableFilter}
            onCatchTableFilterChange={setCatchTableFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showBookmarkedOnly={showBookmarkedOnly}
            onToggleBookmarkedOnly={() => setShowBookmarkedOnly((prev) => !prev)}
            totalCount={JEJU_RESTAURANTS.length}
            bookmarkedCount={bookmarkedIds.length}
          />

          {/* Content Rendering: Cards or Table */}
          {filteredRestaurants.length === 0 ? (
            <div className="py-16 text-center bg-white border border-[#E7E4DC] p-8 space-y-3">
              <p className="text-base font-semibold text-[#1E2022]">
                조건에 일치하는 맛집이 없습니다.
              </p>
              <p className="text-xs text-[#6F7680]">
                검색어를 변경하거나 필터를 초기화해 보세요.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedDistrict('all');
                  setCatchTableFilter('all');
                  setSearchQuery('');
                  setShowBookmarkedOnly(false);
                }}
                className="px-4 py-2 text-xs font-semibold bg-[#1E2022] text-white hover:bg-[#E86034] transition-colors"
              >
                전체 맛집 다시 보기
              </button>
            </div>
          ) : viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  isBookmarked={bookmarkedIds.includes(restaurant.id)}
                  onToggleBookmark={toggleBookmark}
                  onSelect={setActiveRestaurant}
                />
              ))}
            </div>
          ) : (
            <SummaryTable
              restaurants={filteredRestaurants}
              onSelect={setActiveRestaurant}
            />
          )}
        </section>

        {/* Section: Comprehensive Comparison Table (Anchor: #comparison) */}
        <section id="comparison" className="space-y-4 pt-6">
          <div>
            <div className="text-xs text-[#E86034] font-semibold">ALL-IN-ONE OVERVIEW</div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E2022] mt-1">
              5개 맛집 한눈에 비교하기
            </h2>
            <p className="text-xs sm:text-sm text-[#616873] mt-1">
              지역, 대표 메뉴, 가격, 영업시간, 캐치테이블 예약 지원 여부를 직접 비교해 보세요.
            </p>
          </div>

          <SummaryTable
            restaurants={JEJU_RESTAURANTS}
            onSelect={setActiveRestaurant}
          />
        </section>

        {/* Section: Waiting Strategy & CatchTable Guide (Anchor: #waiting-guide) */}
        <section id="waiting-guide" className="p-6 sm:p-8 bg-white border border-[#E8E4DA] space-y-6">
          <div>
            <div className="text-xs text-[#E86034] font-semibold">WAITING HACKS</div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E2022] mt-1">
              캐치테이블 & 현장 웨이팅 실전 공략 가이드
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-[#454B54] leading-relaxed">
            <div className="p-4 bg-[#FAF9F5] border-l-2 border-[#0F6F54] space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[#0F6F54]">
                <CalendarCheck className="w-4 h-4" />
                <span>캐치테이블 원격 줄서기 매장 (3곳)</span>
              </div>
              <p>
                <strong>숙성도, 가시아방국수, 순옥이네명가</strong>는 캐치테이블 원격 대기를 지원합니다.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-xs text-[#5E6571]">
                <li><strong>숙성도 노형본점:</strong> 오전 11:00 / 오후 15:30 정각 앱 오픈 시 즉시 등록 필수</li>
                <li><strong>순옥이네명가:</strong> 제주공항 착륙 직후 수하물 찾는 동안 원격 등록하면 최적</li>
                <li><strong>가시아방국수:</strong> 성산/섭지코지 도착 30~40분 전 앱으로 대기 신청</li>
              </ul>
            </div>

            <div className="p-4 bg-[#FAF9F5] border-l-2 border-[#8A4F1D] space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[#8A4F1D]">
                <MapPinned className="w-4 h-4" />
                <span>현장 대기 / 수기 예약 매장 (2곳)</span>
              </div>
              <p>
                <strong>맛나식당, 명진전복</strong>은 앱 예약을 받지 않고 전통적인 현장 방식을 유지합니다.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-xs text-[#5E6571]">
                <li><strong>맛나식당:</strong> 아침 06:00 매장 앞 수기 장부에 이름/시간 작성 후 지정 시간에 방문</li>
                <li><strong>명진전복:</strong> 매장 카운터에서 선주문 및 전화번호 등록 후 바다 앞 대기실 이용</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section: Recommended Itinerary Route (Anchor: #travel-route) */}
        <section id="travel-route" className="p-6 sm:p-8 bg-[#FAF9F6] border border-[#E8E4DA] space-y-6">
          <div>
            <div className="text-xs text-[#E86034] font-semibold">ITINERARY GUIDE</div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E2022] mt-1">
              동선별 최적 방문 일정 제안
            </h2>
            <p className="text-xs sm:text-sm text-[#616873] mt-1">
              공항 도착 당일과 성산·구좌 동부권 여행 시 추천하는 동선입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="bg-white p-5 border border-[#E7E4DC] space-y-3">
              <div className="font-bold text-[#1E2022] text-sm flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#E86034]" />
                <span>코스 A: 제주공항 & 제주시내 중심 동선</span>
              </div>
              <p className="text-[#515863]">
                공항에서 10~15분 거리인 도두동과 노형동을 묶어 여행 첫날 또는 마지막 날 식사로 추천합니다.
              </p>
              <div className="p-3 bg-[#F8F7F4] text-xs space-y-1">
                <div><strong>도착 첫 끼:</strong> 순옥이네명가 (시원한 전복물회 & 성게미역국)</div>
                <div><strong>저녁 만찬:</strong> 숙성도 노형본점 (720시간 숙성 흑돼지 & 갈치속젓볶음밥)</div>
              </div>
            </div>

            <div className="bg-white p-5 border border-[#E7E4DC] space-y-3">
              <div className="font-bold text-[#1E2022] text-sm flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#E86034]" />
                <span>코스 B: 동부권 (성산일출봉 & 구좌 해안) 동선</span>
              </div>
              <p className="text-[#515863]">
                동쪽 일출과 해맞이해안로 드라이브를 즐기며 아침, 점심, 저녁을 구성할 수 있습니다.
              </p>
              <div className="p-3 bg-[#F8F7F4] text-xs space-y-1">
                <div><strong>아침 식사 (08:30~):</strong> 맛나식당 (매콤달콤 제주 은갈치조림)</div>
                <div><strong>점심 식사 (12:00~):</strong> 가시아방국수 (진한 고기국수 & 돔베고기)</div>
                <div><strong>저녁 식사 (17:00~):</strong> 명진전복 (구수한 전복돌솥밥 & 버터 전복구이)</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: GitHub Ready Banner */}
        <section className="bg-[#1E2022] text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold">
              깃허브(GitHub) 저장소에 바로 업로드하세요
            </h3>
            <p className="text-xs sm:text-sm text-[#A0A8B2]">
              정리된 5개 식당 마크다운 표, TypeScript 데이터 모델, JSON 데이터셋이 완벽하게 준비되어 있습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsGithubModalOpen(true)}
            className="px-5 py-2.5 text-xs font-semibold bg-[#E86034] hover:bg-[#D45127] text-white transition-colors flex items-center gap-2 shrink-0"
          >
            <Github className="w-4 h-4" />
            <span>깃허브 코드 & 데이터 받기</span>
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E8E4DA] bg-white py-8 text-xs text-[#717883]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-[#1E2022]">JEJU TASTE</span>
            <span className="mx-2">·</span>
            <span>제주 한식 맛집 5선 큐레이션 가이드</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsGithubModalOpen(true)}
              className="hover:text-[#1E2022] transition-colors"
            >
              GitHub README 보기
            </button>
            <span>·</span>
            <span>영업시간 및 가격은 매장 사정에 따라 변동될 수 있습니다</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {activeRestaurant && (
        <RestaurantModal
          restaurant={activeRestaurant}
          isBookmarked={bookmarkedIds.includes(activeRestaurant.id)}
          onToggleBookmark={toggleBookmark}
          onClose={() => setActiveRestaurant(null)}
        />
      )}

      {isGithubModalOpen && (
        <GithubExportModal onClose={() => setIsGithubModalOpen(false)} />
      )}
    </div>
  );
}
