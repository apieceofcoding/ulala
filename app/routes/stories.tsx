import { useState } from "react";
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
interface SampleTodo {
  title: string;
  description: string;
}

const sampleTodos: SampleTodo[] = [
  { title: "물 8잔 마시기", description: "건강" },
  { title: "30분 산책하기", description: "운동" },
  { title: "책 30페이지 읽기", description: "학습" },
  { title: "일기 쓰기", description: "자기계발" },
  { title: "스마트폰 사용시간 줄이기", description: "디지털 디톡스" },
];

export default function Stories() {
  const { accessToken } = useAuth();
  const {
    tasks,
    isLoading: isLoadingTasks,
    isCreating: isCreatingTask,
    error,
    addTask,
    toggleTaskStatus,
    removeTask,
    clearError,
  } = useTasks({ accessToken });

  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoCategory, setNewTodoCategory] = useState("기타");

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

  const handleSelectRecommendation = async (sample: SampleTodo) => {
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

  const handleCreateTodo = async () => {
    if (!newTodoTitle.trim()) {
      return;
    }

    try {
      await addTask({
        title: newTodoTitle.trim(),
        description: newTodoCategory,
      });
      setNewTodoTitle("");
      setNewTodoCategory("기타");
      setShowCreateForm(false);
    } catch {
      // 에러는 useTasks에서 처리
    }
  };

  const generateReward = (task: TaskResponse) => {
    // 카테고리별 보상 설정
    const categoryRewards: Record<string, { icon: string; points: number }> = {
      '건강': { icon: '💧', points: 10 },
      '운동': { icon: '🚶‍♂️', points: 15 },
      '학습': { icon: '📚', points: 20 },
      '자기계발': { icon: '✨', points: 12 },
      '디지털 디톡스': { icon: '📱', points: 18 },
      '기타': { icon: '🎯', points: 8 }
    };

    const category = task.description || '기타';
    const rewardInfo = categoryRewards[category] || categoryRewards['기타'];

    const newReward = {
      id: Date.now(),
      title: `${category} 달성`,
      description: `${task.title}을(를) 완료했습니다`,
      earnedAt: new Date().toISOString(),
      type: 'points' as const,
      value: rewardInfo.points,
      icon: rewardInfo.icon,
      isNew: true
    };

    // 로컬 스토리지에서 기존 보상 가져오기
    const savedRewards = localStorage.getItem('ulala-rewards');
    const rewards = savedRewards ? JSON.parse(savedRewards) : [];

    // 새 보상 추가
    const updatedRewards = [newReward, ...rewards];
    localStorage.setItem('ulala-rewards', JSON.stringify(updatedRewards));

    // 새 보상 알림 표시 (3초 후 자동 제거)
    setTimeout(() => {
      const currentRewards = JSON.parse(localStorage.getItem('ulala-rewards') || '[]');
      const updatedRewards = currentRewards.map((reward: typeof newReward) =>
        reward.id === newReward.id ? { ...reward, isNew: false } : reward
      );
      localStorage.setItem('ulala-rewards', JSON.stringify(updatedRewards));
    }, 3000);
  };

  const handleToggleTodo = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const wasCompleted = task.status === TaskStatus.DONE;

    // 완료 시 보상 생성
    if (!wasCompleted) {
      generateReward(task);
    }

    try {
      await toggleTaskStatus(id);
    } catch {
      // 에러는 useTasks에서 처리
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await removeTask(id);
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
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
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
          {
          !isLoadingTasks &&
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
                {sampleTodos.map((sample, index) => (
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
                        <p className="caption-text">{sample.description}</p>
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
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    placeholder="예: 책 읽기, 운동하기"
                    className="w-full px-4 py-2 rounded bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark"
                  />
                </div>
                <div>
                  <label className="block caption-text mb-2">카테고리</label>
                  <div className="relative">
                    <select
                      value={newTodoCategory}
                      onChange={(e) => setNewTodoCategory(e.target.value)}
                      className="w-full px-4 py-2 pr-10 rounded bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="건강">건강</option>
                      <option value="운동">운동</option>
                      <option value="학습">학습</option>
                      <option value="자기계발">자기계발</option>
                      <option value="취미">취미</option>
                      <option value="기타">기타</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-text-tertiary dark:text-text-tertiary-dark"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCreateTodo}
                    disabled={!newTodoTitle.trim() || isCreatingTask}
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

          {/* 할 일 목록 */}
          {tasks.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="heading-secondary">오늘의 할 일</h2>
                <div className="flex gap-4">
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
              </div>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`card-default p-4 ${task.status === TaskStatus.DONE ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleTodo(task.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          task.status === TaskStatus.DONE
                            ? "bg-primary border-primary"
                            : "border-border-light dark:border-border-dark hover:border-primary"
                        }`}
                      >
                        {task.status === TaskStatus.DONE && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M2 6L5 9L10 3"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${task.status === TaskStatus.DONE ? "line-through text-text-tertiary dark:text-text-tertiary-dark" : "text-text-primary dark:text-text-primary-dark"}`}
                        >
                          {task.title}
                        </h3>
                        <p className="caption-text">{task.description || "기타"}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteTodo(task.id)}
                        className="text-text-tertiary dark:text-text-tertiary-dark hover:text-text-secondary dark:hover:text-text-secondary-dark"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
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
                ))}
              </div>
              <div className="text-center">
                <p className="caption-text">
                  완료: {tasks.filter((t) => t.status === TaskStatus.DONE).length} /{" "}
                  {tasks.length}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
