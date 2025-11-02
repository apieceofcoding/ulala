interface ErrorAlertProps {
  message: string;
  onClose: () => void;
}

export function ErrorAlert({ message, onClose }: ErrorAlertProps) {
  return (
    <div className="card-default border-2 border-error bg-error-bg p-4">
      <div className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-error flex-shrink-0"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zM8 4a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0v-3.5A.75.75 0 0 0 8 4zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-medium text-error">{message}</p>
        </div>
        <button onClick={onClose} className="text-error hover:text-error-pressed">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
