import { Search, LayoutGrid, Table, Bookmark } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDistrict: 'all' | 'jeju-si' | 'seogwipo-si';
  onDistrictChange: (district: 'all' | 'jeju-si' | 'seogwipo-si') => void;
  catchTableFilter: 'all' | 'available';
  onCatchTableFilterChange: (filter: 'all' | 'available') => void;
  viewMode: 'cards' | 'table';
  onViewModeChange: (mode: 'cards' | 'table') => void;
  showBookmarkedOnly: boolean;
  onToggleBookmarkedOnly: () => void;
  totalCount: number;
  bookmarkedCount: number;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedDistrict,
  onDistrictChange,
  catchTableFilter,
  onCatchTableFilterChange,
  viewMode,
  onViewModeChange,
  showBookmarkedOnly,
  onToggleBookmarkedOnly,
  totalCount,
  bookmarkedCount,
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      {/* Top row: Search input and district segmented control */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C939E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="식당명, 대표 메뉴(갈치, 흑돼지, 전복 등), 지역 검색..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#DDD9CE] text-sm text-[#1E2022] placeholder:text-[#9198A2] focus:outline-hidden focus:border-[#E86034] transition-colors"
          />
        </div>

        {/* District segment controls */}
        <div className="flex items-center gap-1 p-1 bg-[#EBE8E0] border border-[#DDD9CE] self-start md:self-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => onDistrictChange('all')}
            className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedDistrict === 'all'
                ? 'bg-white text-[#1E2022] shadow-xs'
                : 'text-[#565D67] hover:text-[#1E2022]'
            }`}
          >
            제주 전체 ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => onDistrictChange('jeju-si')}
            className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedDistrict === 'jeju-si'
                ? 'bg-white text-[#1E2022] shadow-xs'
                : 'text-[#565D67] hover:text-[#1E2022]'
            }`}
          >
            제주시 (공항·노형·구좌)
          </button>
          <button
            type="button"
            onClick={() => onDistrictChange('seogwipo-si')}
            className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedDistrict === 'seogwipo-si'
                ? 'bg-white text-[#1E2022] shadow-xs'
                : 'text-[#565D67] hover:text-[#1E2022]'
            }`}
          >
            서귀포시 (성산·섭지코지)
          </button>
        </div>
      </div>

      {/* Bottom row: CatchTable Filter, Bookmark filter, and View switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#EAE7DF] text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* CatchTable quick filter */}
          <div className="flex items-center gap-1 p-1 bg-[#EBE8E0] border border-[#DDD9CE]">
            <button
              type="button"
              onClick={() => onCatchTableFilterChange('all')}
              className={`px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                catchTableFilter === 'all'
                  ? 'bg-white text-[#1E2022] shadow-xs'
                  : 'text-[#565D67] hover:text-[#1E2022]'
              }`}
            >
              전체 웨이팅 방식
            </button>
            <button
              type="button"
              onClick={() => onCatchTableFilterChange('available')}
              className={`px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                catchTableFilter === 'available'
                  ? 'bg-white text-[#0F6F54] font-semibold shadow-xs'
                  : 'text-[#565D67] hover:text-[#1E2022]'
              }`}
            >
              ✓ 캐치테이블 원격 가능만
            </button>
          </div>

          {/* Bookmarks toggle */}
          <button
            type="button"
            onClick={onToggleBookmarkedOnly}
            className={`flex items-center gap-1.5 px-3 py-1.5 border transition-colors ${
              showBookmarkedOnly
                ? 'bg-[#E86034] text-white border-[#E86034]'
                : 'bg-white text-[#565D67] border-[#DDD9CE] hover:text-[#1E2022]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showBookmarkedOnly ? 'fill-current' : ''}`} />
            <span>저장된 맛집만 ({bookmarkedCount})</span>
          </button>
        </div>

        {/* View Mode switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#EBE8E0] border border-[#DDD9CE]">
          <button
            type="button"
            onClick={() => onViewModeChange('cards')}
            title="카드 뷰"
            className={`p-1.5 transition-colors ${
              viewMode === 'cards'
                ? 'bg-white text-[#1E2022] shadow-xs'
                : 'text-[#6C737E] hover:text-[#1E2022]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            title="테이블 비교 뷰"
            className={`p-1.5 transition-colors ${
              viewMode === 'table'
                ? 'bg-white text-[#1E2022] shadow-xs'
                : 'text-[#6C737E] hover:text-[#1E2022]'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
