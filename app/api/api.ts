/**
 * API 클라이언트 및 설정
 *
 * API 관련 모든 설정과 클라이언트 함수를 관리합니다.
 * - 환경 변수 관리
 * - API 클라이언트 함수 (GET, POST, PUT, DELETE)
 * - 인증, 에러 핸들링, 타임아웃 처리
 */

/**
 * API 기본 URL
 * 환경 변수에서 API 서버 주소를 가져옵니다.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

/**
 * API 요청 기본 타임아웃 (밀리초)
 */
export const API_TIMEOUT = 30000;

/**
 * API 관련 설정 객체
 */
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  credentials: 'include' as RequestCredentials,
} as const;

/**
 * API 요청 옵션 인터페이스
 */
export interface ApiRequestOptions extends RequestInit {
  /** 인증 토큰 (Bearer 토큰) */
  token?: string;
  /** 타임아웃 (밀리초) */
  timeout?: number;
}

/**
 * API 에러 클래스
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string,
  ) {
    super(message || `API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

/**
 * 완전한 URL 생성
 * @param endpoint - API 엔드포인트 경로
 * @returns 전체 URL
 */
function buildUrl(endpoint: string): string {
  // 이미 완전한 URL인 경우 그대로 반환
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }

  // BASE_URL과 endpoint를 결합
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  return `${baseUrl}${path}`;
}

/**
 * 공통 API 요청 함수
 * @param endpoint - API 엔드포인트 경로
 * @param options - 요청 옵션
 * @returns Response 객체
 */
async function request(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<Response> {
  const { token, timeout = 30000, headers = {}, ...restOptions } = options;

  // 헤더 설정
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  // 토큰이 있는 경우 Authorization 헤더 추가
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  // URL 생성
  const url = buildUrl(endpoint);

  // 타임아웃 처리를 위한 AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(408, 'Request Timeout', '요청 시간이 초과되었습니다.');
    }

    throw error;
  }
}

/**
 * GET 요청
 * @param endpoint - API 엔드포인트 경로
 * @param options - 요청 옵션
 * @returns Response 객체
 */
async function get(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<Response> {
  return request(endpoint, {
    ...options,
    method: 'GET',
  });
}

/**
 * POST 요청
 * @param endpoint - API 엔드포인트 경로
 * @param options - 요청 옵션
 * @returns Response 객체
 */
async function post(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<Response> {
  return request(endpoint, {
    ...options,
    method: 'POST',
  });
}

/**
 * PUT 요청
 * @param endpoint - API 엔드포인트 경로
 * @param options - 요청 옵션
 * @returns Response 객체
 */
async function put(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<Response> {
  return request(endpoint, {
    ...options,
    method: 'PUT',
  });
}

/**
 * DELETE 요청
 * @param endpoint - API 엔드포인트 경로
 * @param options - 요청 옵션
 * @returns Response 객체
 */
async function deleteRequest(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<Response> {
  return request(endpoint, {
    ...options,
    method: 'DELETE',
  });
}

/**
 * API 클라이언트 객체
 */
export const apiClient = {
  request,
  get,
  post,
  put,
  delete: deleteRequest,
  buildUrl,
};
