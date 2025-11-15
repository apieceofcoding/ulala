import type { CharacterStyle, AnimationState, Direction } from "@/types/character";

interface CharacterProps {
  /** 캐릭터 스타일 */
  style: CharacterStyle;
  /** 애니메이션 상태 */
  animationState: AnimationState;
  /** 바라보는 방향 */
  direction: Direction;
  /** 캐릭터 크기 (px) */
  size: number;
}

/**
 * 캐릭터 컴포넌트
 * 메이플스토리 픽셀 아트 스타일의 귀여운 울랄라 캐릭터를 렌더링하고 애니메이션을 표시합니다.
 */
export function Character({
  style,
  animationState,
  direction,
  size,
}: CharacterProps) {
  // 인물별 색상 (머리는 모두 검은색)
  const getCharacterColors = (characterStyle: CharacterStyle) => {
    switch (characterStyle) {
      case "einstein":
        // 아인슈타인 - 과학자 스타일 (회색 톤)
        return {
          skin: "#FFDAB5",
          hair: "#2C2C2C",
          shirt: "#708090",
          pants: "#4A4A4A",
          shoes: "#2C3E50",
          hairDark: "#1A1A1A"
        };
      case "buffett":
        // 워렌 버핏 - 투자의 귀재 (클래식 정장 톤)
        return {
          skin: "#FFDAB5",
          hair: "#C0C0C0",
          shirt: "#FFFFFF",
          pants: "#2C3E50",
          shoes: "#1A1A1A",
          hairDark: "#A0A0A0"
        };
      case "jordan":
        // 마이클 조던 - 농구 레전드 (빨강/검정 톤)
        return {
          skin: "#8B6F47",
          hair: "#2C2C2C",
          shirt: "#C8102E",
          pants: "#000000",
          shoes: "#C8102E",
          hairDark: "#0A0A0A"
        };
      case "musk":
        // 일론 머스크 - 미래지향적 기업가 (회색/검정 톤)
        return {
          skin: "#FFDAB5",
          hair: "#2C2C2C",
          shirt: "#2F4F4F",
          pants: "#1C1C1C",
          shoes: "#000000",
          hairDark: "#1A1A1A"
        };
      default:
        return {
          skin: "#FFDAB5",
          hair: "#2C2C2C",
          shirt: "#708090",
          pants: "#4A4A4A",
          shoes: "#2C3E50",
          hairDark: "#1A1A1A"
        };
    }
  };

  const colors = getCharacterColors(style);

  // 걷기 애니메이션 프레임
  const walkFrame = animationState === "walk" ? "walk-cycle" : "";

  // 인물별 헤어스타일 렌더링
  const renderHairStyle = (isLookingRight: boolean) => {
    switch (style) {
      case "einstein":
        // 아인슈타인: 부스스한 곱슬머리
        return (
          <>
            {/* 기본 머리 */}
            <rect x="4" y="1" width="24" height="16" fill={colors.hair} />
            <rect x="3" y="3" width="2" height="14" fill={colors.hair} />
            <rect x="27" y="3" width="2" height="14" fill={colors.hair} />

            {/* 곱슬곱슬한 텍스처 */}
            <rect x="5" y="0" width="3" height="3" fill={colors.hair} />
            <rect x="9" y="0" width="3" height="2" fill={colors.hair} />
            <rect x="13" y="0" width="4" height="3" fill={colors.hair} />
            <rect x="18" y="0" width="3" height="2" fill={colors.hair} />
            <rect x="22" y="0" width="4" height="3" fill={colors.hair} />

            {/* 양쪽으로 튀어나온 머리 */}
            <rect x="2" y="5" width="2" height="4" fill={colors.hair} />
            <rect x="28" y="5" width="2" height="4" fill={colors.hair} />

            {/* 그림자 */}
            <rect x="5" y="2" width="5" height="5" fill={colors.hairDark} />
            <rect x="20" y="2" width="5" height="5" fill={colors.hairDark} />
          </>
        );

      case "buffett":
        // 워렌 버핏: 짧고 단정한 은발 (나이든 스타일)
        return (
          <>
            {/* 기본 머리 - 짧고 정돈된 */}
            <rect x="5" y="2" width="22" height="12" fill={colors.hair} />
            <rect x="4" y="4" width="2" height="10" fill={colors.hair} />
            <rect x="26" y="4" width="2" height="10" fill={colors.hair} />
            <rect x="6" y="1" width="20" height="2" fill={colors.hair} />

            {/* 옆으로 넘긴 단정한 스타일 */}
            <rect x="7" y="4" width="14" height="2" fill={colors.hair} />

            {/* 그림자 (은발에 맞게 밝게) */}
            <rect x="6" y="2" width="5" height="4" fill={colors.hairDark} />
            <rect x="21" y="2" width="5" height="4" fill={colors.hairDark} />
          </>
        );

      case "jordan":
        // 마이클 조던: 스포티한 짧은 머리 (대머리 스타일)
        return (
          <>
            {/* 매우 짧은 머리 (대머리에 가까운) */}
            <rect x="6" y="3" width="20" height="11" fill={colors.hair} />
            <rect x="5" y="5" width="22" height="9" fill={colors.hair} />
            <rect x="7" y="2" width="18" height="2" fill={colors.hair} />

            {/* 그림자 (더 강하게) */}
            <rect x="7" y="3" width="5" height="5" fill={colors.hairDark} />
            <rect x="20" y="3" width="5" height="5" fill={colors.hairDark} />
          </>
        );

      case "musk":
        // 일론 머스크: 짧고 단정한 현대적 헤어
        return (
          <>
            {/* 기본 머리 - 짧은 스타일 */}
            <rect x="5" y="2" width="22" height="12" fill={colors.hair} />
            <rect x="4" y="4" width="2" height="10" fill={colors.hair} />
            <rect x="26" y="4" width="2" height="10" fill={colors.hair} />
            <rect x="6" y="1" width="20" height="2" fill={colors.hair} />

            {/* 약간 앞으로 넘긴 스타일 */}
            <rect x="7" y="5" width="12" height="2" fill={colors.hair} />

            {/* 그림자 */}
            <rect x="6" y="2" width="5" height="5" fill={colors.hairDark} />
            <rect x="21" y="2" width="5" height="5" fill={colors.hairDark} />
          </>
        );

      default:
        return (
          <>
            <rect x="4" y="1" width="24" height="16" fill={colors.hair} />
            <rect x="3" y="3" width="2" height="14" fill={colors.hair} />
            <rect x="27" y="3" width="2" height="14" fill={colors.hair} />
            <rect x="5" y="0" width="22" height="2" fill={colors.hair} />
            <rect x="5" y="1" width="5" height="5" fill={colors.hairDark} />
            <rect x="22" y="1" width="5" height="5" fill={colors.hairDark} />
          </>
        );
    }
  };

  // 아인슈타인 전용 콧수염 렌더링
  const renderMustache = () => {
    if (style !== "einstein") return null;

    return (
      <>
        {/* 콧수염 - 아인슈타인 스타일 */}
        <rect x="10" y="20" width="4" height="2" fill="#8B8B8B" />
        <rect x="18" y="20" width="4" height="2" fill="#8B8B8B" />
        <rect x="9" y="21" width="2" height="2" fill="#8B8B8B" />
        <rect x="21" y="21" width="2" height="2" fill="#8B8B8B" />
        {/* 콧수염 하이라이트 */}
        <rect x="10" y="20" width="2" height="1" fill="#B0B0B0" />
        <rect x="18" y="20" width="2" height="1" fill="#B0B0B0" />
      </>
    );
  };

  // 방향에 따른 측면 뷰 렌더링 (45도 각도)
  const renderSideView = () => {
    // direction이 "right"면 오른쪽을 보는 모습, "left"면 왼쪽을 보는 모습
    const isLookingRight = direction === "right";

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: "pixelated" }}
      >
        {/* 머리카락 - 직업별 헤어스타일 */}
        {renderHairStyle(isLookingRight)}

        {/* 얼굴 - 45도 측면 뷰, 더 크게 */}
        <rect x="5" y="7" width="22" height="18" fill={colors.skin} />
        <rect x="4" y="9" width="24" height="14" fill={colors.skin} />

        {/* 눈썹 - 양쪽 눈썹 */}
        {isLookingRight ? (
          <>
            {/* 왼쪽 눈썹 */}
            <rect x="8" y="11" width="5" height="1" fill="#1A1A1A" />
            <rect x="7" y="11" width="1" height="1" fill="#1A1A1A" />

            {/* 오른쪽 눈썹 */}
            <rect x="18" y="11" width="5" height="1" fill="#1A1A1A" />
            <rect x="23" y="11" width="1" height="1" fill="#1A1A1A" />
          </>
        ) : (
          <>
            {/* 오른쪽 눈썹 */}
            <rect x="19" y="11" width="5" height="1" fill="#1A1A1A" />
            <rect x="24" y="11" width="1" height="1" fill="#1A1A1A" />

            {/* 왼쪽 눈썹 */}
            <rect x="8" y="11" width="5" height="1" fill="#1A1A1A" />
            <rect x="7" y="11" width="1" height="1" fill="#1A1A1A" />
          </>
        )}

        {/* 눈 - 동그랗고 귀여운 눈 */}
        {isLookingRight ? (
          <>
            {/* 왼쪽 눈 (뒤쪽) - 동그란 형태 */}
            <rect x="9" y="14" width="5" height="6" fill="#000" />
            <rect x="8" y="15" width="7" height="4" fill="#000" />
            {/* 하얀 하이라이트 - 반짝이는 눈 */}
            <rect x="10" y="14" width="3" height="3" fill="#FFF" />
            <rect x="9" y="15" width="1" height="2" fill="#FFF" />
            <rect x="13" y="15" width="1" height="1" fill="#FFF" />
            {/* 작은 반짝임 */}
            <rect x="11" y="18" width="1" height="1" fill="#FFF" opacity="0.7" />

            {/* 오른쪽 눈 (앞쪽) - 동그란 형태 */}
            <rect x="19" y="14" width="5" height="6" fill="#000" />
            <rect x="18" y="15" width="7" height="4" fill="#000" />
            {/* 하얀 하이라이트 - 반짝이는 눈 */}
            <rect x="20" y="14" width="3" height="3" fill="#FFF" />
            <rect x="19" y="15" width="1" height="2" fill="#FFF" />
            <rect x="23" y="15" width="1" height="1" fill="#FFF" />
            {/* 작은 반짝임 */}
            <rect x="21" y="18" width="1" height="1" fill="#FFF" opacity="0.7" />
          </>
        ) : (
          <>
            {/* 오른쪽 눈 (뒤쪽) - 동그란 형태 */}
            <rect x="18" y="14" width="5" height="6" fill="#000" />
            <rect x="17" y="15" width="7" height="4" fill="#000" />
            {/* 하얀 하이라이트 - 반짝이는 눈 */}
            <rect x="19" y="14" width="3" height="3" fill="#FFF" />
            <rect x="18" y="15" width="1" height="2" fill="#FFF" />
            <rect x="22" y="15" width="1" height="1" fill="#FFF" />
            {/* 작은 반짝임 */}
            <rect x="20" y="18" width="1" height="1" fill="#FFF" opacity="0.7" />

            {/* 왼쪽 눈 (앞쪽) - 동그란 형태 */}
            <rect x="8" y="14" width="5" height="6" fill="#000" />
            <rect x="7" y="15" width="7" height="4" fill="#000" />
            {/* 하얀 하이라이트 - 반짝이는 눈 */}
            <rect x="9" y="14" width="3" height="3" fill="#FFF" />
            <rect x="8" y="15" width="1" height="2" fill="#FFF" />
            <rect x="12" y="15" width="1" height="1" fill="#FFF" />
            {/* 작은 반짝임 */}
            <rect x="10" y="18" width="1" height="1" fill="#FFF" opacity="0.7" />
          </>
        )}

        {/* 콧수염 - 아인슈타인 전용 */}
        {renderMustache()}

        {/* 입 - 45도 측면 */}
        <rect x="13" y="22" width="6" height="2" fill="#000" />
        <rect x="12" y="22" width="1" height="1" fill="#000" />
        <rect x="19" y="22" width="1" height="1" fill="#000" />
        <rect x="13" y="22" width="6" height="1" fill="#FF6B9D" opacity="0.6" />

        {/* 볼 홍조 - 양쪽 모두 */}
        <rect x="5" y="20" width="3" height="2" fill="#FFB3C1" opacity="0.8" />
        <rect x="24" y="20" width="3" height="2" fill="#FFB3C1" opacity="0.8" />

        {/* 몸통 (셔츠) - 작은 상체 */}
        <rect x="12" y="25" width="8" height="6" fill={colors.shirt} />
        <rect x="11" y="27" width="10" height="4" fill={colors.shirt} />

        {/* 어깨 둥글게 - 양쪽 */}
        <rect x="10" y="26" width="2" height="2" fill={colors.shirt} />
        <rect x="20" y="26" width="2" height="2" fill={colors.shirt} />

        {/* 셔츠 그림자 */}
        <rect x="12" y="29" width="8" height="2" fill="#000" opacity="0.1" />

        {/* 팔 - 양쪽 모두 보이지만 원근감 있게, 큰 손 */}
        {isLookingRight ? (
          <>
            {/* 왼쪽 팔 (뒤쪽, 살짝 어둡게) */}
            <g
              opacity="0.85"
              style={{
                transformOrigin: "9px 29px",
                animation: walkFrame ? "arm-left 0.4s ease-in-out infinite" : "none",
              }}
            >
              <rect x="7" y="29" width="3" height="5" fill={colors.shirt} />
              {/* 큰 손 */}
              <rect x="6" y="34" width="4" height="3" fill={colors.skin} />
            </g>
            {/* 오른쪽 팔 (앞쪽) */}
            <g
              style={{
                transformOrigin: "23px 29px",
                animation: walkFrame ? "arm-right 0.4s ease-in-out infinite" : "none",
              }}
            >
              <rect x="21" y="29" width="3" height="5" fill={colors.shirt} />
              {/* 큰 손 */}
              <rect x="20" y="34" width="4" height="3" fill={colors.skin} />
            </g>
          </>
        ) : (
          <>
            {/* 오른쪽 팔 (뒤쪽, 살짝 어둡게) */}
            <g
              opacity="0.85"
              style={{
                transformOrigin: "23px 29px",
                animation: walkFrame ? "arm-right 0.4s ease-in-out infinite" : "none",
              }}
            >
              <rect x="21" y="29" width="3" height="5" fill={colors.shirt} />
              {/* 큰 손 */}
              <rect x="20" y="34" width="4" height="3" fill={colors.skin} />
            </g>
            {/* 왼쪽 팔 (앞쪽) */}
            <g
              style={{
                transformOrigin: "9px 29px",
                animation: walkFrame ? "arm-left 0.4s ease-in-out infinite" : "none",
              }}
            >
              <rect x="7" y="29" width="3" height="5" fill={colors.shirt} />
              {/* 큰 손 */}
              <rect x="6" y="34" width="4" height="3" fill={colors.skin} />
            </g>
          </>
        )}

        {/* 바지/치마 - 작은 상체에 맞춰 조정 */}
        <rect x="12" y="31" width="8" height="5" fill={colors.pants} />

        {/* 다리 - 양쪽 모두 보이지만 원근감 있게 */}
        {isLookingRight ? (
          <>
            {/* 왼쪽 다리 (뒤쪽, 살짝 어둡게) */}
            <g
              opacity="0.85"
              style={{
                transformOrigin: "13px 36px",
                animation: walkFrame ? "leg-left 0.4s ease-in-out infinite" : "none",
              }}
            >
              <rect x="11" y="36" width="4" height="8" fill={colors.skin} />
              <rect x="11" y="44" width="4" height="2" fill={colors.shoes} />
            </g>
            {/* 오른쪽 다리 (앞쪽) */}
            <g
              style={{
                transformOrigin: "19px 36px",
                animation: walkFrame ? "leg-right 0.4s ease-in-out infinite" : "none",
              }}
            >
              <rect x="17" y="36" width="4" height="8" fill={colors.skin} />
              <rect x="17" y="44" width="4" height="2" fill={colors.shoes} />
            </g>
          </>
        ) : (
          <>
            {/* 오른쪽 다리 (뒤쪽, 살짝 어둡게) */}
            <g
              opacity="0.85"
              style={{
                transformOrigin: "19px 36px",
                animation: walkFrame ? "leg-right 0.4s ease-in-out infinite" : "none",
              }}
            >
              <rect x="17" y="36" width="4" height="8" fill={colors.skin} />
              <rect x="17" y="44" width="4" height="2" fill={colors.shoes} />
            </g>
            {/* 왼쪽 다리 (앞쪽) */}
            <g
              style={{
                transformOrigin: "13px 36px",
                animation: walkFrame ? "leg-left 0.4s ease-in-out infinite" : "none",
              }}
            >
              <rect x="11" y="36" width="4" height="8" fill={colors.skin} />
              <rect x="11" y="44" width="4" height="2" fill={colors.shoes} />
            </g>
          </>
        )}
      </svg>
    );
  };

  return (
    <div
      className="absolute transition-transform duration-75"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        imageRendering: "pixelated",
      }}
      aria-label={`울랄라 캐릭터 - ${animationState}`}
    >
      {/* 캐릭터 바디 */}
      <div
        className="relative h-full w-full"
        style={{
          animation:
            animationState === "idle"
              ? "character-idle 2s ease-in-out infinite"
              : animationState === "jump"
                ? "character-jump 0.5s ease-out"
                : "none",
        }}
      >
        {/* SVG 캐릭터 - 측면 뷰 픽셀 아트 스타일 */}
        {renderSideView()}
      </div>

      <style>{`
        @keyframes character-idle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes character-jump {
          0% {
            transform: scale(1) translateY(0);
          }
          50% {
            transform: scale(1.05) translateY(-2px);
          }
          100% {
            transform: scale(1) translateY(0);
          }
        }

        /* 걷기 애니메이션 - 팔 */
        @keyframes arm-left {
          0%, 100% {
            transform: rotate(10deg);
          }
          50% {
            transform: rotate(-10deg);
          }
        }

        @keyframes arm-right {
          0%, 100% {
            transform: rotate(-10deg);
          }
          50% {
            transform: rotate(10deg);
          }
        }

        /* 걷기 애니메이션 - 다리 */
        @keyframes leg-left {
          0%, 100% {
            transform: rotate(-5deg) translateY(0);
          }
          50% {
            transform: rotate(10deg) translateY(-2px);
          }
        }

        @keyframes leg-right {
          0%, 100% {
            transform: rotate(10deg) translateY(-2px);
          }
          50% {
            transform: rotate(-5deg) translateY(0);
          }
        }

        /* prefers-reduced-motion 지원 */
        @media (prefers-reduced-motion: reduce) {
          .transition-transform {
            transition: none;
          }

          [style*="animation"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
