import type { TaskResponse } from "@/types/task";
import { TaskStatus } from "@/types/task";

interface RecentActivityProps {
  accessToken: string | null;
  isLoading: boolean;
  recentTasks: TaskResponse[];
}

// 날짜를 포맷팅하는 함수 (YYYY-MM-DD 형식)
function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 날짜를 표시용으로 포맷팅하는 함수 (MM월 DD일)
function formatDateDisplay(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isToday) return "오늘";
  if (isYesterday) return "어제";

  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

// 시간을 포맷팅하는 함수 (HH:MM)
function formatTime(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

// 일별로 그룹화하는 함수
function groupTasksByDate(tasks: TaskResponse[]): Map<string, TaskResponse[]> {
  const grouped = new Map<string, TaskResponse[]>();

  tasks.forEach((task) => {
    const dateKey = formatDate(task.modifiedAt);
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(task);
  });

  return grouped;
}

export function RecentActivity({
  accessToken,
  isLoading,
  recentTasks,
}: RecentActivityProps) {
  const getStatusText = (status: TaskStatus) => {
    if (status === TaskStatus.DONE) return "완료";
    if (status === TaskStatus.IN_PROGRESS) return "진행중";
    return "대기중";
  };

  const getStatusColor = (status: TaskStatus) => {
    if (status === TaskStatus.DONE) return "text-success font-semibold";
    if (status === TaskStatus.IN_PROGRESS) return "text-info font-semibold";
    return "text-text-secondary dark:text-text-secondary-dark";
  };

  // 최대 10개로 제한
  const limitedTasks = recentTasks.slice(0, 10);

  // 일별로 그룹화
  const groupedTasks = groupTasksByDate(limitedTasks);

  // 날짜별로 정렬 (최신 날짜가 먼저)
  const sortedDates = Array.from(groupedTasks.keys()).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="card-default">
      <h3 className="heading-secondary mb-2">최근 활동</h3>
      {accessToken && isLoading ? (
        <div className="text-center py-4 text-text-secondary dark:text-text-secondary-dark">
          데이터를 불러오는 중...
        </div>
      ) : !accessToken || recentTasks.length === 0 ? (
        <div className="space-y-4">
          <div>
            <div className="caption-text font-semibold text-text-secondary dark:text-text-secondary-dark mb-2">
              오늘
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-bg-tertiary/50 dark:bg-bg-tertiary-dark/50 hover:bg-bg-tertiary dark:hover:bg-bg-tertiary-dark transition-colors duration-150">
                <span className="body-text-small flex-1 text-left truncate mr-2">
                  30분 산책하기
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="caption-text text-success font-semibold">
                    완료
                  </span>
                  <span className="caption-text text-text-tertiary dark:text-text-tertiary-dark">
                    14:30
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-bg-tertiary/50 dark:bg-bg-tertiary-dark/50 hover:bg-bg-tertiary dark:hover:bg-bg-tertiary-dark transition-colors duration-150">
                <span className="body-text-small flex-1 text-left truncate mr-2">
                  물 8잔 마시기
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="caption-text text-success font-semibold">
                    완료
                  </span>
                  <span className="caption-text text-text-tertiary dark:text-text-tertiary-dark">
                    12:15
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-bg-tertiary/50 dark:bg-bg-tertiary-dark/50 hover:bg-bg-tertiary dark:hover:bg-bg-tertiary-dark transition-colors duration-150">
                <span className="body-text-small flex-1 text-left truncate mr-2">
                  책 30페이지 읽기
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="caption-text text-info font-semibold">
                    진행중
                  </span>
                  <span className="caption-text text-text-tertiary dark:text-text-tertiary-dark">
                    09:00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDates.map((dateKey) => {
            const tasksForDate = groupedTasks.get(dateKey) || [];
            // 첫 번째 task의 modifiedAt을 사용하여 날짜 표시
            const displayDate = formatDateDisplay(tasksForDate[0]?.modifiedAt);

            return (
              <div key={dateKey}>
                <div className="caption-text font-semibold text-text-secondary dark:text-text-secondary-dark mb-2">
                  {displayDate}
                </div>
                <div className="space-y-2">
                  {tasksForDate.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-bg-tertiary/50 dark:bg-bg-tertiary-dark/50 hover:bg-bg-tertiary dark:hover:bg-bg-tertiary-dark transition-colors duration-150"
                    >
                      <span className="body-text-small flex-1 text-left truncate mr-2">
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`caption-text ${getStatusColor(task.status)}`}
                        >
                          {getStatusText(task.status)}
                        </span>
                        <span className="caption-text text-text-tertiary dark:text-text-tertiary-dark">
                          {formatTime(task.modifiedAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
