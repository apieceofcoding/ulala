interface TodayProgressProps {
  todayStoryCount: number;
}

export function TodayProgress({ todayStoryCount }: TodayProgressProps) {
  return (
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
  );
}
