import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";

export function meta() {
  return [
    { title: "기록 - ulala" },
    { name: "description", content: "게임 기록과 통계를 확인하세요" },
  ];
}

// 샘플 할 일 데이터
const sampleTodos = [
  { id: 1, title: "물 8잔 마시기", category: "건강", completed: false },
  { id: 2, title: "30분 산책하기", category: "운동", completed: false },
  { id: 3, title: "책 30페이지 읽기", category: "학습", completed: false },
  { id: 4, title: "일기 쓰기", category: "자기계발", completed: false },
  {
    id: 5,
    title: "스마트폰 사용시간 줄이기",
    category: "디지털 디톡스",
    completed: false,
  },
];

interface Todo {
  id: number;
  title: string;
  category: string;
  completed: boolean;
}

export default function Records() {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
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

  const handleSelectRecommendation = (todo: Todo) => {
    const newTodo = { ...todo, id: Date.now() };
    setTodos([...todos, newTodo]);
    setShowRecommendations(false);
  };

  const handleCreateTodo = () => {
    if (newTodoTitle.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        title: newTodoTitle.trim(),
        category: newTodoCategory,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setNewTodoTitle("");
      setNewTodoCategory("기타");
      setShowCreateForm(false);
    }
  };

  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <>
      <TopBar level={1} onSettingsClick={() => console.log("메뉴 버튼 클릭")} />
      <main className="min-h-screen bg-bg-secondary dark:bg-bg-secondary-dark p-4 pb-16">
        <div className="container max-w-lg mx-auto space-y-6">
          {/* 할 일 목록이 없을 때 */}
          {todos.length === 0 &&
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
                {sampleTodos.map((todo) => (
                  <button
                    key={todo.id}
                    onClick={() => handleSelectRecommendation(todo)}
                    className="card-clickable p-3 cursor-pointer w-full text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-text-primary dark:text-text-primary-dark">
                          {todo.title}
                        </h3>
                        <p className="caption-text">{todo.category}</p>
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
                    className="w-full px-4 py-2 rounded border border-border-light dark:border-border-dark bg-bg-primary dark:bg-bg-primary-dark text-text-primary dark:text-text-primary-dark"
                  />
                </div>
                <div>
                  <label className="block caption-text mb-2">카테고리</label>
                  <div className="relative">
                    <select
                      value={newTodoCategory}
                      onChange={(e) => setNewTodoCategory(e.target.value)}
                      className="w-full px-4 py-2 pr-10 rounded border border-border-light dark:border-border-dark bg-bg-primary dark:bg-bg-primary-dark text-text-primary dark:text-text-primary-dark appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
                    disabled={!newTodoTitle.trim()}
                    className="btn-primary flex-1 disabled:bg-primary-disabled disabled:cursor-not-allowed"
                  >
                    만들기
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="btn-secondary flex-1"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 할 일 목록 */}
          {todos.length > 0 && (
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
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`card-default p-4 ${todo.completed ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleTodo(todo.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          todo.completed
                            ? "bg-primary border-primary"
                            : "border-border-light dark:border-border-dark hover:border-primary"
                        }`}
                      >
                        {todo.completed && (
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
                          className={`font-medium ${todo.completed ? "line-through text-text-tertiary dark:text-text-tertiary-dark" : "text-text-primary dark:text-text-primary-dark"}`}
                        >
                          {todo.title}
                        </h3>
                        <p className="caption-text">{todo.category}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
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
                  완료: {todos.filter((t) => t.completed).length} /{" "}
                  {todos.length}
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
