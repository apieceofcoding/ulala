import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import type { TaskResponse } from "@/types/task";
import { TaskStatus } from "@/types/task";
import { DroppableSection } from "@/components/stories/DroppableSection";

interface TaskKanbanBoardProps {
  tasks: TaskResponse[];
  collapsedSections: { [key in TaskStatus]?: boolean };
  activeTask: TaskResponse | null;
  onToggleTask: (id: string) => void;
  onTaskClick: (task: TaskResponse) => void;
  onToggleSection: (sectionId: TaskStatus) => void;
  onShowRecommendations: () => void;
  onShowCreateForm: () => void;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

export function TaskKanbanBoard({
  tasks,
  collapsedSections,
  activeTask,
  onToggleTask,
  onTaskClick,
  onToggleSection,
  onShowRecommendations,
  onShowCreateForm,
  onDragStart,
  onDragEnd,
}: TaskKanbanBoardProps) {
  // 드래그 센서 설정 (터치 및 마우스 지원)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이동 후 드래그 시작 (실수 방지)
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="space-y-6">
        {/* 상단 액션 버튼 */}
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={onShowRecommendations}
            className="text-sm text-primary hover:text-primary-hover"
          >
            AI 추천
          </button>
          <button
            onClick={onShowCreateForm}
            className="text-sm text-primary hover:text-primary-hover"
          >
            직접 추가
          </button>
        </div>

        {/* 할일 섹션 */}
        <DroppableSection
          id={TaskStatus.TODO}
          title="할일"
          tasks={tasks.filter((t) => t.status === TaskStatus.TODO)}
          emptyMessage="할 일이 없습니다"
          onToggle={onToggleTask}
          onClick={onTaskClick}
          collapsed={collapsedSections[TaskStatus.TODO]}
          onToggleCollapse={() => onToggleSection(TaskStatus.TODO)}
        />

        {/* 진행중 섹션 */}
        <DroppableSection
          id={TaskStatus.IN_PROGRESS}
          title="진행중"
          tasks={tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS)}
          emptyMessage="진행 중인 태스크가 없습니다"
          onToggle={onToggleTask}
          onClick={onTaskClick}
          collapsed={collapsedSections[TaskStatus.IN_PROGRESS]}
          onToggleCollapse={() => onToggleSection(TaskStatus.IN_PROGRESS)}
        />

        {/* 완료 섹션 */}
        <DroppableSection
          id={TaskStatus.DONE}
          title="완료"
          tasks={tasks.filter((t) => t.status === TaskStatus.DONE)}
          emptyMessage="완료된 태스크가 없습니다"
          onToggle={onToggleTask}
          onClick={onTaskClick}
          collapsed={collapsedSections[TaskStatus.DONE]}
          onToggleCollapse={() => onToggleSection(TaskStatus.DONE)}
        />

        {/* 전체 통계 */}
        <div className="text-center">
          <p className="caption-text">
            전체: {tasks.length} | 완료:{" "}
            {tasks.filter((t) => t.status === TaskStatus.DONE).length}
          </p>
        </div>
      </div>

      {/* 드래그 오버레이 */}
      <DragOverlay>
        {activeTask ? (
          <div className="card-default p-4 shadow-high rotate-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded border-2 border-border-light dark:border-border-dark" />
              <div className="flex-1">
                <h3 className="font-medium text-text-primary dark:text-text-primary-dark">
                  {activeTask.title}
                </h3>
                {activeTask.description && (
                  <p className="caption-text">{activeTask.description}</p>
                )}
              </div>
              {/* 드래그 핸들 - 오른쪽에 배치 */}
              <div className="text-text-tertiary dark:text-text-tertiary-dark">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="7" cy="5" r="1.5" fill="currentColor" />
                  <circle cx="13" cy="5" r="1.5" fill="currentColor" />
                  <circle cx="7" cy="10" r="1.5" fill="currentColor" />
                  <circle cx="13" cy="10" r="1.5" fill="currentColor" />
                  <circle cx="7" cy="15" r="1.5" fill="currentColor" />
                  <circle cx="13" cy="15" r="1.5" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
