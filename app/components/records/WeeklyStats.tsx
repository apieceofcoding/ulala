import type { WeeklyStatsResponse } from "@/api/tasks";

interface WeeklyStatsProps {
  accessToken: string | null;
  isLoading: boolean;
  weeklyStats: WeeklyStatsResponse | null;
}

export function WeeklyStats({
  accessToken,
  isLoading,
  weeklyStats,
}: WeeklyStatsProps) {
  // 달성률 계산
  const calculateCompletionRate = () => {
    if (!weeklyStats || weeklyStats.totalCount === 0) return 0;
    return Math.round(
      (weeklyStats.completedCount / weeklyStats.totalCount) * 100
    );
  };

  return (
    <div className="card-default">
      <h3 className="heading-secondary mb-2">주간 통계</h3>
      {accessToken && isLoading ? (
        <div className="text-center py-4 text-text-secondary dark:text-text-secondary-dark">
          데이터를 불러오는 중...
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-lg font-semibold text-secondary">
              {accessToken && weeklyStats ? weeklyStats.totalCount : 24}
            </div>
            <div className="caption-text">총 스토리</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-success">
              {accessToken && weeklyStats ? weeklyStats.completedCount : 18}
            </div>
            <div className="caption-text">완료</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">
              {accessToken && weeklyStats
                ? calculateCompletionRate()
                : 75}
              %
            </div>
            <div className="caption-text">달성률</div>
          </div>
        </div>
      )}
    </div>
  );
}
