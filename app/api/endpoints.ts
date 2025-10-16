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
 * 전체 API 엔드포인트
 * 카테고리별로 그룹화된 엔드포인트를 포함합니다.
 */
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  OAUTH: OAUTH_ENDPOINTS,
  MEMBERS: MEMBER_ENDPOINTS,
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
