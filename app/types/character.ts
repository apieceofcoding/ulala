/**
 * 캐릭터 관련 타입 정의
 */

/**
 * 캐릭터 스타일 타입 (인물 기반)
 */
export type CharacterStyle = "einstein" | "buffett" | "jordan" | "musk";

/**
 * 캐릭터 데이터 인터페이스
 */
export interface Character {
  /** 캐릭터 ID */
  id: string;
  /** 회원 ID */
  memberId: string;
  /** 캐릭터 이름 */
  name: string;
  /** 캐릭터 스타일 */
  style: CharacterStyle;
  /** 레벨 */
  level: number;
  /** 생성일시 */
  createdAt: string;
}

/**
 * 캐릭터 생성 요청 데이터
 */
export interface CreateCharacterRequest {
  /** 캐릭터 이름 (선택사항) */
  name?: string;
  /** 캐릭터 스타일 (선택사항, 기본값은 랜덤) */
  style?: CharacterStyle;
}

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
