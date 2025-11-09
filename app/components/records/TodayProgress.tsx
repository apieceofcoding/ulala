interface TodayProgressProps {
  completedTasks: number;
  totalExp: number;
  totalPoints: number;
}

export function TodayProgress({
  completedTasks,
  totalExp,
  totalPoints,
}: TodayProgressProps) {
  return (
    <div className="card-default">
      <h3 className="heading-secondary mb-2">오늘의 진행</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{completedTasks}</div>
          <div className="caption-text">완료한 태스크</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">{totalExp}</div>
          <div className="caption-text">획득한 경험치</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary">{totalPoints}</div>
          <div className="caption-text">획득한 포인트</div>
        </div>
      </div>
    </div>
  );
}
