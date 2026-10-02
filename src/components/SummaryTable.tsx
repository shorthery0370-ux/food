import { Restaurant } from '../types';
import { CatchTableBadge } from './CatchTableBadge';
import { ArrowUpRight } from 'lucide-react';

interface SummaryTableProps {
  restaurants: Restaurant[];
  onSelect: (restaurant: Restaurant) => void;
}

export function SummaryTable({ restaurants, onSelect }: SummaryTableProps) {
  return (
    <div className="overflow-x-auto border border-[#E7E4DC] bg-white">
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="bg-[#F6F4EE] border-b border-[#E7E4DC] text-[#555C66] uppercase tracking-wider text-[11px] sm:text-xs">
            <th className="py-3.5 px-4 font-semibold">식당명</th>
            <th className="py-3.5 px-4 font-semibold">지역 (위치)</th>
            <th className="py-3.5 px-4 font-semibold">대표 메뉴</th>
            <th className="py-3.5 px-4 font-semibold">영업시간 및 휴무</th>
            <th className="py-3.5 px-4 font-semibold">캐치테이블 여부</th>
            <th className="py-3.5 px-4 font-semibold text-right">상세</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EFECE6]">
          {restaurants.map((restaurant, idx) => {
            const signatureItems = restaurant.menuList.filter((m) => m.isMustTry).slice(0, 2);
            return (
              <tr
                key={restaurant.id}
                onClick={() => onSelect(restaurant)}
                className="hover:bg-[#FAF9F5] transition-colors cursor-pointer group"
              >
                {/* Name */}
                <td className="py-4 px-4 font-bold text-[#1E2022]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#89919C] text-xs font-mono tabular-nums">0{idx + 1}</span>
                    <span className="group-hover:text-[#E86034] transition-colors">
                      {restaurant.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#78808C] font-normal mt-0.5">
                    {restaurant.category}
                  </div>
                </td>

                {/* Region */}
                <td className="py-4 px-4 text-[#393E46]">
                  <div className="font-medium text-[#1E2022]">{restaurant.region}</div>
                  <div className="text-[11px] text-[#78808C] truncate max-w-[150px]">
                    {restaurant.address}
                  </div>
                </td>

                {/* Menu */}
                <td className="py-4 px-4 text-[#2E3339]">
                  <div className="space-y-0.5">
                    {signatureItems.map((item) => (
                      <div key={item.name} className="flex items-center gap-1.5">
                        <span className="font-medium text-[#1F2328]">{item.name}</span>
                        <span className="text-[11px] text-[#78808C] tabular-nums">({item.price})</span>
                      </div>
                    ))}
                  </div>
                </td>

                {/* Operating hours */}
                <td className="py-4 px-4 text-[#2E3339]">
                  <div className="font-medium">{restaurant.operatingHours.hours}</div>
                  <div className="text-[11px] text-[#B33E1D] mt-0.5">
                    휴무: {restaurant.operatingHours.closedDays}
                  </div>
                </td>

                {/* CatchTable */}
                <td className="py-4 px-4">
                  <CatchTableBadge catchTable={restaurant.catchTable} size="sm" />
                  <div className="text-[11px] text-[#69717C] mt-1 line-clamp-1 max-w-[200px]">
                    {restaurant.catchTable.tip}
                  </div>
                </td>

                {/* Action */}
                <td className="py-4 px-4 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(restaurant);
                    }}
                    className="inline-flex items-center gap-1 text-xs text-[#E86034] font-semibold hover:underline"
                  >
                    <span>열기</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
