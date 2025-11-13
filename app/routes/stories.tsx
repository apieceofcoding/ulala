import { useState } from "react";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { TaskKanbanBoard } from "@/components/stories/TaskKanbanBoard";
import { TaskDetailModal } from "@/components/stories/TaskDetailModal";
import type { SampleTask } from "@/components/stories/TaskRecommendations";
import { EmptyTaskState } from "@/components/stories/EmptyTaskState";
import { ErrorAlert } from "@/components/stories/ErrorAlert";
import { TaskLoadingState } from "@/components/stories/LoadingStates";
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


  const handleToggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    // 순환 방식: TODO → IN_PROGRESS → DONE → TODO (ON_HOLD는 드래그로만 이동 가능)
    let newStatus: TaskStatus;
    if (task.status === TaskStatus.TODO) {
      newStatus = TaskStatus.IN_PROGRESS;
    } else if (task.status === TaskStatus.IN_PROGRESS) {
      newStatus = TaskStatus.DONE;
    } else {
      // DONE 또는 ON_HOLD에서는 TODO로 돌아감
      newStatus = TaskStatus.TODO;
    }

    // 새로운 상태에서 가장 큰 displayOrder 찾기
    const tasksInNewStatus = tasks.filter((t) => t.status === newStatus);
    const maxDisplayOrder =
      tasksInNewStatus.length > 0
        ? Math.max(...tasksInNewStatus.map((t) => t.displayOrder))
        : 0;
    const newDisplayOrder = maxDisplayOrder + 1;

    try {
      await editTask(id, {
        status: newStatus,
        displayOrder: newDisplayOrder,
      });

      // selectedTask가 현재 토글하는 task라면 업데이트
      if (selectedTask && selectedTask.id === id) {
        setSelectedTask({
          ...selectedTask,
          status: newStatus,
          displayOrder: newDisplayOrder,
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
    description: string,
    status: TaskStatus,
    startAt: string | null,
    endAt: string | null,
    dueAt: string | null
  ) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      // 상태가 변경된 경우 displayOrder 재계산
      let newDisplayOrder = task.displayOrder;
      if (status !== task.status) {
        const tasksInNewStatus = tasks.filter((t) => t.status === status);
        const maxDisplayOrder =
          tasksInNewStatus.length > 0
            ? Math.max(...tasksInNewStatus.map((t) => t.displayOrder))
            : 0;
        newDisplayOrder = maxDisplayOrder + 1;
      }

      // TaskDetailModal에서 저장할 때는 updateNullFields=true
      await editTask(taskId, {
        title,
        description: description || undefined,
        status,
        displayOrder: newDisplayOrder,
        startAt: startAt || undefined,
        endAt: endAt || undefined,
        dueAt: dueAt || undefined,
        updateNullFields: true,
      });

      // selectedTask를 업데이트하여 모달에 변경된 내용 표시
      if (selectedTask) {
        setSelectedTask({
          ...selectedTask,
          title,
          description: description || null,
          status,
          displayOrder: newDisplayOrder,
          startAt,
          endAt,
          dueAt,
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
    const activeTask = tasks.find((t) => t.id === taskId);
    if (!activeTask) return;

    // over.data를 사용하여 drop 대상의 타입 확인
    const overType = over.data?.current?.type;

    // 섹션으로 드래그한 경우 (다른 상태로 이동)
    if (overType === "section") {
      const newStatus = over.data?.current?.status as TaskStatus;
      if (!newStatus || activeTask.status === newStatus) return;

      // 새로운 상태에서 가장 큰 displayOrder 찾기
      const tasksInNewStatus = tasks.filter((t) => t.status === newStatus);
      const maxDisplayOrder =
        tasksInNewStatus.length > 0
          ? Math.max(...tasksInNewStatus.map((t) => t.displayOrder))
          : 0;
      const newDisplayOrder = maxDisplayOrder + 1;

      try {
        await editTask(taskId, {
          status: newStatus,
          displayOrder: newDisplayOrder,
        });

        // selectedTask가 현재 변경하는 task라면 업데이트
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask({
            ...selectedTask,
            status: newStatus,
            displayOrder: newDisplayOrder,
            endAt:
              newStatus === TaskStatus.DONE ? new Date().toISOString() : null,
          });
        }
      } catch {
        // 에러는 useTasks에서 처리
      }
    } else if (overType === "task") {
      // 다른 task 위로 드래그한 경우
      const overId = over.id as string;
      const overTask = tasks.find((t) => t.id === overId);

      if (!overTask) return;
      if (activeTask.id === overTask.id) return; // 자기 자신

      // 다른 섹션의 task 위로 드래그한 경우 (다른 섹션으로 이동하면서 특정 위치에 삽입)
      if (activeTask.status !== overTask.status) {
        const newStatus = overTask.status;

        // 새로운 섹션의 모든 task를 정렬
        const tasksInNewStatus = tasks
          .filter((t) => t.status === newStatus)
          .sort((a, b) => a.displayOrder - b.displayOrder);

        // overTask의 인덱스 찾기
        const overIndex = tasksInNewStatus.findIndex((t) => t.id === overTask.id);
        if (overIndex === -1) return;

        // overTask 위치에 activeTask를 삽입
        const reorderedTasks = [...tasksInNewStatus];
        reorderedTasks.splice(overIndex, 0, activeTask);

        // displayOrder 재할당
        try {
          for (let i = 0; i < reorderedTasks.length; i++) {
            const task = reorderedTasks[i];
            const newDisplayOrder = i + 1;

            if (task.id === activeTask.id) {
              // activeTask는 상태와 displayOrder 모두 변경
              await editTask(task.id, {
                status: newStatus,
                displayOrder: newDisplayOrder,
              });

              // selectedTask가 현재 변경하는 task라면 업데이트
              if (selectedTask && selectedTask.id === taskId) {
                setSelectedTask({
                  ...selectedTask,
                  status: newStatus,
                  displayOrder: newDisplayOrder,
                  endAt:
                    newStatus === TaskStatus.DONE
                      ? new Date().toISOString()
                      : null,
                });
              }
            } else if (task.displayOrder !== newDisplayOrder) {
              // 다른 task들은 displayOrder만 변경
              await editTask(task.id, {
                displayOrder: newDisplayOrder,
              });
            }
          }
        } catch {
          // 에러는 useTasks에서 처리
        }
      } else {
        // 같은 섹션 내에서 순서 변경
        const tasksInSameStatus = tasks
          .filter((t) => t.status === activeTask.status)
          .sort((a, b) => a.displayOrder - b.displayOrder);

        // active와 over의 인덱스 찾기
        const oldIndex = tasksInSameStatus.findIndex((t) => t.id === activeTask.id);
        const newIndex = tasksInSameStatus.findIndex((t) => t.id === overTask.id);

        if (oldIndex === -1 || newIndex === -1) return;

        // 배열 재정렬 (arrayMove 로직)
        const reorderedTasks = [...tasksInSameStatus];
        const [movedTask] = reorderedTasks.splice(oldIndex, 1);
        reorderedTasks.splice(newIndex, 0, movedTask);

        // displayOrder 재할당 (1부터 시작)
        try {
          for (let i = 0; i < reorderedTasks.length; i++) {
            const task = reorderedTasks[i];
            const newDisplayOrder = i + 1;

            // displayOrder가 변경된 경우에만 업데이트
            if (task.displayOrder !== newDisplayOrder) {
              await editTask(task.id, {
                displayOrder: newDisplayOrder,
              });
            }
          }

          // selectedTask가 변경된 경우 업데이트
          if (selectedTask && activeTask.id === selectedTask.id) {
            const newDisplayOrder = newIndex + 1;
            setSelectedTask({
              ...selectedTask,
              displayOrder: newDisplayOrder,
            });
          }
        } catch {
          // 에러는 useTasks에서 처리
        }
      }
    }
  };

  return (
    <>
      <TopBar />
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
              isLoadingRecommendations={isLoadingRecommendations}
              showRecommendations={showRecommendations}
              showCreateForm={showCreateForm}
              sampleTasks={sampleTasks}
              onSelectRecommendation={handleSelectRecommendation}
              onCancelRecommendations={() => setShowRecommendations(false)}
              newTaskTitle={newTaskTitle}
              newTaskDescription={newTaskDescription}
              isCreatingTask={isCreatingTask}
              onTitleChange={setNewTaskTitle}
              onDescriptionChange={setNewTaskDescription}
              onCreate={handleCreateTask}
              onCancelCreate={() => setShowCreateForm(false)}
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
        />
      )}
    </>
  );
}
