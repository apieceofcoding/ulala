import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  pointerWithin,
  rectIntersection,
} from "@dnd-kit/core";
import type { CollisionDetection } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import type { TaskResponse } from "@/types/task";
import { TaskStatus } from "@/types/task";
import { DroppableSection } from "@/components/stories/DroppableSection";
import { TaskRecommendations, type SampleTask } from "@/components/stories/TaskRecommendations";
import { TaskCreateForm } from "@/components/stories/TaskCreateForm";
import { RecommendationsLoadingState } from "@/components/stories/LoadingStates";

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
  isLoadingRecommendations: boolean;
  showRecommendations: boolean;
  showCreateForm: boolean;
  sampleTasks: SampleTask[];
  onSelectRecommendation: (sample: SampleTask) => void;
  onCancelRecommendations: () => void;
  newTaskTitle: string;
  newTaskDescription: string;
  isCreatingTask: boolean;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onCreate: () => void;
  onCancelCreate: () => void;
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
  isLoadingRecommendations,
  showRecommendations,
  showCreateForm,
  sampleTasks,
  onSelectRecommendation,
  onCancelRecommendations,
  newTaskTitle,
  newTaskDescription,
  isCreatingTask,
  onTitleChange,
  onDescriptionChange,
  onCreate,
  onCancelCreate,
}: TaskKanbanBoardProps) {
  // 드래그 센서 설정 (터치 및 마우스 지원)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이동 후 드래그 시작 (실수 방지)
      },
    })
  );

  // 커스텀 collision detection - 다중 컨테이너 간 드래그를 위한 알고리즘
  const collisionDetectionStrategy: CollisionDetection = (args) => {
    // active(드래그 중인) task 정보 가져오기
    const activeData = args.active.data.current;
    const activeTaskStatus = activeData?.task?.status;

    // 먼저 pointerWithin으로 포인터가 있는 droppable 영역 찾기
    const pointerCollisions = pointerWithin(args);

    if (pointerCollisions.length > 0) {
      // 포인터가 있는 영역 중 같은 섹션의 task만 선택
      const sameStatusTaskCollision = pointerCollisions.find((collision) => {
        const container = args.droppableContainers.find(
          (container) => container.id === collision.id
        );
        const containerType = container?.data.current?.type;
        const containerTask = container?.data.current?.task;

        // task이고 같은 섹션일 때만 반환
        return containerType === "task" && containerTask?.status === activeTaskStatus;
      });

      if (sameStatusTaskCollision) {
        return [sameStatusTaskCollision];
      }

      // 같은 섹션 task가 없으면 section 반환
      const sectionCollision = pointerCollisions.find(
        (collision) => args.droppableContainers.find(
          (container) => container.id === collision.id
        )?.data.current?.type === "section"
      );

      if (sectionCollision) {
        return [sectionCollision];
      }

      // 둘 다 없으면 첫 번째 collision 반환
      return [pointerCollisions[0]];
    }

    // pointerWithin으로 못 찾으면 closestCenter 사용
    const closestCenterCollisions = closestCenter(args);

    if (closestCenterCollisions.length > 0) {
      return closestCenterCollisions;
    }

    // 그래도 못 찾으면 rectIntersection 사용
    return rectIntersection(args);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
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

        {/* AI 추천 로딩 화면 */}
        {isLoadingRecommendations && <RecommendationsLoadingState />}

        {/* 추천 할 일 목록 */}
        {showRecommendations && (
          <TaskRecommendations
            sampleTasks={sampleTasks}
            onSelectRecommendation={onSelectRecommendation}
            onCancel={onCancelRecommendations}
          />
        )}

        {/* 직접 만들기 폼 */}
        {showCreateForm && (
          <TaskCreateForm
            title={newTaskTitle}
            description={newTaskDescription}
            isCreating={isCreatingTask}
            onTitleChange={onTitleChange}
            onDescriptionChange={onDescriptionChange}
            onCreate={onCreate}
            onCancel={onCancelCreate}
          />
        )}

        {/* 할일 섹션 */}
        <DroppableSection
          id={TaskStatus.TODO}
          title="할일"
          tasks={tasks
            .filter((t) => t.status === TaskStatus.TODO)
            .sort((a, b) => a.displayOrder - b.displayOrder)}
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
          tasks={tasks
            .filter((t) => t.status === TaskStatus.IN_PROGRESS)
            .sort((a, b) => a.displayOrder - b.displayOrder)}
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
          tasks={tasks
            .filter((t) => t.status === TaskStatus.DONE)
            .sort((a, b) => a.displayOrder - b.displayOrder)}
          emptyMessage="완료된 태스크가 없습니다"
          onToggle={onToggleTask}
          onClick={onTaskClick}
          collapsed={collapsedSections[TaskStatus.DONE]}
          onToggleCollapse={() => onToggleSection(TaskStatus.DONE)}
        />

        {/* 보류 섹션 */}
        <DroppableSection
          id={TaskStatus.ON_HOLD}
          title="보류"
          tasks={tasks
            .filter((t) => t.status === TaskStatus.ON_HOLD)
            .sort((a, b) => a.displayOrder - b.displayOrder)}
          emptyMessage="보류된 태스크가 없습니다"
          onToggle={onToggleTask}
          onClick={onTaskClick}
          collapsed={collapsedSections[TaskStatus.ON_HOLD]}
          onToggleCollapse={() => onToggleSection(TaskStatus.ON_HOLD)}
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
          <div className="card-default px-3 py-3 shadow-high rotate-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded border-2 border-border-light dark:border-border-dark" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-text-primary dark:text-text-primary-dark truncate">
                  {activeTask.title}
                </h3>
                {activeTask.description && (
                  <p className="caption-text truncate">{activeTask.description}</p>
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
