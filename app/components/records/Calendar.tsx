import { formatLocalDate } from "@/utils/dateUtils";

// 날짜별 스토리 기록 타입 정의
export type StoryRecord = {
  date: string; // YYYY-MM-DD 형식
  storyCount: number; // 해당 날짜가 modifiedAt인 스토리 수
};

/**
 * 현재 월에 대한 샘플 스토리 기록 데이터 생성 (로그인하지 않은 상태에서 보여주는 샘플)
 * @returns 샘플 스토리 기록 배열
 */
export function generateSampleRecords(): StoryRecord[] {
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

interface CalendarProps {
  storyRecords: StoryRecord[];
  currentDate: Date;
  onMonthChange: (date: Date) => void;
}

export function Calendar({
  storyRecords,
  currentDate,
  onMonthChange,
}: CalendarProps) {
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
      const dateString = formatLocalDate(date);
      const isCurrentMonth = date.getMonth() === currentDate.getMonth();
      const recordData = storyRecords.find((item) => item.date === dateString);
      const storyCount = recordData?.storyCount || 0;

      days.push({
        date: date.getDate(),
        fullDate: dateString,
        isCurrentMonth,
        storyCount,
        isToday: dateString === formatLocalDate(new Date()),
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
    <div className="card-default max-w-md mx-auto">
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

/**
 * 캘린더 스켈레톤 로딩 UI
 */
export function CalendarSkeleton() {
  return (
    <div className="card-default max-w-md mx-auto">
      {/* 헤더 스켈레톤 */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-24 bg-bg-tertiary dark:bg-bg-tertiary-dark rounded animate-pulse"></div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-bg-tertiary dark:bg-bg-tertiary-dark rounded animate-pulse"></div>
          <div className="h-5 w-20 bg-bg-tertiary dark:bg-bg-tertiary-dark rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-bg-tertiary dark:bg-bg-tertiary-dark rounded animate-pulse"></div>
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

      {/* 캘린더 그리드 스켈레톤 */}
      <div className="space-y-1">
        {Array.from({ length: 6 }).map((_, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, dayIndex) => (
              <div
                key={dayIndex}
                className="aspect-square bg-bg-tertiary dark:bg-bg-tertiary-dark rounded animate-pulse"
              ></div>
            ))}
          </div>
        ))}
      </div>

      {/* 범례 스켈레톤 */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border-light dark:border-border-dark">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-bg-tertiary dark:bg-bg-tertiary-dark animate-pulse"></div>
            <div className="h-3 w-12 bg-bg-tertiary dark:bg-bg-tertiary-dark rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
