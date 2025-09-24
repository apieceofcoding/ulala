import { Link } from "react-router";
import logoDark from "@/assets/images/ulala_dark.png";
import logoLight from "@/assets/images/ulala.png";

interface TopBarProps {
  level?: number;
  onSettingsClick?: () => void;
  className?: string;
}

export function TopBar({ level = 1, onSettingsClick, className = "" }: TopBarProps) {
  return (
    <div className={`bg-bg-primary shadow-low ${className}`}>
      <div className="mx-auto max-w-none lg:max-w-6xl xl:max-w-6xl">
        <div className="flex items-center justify-between h-14 px-2 md:px-4">
        {/* 왼쪽: 로고 */}
        <div className="flex-shrink-0">
          <Link to="/" className="block">
            <div className="h-10 w-10 cursor-pointer transition-all duration-150 hover:opacity-80">
              <img
                src={logoLight}
                alt="Ulala"
                className="block h-full w-full object-contain dark:hidden rounded"
              />
              <img
                src={logoDark}
                alt="Ulala"
                className="hidden h-full w-full object-contain dark:block rounded"
              />
            </div>
          </Link>
        </div>

        {/* 중앙: 레벨 */}
        <div className="flex-1 flex justify-center">
          <span className="text-base font-semibold text-text-primary">
            Lv.{level}
          </span>
        </div>

        {/* 오른쪽: 설정 버튼 */}
        <div className="flex-shrink-0">
          <button
            onClick={onSettingsClick}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded transition-all duration-150 hover:bg-bg-tertiary active:bg-bg-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="메뉴"
          >
            <svg
              width="20"
              height="16"
              viewBox="0 0 20 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-text-secondary"
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