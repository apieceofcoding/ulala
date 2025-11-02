import { useDraggable } from "@dnd-kit/core";
import type { TaskResponse } from "@/types/task";
import { TaskStatus } from "@/types/task";

interface DraggableTaskCardProps {
  task: TaskResponse;
  onToggle: (id: string) => void;
  onClick: (task: TaskResponse) => void;
}

export function DraggableTaskCard({ task, onToggle, onClick }: DraggableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  const getCardClass = () => {
    const baseClass = "card-default p-4 transition-all";
    if (task.status === TaskStatus.IN_PROGRESS) {
      return `${baseClass} border-l-4 border-primary`;
    }
    if (task.status === TaskStatus.DONE) {
      return `${baseClass} opacity-60`;
    }
    return baseClass;
  };

  const getCheckboxClass = () => {
    if (task.status === TaskStatus.DONE) {
      return "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 bg-primary border-primary";
    }
    if (task.status === TaskStatus.IN_PROGRESS) {
      return "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 border-primary bg-primary/10";
    }
    return "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 border-border-light dark:border-border-dark hover:border-primary";
  };

  return (
    <div ref={setNodeRef} style={style} className={getCardClass()}>
      <div className="flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(task.id);
          }}
          className={getCheckboxClass()}
        >
          {task.status === TaskStatus.DONE && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6L5 9L10 3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {task.status === TaskStatus.IN_PROGRESS && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-primary">
              <circle cx="6" cy="6" r="3" fill="currentColor" />
            </svg>
          )}
        </button>
        <div
          className="flex-1 cursor-pointer"
          onClick={() => onClick(task)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onClick(task);
            }
          }}
          role="button"
          tabIndex={0}
        >
          <h3
            className={`font-medium ${task.status === TaskStatus.DONE ? "line-through text-text-tertiary dark:text-text-tertiary-dark" : "text-text-primary dark:text-text-primary-dark"}`}
          >
            {task.title}
          </h3>
          {task.description && <p className="caption-text">{task.description}</p>}
        </div>

        {/* 드래그 핸들 - 오른쪽에 배치 */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none text-text-tertiary dark:text-text-tertiary-dark hover:text-text-secondary dark:hover:text-text-secondary-dark"
          aria-label="드래그하여 이동"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="flex-shrink-0"
          >
            <circle cx="7" cy="5" r="1.5" fill="currentColor" />
            <circle cx="13" cy="5" r="1.5" fill="currentColor" />
            <circle cx="7" cy="10" r="1.5" fill="currentColor" />
            <circle cx="13" cy="10" r="1.5" fill="currentColor" />
            <circle cx="7" cy="15" r="1.5" fill="currentColor" />
            <circle cx="13" cy="15" r="1.5" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
}
