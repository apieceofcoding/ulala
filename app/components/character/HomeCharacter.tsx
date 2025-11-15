import { useState } from "react";
import type { Character, CharacterStyle } from "@/types/character";
import type { Member } from "@/types/member";
import { CharacterMap } from "./CharacterMap";
import { Character as CharacterPreview } from "./Character";
import { logger } from "@/utils/logger";

interface HomeCharacterProps {
  /** 회원 ID */
  memberId: string;
  /** 회원 정보 */
  member: Member;
}

/**
 * 홈 캐릭터 컴포넌트
 * 캐릭터 생성 및 표시를 담당하는 전체 래퍼 컴포넌트입니다.
 */
export function HomeCharacter({ memberId, member }: HomeCharacterProps) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<CharacterStyle | null>(null);

  // 캐릭터 생성
  const handleCreateCharacter = async (style: CharacterStyle) => {
    setIsLoading(true);
    setError(null);

    try {

      // TODO: API 연동 시 실제 API 호출로 대체
      // const response = await apiClient.post(
      //   API_ENDPOINTS.CHARACTERS.CREATE(memberId),
      //   {
      //     style,
      //   }
      // );

      // 임시: 로컬에서 캐릭터 생성 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newCharacter: Character = {
        id: `char-${Date.now()}`,
        memberId,
        name: "울랄라",
        style,
        level: 1,
        createdAt: new Date().toISOString(),
      };

      setCharacter(newCharacter);
      setSelectedStyle(null);
      logger.log("캐릭터 생성 완료:", newCharacter);
    } catch (err) {
      logger.error("캐릭터 생성 실패:", err);
      setError("캐릭터를 생성하는데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 인물 정보
  const styleInfo: Record<CharacterStyle, { label: string; description: string }> = {
    einstein: { label: "아인슈타인", description: "천재 물리학자" },
    buffett: { label: "워렌 버핏", description: "투자의 귀재" },
    jordan: { label: "마이클 조던", description: "농구의 신" },
    musk: { label: "일론 머스크", description: "우주 개척 기업가" },
  };

  // 캐릭터가 없는 경우: 스타일 선택 화면
  if (!character) {
    return (
      <div className="card-default flex w-full flex-col items-center gap-4">
        <div className="text-center">
          <h3 className="mb-2 text-lg font-semibold text-text-primary">
            나만의 울랄라 캐릭터를 만들어보세요!
          </h3>
          <p className="text-sm text-text-secondary">
            롤모델 인물을 선택해주세요
          </p>
        </div>

        {error && (
          <div
            className="w-full rounded-2 bg-error-background px-3 py-2 text-sm text-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* 캐릭터 스타일 선택 */}
        <div className="grid w-full grid-cols-2 gap-3">
          {(Object.keys(styleInfo) as CharacterStyle[]).map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => setSelectedStyle(style)}
              className={`flex flex-col items-center gap-3 rounded-3 p-4 transition-all ${
                selectedStyle === style
                  ? "bg-brand shadow-md scale-105"
                  : "bg-surface-secondary shadow-sm hover:bg-surface-tertiary hover:shadow-md"
              }`}
              aria-label={`${styleInfo[style].label} 스타일 선택`}
            >
              {/* 캐릭터 미리보기 */}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2 bg-surface p-2">
                <CharacterPreview
                  style={style}
                  animationState="idle"
                  direction="right"
                  size={48}
                />
              </div>
              <div className="text-center">
                <div className={`text-sm font-semibold ${
                  selectedStyle === style ? "text-text-on-brand" : "text-text-primary"
                }`}>
                  {styleInfo[style].label}
                </div>
                <div className={`text-xs ${
                  selectedStyle === style ? "text-text-on-brand opacity-80" : "text-text-secondary"
                }`}>
                  {styleInfo[style].description}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 생성 버튼 */}
        <button
          type="button"
          onClick={() => selectedStyle && handleCreateCharacter(selectedStyle)}
          disabled={isLoading || !selectedStyle}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-2 bg-brand px-6 text-sm font-medium text-text-on-brand shadow-sm transition-colors hover:bg-brand-hover active:bg-brand-pressed disabled:bg-disabled disabled:text-text-disabled disabled:shadow-none"
          aria-label="캐릭터 생성하기"
        >
          {isLoading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>생성 중...</span>
            </>
          ) : (
            <span>캐릭터 생성하기</span>
          )}
        </button>
      </div>
    );
  }

  // 캐릭터가 있는 경우: 맵 표시
  return (
    <div className="card-default flex w-full flex-col gap-3">
      {/* 캐릭터 정보 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-text-primary">
            {member.displayName || member.username}
          </h3>
          <p className="text-xs text-text-secondary">Lv. {member.level}</p>
        </div>
        <div className="rounded-2 bg-surface-secondary px-2 py-1 text-xs text-text-secondary">
          {styleInfo[character.style].label}
        </div>
      </div>

      {/* 캐릭터 맵 */}
      <CharacterMap characterStyle={character.style} />
    </div>
  );
}
