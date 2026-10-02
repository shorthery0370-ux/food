import { useState } from 'react';
import { X, Copy, Check, FileText, Database, GitBranch, Download } from 'lucide-react';
import { JEJU_RESTAURANTS } from '../data/restaurants';

interface GithubExportModalProps {
  onClose: () => void;
}

export function GithubExportModal({ onClose }: GithubExportModalProps) {
  const [activeTab, setActiveTab] = useState<'readme' | 'json' | 'git'>('readme');
  const [copied, setCopied] = useState(false);

  const markdownContent = `# 🍊 제주 한식 맛집 BEST 5 큐레이션 (Jeju Taste Best 5)

> 제주 현지 한식 맛집 5곳의 **지역, 대표 메뉴, 영업시간, 캐치테이블 예약/원격줄서기 여부** 완벽 정리!

## 📋 맛집 5곳 핵심 요약 비교표

| 식당명 | 지역 | 대표 메뉴 | 영업시간 & 휴무 | 캐치테이블 |
| :--- | :--- | :--- | :--- | :---: |
${JEJU_RESTAURANTS.map((r) => {
  const sig = r.menuList.filter((m) => m.isMustTry).map((m) => `${m.name}(${m.price})`).join(', ');
  const ct = r.catchTable.available ? '✅ 원격줄서기 가능' : '❌ 불가 (현장대기)';
  return `| **${r.name}** | ${r.region} | ${sig} | ${r.operatingHours.hours} / ${r.operatingHours.closedDays} | ${ct} |`;
}).join('\n')}

---

## 🍽️ 상세 매장 정보

${JEJU_RESTAURANTS.map((r, i) => `### ${i + 1}. ${r.name} (${r.category})
- **주소**: ${r.address} (전화: ${r.phone})
- **영업시간**: ${r.operatingHours.hours} ${r.operatingHours.breakTime ? `(브레이크타임: ${r.operatingHours.breakTime})` : ''}
- **정기휴무**: ${r.operatingHours.closedDays}
- **캐치테이블 여부**: ${r.catchTable.available ? '가능' : '불가'} (${r.catchTable.typeText})
- **웨이팅 팁**: ${r.catchTable.tip}
- **대표메뉴**:
${r.menuList.map((m) => `  - ${m.name}: ${m.price} - ${m.description}`).join('\n')}
- **주차**: ${r.parkingInfo}
`).join('\n---\n\n')}

## 🚀 빠른 로컬 실행 (Getting Started)
\`\`\`bash
# 1. 패키지 설치
npm install

# 2. 개발 서버 시작
npm run dev
\`\`\`
`;

  const jsonContent = JSON.stringify(
    JEJU_RESTAURANTS.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      region: r.region,
      address: r.address,
      phone: r.phone,
      rating: r.rating,
      operatingHours: r.operatingHours,
      catchTable: {
        available: r.catchTable.available,
        type: r.catchTable.typeText,
        tip: r.catchTable.tip,
      },
      menuList: r.menuList,
    })),
    null,
    2
  );

  const gitCommands = `# 1. Git 저장소 초기화
git init

# 2. 전체 파일 스테이징
git add .

# 3. 커밋 생성
git commit -m "feat: 제주 한식 맛집 5선 큐레이션 리스트 완성 (지역, 메뉴, 영업시간, 캐치테이블)"

# 4. GitHub 원격 저장소 연결 (본인 저장소 URL로 변경)
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/jeju-korean-food-best5.git

# 5. 브랜치명 변경 및 메인 브랜치 푸시
git branch -M main
git push -u origin main
`;

  const currentContent =
    activeTab === 'readme'
      ? markdownContent
      : activeTab === 'json'
      ? jsonContent
      : gitCommands;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename =
      activeTab === 'readme'
        ? 'README.md'
        : activeTab === 'json'
        ? 'jeju-restaurants.json'
        : 'git-commands.sh';
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white border border-[#DDD9CE] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E4DA] bg-[#F7F6F1]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#1E2022]">
              깃허브(GitHub) 코드 & 데이터 내보내기
            </h2>
            <p className="text-xs text-[#6F7680] mt-0.5">
              깃허브 리포지토리에 올리기 위한 README.md 마크다운 표, JSON 데이터 및 Git 명령어를 제공합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="p-1.5 text-[#5F6671] hover:text-black hover:bg-black/5 rounded-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 bg-[#FAF9F6] border-b border-[#ECE8DF]">
          <button
            type="button"
            onClick={() => setActiveTab('readme')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors ${
              activeTab === 'readme'
                ? 'bg-[#1E2022] text-white'
                : 'text-[#4F5661] hover:text-[#1E2022] hover:bg-[#EFECE4]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>README.md 마크다운 표</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors ${
              activeTab === 'json'
                ? 'bg-[#1E2022] text-white'
                : 'text-[#4F5661] hover:text-[#1E2022] hover:bg-[#EFECE4]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>JSON 데이터</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('git')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors ${
              activeTab === 'git'
                ? 'bg-[#1E2022] text-white'
                : 'text-[#4F5661] hover:text-[#1E2022] hover:bg-[#EFECE4]'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Git 푸시 명령어</span>
          </button>
        </div>

        {/* Code Content Box */}
        <div className="p-6 flex-1 overflow-y-auto bg-[#181A1B] text-[#D8DEE9]">
          <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap selection:bg-[#E86034] selection:text-white">
            {currentContent}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#F5F3ED] border-t border-[#E5E0D5] flex items-center justify-between gap-3">
          <div className="text-xs text-[#6B727D]">
            {activeTab === 'readme' && '💡 깃허브 저장소 첫 페이지에 그대로 표시되는 README입니다.'}
            {activeTab === 'json' && '💡 모바일 앱, 백엔드 API, 또는 프론트엔드 연동에 즉시 사용 가능합니다.'}
            {activeTab === 'git' && '💡 터미널에서 위 명령어를 차례대로 입력하여 깃허브에 푸시하세요.'}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold border border-[#D0CBC0] bg-white text-[#22272E] hover:bg-[#ECE9E0] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>파일 다운로드</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-[#E86034] text-white hover:bg-[#D45127] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>복사되었습니다!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>코드 전체 복사</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
