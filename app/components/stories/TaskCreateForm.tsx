interface TaskCreateFormProps {
  title: string;
  description: string;
  isCreating: boolean;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onCreate: () => void;
  onCancel: () => void;
}

export function TaskCreateForm({
  title,
  description,
  isCreating,
  onTitleChange,
  onDescriptionChange,
  onCreate,
  onCancel,
}: TaskCreateFormProps) {
  return (
    <div className="card-default space-y-4">
      <div className="text-center">
        <h2 className="heading-secondary mb-2">새 할 일 만들기</h2>
        <p className="body-text-small">나만의 할 일을 만들어보세요!</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block caption-text mb-2">할 일</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="예: 책 읽기, 운동하기"
            className="w-full px-4 py-2 rounded bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark"
          />
        </div>
        <div>
          <label className="block caption-text mb-2">메모 (선택)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="예: 30페이지 목표, 공원에서 가볍게 등"
            className="w-full px-4 py-2 rounded bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCreate}
            disabled={!title.trim() || isCreating}
            className="btn-primary flex-1 disabled:bg-primary-disabled disabled:cursor-not-allowed"
          >
            {isCreating ? "만드는 중..." : "만들기"}
          </button>
          <button
            onClick={onCancel}
            disabled={isCreating}
            className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
