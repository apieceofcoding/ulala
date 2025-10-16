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

  // accessToken이 있으면 회원 정보 조회
  useEffect(() => {
    const fetchMemberInfo = async () => {
      if (!accessToken || member) {
        return;
      }

      try {
        const memberResponse = await apiClient.get(API_ENDPOINTS.MEMBERS.ME, {
          token: accessToken,
        });

        if (memberResponse.ok) {
          const memberData = await memberResponse.json();
          setMember(memberData);
        } else {
          // 토큰이 유효하지 않으면 초기화
          setAccessToken(null);
          setMember(null);
        }
      } catch (error) {
        logger.error("회원 정보 조회 오류:", error);
      }
    };

    fetchMemberInfo();
  }, [accessToken, member]);

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
