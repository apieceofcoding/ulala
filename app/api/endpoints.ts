/**
 * API 엔드포인트 상수 정의
 *
 * 모든 API 엔드포인트는 이 파일에서 관리됩니다.
 * 카테고리별로 구조화되어 있으며, TypeScript의 타입 안전성을 보장합니다.
 */

/**
 * 인증 관련 엔드포인트
 */
export const AUTH_ENDPOINTS = {
  /** AccessToken 발급 */
  TOKEN: "/api/auth/token",
  /** 로그아웃 */
  LOGOUT: "/api/auth/logout",
} as const;

/**
 * OAuth 관련 엔드포인트
 */
export const OAUTH_ENDPOINTS = {
  /** 카카오 로그인 */
  KAKAO: "/oauth2/authorization/kakao",
} as const;

/**
 * 회원 관련 엔드포인트
 */
export const MEMBER_ENDPOINTS = {
  /** 현재 로그인한 사용자 정보 조회 */
  ME: "/api/members/me",
  /** 프로필 정보 업데이트 */
  UPDATE_PROFILE: "/api/members/me",
  /** 사용자이름 중복 확인 */
  CHECK_USERNAME: "/api/members",
} as const;

/**
 * Task 관련 엔드포인트
 */
export const TASK_ENDPOINTS = {
  /** 내 태스크 목록 조회 */
  LIST: "/api/tasks",
  /** 태스크 생성 */
  CREATE: "/api/tasks",
  /** 태스크 상세 조회 */
  GET: (id: string) => `/api/tasks/${id}`,
  /** 태스크 수정 */
  UPDATE: (id: string) => `/api/tasks/${id}`,
  /** 태스크 삭제 */
  DELETE: (id: string) => `/api/tasks/${id}`,
  /** 일별 태스크 통계 조회 */
  DAILY_STATS: "/api/tasks/daily-stats",
  /** 최근 활동 조회 */
  RECENT: "/api/tasks/recent",
  /** 주간 태스크 통계 조회 */
  WEEKLY_STATS: "/api/tasks/weekly-stats",
} as const;

/**
 * Reward 관련 엔드포인트
 */
export const REWARD_ENDPOINTS = {
  /** 내 보상 목록 조회 */
  LIST: "/api/rewards",
  /** 보상 검색 (소스 타입과 ID로 조회) */
  SEARCH: "/api/rewards/search",
} as const;

/**
 * Character 관련 엔드포인트
 */
export const CHARACTER_ENDPOINTS = {
  /** 캐릭터 조회 */
  GET: (memberId: string) => `/api/members/${memberId}/character`,
  /** 캐릭터 생성 */
  CREATE: (memberId: string) => `/api/members/${memberId}/character`,
} as const;

/**
 * 전체 API 엔드포인트
 * 카테고리별로 그룹화된 엔드포인트를 포함합니다.
 */
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  OAUTH: OAUTH_ENDPOINTS,
  MEMBERS: MEMBER_ENDPOINTS,
  TASKS: TASK_ENDPOINTS,
  REWARDS: REWARD_ENDPOINTS,
  CHARACTERS: CHARACTER_ENDPOINTS,
} as const;

/**
 * API 엔드포인트 타입
 * 타입 안전성을 위한 유틸리티 타입
 */
export type AuthEndpoint = (typeof AUTH_ENDPOINTS)[keyof typeof AUTH_ENDPOINTS];
export type OAuthEndpoint =
  (typeof OAUTH_ENDPOINTS)[keyof typeof OAUTH_ENDPOINTS];
export type MemberEndpoint =
  (typeof MEMBER_ENDPOINTS)[keyof typeof MEMBER_ENDPOINTS];
export type RewardEndpoint =
  (typeof REWARD_ENDPOINTS)[keyof typeof REWARD_ENDPOINTS];
export type CharacterEndpoint =
  (typeof CHARACTER_ENDPOINTS)[keyof typeof CHARACTER_ENDPOINTS];
