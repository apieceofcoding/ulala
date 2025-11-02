import { useState } from "react";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { TaskKanbanBoard } from "@/components/stories/TaskKanbanBoard";
import { TaskDetailModal } from "@/components/stories/TaskDetailModal";
import { TaskCreateForm } from "@/components/stories/TaskCreateForm";
import {
  TaskRecommendations,
  type SampleTask,
} from "@/components/stories/TaskRecommendations";
import { EmptyTaskState } from "@/components/stories/EmptyTaskState";
import { ErrorAlert } from "@/components/stories/ErrorAlert";
import {
  TaskLoadingState,
  RecommendationsLoadingState,
} from "@/components/stories/LoadingStates";
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
const sampleTasks: SampleTask[] = [
  { title: "물 8잔 마시기", description: "하루 2L 목표" },
  { title: "30분 산책하기", description: "공원에서 가볍게" },
  { title: "책 30페이지 읽기", description: "자기계발서" },
  { title: "일기 쓰기", description: "오늘 있었던 일 정리" },
  { title: "스마트폰 사용시간 줄이기", description: "SNS 사용 1시간 이내로" },
];

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
  const [activeTask, setActiveTask] = useState<TaskResponse | null>(null);

  // 섹션 접기/펼치기 상태 (localStorage에서 불러오기)
  const [collapsedSections, setCollapsedSections] = useState<{
    [key in TaskStatus]?: boolean;
  }>(() => {
    const saved = localStorage.getItem("ulala-collapsed-sections");
    return saved ? JSON.parse(saved) : {};
  });

  const handleShowRecommendations = () => {
    setIsLoadingRecommendations(true);
    setShowCreateForm(false);
    setShowRecommendations(false);

    // AI 추천 시뮬레이션 (1초 딜레이)
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
          endAt:
            newStatus === TaskStatus.DONE ? new Date().toISOString() : null,
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

  const handleSaveTask = async (
    taskId: string,
    title: string,
    description: string
  ) => {
    try {
      await editTask(taskId, {
        title,
        description: description || undefined,
      });

      // selectedTask를 업데이트하여 모달에 변경된 내용 표시
      if (selectedTask) {
        setSelectedTask({
          ...selectedTask,
          title,
          description: description || null,
        });
      }
    } catch {
      // 에러는 useTasks에서 처리
    }
  };

  // 섹션 접기/펼치기 토글
  const toggleSection = (sectionId: TaskStatus) => {
    setCollapsedSections((prev) => {
      const newState = {
        ...prev,
        [sectionId]: !prev[sectionId],
      };
      // localStorage에 저장
      localStorage.setItem(
        "ulala-collapsed-sections",
        JSON.stringify(newState)
      );
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
          endAt:
            newStatus === TaskStatus.DONE ? new Date().toISOString() : null,
        });
      }
    } catch {
      // 에러는 useTasks에서 처리
    }
  };

  return (
    <>
      <TopBar level={1} />
      <main className="min-h-screen bg-bg-secondary dark:bg-bg-secondary-dark px-0 pt-14 pb-16 md:pb-1 md:pl-64">
        <div className="container max-w-lg mx-auto space-y-6 pt-4">
          {/* 에러 메시지 */}
          {error && <ErrorAlert message={error} onClose={clearError} />}

          {/* 초기 로딩 상태 */}
          {isLoadingTasks && <TaskLoadingState />}

          {/* 할 일 목록이 없을 때 (로딩 완료 후) */}
          {!isLoadingTasks &&
            tasks.length === 0 &&
            !showRecommendations &&
            !showCreateForm &&
            !isLoadingRecommendations && (
              <EmptyTaskState
                onShowRecommendations={handleShowRecommendations}
                onShowCreateForm={handleShowCreateForm}
              />
            )}

          {/* AI 추천 로딩 화면 */}
          {isLoadingRecommendations && <RecommendationsLoadingState />}

          {/* 추천 할 일 목록 */}
          {showRecommendations && (
            <TaskRecommendations
              sampleTasks={sampleTasks}
              onSelectRecommendation={handleSelectRecommendation}
              onCancel={() => setShowRecommendations(false)}
            />
          )}

          {/* 직접 만들기 폼 */}
          {showCreateForm && (
            <TaskCreateForm
              title={newTaskTitle}
              description={newTaskDescription}
              isCreating={isCreatingTask}
              onTitleChange={setNewTaskTitle}
              onDescriptionChange={setNewTaskDescription}
              onCreate={handleCreateTask}
              onCancel={() => setShowCreateForm(false)}
            />
          )}

          {/* 할 일 목록 - 칸반 레이아웃 */}
          {tasks.length > 0 && (
            <TaskKanbanBoard
              tasks={tasks}
              collapsedSections={collapsedSections}
              activeTask={activeTask}
              onToggleTask={handleToggleTask}
              onTaskClick={setSelectedTask}
              onToggleSection={toggleSection}
              onShowRecommendations={handleShowRecommendations}
              onShowCreateForm={handleShowCreateForm}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          )}
        </div>
      </main>
      <BottomNav />

      {/* Task 상세보기 모달 */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onToggleStatus={handleToggleTask}
        />
      )}
    </>
  );
}
