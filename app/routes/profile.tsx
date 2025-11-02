import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import kakaoLoginImage from "@/assets/images/kakao_login_large_narrow.png";
import { API_ENDPOINTS } from "@/api/endpoints";
import { apiClient } from "@/api/api";
import { useAuth } from "@/contexts/AuthContext";
import { logger } from "@/utils/logger";

export function meta() {
  return [
    { title: "내정보 - ulala" },
    { name: "description", content: "프로필과 설정을 관리하세요" },
  ];
}

export default function Profile() {
  const navigate = useNavigate();
  const { accessToken, member, setAccessToken, setMember, fetchMember } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [totalTodos, setTotalTodos] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // accessToken이 있으면 member 정보 조회
  useEffect(() => {
    if (accessToken && !member) {
      fetchMember();
    }
  }, [accessToken, member, fetchMember]);

  useEffect(() => {
    // 다크 모드 설정 불러오기 및 적용
    const savedDarkMode = localStorage.getItem("ulala-dark-mode");
    if (savedDarkMode) {
      const isDark = JSON.parse(savedDarkMode);
      setDarkMode(isDark);

      // 페이지 로드 시 다크 모드 적용
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    // 알림 설정 불러오기
    const savedNotifications = localStorage.getItem("ulala-notifications");
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }

    // 통계 데이터 계산
    calculateStats();
  }, []);

  const calculateStats = () => {
    // 보상 데이터에서 총 포인트 계산
    const savedRewards = localStorage.getItem("ulala-rewards");
    if (savedRewards) {
      const rewards = JSON.parse(savedRewards) as Array<{ value?: number }>;
      const points = rewards.reduce((total: number, reward) => {
        return total + (reward.value || 0);
      }, 0);
      setTotalPoints(points);

      // 완료한 할 일 수는 보상 수와 동일
      setTotalTodos(rewards.length);
    }

    // 연속 달성 일수 계산 (샘플)
    setStreak(7);

    // 완료율 계산 (샘플)
    setCompletionRate(85);
  };

  const handleDarkModeToggle = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem("ulala-dark-mode", JSON.stringify(newValue));

    if (newValue) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleNotificationsToggle = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    localStorage.setItem("ulala-notifications", JSON.stringify(newValue));
  };

  const handleResetData = () => {
    if (
      confirm("모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    ) {
      localStorage.removeItem("ulala-rewards");
      localStorage.removeItem("ulala-todos");
      setTotalTodos(0);
      setTotalPoints(0);
      alert("데이터가 초기화되었습니다.");
      window.location.reload();
    }
  };

  const handleKakaoLogin = () => {
    window.location.href = apiClient.buildUrl(API_ENDPOINTS.OAUTH.KAKAO);
  };

  const handleKakaoLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {
        credentials: "include", // refreshToken Cookie 자동 전송
      });

      if (response.ok) {
        // 메모리의 accessToken과 회원 정보 초기화
        setAccessToken(null);
        setMember(null);
      } else {
        alert("로그아웃에 실패했습니다.");
      }
    } catch (error) {
      logger.error("로그아웃 오류:", error);
      alert("로그아웃에 실패했습니다.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleEditProfile = () => {
    if (!member) {
      alert("로그인이 필요합니다.");
      return;
    }
    navigate("/profile/edit", {
      state: { accessToken, member },
    });
  };

  // 레벨 계산 (10개당 1레벨)
  const level = Math.floor(totalTodos / 10) + 1;
  const currentLevelTodos = totalTodos % 10;
  const experiencePercent = (currentLevelTodos / 10) * 100;

  return (
    <>
      <TopBar level={level} />
      <main className="min-h-screen bg-bg-secondary dark:bg-bg-secondary-dark p-1 pt-14 pb-16 md:pb-1 md:pl-64">
        <div className="container max-w-lg mx-auto space-y-6">
          {/* 로그인 전 상태 */}
          {!member && (
            <div className="card-default text-center space-y-4">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-bg-tertiary dark:bg-bg-tertiary-dark flex items-center justify-center text-3xl mb-4">
                  👤
                </div>
                <h2 className="body-text mb-2">
                  로그인을 하고 더 많은 기능을 이용해보세요
                </h2>
                <button
                  onClick={handleKakaoLogin}
                  className="transition-all duration-150 hover:opacity-90 active:opacity-80"
                  style={{ width: "200px", maxWidth: "100%" }}
                >
                  <img
                    src={kakaoLoginImage}
                    alt="카카오 로그인"
                    className="w-full h-auto"
                  />
                </button>
              </div>
            </div>
          )}

          {/* 로그인 후 상태 - 프로필 헤더 */}
          {member && (
            <div className="card-default text-center space-y-4">
              <div className="flex justify-end mb-2">
                <button
                  onClick={handleEditProfile}
                  className="text-sm text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors duration-150"
                >
                  수정
                </button>
              </div>
              <div className="flex flex-col items-center">
                {/* 프로필 이미지 */}
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.displayName || "프로필"}
                    className="w-20 h-20 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-bg-tertiary dark:bg-bg-tertiary-dark flex items-center justify-center text-3xl mb-4">
                    👤
                  </div>
                )}

                {/* 이름 */}
                <h1 className="heading-primary mb-1">
                  {member.displayName || "회원"}
                </h1>

                {/* 사용자이름 */}
                <p className="caption-text text-text-tertiary dark:text-text-tertiary-dark mb-4">
                  @{member.username}
                </p>

                {/* 레벨 정보 */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="body-text">레벨 {member.level}</span>
                  <span className="caption-text">• {totalTodos}개 완료</span>
                </div>

                {/* 경험치 바 */}
                <div className="w-full">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="caption-text whitespace-nowrap">
                      다음 레벨까지
                    </span>
                    <span className="caption-text font-semibold whitespace-nowrap">
                      {currentLevelTodos}/10
                    </span>
                  </div>
                  <div className="w-full h-2 bg-bg-tertiary dark:bg-bg-tertiary-dark rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-primary transition-all duration-300 rounded-full"
                      style={{ width: `${experiencePercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 활동 통계 */}
          <div className="card-default">
            <h3 className="heading-secondary mb-4">활동 통계</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="card-default text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {totalTodos}
                </div>
                <div className="caption-text">완료한 할 일</div>
              </div>
              <div className="card-default text-center">
                <div className="text-2xl font-bold text-accent mb-1">
                  {totalPoints}
                </div>
                <div className="caption-text">누적 포인트</div>
              </div>
              <div className="card-default text-center">
                <div className="text-2xl font-bold text-secondary mb-1">
                  {streak}일
                </div>
                <div className="caption-text">연속 달성</div>
              </div>
              <div className="card-default text-center">
                <div className="text-2xl font-bold text-success mb-1">
                  {completionRate}%
                </div>
                <div className="caption-text">완료율</div>
              </div>
            </div>
          </div>

          {/* 설정 */}
          <div className="card-default">
            <h3 className="heading-secondary mb-4">설정</h3>
            <div className="space-y-4">
              {/* 다크 모드 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🌙</span>
                  <div>
                    <div className="font-semibold text-text-primary dark:text-text-primary-dark">
                      다크 모드
                    </div>
                    <div className="caption-text">어두운 테마 사용</div>
                  </div>
                </div>
                <button
                  onClick={handleDarkModeToggle}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    darkMode
                      ? "bg-primary"
                      : "bg-bg-tertiary dark:bg-bg-tertiary-dark"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                      darkMode ? "translate-x-7" : "translate-x-1"
                    }`}
                  ></div>
                </button>
              </div>

              {/* 알림 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔔</span>
                  <div>
                    <div className="font-semibold text-text-primary dark:text-text-primary-dark">
                      알림
                    </div>
                    <div className="caption-text">할 일 알림 받기</div>
                  </div>
                </div>
                <button
                  onClick={handleNotificationsToggle}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    notifications
                      ? "bg-primary"
                      : "bg-bg-tertiary dark:bg-bg-tertiary-dark"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                      notifications ? "translate-x-7" : "translate-x-1"
                    }`}
                  ></div>
                </button>
              </div>

              {/* 언어 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🌐</span>
                  <div>
                    <div className="font-semibold text-text-primary dark:text-text-primary-dark">
                      언어
                    </div>
                    <div className="caption-text">앱 언어 설정</div>
                  </div>
                </div>
                <span className="body-text-small text-text-tertiary dark:text-text-tertiary-dark">
                  한국어
                </span>
              </div>
            </div>
          </div>

          {/* 데이터 관리 */}
          <div className="card-default">
            <h3 className="heading-secondary mb-4">데이터 관리</h3>
            <button onClick={handleResetData} className="w-full btn-secondary">
              데이터 초기화
            </button>
          </div>

          {/* 앱 정보 */}
          <div className="card-default">
            <h3 className="heading-secondary mb-4">앱 정보</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="body-text">버전</span>
                <span className="caption-text">1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="body-text">제작</span>
                <span className="caption-text">Ulala Team</span>
              </div>
            </div>
          </div>

          {/* 로그아웃 */}
          {member && (
            <div className="text-center pb-4">
              <button
                onClick={handleKakaoLogout}
                disabled={isLoggingOut}
                className="text-text-tertiary dark:text-text-tertiary-dark text-sm underline hover:text-text-secondary dark:hover:text-text-secondary-dark transition-colors duration-150 disabled:opacity-50"
              >
                {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
              </button>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
