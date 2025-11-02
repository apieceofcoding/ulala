import type { TaskResponse } from "@/types/task";
import { TaskStatus } from "@/types/task";

interface RecentActivityProps {
  accessToken: string | null;
  isLoading: boolean;
  recentTasks: TaskResponse[];
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
    if (status === TaskStatus.DONE) return "text-success";
    if (status === TaskStatus.IN_PROGRESS) return "text-warning";
    return "text-text-secondary dark:text-text-secondary-dark";
  };

  return (
    <div className="card-default">
      <h3 className="heading-secondary mb-2">최근 활동</h3>
      {accessToken && isLoading ? (
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
          {recentTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between">
              <span className="body-text-small">{task.title}</span>
              <span className={`caption-text ${getStatusColor(task.status)}`}>
                {getStatusText(task.status)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
