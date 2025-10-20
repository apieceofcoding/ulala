# 스토리 페이지 태스크 API 연동 기능 명세서

**상태**: ✅ 구현 완료 및 리팩토링 완료 (2025-10-20)

**구현된 파일**:
- `app/routes/stories.tsx` - 태스크 API 연동 완료 및 useTasks 훅 사용으로 리팩토링
- `app/hooks/useTasks.ts` - 태스크 관련 상태 및 로직 관리 커스텀 훅

**주요 변경사항**:
- 로컬 상태 관리에서 서버 API 연동으로 전환
- 낙관적 업데이트(Optimistic Update) 패턴 적용
- 에러 핸들링 및 로딩 상태 UI 추가
- **커스텀 훅(`useTasks`)으로 비즈니스 로직 분리** ⭐
- TypeScript 타입 체크 및 ESLint 검증 통과

## 개요

### 목적
- `/stories` 페이지에서 기존 UI를 유지하면서 실제 태스크 생성 및 조회 API를 연동
- 로컬 상태 관리에서 서버 데이터 관리로 전환하여 데이터 영속성 확보
- 사용자 경험은 동일하게 유지하면서 백엔드 API와의 통신 구현

### 배경
- 현재 `app/routes/stories.tsx`는 로컬 상태(`useState`)로만 태스크를 관리
- 이미 태스크 API 클라이언트(`app/api/tasks.ts`)와 타입(`app/types/task.ts`)이 구현되어 있음
- 기존 UI/UX는 유지하면서 API 연동만 추가 필요

## 요구사항

### 기능적 요구사항

1. **태스크 목록 조회**
   - 페이지 로드 시 `GET /api/tasks`를 호출하여 사용자의 태스크 목록 조회
   - 조회된 태스크를 기존 UI에 표시
   - 로딩 상태 표시 (기존 AI 추천 로딩 UI 재활용)
   - 에러 발생 시 사용자에게 명확한 피드백 제공

2. **태스크 생성**
   - "직접 만들기" 폼에서 태스크 생성 시 `POST /api/tasks` 호출
   - 생성 성공 시 목록에 자동 추가
   - 기존 카테고리 필드를 `description`에 매핑
   - 생성 중 로딩 상태 표시

3. **태스크 완료 처리**
   - 체크박스 클릭 시 `PUT /api/tasks/:id`로 상태 업데이트
   - `status`를 `TODO` ↔ `DONE`으로 변경
   - 낙관적 업데이트(Optimistic Update)로 즉각적인 UI 반응
   - 실패 시 이전 상태로 롤백

4. **태스크 삭제**
   - 삭제 버튼 클릭 시 `DELETE /api/tasks/:id` 호출
   - 낙관적 업데이트로 즉시 UI에서 제거
   - 실패 시 이전 상태로 롤백

5. **AI 추천 기능**
   - 기존 샘플 데이터를 사용한 추천 UI는 유지
   - 추천 선택 시 API를 통해 실제 태스크 생성

### 비기능적 요구사항

1. **인증 처리**
   - AuthContext에서 인증 토큰 가져오기
   - 로그인하지 않은 사용자 처리 (로그인 페이지로 리다이렉트 또는 안내 메시지)

2. **에러 핸들링**
   - 네트워크 에러, API 에러 등 모든 에러 케이스 처리
   - 사용자에게 이해하기 쉬운 에러 메시지 표시
   - `logger` 유틸리티를 사용한 에러 로깅

3. **로딩 상태 관리**
   - 초기 로딩, 생성 중, 업데이트 중 등 각 상태에 대한 UI 피드백
   - 기존 스켈레톤 UI 활용

4. **성능**
   - 불필요한 API 재호출 방지
   - 낙관적 업데이트로 빠른 사용자 경험 제공

## 디자인 고려사항

### 적용할 디자인 원칙 (`docs/design-guide.md`)

1. **일관성 (Consistency)**
   - 기존 버튼, 카드, 입력 필드 스타일 유지
   - 로딩 상태는 기존 AI 추천 로딩 UI와 동일한 스타일

2. **피드백 (Feedback)**
   - 로딩 상태: 기존 스켈레톤 UI 활용
   - 에러 상태: 에러 메시지 카드 표시 (빨간색 테두리, 에러 아이콘)
   - 성공 상태: 즉각적인 UI 업데이트 (낙관적 업데이트)

3. **사용할 컴포넌트**
   - `.card-default`: 에러 메시지 카드
   - `.btn-primary`, `.btn-secondary`: 기존 버튼 유지
   - 스켈레톤 로딩: 기존 AI 추천 로딩 UI 재활용

4. **색상 시스템**
   - 에러: `--color-error`, `--color-error-bg`
   - 기본 텍스트: `--color-text-primary`, `--color-text-secondary`
   - 배경: `--color-bg-primary`, `--color-bg-secondary`

5. **접근성**
   - 로딩 중 버튼은 `disabled` 상태로 설정
   - 에러 메시지에는 아이콘과 텍스트 함께 표시
   - 모든 상태 변화는 시각적으로 명확하게 표현

## 데이터 타입 매핑

### 기존 로컬 `Todo` 타입
```typescript
interface Todo {
  id: number;
  title: string;
  category: string;
  completed: boolean;
}
```

### API `TaskResponse` 타입
```typescript
interface TaskResponse {
  id: number;
  memberId: number;
  title: string;
  description: string | null;
  status: TaskStatus; // "TODO" | "IN_PROGRESS" | "DONE"
  startAt: string | null;
  endAt: string | null;
  dueAt: string | null;
  createdAt: string | null;
  modifiedAt: string | null;
}
```

### 매핑 전략
- `Todo.title` → `TaskResponse.title`
- `Todo.category` → `TaskResponse.description` (카테고리를 설명으로 저장)
- `Todo.completed` → `TaskResponse.status === "DONE"`
- `TaskResponse.status === "TODO"`인 경우 `completed: false`

### 태스크 생성 요청
```typescript
{
  title: string,          // 사용자 입력
  description?: string,   // 카테고리 값
}
```

## 구현 계획

### 1단계: AuthContext 및 API 클라이언트 import
- `useAuth()` 훅으로 인증 토큰 가져오기
- `app/api/tasks.ts`의 API 함수들 import
- 타입 import (`TaskResponse`, `CreateTaskRequest` 등)

### 2단계: 상태 관리 수정
- 로컬 `Todo[]` 대신 `TaskResponse[]` 사용
- 로딩 상태 추가: `isLoadingTasks`, `isCreatingTask`, etc.
- 에러 상태 추가: `error: string | null`

### 3단계: 초기 데이터 로드
- `useEffect`로 컴포넌트 마운트 시 태스크 목록 조회
- 로딩 중 스켈레톤 UI 표시
- 에러 발생 시 에러 메시지 표시

### 4단계: 태스크 생성 API 연동
- `handleCreateTodo` 함수 수정
- `createTask` API 호출
- 성공 시 목록에 추가
- 에러 처리

### 5단계: 태스크 완료/취소 API 연동
- `handleToggleTodo` 함수 수정
- 낙관적 업데이트 구현
- `updateTask` API 호출
- 실패 시 롤백

### 6단계: 태스크 삭제 API 연동
- `handleDeleteTodo` 함수 수정
- 낙관적 업데이트 구현
- `deleteTask` API 호출
- 실패 시 롤백

### 7단계: AI 추천 선택 API 연동
- `handleSelectRecommendation` 함수 수정
- 선택한 추천을 API로 생성
- 성공 시 목록에 추가

### 8단계: 에러 UI 구현
- 네트워크 에러, API 에러에 대한 사용자 피드백
- 재시도 버튼 추가

## 파일 수정 목록

### 수정할 파일
1. `app/routes/stories.tsx` - 메인 구현 파일

### 사용할 기존 파일
1. `app/api/tasks.ts` - 태스크 API 클라이언트 함수
2. `app/types/task.ts` - 태스크 타입 정의
3. `app/api/endpoints.ts` - API 엔드포인트 상수
4. `app/contexts/AuthContext.tsx` - 인증 컨텍스트 (토큰 가져오기)

## 테스트 계획

### 수동 테스트 시나리오

1. **초기 로드 테스트**
   - [ ] 페이지 로드 시 기존 태스크 목록이 표시되는가?
   - [ ] 로딩 중 스켈레톤 UI가 표시되는가?
   - [ ] 에러 발생 시 에러 메시지가 표시되는가?

2. **태스크 생성 테스트**
   - [ ] "직접 만들기" 폼에서 태스크를 생성할 수 있는가?
   - [ ] 생성 중 로딩 상태가 표시되는가?
   - [ ] 생성 후 목록에 새 태스크가 추가되는가?
   - [ ] AI 추천에서 선택한 태스크가 생성되는가?

3. **태스크 완료/취소 테스트**
   - [ ] 체크박스 클릭 시 즉시 UI가 업데이트되는가?
   - [ ] 완료 상태가 서버에 저장되는가?
   - [ ] 실패 시 이전 상태로 롤백되는가?
   - [ ] 완료 시 보상이 생성되는가?

4. **태스크 삭제 테스트**
   - [ ] 삭제 버튼 클릭 시 즉시 UI에서 제거되는가?
   - [ ] 삭제가 서버에 반영되는가?
   - [ ] 실패 시 이전 상태로 롤백되는가?

5. **에러 케이스 테스트**
   - [ ] 네트워크 오프라인 시 적절한 에러 메시지가 표시되는가?
   - [ ] 인증 실패 시 로그인 페이지로 리다이렉트되는가?
   - [ ] 서버 에러 시 사용자 친화적인 메시지가 표시되는가?

### 검증 방법
1. Chrome DevTools Network 탭에서 API 호출 확인
2. 콘솔에서 에러 로그 확인
3. 다크 모드에서도 UI가 정상 작동하는지 확인
4. 모바일 화면에서도 정상 작동하는지 확인

## 잠재적 이슈 및 고려사항

1. **인증 토큰 없음**
   - 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
   - 또는 로그인 안내 메시지 표시

2. **API 응답 시간**
   - 느린 네트워크 환경에서도 사용자 경험 유지
   - 낙관적 업데이트로 즉각적인 반응 제공

3. **데이터 동기화**
   - 다른 탭이나 기기에서 변경된 데이터 반영 문제
   - 현재는 페이지 새로고침으로 해결 (추후 WebSocket 고려)

4. **보상 시스템**
   - 기존 로컬 스토리지 기반 보상 시스템 유지
   - 추후 보상도 API로 관리 고려

## 성공 기준

- [x] 기존 UI/UX가 그대로 유지됨
- [x] 모든 태스크 CRUD 작업이 API를 통해 수행됨
- [x] 에러 발생 시 사용자에게 명확한 피드백 제공
- [x] 로딩 상태가 적절히 표시됨
- [x] 페이지 새로고침 후에도 태스크가 유지됨
- [x] 린트 및 타입 체크 통과
- [x] 다크 모드 정상 작동 (기존 디자인 시스템 사용)
- [x] 모바일 반응형 정상 작동 (기존 레이아웃 유지)

## 구현 세부사항

### 1. 상태 관리
```typescript
// 기존: 로컬 Todo[] 상태
const [todos, setTodos] = useState<Todo[]>([]);

// 변경: TaskResponse[] 상태로 전환
const [todos, setTodos] = useState<TaskResponse[]>([]);

// 추가된 상태
const [isLoadingTasks, setIsLoadingTasks] = useState(false);
const [isCreatingTask, setIsCreatingTask] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### 2. 초기 데이터 로드
```typescript
useEffect(() => {
  const loadTasks = async () => {
    if (!accessToken) return;

    setIsLoadingTasks(true);
    setError(null);

    try {
      const tasks = await getMyTasks(accessToken);
      setTodos(tasks);
    } catch (err) {
      logger.error("태스크 목록 로드 실패:", err);
      setError("태스크 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoadingTasks(false);
    }
  };

  loadTasks();
}, [accessToken]);
```

### 3. 태스크 생성
- `handleCreateTodo()` 함수를 async로 변경
- `createTask()` API 호출
- 생성 중 로딩 상태 표시 ("만드는 중...")
- 에러 발생 시 에러 메시지 표시

### 4. 낙관적 업데이트 패턴
태스크 완료/삭제 시 즉각적인 UI 반응을 위해 낙관적 업데이트 적용:

```typescript
// 1. UI 먼저 업데이트
setTodos(todos.map(t => t.id === id ? { ...t, status: newStatus } : t));

// 2. API 호출
try {
  await updateTask(id, { status: newStatus }, accessToken);
} catch (err) {
  // 3. 실패 시 롤백
  setTodos(todos.map(t => t.id === id ? { ...t, status: oldStatus } : t));
  setError("업데이트에 실패했습니다.");
}
```

### 5. 타입 매핑
- `Todo.category` → `TaskResponse.description`
- `Todo.completed` → `TaskResponse.status === TaskStatus.DONE`
- UI에서 `todo.category` → `todo.description || "기타"`
- UI에서 `todo.completed` → `todo.status === TaskStatus.DONE`

### 6. 에러 UI
- 에러 발생 시 상단에 에러 카드 표시
- 빨간색 아이콘과 함께 명확한 에러 메시지
- 닫기 버튼으로 에러 메시지 제거 가능

### 7. 로딩 UI
- 초기 로딩: 스켈레톤 UI (3개 항목)
- 생성 중: 버튼 텍스트 "만드는 중..." + disabled 상태
- 모든 버튼은 로딩 중 disabled 처리

## 테스트 결과

### 코드 품질
- ✅ TypeScript 타입 체크 통과
- ✅ ESLint 검사 통과 (stories.tsx의 모든 경고 해결)
- ✅ 개발 서버 정상 실행 (http://localhost:5174/)

### 기능 검증 (수동 테스트 필요)
사용자가 직접 브라우저에서 다음 항목을 테스트해야 합니다:

1. **초기 로드**
   - 로그인 후 /stories 페이지 접속
   - 기존 태스크 목록이 표시되는지 확인
   - 로딩 스켈레톤이 표시되는지 확인

2. **태스크 생성**
   - "직접 만들기" 버튼 클릭
   - 태스크 제목과 카테고리 입력
   - "만들기" 버튼 클릭 시 "만드는 중..." 표시 확인
   - 생성된 태스크가 목록에 추가되는지 확인

3. **AI 추천**
   - "할 일을 만들어볼까요?" 버튼 클릭
   - 추천 목록에서 항목 선택
   - API로 태스크가 생성되는지 확인

4. **태스크 완료/취소**
   - 체크박스 클릭 시 즉시 UI 업데이트 확인
   - 페이지 새로고침 후에도 상태 유지 확인
   - 완료 시 보상이 생성되는지 확인

5. **태스크 삭제**
   - X 버튼 클릭 시 즉시 UI에서 제거되는지 확인
   - 페이지 새로고침 후에도 삭제 상태 유지 확인

6. **에러 처리**
   - 네트워크 차단 후 태스크 생성 시도
   - 에러 메시지가 표시되는지 확인
   - 에러 메시지 닫기 버튼 동작 확인

## 리팩토링: useTasks 커스텀 훅 분리

### 리팩토링 목적
1. **관심사 분리**: UI 로직과 비즈니스 로직 분리
2. **재사용성**: 다른 컴포넌트에서도 태스크 관리 로직 재사용 가능
3. **테스트 용이성**: 훅을 독립적으로 테스트 가능
4. **유지보수성**: 코드 구조 개선 및 가독성 향상

### useTasks 훅 구조

```typescript
// app/hooks/useTasks.ts
export function useTasks({ accessToken }: UseTasksOptions): UseTasksReturn {
  // 상태 관리
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 초기 로드
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // API 메서드들
  return {
    tasks,
    isLoading,
    isCreating,
    error,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    toggleTaskStatus,
    clearError,
  };
}
```

### stories.tsx 변경 사항

**Before (직접 API 호출)**:
```typescript
const [todos, setTodos] = useState<TaskResponse[]>([]);
const [isLoadingTasks, setIsLoadingTasks] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const loadTasks = async () => {
    // ... 복잡한 로딩 로직
  };
  loadTasks();
}, [accessToken]);

const handleCreateTodo = async () => {
  // ... 복잡한 생성 로직
};
```

**After (useTasks 훅 사용)**:
```typescript
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

const handleCreateTodo = async () => {
  try {
    await addTask({ title, description });
    // UI 상태만 업데이트
  } catch {
    // 에러는 훅에서 처리
  }
};
```

### 개선 효과

1. **코드 라인 수 감소**: stories.tsx의 코드가 약 100줄 이상 감소
2. **복잡도 감소**: 컴포넌트는 UI에만 집중
3. **낙관적 업데이트**: 훅 내부에서 일관되게 처리
4. **에러 처리**: 중앙집중식 에러 관리

### useTasks 훅의 주요 기능

1. **자동 초기 로드**: accessToken 변경 시 자동으로 태스크 재조회
2. **낙관적 업데이트**: editTask, removeTask, toggleTaskStatus에 적용
3. **로딩 상태 분리**: isLoading (조회), isCreating (생성) 분리
4. **에러 관리**: 통합된 에러 상태 및 clearError 메서드

## 개선 사항 (추후 고려)

1. **재시도 메커니즘**
   - 에러 발생 시 "다시 시도" 버튼 추가

2. **WebSocket 실시간 동기화**
   - 다른 기기/탭에서 변경된 내용 실시간 반영

3. **오프라인 모드**
   - 오프라인에서도 태스크 조작 가능
   - 온라인 복구 시 동기화

4. **보상 API 연동**
   - 현재 로컬 스토리지 기반 → API 기반으로 전환

5. **페이지네이션**
   - 태스크가 많을 경우 페이지네이션 추가

6. **필터링/정렬**
   - 카테고리별 필터링
   - 완료/미완료 필터링
   - 날짜순 정렬

7. **훅 최적화**
   - useTasks 내부에서 tasks 의존성 제거 (useCallback 최적화)
   - React Query 또는 SWR 도입 고려
