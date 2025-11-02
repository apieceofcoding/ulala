import { useDroppable } from "@dnd-kit/core";
import type { TaskResponse } from "@/types/task";
import { TaskStatus } from "@/types/task";
import { DraggableTaskCard } from "@/components/stories/DraggableTaskCard";

interface DroppableSectionProps {
  id: TaskStatus;
  title: string;
  tasks: TaskResponse[];
  emptyMessage: string;
  onToggle: (id: string) => void;
  onClick: (task: TaskResponse) => void;
  collapsed?: boolean;
  onToggleCollapse: () => void;
}

export function DroppableSection({
  id,
  title,
  tasks,
  emptyMessage,
  onToggle,
  onClick,
  collapsed = false,
  onToggleCollapse,
}: DroppableSectionProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <section className="space-y-3" aria-label={title}>
      <button
        onClick={onToggleCollapse}
        className="w-full flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <h2 className="heading-secondary flex items-center gap-2">
          {title} <span className="caption-text">({tasks.length})</span>
        </h2>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`text-text-secondary dark:text-text-secondary-dark transition-transform ${
            collapsed ? "-rotate-90" : ""
          }`}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {!collapsed && (
        <div
          ref={setNodeRef}
          className={`bg-bg-secondary dark:bg-bg-secondary-dark px-2 py-4 rounded-lg space-y-3 min-h-[100px] transition-colors ${
            isOver ? "bg-primary/10 border-2 border-dashed border-primary" : ""
          }`}
        >
          {tasks.length === 0 ? (
            <p className="body-text-small text-text-tertiary dark:text-text-tertiary-dark text-center py-4">
              {emptyMessage}
            </p>
          ) : (
            tasks.map((task) => (
              <DraggableTaskCard
                key={task.id}
                task={task}
                onToggle={onToggle}
                onClick={onClick}
              />
            ))
          )}
        </div>
      )}
    </section>
  );
}
