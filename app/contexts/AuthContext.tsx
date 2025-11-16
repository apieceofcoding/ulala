import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import type { Member } from "@/types/member";
import { API_ENDPOINTS } from "@/api/endpoints";
import { apiClient, setRefreshTokenCallback } from "@/api/api";
import { logger } from "@/utils/logger";

interface AuthContextType {
  accessToken: string | null;
  member: Member | null;
  setAccessToken: (token: string | null) => void;
  setMember: (member: Member | null) => void;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
  fetchMember: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 액세스 토큰 유효 시간 (밀리초)
 * 1시간 = 60 * 60 * 1000
 */
const ACCESS_TOKEN_LIFETIME = 60 * 60 * 1000;

/**
 * 토큰 갱신 시점 (만료 5분 전)
 * 55분 = 55 * 60 * 1000
 */
const TOKEN_REFRESH_BEFORE_EXPIRY = 55 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 토큰 만료 시간 추적
  const tokenExpiryTimeRef = useRef<number | null>(null);
  // 주기적 갱신 타이머
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // member 정보 로드 헬퍼 함수
  const loadMemberInfo = useCallback(async (token: string) => {
    try {
      const memberResponse = await apiClient.get(API_ENDPOINTS.MEMBERS.ME, {
        token,
      });

      if (memberResponse.ok) {
        const memberData = await memberResponse.json();
        setMember(memberData);
      } else {
        logger.warn("회원 정보 조회 실패");
      }
    } catch (error) {
      logger.error("회원 정보 조회 오류:", error);
    }
  }, []);

  /**
   * 주기적 토큰 갱신 타이머 중지
   */
  const stopRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  /**
   * 인증 정보 강제 갱신 함수
   */
  const refreshAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.TOKEN, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.accessToken) {
          setAccessToken(data.accessToken);
          // 토큰 만료 시간 설정
          tokenExpiryTimeRef.current = Date.now() + ACCESS_TOKEN_LIFETIME;

          // accessToken 갱신 후 자동으로 member 정보 조회
          await loadMemberInfo(data.accessToken);

          // 주기적 갱신 타이머 재시작
          stopRefreshTimer();
          refreshTimerRef.current = setTimeout(() => {
            refreshAuth();
          }, TOKEN_REFRESH_BEFORE_EXPIRY);
        }
      } else {
        setAccessToken(null);
        setMember(null);
        tokenExpiryTimeRef.current = null;
        stopRefreshTimer();
      }
    } catch (error) {
      logger.error("인증 정보 갱신 오류:", error);
      setAccessToken(null);
      setMember(null);
      tokenExpiryTimeRef.current = null;
      stopRefreshTimer();
    } finally {
      setIsLoading(false);
    }
  }, [loadMemberInfo, stopRefreshTimer]);

  /**
   * 주기적 토큰 갱신 타이머 시작
   */
  const startRefreshTimer = useCallback(() => {
    // 기존 타이머 정리
    stopRefreshTimer();

    // 55분 후 토큰 갱신
    refreshTimerRef.current = setTimeout(() => {
      refreshAuth();
    }, TOKEN_REFRESH_BEFORE_EXPIRY);
  }, [refreshAuth, stopRefreshTimer]);

  /**
   * 토큰 설정 및 만료 시간 기록
   */
  const setTokenWithExpiry = useCallback((token: string | null) => {
    setAccessToken(token);

    if (token) {
      // 현재 시간 + 1시간
      tokenExpiryTimeRef.current = Date.now() + ACCESS_TOKEN_LIFETIME;

      // 주기적 갱신 타이머 시작
      startRefreshTimer();
    } else {
      tokenExpiryTimeRef.current = null;
      stopRefreshTimer();
    }
  }, [startRefreshTimer, stopRefreshTimer]);

  // 회원 정보 조회 함수 (수동 갱신용)
  const fetchMember = useCallback(async () => {
    if (!accessToken) {
      logger.warn("accessToken이 없어 회원 정보를 조회할 수 없습니다.");
      return;
    }

    await loadMemberInfo(accessToken);
  }, [accessToken, loadMemberInfo]);

  // 앱 시작 시 accessToken 발급 시도
  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await apiClient.post(API_ENDPOINTS.AUTH.TOKEN, {
          credentials: "include", // refreshToken이 담긴 Cookie 자동 전송
        });

        if (response.ok) {
          const data = await response.json();
          if (data.accessToken) {
            setTokenWithExpiry(data.accessToken);
            // accessToken 발급 후 자동으로 member 정보 조회
            await loadMemberInfo(data.accessToken);
          }
        }
      } catch (error) {
        logger.error("AccessToken 발급 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // cleanup: 컴포넌트 언마운트 시 타이머 정리
    return () => {
      stopRefreshTimer();
    };
  }, [setTokenWithExpiry, loadMemberInfo, stopRefreshTimer]);

  // API 클라이언트에 토큰 갱신 콜백 등록
  useEffect(() => {
    const refreshTokenCallback = async (): Promise<string | null> => {
      try {
        const response = await apiClient.post(API_ENDPOINTS.AUTH.TOKEN, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.accessToken) {
            setTokenWithExpiry(data.accessToken);
            // member 정보도 갱신
            await loadMemberInfo(data.accessToken);
            return data.accessToken;
          }
        }

        // 갱신 실패 시
        setTokenWithExpiry(null);
        setMember(null);
        return null;
      } catch {
        setTokenWithExpiry(null);
        setMember(null);
        return null;
      }
    };

    setRefreshTokenCallback(refreshTokenCallback);
  }, [setTokenWithExpiry, loadMemberInfo]);

  // Page Visibility API를 사용한 탭 활성화 감지
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && accessToken) {
        // 토큰이 만료되었거나 곧 만료될 경우 갱신
        const now = Date.now();
        if (tokenExpiryTimeRef.current && now >= tokenExpiryTimeRef.current - (5 * 60 * 1000)) {
          refreshAuth();
        } else {
          // 토큰이 유효하면 타이머 재시작
          startRefreshTimer();
        }
      } else if (document.visibilityState === 'hidden') {
        stopRefreshTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [accessToken, refreshAuth, startRefreshTimer, stopRefreshTimer]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        member,
        setAccessToken,
        setMember,
        isLoading,
        refreshAuth,
        fetchMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
