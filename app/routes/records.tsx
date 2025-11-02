import { useState, useEffect, useMemo } from "react";
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

export function meta() {
  return [
    { title: "기록 - ulala" },
    { name: "description", content: "게임 기록과 통계를 확인하세요" },
  ];
}

export default function Records() {
  const { accessToken } = useAuth();
  const {
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
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [todayStoryCount, setTodayStoryCount] = useState(0);

  // 샘플 데이터는 한번만 생성 (비로그인 상태용)
  const sampleRecords = useMemo(() => generateSampleRecords(), []);

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

  // 오늘의 스토리 수 저장 (오늘 데이터가 포함된 경우에만 업데이트)
  useEffect(() => {
    const todayDateString = formatLocalDate(new Date());
    const todayRecord = storyRecords.find(
      (record) => record.date === todayDateString
    );

    // 오늘 데이터가 있으면 저장 (로그인/비로그인 모두)
    if (todayRecord) {
      setTodayStoryCount(todayRecord.storyCount);
    }
    // 비로그인 상태에서 오늘 데이터가 없으면 0으로 설정
    else if (!accessToken) {
      setTodayStoryCount(0);
    }
    // 로그인 상태에서 오늘 데이터가 없으면 기존 값 유지 (업데이트 안함)
  }, [storyRecords, accessToken]);

  return (
    <>
      <TopBar level={1} />
      <main className="min-h-screen bg-bg-secondary dark:bg-bg-secondary-dark p-1 pt-14 pb-16 md:pb-1 md:pl-64">
        <div className="container max-w-lg mx-auto space-y-6">
          <div className="card-default text-center space-y-4">
            <div className="space-y-4">
              <TodayProgress todayStoryCount={todayStoryCount} />

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
