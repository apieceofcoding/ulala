interface MapControlsProps {
  /** 왼쪽 버튼 눌림 핸들러 */
  onLeftPress: () => void;
  /** 왼쪽 버튼 릴리즈 핸들러 */
  onLeftRelease: () => void;
  /** 오른쪽 버튼 눌림 핸들러 */
  onRightPress: () => void;
  /** 오른쪽 버튼 릴리즈 핸들러 */
  onRightRelease: () => void;
  /** 점프 버튼 눌림 핸들러 */
  onJumpPress: () => void;
  /** 점프 버튼 릴리즈 핸들러 */
  onJumpRelease: () => void;
}

/**
 * 맵 컨트롤 컴포넌트
 * 모바일 환경에서 캐릭터를 조작할 수 있는 터치 버튼을 제공합니다.
 */
export function MapControls({
  onLeftPress,
  onLeftRelease,
  onRightPress,
  onRightRelease,
  onJumpPress,
  onJumpRelease,
}: MapControlsProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 md:hidden">
      {/* 좌우 이동 버튼 */}
      <div className="flex gap-2">
        {/* 왼쪽 버튼 */}
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            onLeftPress();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onLeftRelease();
          }}
          onMouseDown={onLeftPress}
          onMouseUp={onLeftRelease}
          onMouseLeave={onLeftRelease}
          className="flex h-12 w-12 items-center justify-center rounded-2 bg-surface-secondary text-text-primary shadow-sm active:bg-surface-tertiary active:shadow-none"
          aria-label="왼쪽으로 이동"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* 오른쪽 버튼 */}
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            onRightPress();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onRightRelease();
          }}
          onMouseDown={onRightPress}
          onMouseUp={onRightRelease}
          onMouseLeave={onRightRelease}
          className="flex h-12 w-12 items-center justify-center rounded-2 bg-surface-secondary text-text-primary shadow-sm active:bg-surface-tertiary active:shadow-none"
          aria-label="오른쪽으로 이동"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M9 18l6-6-6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* 점프 버튼 */}
      <button
        type="button"
        onTouchStart={(e) => {
          e.preventDefault();
          onJumpPress();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          onJumpRelease();
        }}
        onMouseDown={onJumpPress}
        onMouseUp={onJumpRelease}
        onMouseLeave={onJumpRelease}
        className="flex h-12 w-20 items-center justify-center rounded-2 bg-brand text-text-on-brand shadow-sm active:bg-brand-hover active:shadow-none"
        aria-label="점프"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 19V5M5 12l7-7 7 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
