/**
 * 캐릭터 관련 타입 정의
 */

/**
 * 롤모델 타입
 */
export type RoleModel = "EINSTEIN" | "WARREN_BUFFETT" | "MICHAEL_JORDAN" | "ELON_MUSK";

/**
 * 캐릭터 API 응답 인터페이스 (백엔드 응답)
 */
export interface CharacterResponse {
  /** 캐릭터 ID */
  id: number;
  /** 롤모델 */
  roleModel: RoleModel;
  /** 롤모델 표시 이름 */
  roleModelDisplayName: string;
  /** 회원 ID */
  memberId: string;
}

/**
 * 캐릭터 데이터 인터페이스
 */
export interface Character {
  /** 캐릭터 ID */
  id: number;
  /** 회원 ID */
  memberId: string;
  /** 롤모델 */
  roleModel: RoleModel;
  /** 롤모델 표시 이름 */
  displayName: string;
}

/**
 * 캐릭터 생성 요청 데이터
 */
export interface CreateCharacterRequest {
  /** 롤모델 */
  roleModel: RoleModel;
}

/**
 * 캐릭터 수정 요청 데이터
 */
export interface UpdateCharacterRequest {
  /** 롤모델 */
  roleModel: RoleModel;
}

/**
 * CharacterResponse를 Character로 변환
 */
export const toCharacter = (response: CharacterResponse): Character => {
  return {
    id: response.id,
    memberId: response.memberId,
    roleModel: response.roleModel,
    displayName: response.roleModelDisplayName,
  };
};

/**
 * 게임 애니메이션 상태
 */
export type AnimationState = "idle" | "walk" | "jump";

/**
 * 캐릭터 방향
 */
export type Direction = "left" | "right";

/**
 * 게임 물리 상태
 */
export interface GameState {
  /** 캐릭터 X 위치 (px) */
  x: number;
  /** 캐릭터 Y 위치 (px) */
  y: number;
  /** X축 속도 (px/frame) */
  velocityX: number;
  /** Y축 속도 (px/frame) */
  velocityY: number;
  /** 점프 중인지 여부 */
  isJumping: boolean;
  /** 바라보는 방향 */
  direction: Direction;
  /** 현재 애니메이션 상태 */
  animationState: AnimationState;
}

/**
 * 게임 설정
 */
export interface GameConfig {
  /** 맵 너비 (px) */
  mapWidth: number;
  /** 맵 높이 (px) */
  mapHeight: number;
  /** 캐릭터 크기 (px) */
  characterSize: number;
  /** 중력 가속도 (px/frame²) */
  gravity: number;
  /** 이동 속도 (px/frame) */
  moveSpeed: number;
  /** 점프 초기 속도 (px/frame, 음수) */
  jumpSpeed: number;
  /** 바닥 Y 위치 (px) */
  groundY: number;
}

/**
 * 입력 키 상태
 */
export interface InputState {
  /** 왼쪽 키 눌림 */
  left: boolean;
  /** 오른쪽 키 눌림 */
  right: boolean;
  /** 점프 키 눌림 */
  jump: boolean;
}
