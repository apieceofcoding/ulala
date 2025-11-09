import { useState, useEffect, useMemo, useCallback } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/hooks/useTasks";
import {
  Calendar,
  generateSampleRecords,
  type StoryRecord,
} from "@/components/records/Calendar";
import { TodayProgress } from "@/components/records/TodayProgress";
import { RecentActivity } from "@/components/records/RecentActivity";
import { WeeklyStats } from "@/components/records/WeeklyStats";
import { formatLocalDate, getCalendarDateRange } from "@/utils/dateUtils";
import { searchRewards } from "@/api/rewards";
import { TaskStatus } from "@/types/task";
import { logger } from "@/utils/logger";

export function meta() {
  return [
    { title: "기록 - ulala" },
    { name: "description", content: "게임 기록과 통계를 확인하세요" },
  ];
}

export default function Records() {
  const { accessToken } = useAuth();
  const {
    tasks,
    dailyStats,
    isDailyStatsLoading,
    fetchDailyStats,
    recentTasks,
    isRecentTasksLoading,
    fetchRecentTasks,
    weeklyStats,
    isWeeklyStatsLoading,
    fetchWeeklyStats,
  } = useTasks({
    accessToken,
    autoFetch: true, // 태스크 목록 조회 필요 (오늘 완료한 태스크 확인용)
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 보상 데이터 상태
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [totalExp, setTotalExp] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  // 샘플 데이터는 한번만 생성 (비로그인 상태용)
  const sampleRecords = useMemo(() => generateSampleRecords(), []);

  // 오늘 완료한 태스크 필터링 (useMemo로 캐싱)
  const todayCompletedTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    const todayDateString = formatLocalDate(new Date());

    return tasks.filter((task) => {
      // status가 DONE이어야 함
      if (task.status !== TaskStatus.DONE) return false;

      // endAt이 있으면 우선 사용, 없으면 modifiedAt 사용
      const completedDate = task.endAt || task.modifiedAt;
      if (!completedDate) return false;

      // 날짜만 비교 (시간 부분 제거)
      const taskDateString = formatLocalDate(new Date(completedDate));
      return taskDateString === todayDateString;
    });
  }, [tasks]);

  // 보상 데이터 조회
  const fetchTodayRewards = useCallback(async () => {
    if (!accessToken || todayCompletedTasks.length === 0) {
      // 완료한 태스크가 없으면 0으로 설정
      setCompletedTasksCount(0);
      setTotalExp(0);
      setTotalPoints(0);
      return;
    }

    try {
      const taskIds = todayCompletedTasks.map((task) => task.id);

      const rewards = await searchRewards(
        {
          sourceType: "TASK",
          sourceIds: taskIds,
        },
        accessToken,
      );

      // 데이터 집계
      setCompletedTasksCount(todayCompletedTasks.length);
      const exp = rewards.reduce((sum, reward) => sum + reward.exp, 0);
      const points = rewards.reduce((sum, reward) => sum + reward.point, 0);
      setTotalExp(exp);
      setTotalPoints(points);
    } catch (error) {
      logger.error("Failed to fetch today rewards:", error);
      // 에러 발생 시 기본값(0) 유지
      setCompletedTasksCount(todayCompletedTasks.length);
      setTotalExp(0);
      setTotalPoints(0);
    }
  }, [accessToken, todayCompletedTasks]);

  // 오늘 완료한 태스크가 변경되면 보상 데이터 조회
  useEffect(() => {
    fetchTodayRewards();
  }, [fetchTodayRewards]);

  // 스토리 기록 데이터 조회
  useEffect(() => {
    if (!accessToken) {
      // 로그인하지 않은 경우는 샘플 데이터 사용
      return;
    }

    // 로그인한 경우 API로 데이터 조회
    const { startDate, endDate } = getCalendarDateRange(currentMonth);
    fetchDailyStats(startDate, endDate);
  }, [accessToken, currentMonth, fetchDailyStats]);

  // 최근 활동 조회
  useEffect(() => {
    if (!accessToken) {
      return;
    }

    fetchRecentTasks();
  }, [accessToken, fetchRecentTasks]);

  // 주간 통계 조회
  useEffect(() => {
    if (!accessToken) {
      return;
    }

    fetchWeeklyStats();
  }, [accessToken, fetchWeeklyStats]);

  // storyRecords 생성: 로그인 여부에 따라 샘플 또는 실제 데이터 사용
  const storyRecords: StoryRecord[] = accessToken
    ? dailyStats.map((item) => ({
        date: item.date,
        storyCount: item.count,
      }))
    : sampleRecords;

  return (
    <>
      <TopBar level={1} />
      <main className="min-h-screen bg-bg-secondary dark:bg-bg-secondary-dark p-1 pt-14 pb-16 md:pb-1 md:pl-64">
        <div className="container max-w-lg mx-auto space-y-6">
          <div className="card-default text-center space-y-4">
            <div className="space-y-4">
              <TodayProgress
                completedTasks={completedTasksCount}
                totalExp={totalExp}
                totalPoints={totalPoints}
              />

              {accessToken && isDailyStatsLoading ? (
                <div className="card-default text-center py-8">
                  <div className="text-text-secondary dark:text-text-secondary-dark">
                    데이터를 불러오는 중...
                  </div>
                </div>
              ) : (
                <Calendar
                  storyRecords={storyRecords}
                  currentDate={currentMonth}
                  onMonthChange={setCurrentMonth}
                />
              )}

              <RecentActivity
                accessToken={accessToken}
                isLoading={isRecentTasksLoading}
                recentTasks={recentTasks}
              />

              <WeeklyStats
                accessToken={accessToken}
                isLoading={isWeeklyStatsLoading}
                weeklyStats={weeklyStats}
              />
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
