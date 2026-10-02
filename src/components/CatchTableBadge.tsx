import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { CatchTableInfo } from '../types';

interface CatchTableBadgeProps {
  catchTable: CatchTableInfo;
  size?: 'sm' | 'md';
}

export function CatchTableBadge({ catchTable, size = 'md' }: CatchTableBadgeProps) {
  if (catchTable.available) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium ${
          size === 'sm' ? 'text-xs text-[#0F6F54]' : 'text-xs text-[#0F6F54]'
        }`}
      >
        <CheckCircle2 className={size === 'sm' ? 'w-3.5 h-3.5 text-[#0F6F54]' : 'w-4 h-4 text-[#0F6F54]'} />
        <span>캐치테이블 원격 가능</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium ${
        size === 'sm' ? 'text-xs text-[#8A4F1D]' : 'text-xs text-[#8A4F1D]'
      }`}
    >
      <Clock className={size === 'sm' ? 'w-3.5 h-3.5 text-[#8A4F1D]' : 'w-4 h-4 text-[#8A4F1D]'} />
      <span>현장 대기 (앱 예약 불가)</span>
    </span>
  );
}
