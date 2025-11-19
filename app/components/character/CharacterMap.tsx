import { useState, useEffect, useCallback } from "react";
import type {
  RoleModel,
  GameState,
  GameConfig,
  InputState,
} from "@/types/character";
import { Character } from "./Character";
import { MapControls } from "./MapControls";
import { useGameLoop } from "@/hooks/useGameLoop";

// 계절 타입 정의
export type Season = "spring" | "summer" | "autumn" | "winter";

interface CharacterMapProps {
  /** 롤모델 */
  roleModel: RoleModel;
  /** 선택된 계절 */
  season?: Season;
}

// 게임 설정
const GAME_CONFIG: GameConfig = {
  mapWidth: 360,
  mapHeight: 280,
  characterSize: 96,
  gravity: 0.5,
  moveSpeed: 4,
  jumpSpeed: -12,
  groundY: 168, // mapHeight - characterSize - 16 (바닥 여백)
};

// 현재 계절 가져오기 (월 기준)
export const getCurrentSeason = (): Season => {
  const month = new Date().getMonth() + 1; // 0-11 -> 1-12
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 9) return "summer";
  if (month >= 10 && month <= 11) return "autumn";
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
export function CharacterMap({ roleModel, season }: CharacterMapProps) {
  // 선택된 계절 (prop이 없으면 현재 계절)
  const selectedSeason = season || getCurrentSeason();
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

  // 게임 루프 시작
  useGameLoop(gameState, setGameState, inputState, GAME_CONFIG);

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
            roleModel={roleModel}
            animationState={gameState.animationState}
            direction={gameState.direction}
            size={GAME_CONFIG.characterSize}
          />
        </div>

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
