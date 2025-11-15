import { useState, useEffect, useCallback } from "react";
import type {
  CharacterStyle,
  GameState,
  GameConfig,
  InputState,
} from "@/types/character";
import { Character } from "./Character";
import { MapControls } from "./MapControls";
import { useGameLoop } from "@/hooks/useGameLoop";

interface CharacterMapProps {
  /** 캐릭터 스타일 */
  characterStyle: CharacterStyle;
}

// 게임 설정
const GAME_CONFIG: GameConfig = {
  mapWidth: 360,
  mapHeight: 280,
  characterSize: 48,
  gravity: 0.5,
  moveSpeed: 4,
  jumpSpeed: -12,
  groundY: 216, // mapHeight - characterSize - 16 (바닥 여백)
};

// 계절 타입 정의
type Season = "spring" | "summer" | "autumn" | "winter";

// 현재 계절 가져오기 (월 기준)
const getCurrentSeason = (): Season => {
  const month = new Date().getMonth() + 1; // 0-11 -> 1-12
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
};

// 계절별 색상 테마
const seasonColors = {
  spring: {
    sky: "from-sky-200 to-sky-100",
    ground: "bg-green-600",
    groundBorder: "border-green-700",
  },
  summer: {
    sky: "from-blue-400 to-blue-200",
    ground: "bg-green-500",
    groundBorder: "border-green-600",
  },
  autumn: {
    sky: "from-orange-200 to-yellow-100",
    ground: "bg-amber-700",
    groundBorder: "border-amber-800",
  },
  winter: {
    sky: "from-slate-300 to-slate-100",
    ground: "bg-slate-400",
    groundBorder: "border-slate-500",
  },
};

/**
 * 캐릭터 맵 컴포넌트
 * 캐릭터가 움직일 수 있는 맵과 게임 로직을 담당합니다.
 */
export function CharacterMap({ characterStyle }: CharacterMapProps) {
  // 선택된 계절 (기본값은 현재 계절)
  const [selectedSeason, setSelectedSeason] = useState<Season>(getCurrentSeason());
  const colors = seasonColors[selectedSeason];

  // 게임 상태
  const [gameState, setGameState] = useState<GameState>({
    x: GAME_CONFIG.mapWidth / 2 - GAME_CONFIG.characterSize / 2,
    y: GAME_CONFIG.groundY,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    direction: "right",
    animationState: "idle",
  });

  // 입력 상태
  const [inputState, setInputState] = useState<InputState>({
    left: false,
    right: false,
    jump: false,
  });

  // 도움말 표시 상태
  const [showHelp, setShowHelp] = useState(false);

  // 설정 메뉴 표시 상태
  const [showSettings, setShowSettings] = useState(false);

  // 게임 루프 시작
  useGameLoop(gameState, setGameState, inputState, GAME_CONFIG);

  // 도움말 외부 클릭 시 닫기
  useEffect(() => {
    if (!showHelp) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // 도움말 버튼이나 툴팁 내부 클릭이 아닌 경우 닫기
      if (!target.closest('[data-help-button]') && !target.closest('[data-help-tooltip]')) {
        setShowHelp(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHelp]);

  // 설정 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    if (!showSettings) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // 설정 버튼이나 메뉴 내부 클릭이 아닌 경우 닫기
      if (!target.closest('[data-settings-button]') && !target.closest('[data-settings-menu]')) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings]);

  // 키보드 입력 핸들러
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
      case "a":
      case "A":
        e.preventDefault();
        setInputState((prev) => ({ ...prev, left: true }));
        break;
      case "ArrowRight":
      case "d":
      case "D":
        e.preventDefault();
        setInputState((prev) => ({ ...prev, right: true }));
        break;
      case " ":
      case "ArrowUp":
      case "w":
      case "W":
        e.preventDefault();
        setInputState((prev) => ({ ...prev, jump: true }));
        break;
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
      case "a":
      case "A":
        setInputState((prev) => ({ ...prev, left: false }));
        break;
      case "ArrowRight":
      case "d":
      case "D":
        setInputState((prev) => ({ ...prev, right: false }));
        break;
      case " ":
      case "ArrowUp":
      case "w":
      case "W":
        setInputState((prev) => ({ ...prev, jump: false }));
        break;
    }
  }, []);

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className="flex w-full flex-col gap-3">
      {/* 맵 영역 */}
      <div
        className="relative mx-auto w-full overflow-hidden rounded-3 shadow-sm"
        style={{
          maxWidth: `${GAME_CONFIG.mapWidth}px`,
          height: `${GAME_CONFIG.mapHeight}px`,
        }}
        role="img"
        aria-label="캐릭터 맵"
      >
        {/* 계절별 하늘 배경 */}
        <div className={`absolute inset-0 bg-gradient-to-b ${colors.sky}`} />

        {/* 바닥 */}
        <div
          className={`absolute bottom-0 left-0 right-0 border-t-2 ${colors.ground} ${colors.groundBorder}`}
          style={{
            height: `${GAME_CONFIG.mapHeight - GAME_CONFIG.groundY - GAME_CONFIG.characterSize}px`,
          }}
        />

        {/* 캐릭터 */}
        <div
          className="absolute transition-none"
          style={{
            left: `${gameState.x}px`,
            top: `${gameState.y}px`,
          }}
        >
          <Character
            style={characterStyle}
            animationState={gameState.animationState}
            direction={gameState.direction}
            size={GAME_CONFIG.characterSize}
          />
        </div>

        {/* 설정 버튼 */}
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="absolute right-10 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-surface text-text-secondary shadow-sm transition-colors hover:bg-surface-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          aria-label="설정"
          aria-expanded={showSettings}
          data-settings-button
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* 도움말 버튼 */}
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-surface text-text-secondary shadow-sm transition-colors hover:bg-surface-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          aria-label="조작법 보기"
          aria-expanded={showHelp}
          data-help-button
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 17H12.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* 설정 메뉴 */}
        {showSettings && (
          <div
            className="absolute right-10 top-10 z-10 min-w-[120px] rounded-2 bg-surface px-3 py-2 text-xs text-text-primary shadow-lg"
            data-settings-menu
          >
            <div className="mb-2 font-medium">배경 계절</div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedSeason("spring");
                  setShowSettings(false);
                }}
                className={`w-full rounded-1 px-2 py-1.5 text-left transition-colors ${
                  selectedSeason === "spring"
                    ? "bg-brand text-text-on-brand"
                    : "hover:bg-surface-secondary"
                }`}
              >
                봄 🌸
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedSeason("summer");
                  setShowSettings(false);
                }}
                className={`w-full rounded-1 px-2 py-1.5 text-left transition-colors ${
                  selectedSeason === "summer"
                    ? "bg-brand text-text-on-brand"
                    : "hover:bg-surface-secondary"
                }`}
              >
                여름 ☀️
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedSeason("autumn");
                  setShowSettings(false);
                }}
                className={`w-full rounded-1 px-2 py-1.5 text-left transition-colors ${
                  selectedSeason === "autumn"
                    ? "bg-brand text-text-on-brand"
                    : "hover:bg-surface-secondary"
                }`}
              >
                가을 🍂
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedSeason("winter");
                  setShowSettings(false);
                }}
                className={`w-full rounded-1 px-2 py-1.5 text-left transition-colors ${
                  selectedSeason === "winter"
                    ? "bg-brand text-text-on-brand"
                    : "hover:bg-surface-secondary"
                }`}
              >
                겨울 ❄️
              </button>
            </div>
          </div>
        )}

        {/* 도움말 툴팁 */}
        {showHelp && (
          <div
            className="absolute right-2 top-10 z-10 rounded-2 bg-surface px-3 py-2 text-xs text-text-primary shadow-lg"
            data-help-tooltip
          >
            <div className="mb-1 font-medium">조작법</div>
            {/* 데스크톱 조작법 */}
            <div className="hidden space-y-0.5 text-text-secondary md:block">
              <div>방향키/WASD: 이동</div>
              <div>Space: 점프</div>
            </div>
            {/* 모바일 조작법 */}
            <div className="space-y-0.5 text-text-secondary md:hidden">
              <div>하단 좌/우 버튼: 이동</div>
              <div>하단 점프 버튼: 점프</div>
            </div>
          </div>
        )}
      </div>

      {/* 모바일 컨트롤 */}
      <MapControls
        onLeftPress={() => setInputState((prev) => ({ ...prev, left: true }))}
        onLeftRelease={() => setInputState((prev) => ({ ...prev, left: false }))}
        onRightPress={() => setInputState((prev) => ({ ...prev, right: true }))}
        onRightRelease={() =>
          setInputState((prev) => ({ ...prev, right: false }))
        }
        onJumpPress={() => setInputState((prev) => ({ ...prev, jump: true }))}
        onJumpRelease={() => setInputState((prev) => ({ ...prev, jump: false }))}
      />
    </div>
  );
}
