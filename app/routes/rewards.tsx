import { useState, useEffect, useRef, useCallback } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { API_ENDPOINTS } from "@/api/endpoints";
import { apiClient } from "@/api/api";
import { logger } from "@/utils/logger";

export function meta() {
  return [
    { title: "보상 - ulala" },
    { name: "description", content: "완료한 할 일에 대한 보상을 확인하세요" },
  ];
}

// 프론트엔드 Reward 타입
interface Reward {
  id: string;
  title: string;
  description: string;
  earnedAt: string;
  type: 'points' | 'badge' | 'achievement';
  value?: number;
  icon: string;
  isNew?: boolean;
}

// 백엔드 RewardResponse 타입
interface RewardResponse {
  id: string;
  memberId: string;
  sourceId: string;
  sourceType: "TASK" | "EVENT";
  point: number;
  exp: number;
  createdAt: string | null;
  modifiedAt: string | null;
}

// 페이지네이션 응답 타입
interface PageResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

// sourceType에 따른 아이콘 매핑
const getIconBySourceType = (sourceType: string): string => {
  switch (sourceType) {
    case "TASK":
      return "🎯";
    case "EVENT":
      return "🎉";
    default:
      return "🎁";
  }
};

// 백엔드 데이터를 프론트엔드 타입으로 변환
const transformRewardResponse = (response: RewardResponse): Reward => {
  return {
    id: response.id,
    title: response.sourceType === "TASK" ? "할 일 완료" : "이벤트 달성",
    description: `${response.point}포인트와 ${response.exp}경험치를 획득했습니다`,
    earnedAt: response.createdAt || new Date().toISOString(),
    type: "points",
    value: response.point,
    icon: getIconBySourceType(response.sourceType),
    isNew: false,
  };
};

export default function Rewards() {
  const { accessToken } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const observerTarget = useRef<HTMLDivElement>(null);

  // 보상 데이터 조회 함수
  const fetchRewards = useCallback(async (page: number = 0, isInitial: boolean = true) => {
    // accessToken이 없으면 API 호출하지 않음
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      const response = await apiClient.get(
        `${API_ENDPOINTS.REWARDS.LIST}?page=${page}&size=10`,
        { token: accessToken }
      );

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }

      const data: PageResponse<RewardResponse> = await response.json();

      // 데이터 변환
      const transformedRewards = data.content.map(transformRewardResponse);

      // 데이터 누적 또는 초기화
      if (isInitial) {
        setRewards(transformedRewards);
      } else {
        setRewards((prev) => [...prev, ...transformedRewards]);
      }

      // 페이지 정보 업데이트
      setCurrentPage(data.page.number);
      setHasMore(data.page.number < data.page.totalPages - 1);

      // 총 포인트 계산 (전체 데이터 기준)
      if (isInitial) {
        const points = transformedRewards.reduce((total: number, reward: Reward) => {
          return total + (reward.value || 0);
        }, 0);
        setTotalPoints(points);
      } else {
        const newPoints = transformedRewards.reduce((total: number, reward: Reward) => {
          return total + (reward.value || 0);
        }, 0);
        setTotalPoints((prev) => prev + newPoints);
      }
    } catch (err) {
      logger.error("보상 데이터 로드 실패:", err);
      setError("보상 정보를 불러오는데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [accessToken]);

  // 초기 데이터 로드
  useEffect(() => {
    fetchRewards(0, true);
  }, [fetchRewards]);

  // 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 관찰 대상이 보이고, 더 불러올 데이터가 있고, 현재 로딩 중이 아닐 때
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !loading) {
          fetchRewards(currentPage + 1, false);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoadingMore, loading, currentPage, fetchRewards]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "오늘";
    if (diffDays === 2) return "어제";
    if (diffDays <= 7) return `${diffDays - 1}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'points': return '포인트';
      case 'badge': return '뱃지';
      case 'achievement': return '업적';
      default: return '';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'points': return 'text-primary';
      case 'badge': return 'text-accent';
      case 'achievement': return 'text-secondary';
      default: return 'text-text-secondary';
    }
  };

  return (
    <>
      <TopBar level={1} />
      <main className="min-h-screen bg-bg-secondary dark:bg-bg-secondary-dark p-1 pt-14 pb-16 md:pb-1 md:pl-64">
        <div className="container max-w-lg mx-auto space-y-6">
          {/* 헤더 및 총 포인트 */}
          <div className="card-default text-center space-y-4">
            <h1 className="heading-primary mb-4">보상</h1>
            <div className="card-default">
              <h3 className="heading-secondary mb-2">내 포인트</h3>
              <div className="text-3xl font-bold text-primary mb-2">{totalPoints}</div>
              <div className="caption-text">누적 포인트</div>
            </div>
          </div>

          {/* 로딩 상태 */}
          {loading && (
            <div className="card-default text-center space-y-4">
              <div className="flex justify-center items-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="body-text">보상 정보를 불러오는 중...</p>
            </div>
          )}

          {/* 에러 상태 */}
          {!loading && error && (
            <div className="card-default text-center space-y-4">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="heading-secondary text-error">오류 발생</h3>
              <p className="body-text">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary mt-4"
              >
                다시 시도
              </button>
            </div>
          )}

          {/* 최근 보상 */}
          {!loading && !error && rewards.length > 0 && (
            <div className="card-default">
              <h3 className="heading-secondary mb-4">최근 획득한 보상</h3>
              <div className="space-y-3">
                {rewards
                  .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
                  .map((reward) => (
                    <div
                      key={reward.id}
                      className={`card-clickable p-3 relative ${
                        reward.isNew ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      {reward.isNew && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
                      )}
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{reward.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-text-primary dark:text-text-primary-dark">
                              {reward.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              {reward.value && (
                                <span className="text-sm font-bold text-primary">
                                  +{reward.value}
                                </span>
                              )}
                              <span className={`caption-text ${getTypeColor(reward.type)}`}>
                                {getTypeLabel(reward.type)}
                              </span>
                            </div>
                          </div>
                          <p className="body-text-small mb-2">{reward.description}</p>
                          <div className="caption-text">{formatDate(reward.earnedAt)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* 무한 스크롤 관찰 대상 */}
              {hasMore && (
                <div ref={observerTarget} className="py-4 text-center">
                  {isLoadingMore && (
                    <div className="flex justify-center items-center">
                      <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 빈 데이터 상태 */}
          {!loading && !error && rewards.length === 0 && (
            <div className="card-default text-center space-y-4">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="heading-secondary">아직 보상이 없어요</h3>
              <p className="body-text">
                스토리 탭에서 할 일을 완료하면 보상을 받을 수 있어요!
              </p>
            </div>
          )}

          {/* 보상 정보 */}
          <div className="card-default">
            <h3 className="heading-secondary mb-4">보상 안내</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="text-xl">🎯</div>
                <div>
                  <div className="font-semibold text-text-primary dark:text-text-primary-dark">
                    할 일 완료
                  </div>
                  <div className="caption-text">할 일을 완료할 때마다 포인트와 뱃지를 획득</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xl">🏆</div>
                <div>
                  <div className="font-semibold text-text-primary dark:text-text-primary-dark">
                    업적 달성
                  </div>
                  <div className="caption-text">연속 완료, 특별한 도전 과제 달성 시 특별 보상</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xl">💎</div>
                <div>
                  <div className="font-semibold text-text-primary dark:text-text-primary-dark">
                    포인트 활용
                  </div>
                  <div className="caption-text">모은 포인트로 다양한 혜택을 받아보세요</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}