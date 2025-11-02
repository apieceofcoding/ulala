interface EmptyTaskStateProps {
  onShowRecommendations: () => void;
  onShowCreateForm: () => void;
}

export function EmptyTaskState({
  onShowRecommendations,
  onShowCreateForm,
}: EmptyTaskStateProps) {
  return (
    <div className="card-default text-center space-y-4">
      <p className="body-text">오늘 달성하고 싶은 목표를 설정해보세요.</p>
      <div className="space-y-3">
        <button onClick={onShowRecommendations} className="btn-primary w-full">
          할 일을 만들어볼까요?
        </button>
        <button onClick={onShowCreateForm} className="btn-secondary w-full">
          직접 만들래요
        </button>
      </div>
    </div>
  );
}
