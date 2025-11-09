import { Link, useNavigate } from "react-router";
import logoDark from "@/assets/images/ulala_dark.png";
import logoLight from "@/assets/images/ulala.png";
import { useAuth } from "@/contexts/AuthContext";

interface TopBarProps {
  level?: number;
  onSettingsClick?: () => void;
  className?: string;
}

export function TopBar({
  level = 1,
  onSettingsClick,
  className = "",
}: TopBarProps) {
  const navigate = useNavigate();
  const { member } = useAuth();

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      navigate("/profile");
    }
  };
  return (
    <div
      className={`fixed top-0 left-0 right-0 bg-bg-primary shadow-low z-50 ${className}`}
    >
      <div className="max-w-none w-full">
        <div className="flex items-center justify-between h-14 px-2 md:px-4">
          {/* 왼쪽: 로고 + 텍스트 */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 md:gap-3">
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
              <span className="hidden md:block text-xl font-bold text-text-primary dark:text-text-primary-dark">
                Ulala
              </span>
            </Link>
          </div>

          {/* 중앙: 레벨 + 표시이름 */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-text-primary dark:text-text-primary-dark">
                Lv.{member ? member.level : level}
              </span>
              {member && (
                <span className="text-base font-medium text-text-secondary dark:text-text-secondary-dark">
                  {member.displayName || member.username}
                </span>
              )}
            </div>
          </div>

          {/* 오른쪽: 설정 버튼 */}
          <div className="flex-shrink-0">
            <button
              onClick={handleSettingsClick}
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
