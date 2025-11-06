# 보상 API 연동 기능 명세서

**상태**: ✅ 구현 완료 (2025-11-06)
**구현된 파일**:
- app/api/endpoints.ts (수정)
- app/routes/rewards.tsx (수정)

**주요 변경사항**:
- 로컬 스토리지 기반에서 백엔드 API 연동으로 전환
- 페이지네이션 응답 구조 매핑 (`PageResponse<T>`)
- 무한 스크롤 구현 (IntersectionObserver)
- AuthContext를 통한 인증 토큰 관리
- 로딩 및 에러 상태 UI 추가

## 개요

기존 로컬 스토리지 기반의 보상 시스템을 백엔드 API와 연동하여 실제 서버 데이터를 사용하도록 개선합니다.

### 목적과 필요성
- 서버와 클라이언트 간 보상 데이터 동기화
- 로컬 스토리지 의존성 제거 및 데이터 신뢰성 향상
- 여러 디바이스에서 동일한 보상 이력 조회 가능
- 백엔드에서 관리되는 정확한 포인트 및 경험치 데이터 활용

## 요구사항

### 기능적 요구사항

1. **API 엔드포인트 추가**
   - `GET /api/rewards` 엔드포인트를 `app/api/endpoints.ts`에 추가
   - REWARD_ENDPOINTS 카테고리 생성

2. **백엔드 API 연동**
   - 컴포넌트 마운트 시 GET /api/rewards 호출
   - 응답 데이터를 프론트엔드 타입으로 변환
   - 인증 토큰 자동 주입

3. **데이터 타입 변환**
   - 백엔드 RewardResponse → 프론트엔드 Reward 타입 매핑
   - sourceType 기반 보상 유형(type) 결정
   - sourceId로 제목 및 설명 생성

4. **상태 관리 개선**
   - 로딩 상태 표시
   - 에러 처리 및 사용자 피드백
   - 빈 데이터 처리

### 비기능적 요구사항
- 로딩 중 스켈레톤 UI 또는 로딩 인디케이터 표시
- 에러 발생 시 사용자 친화적인 메시지 표시
- API 응답 실패 시 적절한 폴백 처리
- 모바일 우선 반응형 디자인 유지
- 라이트/다크 모드 지원 유지

### API 명세

#### 요청
```
GET /api/rewards?page=0&size=10
Authorization: Bearer {accessToken}
```

#### 쿼리 파라미터
- `page`: 페이지 번호 (0부터 시작)
- `size`: 페이지 크기 (기본값: 10)

#### 응답
```typescript
interface PageResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

interface RewardResponse {
  id: string;
  memberId: string;
  sourceId: string;
  sourceType: "TASK" | "EVENT";
  point: number;
  exp: number;
  createdAt: string | null;
  modifiedAt: string | null;
}
```

#### 응답 예시
```json
{
  "content": [
    {
      "id": "reward-1",
      "memberId": "member-1",
      "sourceId": "task-1",
      "sourceType": "TASK",
      "point": 10,
      "exp": 5,
      "createdAt": "2025-11-06T10:00:00",
      "modifiedAt": null
    }
  ],
  "page": {
    "size": 10,
    "number": 0,
    "totalElements": 1,
    "totalPages": 1
  }
}
```

## 디자인 고려사항

### docs/design-guide.md 적용 원칙
- **일관성**: 기존 보상 탭 디자인 유지
- **가독성**: 로딩 및 에러 상태에서도 명확한 정보 전달
- **단순성**: 최소한의 UI 변경으로 API 연동
- **자연스러운 구분**: 로딩 스켈레톤은 배경색 차이로 표현

### 사용할 컴포넌트와 색상 시스템
- 로딩 상태: 애니메이션 효과가 있는 스켈레톤 카드
- 에러 상태: `text-error` 색상과 아이콘 사용
- 기존 카드 스타일 (`card-default`, `card-clickable`) 유지
- 타이포그래피 클래스 (`heading-primary`, `body-text`, `caption-text`) 유지

## 구현 계획

### 1단계: API 엔드포인트 정의
- `app/api/endpoints.ts`에 REWARD_ENDPOINTS 추가
- API_ENDPOINTS에 REWARDS 카테고리 포함

### 2단계: 타입 정의
- 백엔드 RewardResponse 인터페이스 정의
- 데이터 변환 함수 작성 (transformRewardResponse)
- sourceType별 매핑 로직 구현

### 3단계: API 연동 로직 구현
- useEffect에서 fetchRewards 함수 호출
- apiClient를 사용한 API 요청
- 응답 데이터 변환 및 상태 업데이트

### 4단계: 상태 관리
- loading, error 상태 추가
- 각 상태별 UI 렌더링

### 5단계: 에러 처리 및 UX 개선
- API 요청 실패 시 에러 메시지 표시
- 네트워크 에러 처리
- 빈 데이터 상태 처리

### 6단계: 로컬 스토리지 제거
- localStorage 관련 코드 제거
- 샘플 데이터 제거

## 데이터 변환 매핑

### sourceType
```typescript
// 백엔드 sourceType
TASK
EVENT
```

### sourceId → title, description, icon 매핑
- sourceType이 TASK_COMPLETION인 경우: Task API로 제목 조회 또는 기본 메시지 사용
- sourceType이 ACHIEVEMENT, BADGE인 경우: 사전 정의된 매핑 사용

### 필드 매핑
```typescript
id: string
point
createdAt
```

## 테스트 계획

### 테스트 시나리오

1. **정상 API 응답 테스트**
   - 보상 데이터가 정상적으로 로드되는지 확인
   - 데이터 변환이 올바르게 수행되는지 확인
   - 총 포인트가 정확하게 계산되는지 확인

2. **로딩 상태 테스트**
   - API 요청 중 로딩 인디케이터가 표시되는지 확인
   - 로딩 완료 후 데이터가 렌더링되는지 확인

3. **에러 상태 테스트**
   - API 요청 실패 시 에러 메시지가 표시되는지 확인
   - 네트워크 에러 발생 시 적절한 처리가 되는지 확인

4. **빈 데이터 테스트**
   - 보상이 없는 경우 적절한 안내 메시지 표시 확인

5. **인증 테스트**
   - 인증 토큰이 올바르게 전송되는지 확인
   - 인증 실패 시 적절한 에러 처리 확인

6. **반응형 및 접근성 테스트**
   - 모바일 디바이스에서 UI 적절성 확인
   - 라이트/다크 모드 전환 테스트
   - 키보드 접근성 확인

### 검증 방법
- 브라우저 개발자 도구 Network 탭에서 API 요청 확인
- 다양한 응답 시나리오 테스트 (성공, 실패, 빈 데이터)
- 타입 체크 및 린트 검사 통과 확인

## 기술적 고려사항

### 성능 최적화
- API 응답 캐싱 고려 (React Query 또는 SWR 사용 검토)
- 불필요한 재요청 방지

### 확장성
- 페이지네이션 지원 준비 (추후 보상이 많아질 경우)
- 필터링 및 정렬 기능 확장 가능성 고려

### 보안
- API 요청 시 인증 토큰 자동 주입
- XSS 방지를 위한 데이터 검증

## 추후 개선 사항

1. **실시간 업데이트**
   - 새로운 보상 획득 시 자동 갱신
   - WebSocket 또는 Polling 방식 검토

2. **무한 스크롤 또는 페이지네이션**
   - 보상 데이터가 많아질 경우 대비

3. **필터링 기능**
   - 보상 유형별 필터
   - 날짜 범위 필터

4. **상세 보기**
   - 보상 상세 정보 모달
   - 보상 획득 시점의 컨텍스트 정보

## 체크리스트

### 구현 전 확인사항
- [x] API 명세서 확인 및 백엔드 개발자와 협의
- [x] sourceType 열거형 값 확인 (TASK, EVENT)
- [x] 인증 토큰 주입 방식 확인 (localStorage의 accessToken 사용)
- [x] 에러 응답 형식 확인

### 구현 중 확인사항
- [x] API 엔드포인트 추가 (REWARD_ENDPOINTS)
- [x] 타입 정의 완료 (RewardResponse, Reward)
- [x] 데이터 변환 로직 구현 (transformRewardResponse)
- [x] 로딩 상태 UI 구현 (스피너 및 로딩 메시지)
- [x] 에러 상태 UI 구현 (에러 아이콘 및 재시도 버튼)
- [x] 로컬 스토리지 코드 제거 (샘플 데이터 제거)

### 구현 후 확인사항
- [x] 타입 체크 통과
- [x] 린트 검사 통과 (기존 경고만 존재)
- [ ] 모든 테스트 시나리오 통과 (수동 테스트 필요)
- [x] 디자인 가이드라인 준수 확인
- [x] 접근성 기준 준수 확인
- [x] 문서 업데이트 (이 명세서를 최신 상태로 유지)

## 구현 세부 내용

### 1. API 엔드포인트 추가 (app/api/endpoints.ts)
```typescript
export const REWARD_ENDPOINTS = {
  LIST: "/api/rewards",
} as const;

export const API_ENDPOINTS = {
  // ... 기존 엔드포인트
  REWARDS: REWARD_ENDPOINTS,
} as const;
```

### 2. 타입 정의 (app/routes/rewards.tsx)
```typescript
// 페이지네이션 응답 타입
interface PageResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

// 백엔드 응답 타입
interface RewardResponse {
  id: string;
  memberId: string;
  sourceId: string;
  sourceType: "TASK" | "EVENT";
  point: number;
  exp: number;
  createdAt: string | null;
  modifiedAt: string | null;
}

// 프론트엔드 데이터 타입
interface Reward {
  id: string;
  title: string;
  description: string;
  earnedAt: string;
  type: 'points' | 'badge' | 'achievement';
  value?: number;
  icon: string;
  isNew?: boolean;
}
```

### 3. 데이터 변환 로직
- `transformRewardResponse` 함수로 백엔드 데이터를 프론트엔드 형식으로 변환
- sourceType에 따른 아이콘 매핑 (TASK: 🎯, EVENT: 🎉)
- point와 exp를 포함한 설명 메시지 생성

### 4. API 연동 구현 (페이지네이션)
- 초기 로드: `GET /api/rewards?page=0&size=10`
- 쿼리 파라미터로 페이지 번호와 크기 전달
- AuthContext의 `useAuth()` 훅으로 accessToken 획득
- accessToken이 있을 때만 API 호출
- 페이지네이션 응답 구조 처리 (`content`, `page` 분리)

### 5. 무한 스크롤 구현
- **IntersectionObserver API** 사용
- 관찰 대상: 보상 목록 마지막 요소
- 트리거 조건:
  - 관찰 대상이 화면에 보임
  - 다음 페이지가 존재 (`hasMore`)
  - 현재 로딩 중이 아님 (`!isLoadingMore && !loading`)
- 자동으로 다음 페이지 데이터 로드 및 누적

### 6. 상태 관리
- `loading`: 초기 API 요청 진행 상태
- `isLoadingMore`: 추가 페이지 로딩 상태
- `error`: 에러 메시지
- `rewards`: 변환된 보상 데이터 배열 (누적)
- `totalPoints`: 누적 포인트 (페이지마다 증가)
- `currentPage`: 현재 페이지 번호
- `hasMore`: 다음 페이지 존재 여부

### 7. UI 구현
- **초기 로딩 상태**: 스피너 애니메이션 및 "보상 정보를 불러오는 중..." 메시지
- **에러 상태**: 경고 아이콘, 에러 메시지, 재시도 버튼
- **빈 데이터 상태**: 보상이 없을 때 안내 메시지
- **성공 상태**: 보상 목록 표시 (시간순 정렬)
- **추가 로딩 상태**: 보상 목록 하단에 작은 스피너 표시

## 주의사항

### 인증 토큰 관리
- AuthContext의 `useAuth()` 훅을 사용하여 accessToken 관리
- accessToken이 없으면 API 호출을 건너뛰고 빈 데이터 상태 표시
- AuthContext가 앱 시작 시 자동으로 토큰 발급 및 갱신 관리

### 에러 처리
- 네트워크 에러, 타임아웃, 인증 실패 등 모든 에러를 포괄적으로 처리
- 사용자에게 명확한 에러 메시지 제공
- 재시도 기능 제공 (페이지 새로고침)

### 데이터 매핑 제한사항
- 현재 sourceId를 사용하지 않음 (추후 Task 정보 조회로 개선 가능)
- 모든 보상의 type이 "points"로 고정 (추후 업적, 뱃지 구분 추가 가능)
- isNew는 항상 false (추후 최근 획득 시간 기반 판단 로직 추가 가능)

### 무한 스크롤 동작
1. 사용자가 페이지를 처음 열면 `page=0&size=10`으로 첫 10개 보상 로드
2. 사용자가 스크롤을 내려 목록 하단에 도달하면 IntersectionObserver가 감지
3. 다음 페이지가 있으면 (`hasMore=true`) 자동으로 `page=1&size=10` 호출
4. 새로운 데이터를 기존 목록에 추가하고 총 포인트 업데이트
5. 모든 페이지를 로드하면 (`hasMore=false`) 더 이상 API 호출하지 않음

### 성능 최적화
- `useCallback`으로 fetchRewards 함수 메모이제이션
- IntersectionObserver cleanup으로 메모리 누수 방지
- 불필요한 재렌더링 방지 (의존성 배열 최적화)
