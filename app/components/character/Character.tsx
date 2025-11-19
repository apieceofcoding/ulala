import type { RoleModel, AnimationState, Direction } from "@/types/character";

interface CharacterProps {
  /** 롤모델 */
  roleModel: RoleModel;
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
  roleModel,
  animationState,
  direction,
  size,
}: CharacterProps) {
  // 인물별 색상 (머리는 모두 검은색)
  const getCharacterColors = (model: RoleModel) => {
    switch (model) {
      case "EINSTEIN":
        // 아인슈타인 - 과학자 스타일 (흰/회색 머리)
        return {
          skin: "#FFDAB5",
          hair: "#E8E8E8",
          shirt: "#708090",
          pants: "#4A4A4A",
          shoes: "#2C3E50",
          hairDark: "#C8C8C8",
        };
      case "WARREN_BUFFETT":
        // 워렌 버핏 - 투자의 귀재 (클래식 정장 톤)
        return {
          skin: "#FFDAB5",
          hair: "#C0C0C0",
          shirt: "#FFFFFF",
          pants: "#2C3E50",
          shoes: "#1A1A1A",
          hairDark: "#A0A0A0",
        };
      case "MICHAEL_JORDAN":
        // 마이클 조던 - 농구 레전드 (빨강/검정 톤)
        return {
          skin: "#8B6F47",
          hair: "#2C2C2C",
          shirt: "#C8102E",
          pants: "#000000",
          shoes: "#C8102E",
          hairDark: "#0A0A0A",
        };
      case "ELON_MUSK":
        // 일론 머스크 - 테크 CEO 스타일 (검은 티셔츠)
        return {
          skin: "#FFDAB5",
          hair: "#3D2817",
          shirt: "#1A1A1A",
          pants: "#2C2C2C",
          shoes: "#1A1A1A",
          hairDark: "#2A1A0A",
        };
      default:
        return {
          skin: "#FFDAB5",
          hair: "#2C2C2C",
          shirt: "#708090",
          pants: "#4A4A4A",
          shoes: "#2C3E50",
          hairDark: "#1A1A1A",
        };
    }
  };

  const colors = getCharacterColors(roleModel);

  // 걷기 애니메이션 프레임
  const walkFrame = animationState === "walk" ? "walk-cycle" : "";

  // 인물별 헤어스타일 렌더링
  const renderHairStyle = (isLookingRight: boolean) => {
    switch (roleModel) {
      case "EINSTEIN":
        // 아인슈타인: 매우 풍성하고 부스스한 흰 곱슬머리
        return (
          <>
            {/* 기본 머리 - 더 풍성하게 */}
            <rect x="3" y="1" width="26" height="16" fill={colors.hair} />
            <rect x="2" y="3" width="2" height="14" fill={colors.hair} />
            <rect x="28" y="3" width="2" height="14" fill={colors.hair} />

            {/* 매우 곱슬곱슬한 텍스처 - 위로 튀어나온 부분 */}
            <rect x="4" y="-1" width="4" height="4" fill={colors.hair} />
            <rect x="9" y="-2" width="3" height="4" fill={colors.hair} />
            <rect x="13" y="-1" width="5" height="4" fill={colors.hair} />
            <rect x="19" y="-2" width="3" height="4" fill={colors.hair} />
            <rect x="23" y="-1" width="4" height="4" fill={colors.hair} />

            {/* 양쪽으로 크게 튀어나온 머리 - 아인슈타인 특유의 헤어스타일 */}
            <rect x="0" y="4" width="4" height="6" fill={colors.hair} />
            <rect x="1" y="3" width="3" height="2" fill={colors.hair} />
            <rect x="1" y="10" width="3" height="3" fill={colors.hair} />
            <rect x="28" y="4" width="4" height="6" fill={colors.hair} />
            <rect x="28" y="3" width="3" height="2" fill={colors.hair} />
            <rect x="28" y="10" width="3" height="3" fill={colors.hair} />

            {/* 그림자 */}
            <rect x="5" y="2" width="6" height="6" fill={colors.hairDark} />
            <rect x="19" y="2" width="6" height="6" fill={colors.hairDark} />
          </>
        );

      case "WARREN_BUFFETT":
        // 워렌 버핏: 이마가 넓고 옆머리만 있는 대머리 스타일
        return (
          <>
            {/* 대머리 - 이마가 넓고 옆머리만 있음 */}
            {/* 왼쪽 옆머리 */}
            <rect x="3" y="8" width="4" height="10" fill={colors.hair} />
            <rect x="4" y="7" width="3" height="2" fill={colors.hair} />
            <rect x="5" y="6" width="2" height="2" fill={colors.hair} />

            {/* 오른쪽 옆머리 */}
            <rect x="25" y="8" width="4" height="10" fill={colors.hair} />
            <rect x="25" y="7" width="3" height="2" fill={colors.hair} />
            <rect x="25" y="6" width="2" height="2" fill={colors.hair} />

            {/* 뒷머리 (살짝만) */}
            <rect x="7" y="2" width="18" height="3" fill={colors.hair} />
            <rect x="5" y="4" width="22" height="3" fill={colors.hair} />

            {/* 그림자 */}
            <rect x="4" y="9" width="3" height="4" fill={colors.hairDark} />
            <rect x="25" y="9" width="3" height="4" fill={colors.hairDark} />
          </>
        );

      case "MICHAEL_JORDAN":
        // 마이클 조던: 거의 대머리 (스킨헤드)
        return (
          <>
            {/* 거의 대머리 - 아주 얇은 머리카락만 */}
            <rect x="7" y="4" width="18" height="8" fill={colors.hair} />
            <rect x="6" y="6" width="20" height="6" fill={colors.hair} />
            <rect x="8" y="3" width="16" height="2" fill={colors.hair} />

            {/* 그림자 - 머리 윤곽 강조 */}
            <rect x="8" y="4" width="5" height="4" fill={colors.hairDark} />
            <rect x="19" y="4" width="5" height="4" fill={colors.hairDark} />

            {/* 귀걸이 - 조던의 상징 (왼쪽 귀) */}
            <rect x="3" y="16" width="2" height="2" fill="#FFD700" />
            <rect x="4" y="17" width="1" height="2" fill="#FFD700" />
          </>
        );

      case "ELON_MUSK":
        // 일론 머스크: 자연스럽게 앞으로 내린 헤어스타일
        return (
          <>
            {/* 기본 머리 */}
            <rect x="5" y="2" width="22" height="12" fill={colors.hair} />
            <rect x="4" y="4" width="2" height="10" fill={colors.hair} />
            <rect x="26" y="4" width="2" height="10" fill={colors.hair} />

            {/* 윗머리 - 자연스러운 볼륨 */}
            <rect x="6" y="1" width="20" height="2" fill={colors.hair} />
            <rect x="8" y="0" width="16" height="2" fill={colors.hair} />

            {/* 앞머리 - 이마 쪽으로 자연스럽게 내려옴 */}
            <rect x="7" y="4" width="10" height="3" fill={colors.hair} />
            <rect x="8" y="6" width="7" height="2" fill={colors.hair} />
            <rect x="9" y="7" width="4" height="1" fill={colors.hair} />

            {/* 그림자 */}
            <rect x="6" y="2" width="5" height="4" fill={colors.hairDark} />
            <rect x="21" y="2" width="5" height="4" fill={colors.hairDark} />
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

  // 마이클 조던 전용 염소수염 렌더링
  const renderGoatee = () => {
    if (roleModel !== "MICHAEL_JORDAN") return null;

    return (
      <>
        {/* 염소수염 - 턱 주변 */}
        <rect x="13" y="23" width="6" height="2" fill="#1A1A1A" />
        <rect x="14" y="24" width="4" height="2" fill="#1A1A1A" />
        <rect x="15" y="25" width="2" height="1" fill="#1A1A1A" />
      </>
    );
  };

  // 워렌 버핏 전용 안경 렌더링
  const renderGlasses = () => {
    if (roleModel !== "WARREN_BUFFETT") return null;

    return (
      <>
        {/* 안경테 - 둥근 사각형 스타일 */}
        {/* 왼쪽 렌즈 */}
        <rect
          x="6"
          y="12"
          width="8"
          height="6"
          fill="none"
          stroke="#3D3D3D"
          strokeWidth="1"
        />
        <rect x="7" y="13" width="6" height="4" fill="#E8F4FF" opacity="0.3" />

        {/* 오른쪽 렌즈 */}
        <rect
          x="18"
          y="12"
          width="8"
          height="6"
          fill="none"
          stroke="#3D3D3D"
          strokeWidth="1"
        />
        <rect x="19" y="13" width="6" height="4" fill="#E8F4FF" opacity="0.3" />

        {/* 코걸이 */}
        <rect x="14" y="14" width="4" height="1" fill="#3D3D3D" />

        {/* 안경다리 */}
        <rect x="4" y="13" width="2" height="1" fill="#3D3D3D" />
        <rect x="26" y="13" width="2" height="1" fill="#3D3D3D" />
      </>
    );
  };

  // 아인슈타인 전용 콧수염 렌더링
  const renderMustache = () => {
    if (roleModel !== "EINSTEIN") return null;

    return (
      <>
        {/* 콧수염 - 아인슈타인 특유의 큰 콧수염 */}
        <rect x="8" y="19" width="6" height="3" fill="#D8D8D8" />
        <rect x="18" y="19" width="6" height="3" fill="#D8D8D8" />
        <rect x="7" y="20" width="3" height="3" fill="#D8D8D8" />
        <rect x="22" y="20" width="3" height="3" fill="#D8D8D8" />
        {/* 콧수염 그림자 */}
        <rect x="9" y="21" width="5" height="1" fill="#B8B8B8" />
        <rect x="18" y="21" width="5" height="1" fill="#B8B8B8" />
        {/* 콧수염 하이라이트 */}
        <rect x="9" y="19" width="3" height="1" fill="#F0F0F0" />
        <rect x="19" y="19" width="3" height="1" fill="#F0F0F0" />
      </>
    );
  };

  // 마이클 조던 전용 농구공 렌더링 (드리블/점프)
  const renderBasketball = (isLookingRight: boolean) => {
    if (roleModel !== "MICHAEL_JORDAN") return null;
    if (animationState !== "walk" && animationState !== "jump") return null;

    // 점프할 때는 두 손으로 잡기 (상체 중간)
    if (animationState === "jump") {
      return (
        <g>
          {/* 농구공 - 상체 중간 */}
          <circle cx="16" cy="28" r="4" fill="#FF6B00" />
          {/* 농구공 줄무늬 */}
          <path d="M16 24 L16 32" stroke="#000" strokeWidth="0.5" />
          <path d="M12 28 L20 28" stroke="#000" strokeWidth="0.5" />
          {/* 농구공 하이라이트 */}
          <circle cx="14" cy="26" r="1" fill="#FFA500" opacity="0.6" />
        </g>
      );
    }

    // 드리블할 때
    const ballX = isLookingRight ? 22 : 2;

    return (
      <g
        style={{
          transformOrigin: `${ballX + 4}px 40px`,
          animation: "basketball-dribble 0.4s ease-in-out infinite",
        }}
      >
        {/* 농구공 - 상체 높이(y=30)에서 시작하여 바닥(y=42)까지 바운스 */}
        <circle cx={ballX + 4} cy="30" r="4" fill="#FF6B00" />
        {/* 농구공 줄무늬 */}
        <path
          d={`M${ballX + 4} 26 L${ballX + 4} 34`}
          stroke="#000"
          strokeWidth="0.5"
        />
        <path
          d={`M${ballX} 30 L${ballX + 8} 30`}
          stroke="#000"
          strokeWidth="0.5"
        />
        {/* 농구공 하이라이트 */}
        <circle cx={ballX + 2} cy="28" r="1" fill="#FFA500" opacity="0.6" />
      </g>
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
            <rect
              x="11"
              y="18"
              width="1"
              height="1"
              fill="#FFF"
              opacity="0.7"
            />

            {/* 오른쪽 눈 (앞쪽) - 동그란 형태 */}
            <rect x="19" y="14" width="5" height="6" fill="#000" />
            <rect x="18" y="15" width="7" height="4" fill="#000" />
            {/* 하얀 하이라이트 - 반짝이는 눈 */}
            <rect x="20" y="14" width="3" height="3" fill="#FFF" />
            <rect x="19" y="15" width="1" height="2" fill="#FFF" />
            <rect x="23" y="15" width="1" height="1" fill="#FFF" />
            {/* 작은 반짝임 */}
            <rect
              x="21"
              y="18"
              width="1"
              height="1"
              fill="#FFF"
              opacity="0.7"
            />
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
            <rect
              x="20"
              y="18"
              width="1"
              height="1"
              fill="#FFF"
              opacity="0.7"
            />

            {/* 왼쪽 눈 (앞쪽) - 동그란 형태 */}
            <rect x="8" y="14" width="5" height="6" fill="#000" />
            <rect x="7" y="15" width="7" height="4" fill="#000" />
            {/* 하얀 하이라이트 - 반짝이는 눈 */}
            <rect x="9" y="14" width="3" height="3" fill="#FFF" />
            <rect x="8" y="15" width="1" height="2" fill="#FFF" />
            <rect x="12" y="15" width="1" height="1" fill="#FFF" />
            {/* 작은 반짝임 */}
            <rect
              x="10"
              y="18"
              width="1"
              height="1"
              fill="#FFF"
              opacity="0.7"
            />
          </>
        )}

        {/* 안경 - 버핏 전용 */}
        {renderGlasses()}

        {/* 콧수염 - 아인슈타인 전용 */}
        {renderMustache()}

        {/* 염소수염 - 조던 전용 */}
        {renderGoatee()}

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
        {/* 마이클 조던 점프 시 두 손으로 농구공 잡기 */}
        {roleModel === "MICHAEL_JORDAN" && animationState === "jump" ? (
          <>
            {/* 왼쪽 팔 - 농구공 왼쪽으로 */}
            <g opacity="0.85">
              <rect x="9" y="26" width="3" height="4" fill={colors.shirt} />
              <rect x="10" y="26" width="4" height="3" fill={colors.skin} />
            </g>
            {/* 오른쪽 팔 - 농구공 오른쪽으로 */}
            <g>
              <rect x="20" y="26" width="3" height="4" fill={colors.shirt} />
              <rect x="18" y="26" width="4" height="3" fill={colors.skin} />
            </g>
          </>
        ) : roleModel === "MICHAEL_JORDAN" && animationState === "walk" ? (
          // 마이클 조던 드리블 시 - 농구공 쪽 손이 드리블
          isLookingRight ? (
            <>
              {/* 왼쪽 팔 (뒤쪽) - 일반 걷기 */}
              <g
                opacity="0.85"
                style={{
                  transformOrigin: "9px 29px",
                  animation: "arm-left 0.4s ease-in-out infinite",
                }}
              >
                <rect x="7" y="29" width="3" height="5" fill={colors.shirt} />
                <rect x="6" y="34" width="4" height="3" fill={colors.skin} />
              </g>
              {/* 오른쪽 팔 (앞쪽) - 드리블 터치 */}
              <g>
                <rect x="21" y="29" width="3" height="5" fill={colors.shirt} />
                {/* 손 - 드리블 터치 애니메이션 */}
                <rect
                  x="20"
                  y="34"
                  width="4"
                  height="3"
                  fill={colors.skin}
                  style={{
                    animation: "hand-dribble 0.4s ease-in-out infinite",
                  }}
                />
              </g>
            </>
          ) : (
            <>
              {/* 오른쪽 팔 (뒤쪽) - 일반 걷기 */}
              <g
                opacity="0.85"
                style={{
                  transformOrigin: "23px 29px",
                  animation: "arm-right 0.4s ease-in-out infinite",
                }}
              >
                <rect x="21" y="29" width="3" height="5" fill={colors.shirt} />
                <rect x="20" y="34" width="4" height="3" fill={colors.skin} />
              </g>
              {/* 왼쪽 팔 (앞쪽) - 드리블 터치 */}
              <g>
                <rect x="7" y="29" width="3" height="5" fill={colors.shirt} />
                {/* 손 - 드리블 터치 애니메이션 */}
                <rect
                  x="6"
                  y="34"
                  width="4"
                  height="3"
                  fill={colors.skin}
                  style={{
                    animation: "hand-dribble 0.4s ease-in-out infinite",
                  }}
                />
              </g>
            </>
          )
        ) : isLookingRight ? (
          <>
            {/* 왼쪽 팔 (뒤쪽, 살짝 어둡게) */}
            <g
              opacity="0.85"
              style={{
                transformOrigin: "9px 29px",
                animation: walkFrame
                  ? "arm-left 0.4s ease-in-out infinite"
                  : "none",
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
                animation: walkFrame
                  ? "arm-right 0.4s ease-in-out infinite"
                  : "none",
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
                animation: walkFrame
                  ? "arm-right 0.4s ease-in-out infinite"
                  : "none",
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
                animation: walkFrame
                  ? "arm-left 0.4s ease-in-out infinite"
                  : "none",
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
                animation: walkFrame
                  ? "leg-left 0.4s ease-in-out infinite"
                  : "none",
              }}
            >
              <rect x="11" y="36" width="4" height="8" fill={colors.skin} />
              <rect x="11" y="44" width="4" height="2" fill={colors.shoes} />
            </g>
            {/* 오른쪽 다리 (앞쪽) */}
            <g
              style={{
                transformOrigin: "19px 36px",
                animation: walkFrame
                  ? "leg-right 0.4s ease-in-out infinite"
                  : "none",
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
                animation: walkFrame
                  ? "leg-right 0.4s ease-in-out infinite"
                  : "none",
              }}
            >
              <rect x="17" y="36" width="4" height="8" fill={colors.skin} />
              <rect x="17" y="44" width="4" height="2" fill={colors.shoes} />
            </g>
            {/* 왼쪽 다리 (앞쪽) */}
            <g
              style={{
                transformOrigin: "13px 36px",
                animation: walkFrame
                  ? "leg-left 0.4s ease-in-out infinite"
                  : "none",
              }}
            >
              <rect x="11" y="36" width="4" height="8" fill={colors.skin} />
              <rect x="11" y="44" width="4" height="2" fill={colors.shoes} />
            </g>
          </>
        )}

        {/* 농구공 - 조던 전용 */}
        {renderBasketball(isLookingRight)}
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
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
          100% {
            transform: translateY(0);
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

        /* 농구공 드리블 애니메이션 */
        @keyframes basketball-dribble {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(8px);
          }
        }

        /* 드리블 터치 애니메이션 - 손만 아래로 내려가서 공 터치 */
        @keyframes hand-dribble {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(1px);
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
