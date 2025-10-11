import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { logger } from "@/utils/logger";

export function meta() {
  return [
    { title: "기록 - ulala" },
    { name: "description", content: "게임 기록과 통계를 확인하세요" },
  ];
}

// 날짜별 스토리 완료 데이터 (샘플 - 2024년 9월)
const storyCompletions: Record<string, number> = {
  "2025-09-01": 2,
  "2025-09-02": 4,
  "2025-09-03": 3,
  "2025-09-05": 5,
  "2025-09-06": 1,
  "2025-09-07": 3,
  "2025-09-08": 6,
  "2025-09-10": 2,
  "2025-09-11": 4,
  "2025-09-12": 3,
  "2025-09-14": 5,
  "2025-09-15": 7,
  "2025-09-16": 1,
  "2025-09-17": 4,
  "2025-09-19": 3,
  "2025-09-20": 2,
  "2025-09-21": 6,
  "2025-09-22": 4,
  "2025-09-23": 5,
  "2025-09-25": 3,
  "2025-09-26": 2,
  "2025-09-27": 4,
  "2025-09-28": 1,
  "2025-09-29": 5,
  "2025-09-30": 3,
};

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 이전/다음 달로 이동
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
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
      const completions = storyCompletions[dateString] || 0;

      days.push({
        date: date.getDate(),
        fullDate: dateString,
        isCurrentMonth,
        completions,
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

  const getCompletionColor = (completions: number) => {
    if (completions === 0) return "bg-bg-tertiary dark:bg-bg-tertiary-dark";
    if (completions <= 2) return "bg-success/30";
    if (completions <= 4) return "bg-success/60";
    return "bg-success";
  };

  return (
    <div className="card-default">
      <div className="flex items-center justify-between mb-4">
        <h3 className="heading-secondary">스토리 완료 캘린더</h3>
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
                  ${getCompletionColor(day.completions)}
                  ${day.completions > 0 ? "hover:scale-105 cursor-pointer" : ""}
                `}
                title={
                  day.completions > 0 ? `${day.completions}개 스토리 완료` : ""
                }
              >
                <span className="font-medium">{day.date}</span>
                {day.completions > 0 && (
                  <span className="text-[10px] font-bold text-white">
                    {day.completions}
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
  return (
    <>
      <TopBar level={1} onSettingsClick={() => logger.log("메뉴 버튼 클릭")} />
      <main className="min-h-screen bg-bg-secondary dark:bg-bg-secondary-dark p-1 pb-16">
        <div className="container max-w-lg mx-auto space-y-6">
          <div className="card-default text-center space-y-4">
            <div className="space-y-4">
              <div className="card-default">
                <h3 className="heading-secondary mb-2">오늘의 진행</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">5</div>
                    <div className="caption-text">완료한 할 일</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">2</div>
                    <div className="caption-text">획득한 보상</div>
                  </div>
                </div>
              </div>

              <Calendar />
              
              <div className="card-default">
                <h3 className="heading-secondary mb-2">최근 활동</h3>
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
