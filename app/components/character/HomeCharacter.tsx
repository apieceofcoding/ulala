import { useState } from "react";
import { useNavigate } from "react-router";
import type { RoleModel } from "@/types/character";
import type { Member } from "@/types/member";
import { CharacterMap, getCurrentSeason, type Season } from "./CharacterMap";
import { Character as CharacterPreview } from "./Character";
import { useAuth } from "@/contexts/AuthContext";
import { useCharacters } from "@/hooks/useCharacters";

interface HomeCharacterProps {
  /** 회원 정보 (비로그인 시 null 또는 undefined) */
  member?: Member | null;
}

/**
 * 홈 캐릭터 컴포넌트
 * 캐릭터 생성 및 표시를 담당하는 전체 래퍼 컴포넌트입니다.
 */
export function HomeCharacter({ member }: HomeCharacterProps) {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  // useCharacters 훅 사용
  const {
    character,
    isLoading,
    isFetching,
    error,
    createCharacter,
    updateCharacter,
    clearError,
  } = useCharacters({ accessToken });

  const [selectedRoleModel, setSelectedRoleModel] = useState<RoleModel | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<Season>(getCurrentSeason());
  const [activeMenu, setActiveMenu] = useState<"main" | "character" | "season" | "controls">("main");

  // 캐릭터 생성
  const handleCreateCharacter = async (roleModel: RoleModel) => {
    if (!accessToken) {
      navigate("/profile");
      return;
    }

    try {
      await createCharacter(roleModel);
      setSelectedRoleModel(null);
    } catch {
      // 에러는 hook에서 처리
    }
  };

  // 캐릭터 수정
  const handleUpdateCharacter = async (roleModel: RoleModel) => {
    if (!accessToken || !character) {
      return;
    }

    try {
      await updateCharacter(character.id, roleModel);
      setIsEditing(false);
      setSelectedRoleModel(null);
    } catch {
      // 에러는 hook에서 처리
    }
  };

  // 인물 정보
  const roleModelInfo: Record<
    RoleModel,
    { label: string; description: string }
  > = {
    EINSTEIN: { label: "아인슈타인", description: "천재 물리학자" },
    WARREN_BUFFETT: { label: "워렌 버핏", description: "투자의 귀재" },
    MICHAEL_JORDAN: { label: "마이클 조던", description: "농구의 신" },
    ELON_MUSK: { label: "일론 머스크", description: "우주 개척 기업가" },
  };

  // 로딩 중인 경우
  if (isFetching) {
    return (
      <div className="card-default flex w-full items-center justify-center py-8">
        <div className="flex flex-col items-center gap-2">
          <svg
            className="h-6 w-6 animate-spin text-brand"
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
          <span className="text-sm text-text-secondary">
            캐릭터 불러오는 중...
          </span>
        </div>
      </div>
    );
  }

  // 캐릭터가 없는 경우: 스타일 선택 화면
  if (!character) {
    return (
      <div className="card-default flex w-full flex-col items-center gap-4">
        <div className="text-center">
          <h3 className="mb-2 text-lg font-semibold text-text-primary">
            울랄라에서 나의 스토리를 만들어보세요
          </h3>
          <p className="text-sm text-text-secondary">
            꿈을 자극할 롤모델을 선택해주세요.
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

        {/* 캐릭터 롤모델 선택 */}
        <div className="grid w-full grid-cols-2 gap-3">
          {(Object.keys(roleModelInfo) as RoleModel[]).map((roleModel) => (
            <button
              key={roleModel}
              type="button"
              onClick={() => setSelectedRoleModel(roleModel)}
              className={`flex flex-col items-center gap-3 rounded-3 p-4 transition-all ${
                selectedRoleModel === roleModel
                  ? "bg-brand shadow-md scale-105"
                  : "bg-surface-secondary shadow-sm hover:bg-surface-tertiary hover:shadow-md"
              }`}
              aria-label={`${roleModelInfo[roleModel].label} 선택`}
            >
              {/* 캐릭터 미리보기 */}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2 bg-surface p-2">
                <CharacterPreview
                  roleModel={roleModel}
                  animationState="idle"
                  direction="right"
                  size={48}
                />
              </div>
              <div className="text-center">
                <div
                  className={`text-sm font-semibold ${
                    selectedRoleModel === roleModel
                      ? "text-text-on-brand"
                      : "text-text-primary"
                  }`}
                >
                  {roleModelInfo[roleModel].label}
                </div>
                <div
                  className={`text-xs ${
                    selectedRoleModel === roleModel
                      ? "text-text-on-brand opacity-80"
                      : "text-text-secondary"
                  }`}
                >
                  {roleModelInfo[roleModel].description}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 생성 버튼 */}
        <button
          type="button"
          onClick={() =>
            selectedRoleModel && handleCreateCharacter(selectedRoleModel)
          }
          disabled={isLoading || !selectedRoleModel}
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

  // 캐릭터가 있고 편집 모드인 경우: 롤모델 선택 화면
  if (isEditing) {
    return (
      <div className="card-default flex w-full flex-col items-center gap-4">
        <div className="text-center">
          <h3 className="mb-2 text-lg font-semibold text-text-primary">
            롤모델 변경
          </h3>
          <p className="text-sm text-text-secondary">
            새로운 롤모델을 선택해주세요
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

        {/* 롤모델 선택 */}
        <div className="grid w-full grid-cols-2 gap-3">
          {(Object.keys(roleModelInfo) as RoleModel[]).map((roleModel) => (
            <button
              key={roleModel}
              type="button"
              onClick={() => setSelectedRoleModel(roleModel)}
              className={`flex flex-col items-center gap-3 rounded-3 p-4 transition-all ${
                selectedRoleModel === roleModel
                  ? "bg-brand shadow-md scale-105"
                  : "bg-surface-secondary shadow-sm hover:bg-surface-tertiary hover:shadow-md"
              }`}
              aria-label={`${roleModelInfo[roleModel].label} 선택`}
            >
              {/* 캐릭터 미리보기 */}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2 bg-surface p-2">
                <CharacterPreview
                  roleModel={roleModel}
                  animationState="idle"
                  direction="right"
                  size={48}
                />
              </div>
              <div className="text-center">
                <div
                  className={`text-sm font-semibold ${
                    selectedRoleModel === roleModel
                      ? "text-text-on-brand"
                      : "text-text-primary"
                  }`}
                >
                  {roleModelInfo[roleModel].label}
                </div>
                <div
                  className={`text-xs ${
                    selectedRoleModel === roleModel
                      ? "text-text-on-brand opacity-80"
                      : "text-text-secondary"
                  }`}
                >
                  {roleModelInfo[roleModel].description}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 버튼 그룹 */}
        <div className="flex w-full gap-2">
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setSelectedRoleModel(null);
              clearError();
            }}
            className="flex h-10 flex-1 items-center justify-center rounded-2 bg-surface-secondary px-4 text-sm font-medium text-text-primary transition-colors hover:bg-surface-tertiary"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() =>
              selectedRoleModel && handleUpdateCharacter(selectedRoleModel)
            }
            disabled={isLoading || !selectedRoleModel}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-2 bg-brand px-4 text-sm font-medium text-text-on-brand shadow-sm transition-colors hover:bg-brand-hover active:bg-brand-pressed disabled:bg-disabled disabled:text-text-disabled disabled:shadow-none"
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
                <span>변경 중...</span>
              </>
            ) : (
              <span>변경하기</span>
            )}
          </button>
        </div>
      </div>
    );
  }

  // 캐릭터가 있는 경우: 맵 표시
  return (
    <div className="card-default relative flex w-full flex-col gap-3">
      {/* 캐릭터 정보 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-text-primary">
            {member?.displayName || member?.username || "게스트"}
          </h3>
          <p className="text-xs text-text-secondary">
            Lv. {member?.level || 1}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-2 bg-surface-secondary px-2 py-1 text-xs text-text-secondary">
            {character.displayName}
          </div>
          {/* 설정 버튼 */}
          <button
            type="button"
            onClick={() => {
              setShowSettings(!showSettings);
              setActiveMenu("main");
            }}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-secondary text-text-secondary transition-colors hover:bg-surface-tertiary hover:text-text-primary"
            aria-label="설정"
          >
            <svg
              width="14"
              height="14"
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
        </div>
      </div>

      {/* 설정 메뉴 */}
      {showSettings && (
        <div className="absolute right-4 top-12 z-10 min-w-[140px] rounded-2 bg-surface px-3 py-2 text-xs text-text-primary shadow-lg">
          {activeMenu === "main" && (
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveMenu("character")}
                className="flex w-full items-center justify-between rounded-1 px-2 py-1.5 text-left transition-colors hover:bg-surface-secondary"
              >
                <span>캐릭터 변경</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setActiveMenu("season")}
                className="flex w-full items-center justify-between rounded-1 px-2 py-1.5 text-left transition-colors hover:bg-surface-secondary"
              >
                <span>배경 계절</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setActiveMenu("controls")}
                className="flex w-full items-center justify-between rounded-1 px-2 py-1.5 text-left transition-colors hover:bg-surface-secondary"
              >
                <span>조작법</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}

          {activeMenu === "character" && (
            <div>
              <button
                type="button"
                onClick={() => setActiveMenu("main")}
                className="mb-2 flex w-full items-center gap-1 rounded-1 px-2 py-1.5 text-left font-medium transition-colors hover:bg-surface-secondary"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>캐릭터 변경</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  setShowSettings(false);
                }}
                className="w-full rounded-1 px-2 py-1.5 text-left transition-colors hover:bg-surface-secondary"
              >
                롤모델 변경
              </button>
            </div>
          )}

          {activeMenu === "season" && (
            <div>
              <button
                type="button"
                onClick={() => setActiveMenu("main")}
                className="mb-2 flex w-full items-center gap-1 rounded-1 px-2 py-1.5 text-left font-medium transition-colors hover:bg-surface-secondary"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>배경 계절</span>
              </button>
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
                  봄
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
                  여름
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
                  가을
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
                  겨울
                </button>
              </div>
            </div>
          )}

          {activeMenu === "controls" && (
            <div>
              <button
                type="button"
                onClick={() => setActiveMenu("main")}
                className="mb-2 flex w-full items-center gap-1 rounded-1 px-2 py-1.5 text-left font-medium transition-colors hover:bg-surface-secondary"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>조작법</span>
              </button>
              <div className="hidden space-y-0.5 px-2 text-text-secondary md:block">
                <div>방향키/WASD: 이동</div>
                <div>Space: 점프</div>
              </div>
              <div className="space-y-0.5 px-2 text-text-secondary md:hidden">
                <div>하단 좌/우 버튼: 이동</div>
                <div>하단 점프 버튼: 점프</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 캐릭터 맵 */}
      <CharacterMap roleModel={character.roleModel} season={selectedSeason} />
    </div>
  );
}
