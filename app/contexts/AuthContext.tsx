import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Member } from "@/types/member";
import { API_ENDPOINTS } from "@/api/endpoints";
import { apiClient } from "@/api/api";
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
            setAccessToken(data.accessToken);
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
  }, []);

  // member 정보 로드 헬퍼 함수
  const loadMemberInfo = async (token: string) => {
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
  };

  // 회원 정보 조회 함수 (수동 갱신용)
  const fetchMember = async () => {
    if (!accessToken) {
      logger.warn("accessToken이 없어 회원 정보를 조회할 수 없습니다.");
      return;
    }

    await loadMemberInfo(accessToken);
  };

  // 인증 정보 강제 갱신 함수
  const refreshAuth = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.TOKEN, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.accessToken) {
          setAccessToken(data.accessToken);
          // accessToken 갱신 후 자동으로 member 정보 조회
          await loadMemberInfo(data.accessToken);
        }
      } else {
        setAccessToken(null);
        setMember(null);
      }
    } catch (error) {
      logger.error("인증 정보 갱신 오류:", error);
      setAccessToken(null);
      setMember(null);
    } finally {
      setIsLoading(false);
    }
  };

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
