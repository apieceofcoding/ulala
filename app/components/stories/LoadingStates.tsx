// 태스크 초기 로딩 상태
export function TaskLoadingState() {
  return (
    <div className="card-default space-y-4">
      <div className="text-center">
        <h2 className="heading-secondary mb-2">태스크를 불러오는 중...</h2>
        <p className="body-text-small">잠시만 기다려주세요!</p>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-default p-3 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-bg-tertiary dark:bg-bg-tertiary-dark rounded mb-2"></div>
                <div className="h-3 bg-bg-tertiary dark:bg-bg-tertiary-dark rounded w-16"></div>
              </div>
              <div className="w-4 h-4 bg-bg-tertiary dark:bg-bg-tertiary-dark rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// AI 추천 로딩 상태
export function RecommendationsLoadingState() {
  return (
    <div className="card-default space-y-4">
      <div className="text-center">
        <h2 className="heading-secondary mb-2">AI가 추천을 만들고 있어요</h2>
        <p className="body-text-small">잠시만 기다려주세요!</p>
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="card-default p-3 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-bg-tertiary dark:bg-bg-tertiary-dark rounded mb-2"></div>
                <div className="h-3 bg-bg-tertiary dark:bg-bg-tertiary-dark rounded w-16"></div>
              </div>
              <div className="w-4 h-4 bg-bg-tertiary dark:bg-bg-tertiary-dark rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
