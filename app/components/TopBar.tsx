import { useLocation } from "react-router";
import { TAB_INFO } from "@/types/navigation";

interface TopBarProps {
  level?: number;
  onSettingsClick?: () => void;
  className?: string;
}

export function TopBar({ level = 1, onSettingsClick, className = "" }: TopBarProps) {
  const location = useLocation();
  const currentTabName = TAB_INFO[location.pathname] || '홈';
  return (
    <div className={`bg-bg-primary dark:bg-bg-primary-dark border-b border-border-light dark:border-border-dark ${className}`}>
      <div className="mx-auto max-w-none lg:max-w-6xl xl:max-w-6xl">
        <div className="flex items-center justify-between h-14 px-2 md:px-spacing-m">
        {/* 왼쪽: 현재 탭 이름 */}
        <div className="flex-shrink-0">
          <span className="text-sm font-semibold text-text-primary dark:text-text-primary-dark md:text-xl">
            {currentTabName}
          </span>
        </div>

        {/* 중앙: 레벨 */}
        <div className="flex-1 flex justify-center">
          <span className="text-base font-semibold text-text-primary dark:text-text-primary-dark">
            Lv.{level}
          </span>
        </div>

        {/* 오른쪽: 설정 버튼 */}
        <div className="flex-shrink-0">
          <button
            onClick={onSettingsClick}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded transition-all duration-150 hover:bg-bg-tertiary dark:hover:bg-bg-tertiary-dark active:bg-bg-tertiary dark:active:bg-bg-tertiary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="메뉴"
          >
            <svg
              width="20"
              height="16"
              viewBox="0 0 20 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-text-secondary dark:text-text-secondary-dark"
            >
              <path
                d="M1 2h18M1 8h18M1 14h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}