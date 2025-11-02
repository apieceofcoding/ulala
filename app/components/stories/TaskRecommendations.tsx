export interface SampleTask {
  title: string;
  description?: string;
}

interface TaskRecommendationsProps {
  sampleTasks: SampleTask[];
  onSelectRecommendation: (sample: SampleTask) => void;
  onCancel: () => void;
}

export function TaskRecommendations({
  sampleTasks,
  onSelectRecommendation,
  onCancel,
}: TaskRecommendationsProps) {
  return (
    <div className="card-default space-y-4">
      <div className="text-center">
        <h2 className="heading-secondary mb-2">추천 할 일</h2>
        <p className="body-text-small">마음에 드는 할 일을 선택해보세요!</p>
      </div>
      <div className="space-y-3">
        {sampleTasks.map((sample, index) => (
          <button
            key={index}
            onClick={() => onSelectRecommendation(sample)}
            className="card-clickable p-3 cursor-pointer w-full text-left"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-text-primary dark:text-text-primary-dark truncate">
                  {sample.title}
                </h3>
                {sample.description && (
                  <p className="caption-text truncate">{sample.description}</p>
                )}
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-text-tertiary dark:text-text-tertiary-dark flex-shrink-0"
              >
                <path
                  d="M8 3V13M3 8H13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>
      <button onClick={onCancel} className="btn-secondary w-full">
        취소
      </button>
    </div>
  );
}
