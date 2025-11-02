import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { logger } from "@/utils/logger";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/hooks/useTasks";
import type { TaskResponse } from "@/types/task";
import { TaskStatus } from "@/types/task";

export function meta() {
  return [
    { title: "스토리 - ulala" },
    { name: "description", content: "게임 스토리와 통계를 확인하세요" },
  ];
}

// 샘플 할 일 데이터 (AI 추천용)
interface SampleTask {
  title: string;
  description?: string;
}

const sampleTasks: SampleTask[] = [
  { title: "물 8잔 마시기", description: "하루 2L 목표" },
  { title: "30분 산책하기", description: "공원에서 가볍게" },
  { title: "책 30페이지 읽기", description: "자기계발서" },
  { title: "일기 쓰기", description: "오늘 있었던 일 정리" },
  { title: "스마트폰 사용시간 줄이기", description: "SNS 사용 1시간 이내로" },
];

// 드래그 가능한 태스크 카드 컴포넌트
interface DraggableTaskCardProps {
  task: TaskResponse;
  onToggle: (id: string) => void;
  onClick: (task: TaskResponse) => void;
}

function DraggableTaskCard({ task, onToggle, onClick }: DraggableTaskCardProps) {
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

// 드롭 가능한 섹션 컴포넌트
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

function DroppableSection({
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
          className={`bg-bg-secondary dark:bg-bg-secondary-dark p-4 rounded-lg space-y-3 min-h-[100px] transition-colors ${
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

export default function Stories() {
  const { accessToken } = useAuth();
  const {
    tasks,
    isLoading: isLoadingTasks,
    isCreating: isCreatingTask,
    error,
    addTask,
    editTask,
    removeTask,
    clearError,
  } = useTasks({ accessToken });

  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [selectedTask, setSelectedTask] = useState<TaskResponse | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [activeTask, setActiveTask] = useState<TaskResponse | null>(null);

  // 섹션 접기/펼치기 상태 (localStorage에서 불러오기)
  const [collapsedSections, setCollapsedSections] = useState<{
    [key in TaskStatus]?: boolean;
  }>(() => {
    const saved = localStorage.getItem("ulala-collapsed-sections");
    return saved ? JSON.parse(saved) : {};
  });

  // 드래그 센서 설정 (터치 및 마우스 지원)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이동 후 드래그 시작 (실수 방지)
      },
    })
  );

  const handleShowRecommendations = () => {
    setIsLoadingRecommendations(true);
    setShowCreateForm(false);
    setShowRecommendations(false);

    // AI 추천 시뮬레이션 (0.3초 딜레이)
    setTimeout(() => {
      setIsLoadingRecommendations(false);
      setShowRecommendations(true);
    }, 1000);
  };

  const handleShowCreateForm = () => {
    setShowCreateForm(true);
    setShowRecommendations(false);
  };

  const handleSelectRecommendation = async (sample: SampleTask) => {
    try {
      await addTask({
        title: sample.title,
        description: sample.description,
      });
      setShowRecommendations(false);
    } catch {
      // 에러는 useTasks에서 처리
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) {
      return;
    }

    try {
      await addTask({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || undefined,
      });
      setNewTaskTitle("");
      setNewTaskDescription("");
      setShowCreateForm(false);
    } catch {
      // 에러는 useTasks에서 처리
    }
  };

  const generateReward = (task: TaskResponse) => {
    // 카테고리별 보상 설정
    const categoryRewards: Record<string, { icon: string; points: number }> = {
      건강: { icon: "💧", points: 10 },
      운동: { icon: "🚶‍♂️", points: 15 },
      학습: { icon: "📚", points: 20 },
      자기계발: { icon: "✨", points: 12 },
      "디지털 디톡스": { icon: "📱", points: 18 },
      기타: { icon: "🎯", points: 8 },
    };

    const category = task.description || "기타";
    const rewardInfo = categoryRewards[category] || categoryRewards["기타"];

    const newReward = {
      id: Date.now(),
      title: `${category} 달성`,
      description: `${task.title}을(를) 완료했습니다`,
      earnedAt: new Date().toISOString(),
      type: "points" as const,
      value: rewardInfo.points,
      icon: rewardInfo.icon,
      isNew: true,
    };

    // 로컬 스토리지에서 기존 보상 가져오기
    const savedRewards = localStorage.getItem("ulala-rewards");
    const rewards = savedRewards ? JSON.parse(savedRewards) : [];

    // 새 보상 추가
    const updatedRewards = [newReward, ...rewards];
    localStorage.setItem("ulala-rewards", JSON.stringify(updatedRewards));

    // 새 보상 알림 표시 (3초 후 자동 제거)
    setTimeout(() => {
      const currentRewards = JSON.parse(
        localStorage.getItem("ulala-rewards") || "[]"
      );
      const updatedRewards = currentRewards.map((reward: typeof newReward) =>
        reward.id === newReward.id ? { ...reward, isNew: false } : reward
      );
      localStorage.setItem("ulala-rewards", JSON.stringify(updatedRewards));
    }, 3000);
  };

  const handleToggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    // 순환 방식: TODO → IN_PROGRESS → DONE → TODO
    let newStatus: TaskStatus;
    if (task.status === TaskStatus.TODO) {
      newStatus = TaskStatus.IN_PROGRESS;
    } else if (task.status === TaskStatus.IN_PROGRESS) {
      newStatus = TaskStatus.DONE;
    } else {
      newStatus = TaskStatus.TODO;
    }

    // 완료 시 보상 생성
    if (newStatus === TaskStatus.DONE) {
      generateReward(task);
    }

    try {
      await editTask(id, { status: newStatus });

      // selectedTask가 현재 토글하는 task라면 업데이트
      if (selectedTask && selectedTask.id === id) {
        setSelectedTask({
          ...selectedTask,
          status: newStatus,
          endAt: newStatus === TaskStatus.DONE ? new Date().toISOString() : null,
        });
      }
    } catch {
      // 에러는 useTasks에서 처리
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await removeTask(id);
    } catch {
      // 에러는 useTasks에서 처리
    }
  };

  const handleEditTask = async () => {
    if (!selectedTask || !editTitle.trim()) {
      return;
    }

    try {
      await editTask(selectedTask.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });

      // selectedTask를 업데이트하여 모달에 변경된 내용 표시
      setSelectedTask({
        ...selectedTask,
        title: editTitle.trim(),
        description: editDescription.trim() || null,
      });

      setIsEditMode(false);
    } catch {
      // 에러는 useTasks에서 처리
    }
  };

  const handleStartEdit = () => {
    if (selectedTask) {
      setEditTitle(selectedTask.title);
      setEditDescription(selectedTask.description || "");
      setIsEditMode(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditTitle("");
    setEditDescription("");
  };

  // 섹션 접기/펼치기 토글
  const toggleSection = (sectionId: TaskStatus) => {
    setCollapsedSections((prev) => {
      const newState = {
        ...prev,
        [sectionId]: !prev[sectionId],
      };
      // localStorage에 저장
      localStorage.setItem("ulala-collapsed-sections", JSON.stringify(newState));
      return newState;
    });
  };

  // 드래그 시작
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  // 드래그 종료
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // 완료로 변경 시 보상 생성
    if (newStatus === TaskStatus.DONE) {
      generateReward(task);
    }

    try {
      await editTask(taskId, { status: newStatus });

      // selectedTask가 현재 변경하는 task라면 업데이트
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask({
          ...selectedTask,
          status: newStatus,
          endAt: newStatus === TaskStatus.DONE ? new Date().toISOString() : null,
        });
      }
    } catch {
      // 에러는 useTasks에서 처리
    }
  };

  return (
    <>
      <TopBar level={1} onSettingsClick={() => logger.log("메뉴 버튼 클릭")} />
      <main className="min-h-screen bg-bg-secondary dark:bg-bg-secondary-dark p-1 pb-16">
        <div className="container max-w-lg mx-auto space-y-6">
          {/* 에러 메시지 */}
          {error && (
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
                  <p className="text-sm font-medium text-error">{error}</p>
                </div>
                <button
                  onClick={clearError}
                  className="text-error hover:text-error-pressed"
                >
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
          )}

          {/* 초기 로딩 상태 */}
          {isLoadingTasks && (
            <div className="card-default space-y-4">
              <div className="text-center">
                <h2 className="heading-secondary mb-2">
                  태스크를 불러오는 중...
                </h2>
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
          )}

          {/* 할 일 목록이 없을 때 (로딩 완료 후) */}
          {!isLoadingTasks &&
            tasks.length === 0 &&
            !showRecommendations &&
            !showCreateForm &&
            !isLoadingRecommendations && (
              <div className="card-default text-center space-y-4">
                <p className="body-text">
                  오늘 달성하고 싶은 목표를 설정해보세요.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleShowRecommendations}
                    className="btn-primary w-full"
                  >
                    할 일을 만들어볼까요?
                  </button>
                  <button
                    onClick={handleShowCreateForm}
                    className="btn-secondary w-full"
                  >
                    직접 만들래요
                  </button>
                </div>
              </div>
            )}

          {/* AI 추천 로딩 화면 */}
          {isLoadingRecommendations && (
            <div className="card-default space-y-4">
              <div className="text-center">
                <h2 className="heading-secondary mb-2">
                  AI가 추천을 만들고 있어요
                </h2>
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
          )}

          {/* 추천 할 일 목록 */}
          {showRecommendations && (
            <div className="card-default space-y-4">
              <div className="text-center">
                <h2 className="heading-secondary mb-2">추천 할 일</h2>
                <p className="body-text-small">
                  마음에 드는 할 일을 선택해보세요!
                </p>
              </div>
              <div className="space-y-3">
                {sampleTasks.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectRecommendation(sample)}
                    className="card-clickable p-3 cursor-pointer w-full text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-text-primary dark:text-text-primary-dark">
                          {sample.title}
                        </h3>
                        {sample.description && (
                          <p className="caption-text">{sample.description}</p>
                        )}
                      </div>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="text-text-tertiary dark:text-text-tertiary-dark"
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
              <button
                onClick={() => setShowRecommendations(false)}
                className="btn-secondary w-full"
              >
                취소
              </button>
            </div>
          )}

          {/* 직접 만들기 폼 */}
          {showCreateForm && (
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
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="예: 책 읽기, 운동하기"
                    className="w-full px-4 py-2 rounded bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark"
                  />
                </div>
                <div>
                  <label className="block caption-text mb-2">메모 (선택)</label>
                  <input
                    type="text"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="예: 30페이지 목표, 공원에서 가볍게 등"
                    className="w-full px-4 py-2 rounded bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCreateTask}
                    disabled={!newTaskTitle.trim() || isCreatingTask}
                    className="btn-primary flex-1 disabled:bg-primary-disabled disabled:cursor-not-allowed"
                  >
                    {isCreatingTask ? "만드는 중..." : "만들기"}
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    disabled={isCreatingTask}
                    className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 할 일 목록 - 칸반 레이아웃 */}
          {tasks.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="space-y-6">
                {/* 상단 액션 버튼 */}
                <div className="flex items-center justify-end gap-4">
                  <button
                    onClick={handleShowRecommendations}
                    className="text-sm text-primary hover:text-primary-hover"
                  >
                    AI 추천
                  </button>
                  <button
                    onClick={handleShowCreateForm}
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
                  onToggle={handleToggleTask}
                  onClick={setSelectedTask}
                  collapsed={collapsedSections[TaskStatus.TODO]}
                  onToggleCollapse={() => toggleSection(TaskStatus.TODO)}
                />

                {/* 진행중 섹션 */}
                <DroppableSection
                  id={TaskStatus.IN_PROGRESS}
                  title="진행중"
                  tasks={tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS)}
                  emptyMessage="진행 중인 태스크가 없습니다"
                  onToggle={handleToggleTask}
                  onClick={setSelectedTask}
                  collapsed={collapsedSections[TaskStatus.IN_PROGRESS]}
                  onToggleCollapse={() => toggleSection(TaskStatus.IN_PROGRESS)}
                />

                {/* 완료 섹션 */}
                <DroppableSection
                  id={TaskStatus.DONE}
                  title="완료"
                  tasks={tasks.filter((t) => t.status === TaskStatus.DONE)}
                  emptyMessage="완료된 태스크가 없습니다"
                  onToggle={handleToggleTask}
                  onClick={setSelectedTask}
                  collapsed={collapsedSections[TaskStatus.DONE]}
                  onToggleCollapse={() => toggleSection(TaskStatus.DONE)}
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
                          <p className="caption-text">
                            {activeTask.description}
                          </p>
                        )}
                      </div>
                      {/* 드래그 핸들 - 오른쪽에 배치 */}
                      <div className="text-text-tertiary dark:text-text-tertiary-dark">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
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
          )}
        </div>
      </main>
      <BottomNav />

      {/* Task 상세보기 모달 */}
      {selectedTask && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setSelectedTask(null);
            setShowDeleteConfirm(false);
            setIsEditMode(false);
            setEditTitle("");
            setEditDescription("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setSelectedTask(null);
              setShowDeleteConfirm(false);
              setIsEditMode(false);
              setEditTitle("");
              setEditDescription("");
            }
          }}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <div
            className="card-default max-w-md w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="document"
          >
            <div className="flex items-center justify-between gap-3">
              {isEditMode ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 px-3 py-2 rounded bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark font-semibold text-lg"
                  autoFocus
                />
              ) : (
                <h2 className="heading-secondary truncate">
                  {selectedTask.title}
                </h2>
              )}
              <button
                onClick={() => {
                  setSelectedTask(null);
                  setShowDeleteConfirm(false);
                  setIsEditMode(false);
                  setEditTitle("");
                  setEditDescription("");
                }}
                className="text-text-tertiary dark:text-text-tertiary-dark hover:text-text-secondary dark:hover:text-text-secondary-dark flex-shrink-0"
              >
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

            <div className="space-y-4">
              {/* 메모 */}
              <div>
                <label className="block caption-text mb-2">메모</label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="예: 30페이지 목표, 공원에서 가볍게 등"
                    className="w-full px-4 py-2 rounded bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark"
                  />
                ) : selectedTask.description ? (
                  <p className="body-text">{selectedTask.description}</p>
                ) : (
                  <p className="caption-text">메모 없음</p>
                )}
              </div>

              {/* 상태 */}
              <div>
                <label className="block caption-text mb-2">상태</label>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      selectedTask.status === TaskStatus.DONE
                        ? "bg-primary"
                        : selectedTask.status === TaskStatus.IN_PROGRESS
                          ? "bg-primary opacity-60"
                          : "bg-text-tertiary dark:bg-text-tertiary-dark"
                    }`}
                  />
                  <p className="body-text">
                    {selectedTask.status === TaskStatus.DONE
                      ? "완료"
                      : selectedTask.status === TaskStatus.IN_PROGRESS
                        ? "진행중"
                        : "할일"}
                  </p>
                </div>
              </div>

              {/* 생성일 */}
              {selectedTask.createdAt && (
                <div>
                  <label className="block caption-text mb-2">생성일</label>
                  <p className="body-text">
                    {new Date(selectedTask.createdAt).toLocaleDateString(
                      "ko-KR",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              )}

              {/* 완료일 */}
              {selectedTask.status === TaskStatus.DONE &&
                (selectedTask.endAt || selectedTask.modifiedAt) && (
                  <div>
                    <label className="block caption-text mb-2">완료일</label>
                    <p className="body-text">
                      {new Date(
                        selectedTask.endAt || selectedTask.modifiedAt!
                      ).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
            </div>

            {/* 액션 버튼 */}
            {isEditMode ? (
              <div className="flex gap-3 pt-4 border-t border-border-light dark:border-border-dark">
                <button
                  onClick={handleCancelEdit}
                  className="btn-secondary flex-1"
                >
                  취소
                </button>
                <button
                  onClick={handleEditTask}
                  disabled={!editTitle.trim()}
                  className="btn-primary flex-1 disabled:bg-primary-disabled disabled:cursor-not-allowed"
                >
                  저장
                </button>
              </div>
            ) : !showDeleteConfirm ? (
              <div className="flex gap-3 pt-4 border-t border-border-light dark:border-border-dark">
                <button
                  onClick={handleStartEdit}
                  className="btn-secondary flex-1"
                >
                  수정
                </button>
                <button
                  onClick={() => handleToggleTask(selectedTask.id)}
                  className="btn-secondary flex-1"
                >
                  {selectedTask.status === TaskStatus.TODO
                    ? "진행중으로"
                    : selectedTask.status === TaskStatus.IN_PROGRESS
                      ? "완료로"
                      : "할일로"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn-secondary flex-1 !text-error hover:!bg-error-bg"
                >
                  삭제
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-4 border-t border-border-light dark:border-border-dark">
                <div className="text-center">
                  <p className="body-text text-error font-medium">
                    정말 삭제하시겠습니까?
                  </p>
                  <p className="caption-text mt-1">
                    삭제된 할 일은 복구할 수 없습니다.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="btn-secondary flex-1"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteTask(selectedTask.id);
                      setSelectedTask(null);
                      setShowDeleteConfirm(false);
                    }}
                    className="btn-primary flex-1 !bg-error !hover:bg-error-pressed"
                  >
                    삭제
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
