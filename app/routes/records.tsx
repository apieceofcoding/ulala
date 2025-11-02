import { useState, useEffect, useMemo } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/hooks/useTasks";
import { TaskStatus } from "@/types/task";

export function meta() {
  return [
    { title: "기록 - ulala" },
    { name: "description", content: "게임 기록과 통계를 확인하세요" },
  ];
}

// 날짜별 스토리 기록 타입 정의
type StoryRecord = {
  date: string; // YYYY-MM-DD 형식
  storyCount: number; // 해당 날짜가 modifiedAt인 스토리 수
};

// 현재 월에 대한 샘플 스토리 기록 데이터 생성 (로그인하지 않은 상태에서 보여주는 샘플)
function generateSampleRecords(): StoryRecord[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const records: StoryRecord[] = [];

  // 현재 월의 약 60-70% 날짜에 랜덤하게 스토리 기록 데이터 생성
  for (let day = 1; day <= daysInMonth; day++) {
    // 60-70% 확률로 해당 날짜에 데이터 생성
    if (Math.random() < 0.65) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      // 1~7개 사이의 랜덤한 스토리 수
      records.push({
        date: dateString,
        storyCount: Math.floor(Math.random() * 7) + 1,
      });
    }
  }

  return records;
}

// 달력 표시 범위의 시작일과 종료일을 계산하는 함수
function getCalendarDateRange(currentDate: Date) {
  // 현재 월의 첫째 날
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // 현재 월의 마지막 날
  const lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // 첫째 날이 포함된 주의 일요일
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay() + 1);

  // 마지막 날이 포함된 주의 토요일
  const endDate = new Date(lastDay);
  endDate.setDate(lastDay.getDate() + (7 - lastDay.getDay()));

  return {
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  };
}

interface CalendarProps {
  storyRecords: StoryRecord[];
  currentDate: Date;
  onMonthChange: (date: Date) => void;
}

function Calendar({ storyRecords, currentDate, onMonthChange }: CalendarProps) {
  // 이전/다음 달로 이동
  const goToPreviousMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    onMonthChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    onMonthChange(newDate);
  };

  // 현재 월의 첫째 날
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // 달력 시작 날짜 (일요일부터 시작)
  const startDate = new Date(firstDay);
  const dayOfWeek = firstDay.getDay();
  startDate.setDate(firstDay.getDate() - dayOfWeek);

  // 6주간의 날짜 생성
  const weeks = [];
  const currentWeekDate = new Date(startDate);

  for (let week = 0; week < 6; week++) {
    const days = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(currentWeekDate);
      const dateString = date.toISOString().split("T")[0];
      const isCurrentMonth = date.getMonth() === currentDate.getMonth();
      const recordData = storyRecords.find((item) => item.date === dateString);
      const storyCount = recordData?.storyCount || 0;

      days.push({
        date: date.getDate(),
        fullDate: dateString,
        isCurrentMonth,
        storyCount,
        isToday: dateString === new Date().toISOString().split("T")[0],
      });

      currentWeekDate.setDate(currentWeekDate.getDate() + 1);
    }
    weeks.push(days);
  }

  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  const getStoryCountColor = (storyCount: number) => {
    if (storyCount === 0) return "bg-bg-tertiary dark:bg-bg-tertiary-dark";
    if (storyCount <= 2) return "bg-success/30";
    if (storyCount <= 4) return "bg-success/60";
    return "bg-success";
  };

  return (
    <div className="card-default">
      <div className="flex items-center justify-between mb-4">
        <h3 className="heading-secondary">스토리 기록</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={goToPreviousMonth}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-bg-tertiary dark:hover:bg-bg-tertiary-dark transition-colors duration-150"
            aria-label="이전 달"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-text-secondary dark:text-text-secondary-dark"
            >
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className="body-text-small font-semibold min-w-[80px] text-center">
            {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
          </span>
          <button
            onClick={goToNextMonth}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-bg-tertiary dark:hover:bg-bg-tertiary-dark transition-colors duration-150"
            aria-label="다음 달"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-text-secondary dark:text-text-secondary-dark"
            >
              <path
                d="M6 4L10 8L6 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div
            key={day}
            className="text-center caption-text font-semibold py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 캘린더 그리드 */}
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`
                  aspect-square flex flex-col items-center justify-center text-xs rounded transition-colors duration-150
                  ${day.isCurrentMonth ? "text-text-primary dark:text-text-primary-dark" : "text-text-tertiary dark:text-text-tertiary-dark"}
                  ${day.isToday ? "ring-2 ring-primary" : ""}
                  ${getStoryCountColor(day.storyCount)}
                  ${day.storyCount > 0 ? "hover:scale-105 cursor-pointer" : ""}
                `}
                title={
                  day.storyCount > 0 ? `${day.storyCount}개 스토리 완료` : ""
                }
              >
                <span className="font-medium">{day.date}</span>
                {day.storyCount > 0 && (
                  <span className="text-[10px] font-bold text-white">
                    {day.storyCount}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 범례 */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border-light dark:border-border-dark">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-bg-tertiary dark:bg-bg-tertiary-dark"></div>
          <span className="caption-text">없음</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-success/30"></div>
          <span className="caption-text">1-2개</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-success/60"></div>
          <span className="caption-text">3-4개</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-success"></div>
          <span className="caption-text">5개+</span>
        </div>
      </div>
    </div>
  );
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

  // storyRecords 생성: 로그인 여부에 따라 샘플 또는 실제 데이터 사용
  const storyRecords: StoryRecord[] = accessToken
    ? dailyStats.map((item) => ({
        date: item.date,
        storyCount: item.count,
      }))
    : sampleRecords;

  // 오늘의 스토리 수 저장 (오늘 데이터가 포함된 경우에만 업데이트)
  useEffect(() => {
    const todayDateString = new Date().toISOString().split("T")[0];
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
              <div className="card-default">
                <h3 className="heading-secondary mb-2">오늘의 진행</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {todayStoryCount}
                    </div>
                    <div className="caption-text">오늘의 스토리</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">2</div>
                    <div className="caption-text">획득한 보상</div>
                  </div>
                </div>
              </div>

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

              <div className="card-default">
                <h3 className="heading-secondary mb-2">최근 활동</h3>
                {accessToken && isRecentTasksLoading ? (
                  <div className="text-center py-4 text-text-secondary dark:text-text-secondary-dark">
                    데이터를 불러오는 중...
                  </div>
                ) : !accessToken || recentTasks.length === 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="body-text-small">30분 산책하기</span>
                      <span className="caption-text text-success">완료</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="body-text-small">물 8잔 마시기</span>
                      <span className="caption-text text-success">완료</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="body-text-small">책 30페이지 읽기</span>
                      <span className="caption-text text-warning">진행중</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentTasks.map((task) => {
                      const getStatusText = (status: TaskStatus) => {
                        if (status === TaskStatus.DONE) return "완료";
                        if (status === TaskStatus.IN_PROGRESS) return "진행중";
                        return "대기중";
                      };
                      const getStatusColor = (status: TaskStatus) => {
                        if (status === TaskStatus.DONE) return "text-success";
                        if (status === TaskStatus.IN_PROGRESS) return "text-warning";
                        return "text-text-secondary dark:text-text-secondary-dark";
                      };

                      return (
                        <div key={task.id} className="flex items-center justify-between">
                          <span className="body-text-small">{task.title}</span>
                          <span className={`caption-text ${getStatusColor(task.status)}`}>
                            {getStatusText(task.status)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="card-default">
                <h3 className="heading-secondary mb-2">주간 통계</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-secondary">
                      24
                    </div>
                    <div className="caption-text">총 할 일</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-success">18</div>
                    <div className="caption-text">완료</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">
                      75%
                    </div>
                    <div className="caption-text">달성률</div>
                  </div>
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
