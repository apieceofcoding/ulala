# 프로필 통계 API 연동 기능 명세서

**상태**: ✅ 구현 완료 (2025-11-06)
**구현된 파일**:
- app/types/member.ts (수정)
- app/routes/profile.tsx (수정)

**주요 변경사항**:
- 로컬스토리지 기반 통계 계산을 백엔드 API 데이터로 전환
- Member 타입에 level, point, exp, requiredExp 필드 추가
- 경험치 바를 실제 API 데이터 기반으로 표시
- 활동 통계 섹션에 레벨/포인트/경험치 정보 반영

## 개요

프로필(내정보) 페이지에서 사용자의 레벨, 포인트, 경험치, 필요 경험치를 백엔드 API로부터 받아와 표시합니다.

### 목적과 필요성
- 로컬스토리지 기반 계산의 부정확성 제거
- 서버에서 관리하는 정확한 게임 데이터 표시
- 여러 디바이스에서 동일한 통계 확인 가능
- 레벨업, 경험치 획득 등 게이미피케이션 요소 강화

## 요구사항

### 기능적 요구사항

1. **Member 타입 확장**
   - level: Int → number (레벨)
   - point: BigDecimal → number (누적 포인트)
   - exp: BigDecimal → number (현재 경험치)
   - requiredExp: BigDecimal → number (레벨업에 필요한 경험치)

2. **프로필 헤더 개선**
   - 레벨과 포인트를 함께 표시
   - 경험치 진행률 바 표시 (exp/requiredExp)
   - 경험치 수치 표시

3. **활동 통계 개선**
   - 현재 레벨
   - 누적 포인트
   - 현재 경험치
   - 필요 경험치

4. **로컬스토리지 의존성 제거**
   - totalTodos, totalPoints 계산 로직 제거
   - 샘플 데이터 기반 연속 달성, 완료율 제거
   - API 데이터만 사용

### 비기능적 요구사항
- 로그인 전에는 기본값 표시 (레벨 1, 포인트/경험치 0)
- 모바일 우선 반응형 디자인 유지
- 라이트/다크 모드 지원 유지
- 기존 디자인 가이드 준수

### API 명세

#### MemberResponse (GET /api/members/me)
```typescript
interface MemberResponse {
  id: string;
  username: string;
  displayName: string | null;
  imageUrl: string | null;
  level: number;
  point: number;
  exp: number;
  requiredExp: number;
}
```

## 구현 세부 내용

### 1. Member 타입 업데이트 (app/types/member.ts)

**변경 전**:
```typescript
export interface Member {
  id: string;
  username: string;
  displayName: string | null;
  imageUrl: string | null;
  level: string;
}
```

**변경 후**:
```typescript
export interface Member {
  id: string;
  username: string;
  displayName: string | null;
  imageUrl: string | null;
  level: number;
  point: number;
  exp: number;
  requiredExp: number;
}
```

### 2. 프로필 페이지 수정 (app/routes/profile.tsx)

#### 상태 관리 단순화
**제거된 상태**:
- `totalTodos` - 로컬스토리지 기반 할 일 개수 계산
- `totalPoints` - 로컬스토리지 기반 포인트 계산
- `streak` - 샘플 데이터
- `completionRate` - 샘플 데이터

**사용하는 데이터**:
```typescript
const level = member?.level ?? 1;
const point = member?.point ?? 0;
const exp = member?.exp ?? 0;
const requiredExp = member?.requiredExp ?? 100;
const experiencePercent = requiredExp > 0 ? (exp / requiredExp) * 100 : 0;
```

#### 프로필 헤더 UI

**레벨 정보**:
```tsx
<div className="flex items-center gap-2 mb-4">
  <span className="body-text">레벨 {level}</span>
  <span className="caption-text">• {point} 포인트</span>
</div>
```

**경험치 바**:
```tsx
<div className="w-full">
  <div className="flex items-center justify-center gap-2 mb-2">
    <span className="caption-text whitespace-nowrap">경험치</span>
    <span className="caption-text font-semibold whitespace-nowrap">
      {exp.toFixed(0)}/{requiredExp.toFixed(0)}
    </span>
  </div>
  <div className="w-full h-2 bg-bg-tertiary dark:bg-bg-tertiary-dark rounded-full overflow-hidden">
    <div
      className="h-2 bg-primary transition-all duration-300 rounded-full"
      style={{ width: `${experiencePercent}%` }}
    ></div>
  </div>
</div>
```

#### 활동 통계 섹션

**변경 전**: 샘플 데이터 기반 완료한 할 일, 연속 달성, 완료율

**변경 후**: API 데이터 기반 레벨, 포인트, 경험치, 필요 경험치
```tsx
{member && (
  <div className="card-default">
    <h3 className="heading-secondary mb-4">활동 통계</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="card-default text-center">
        <div className="text-2xl font-bold text-primary mb-1">레벨 {level}</div>
        <div className="caption-text">현재 레벨</div>
      </div>
      <div className="card-default text-center">
        <div className="text-2xl font-bold text-accent mb-1">
          {point.toFixed(0)}
        </div>
        <div className="caption-text">누적 포인트</div>
      </div>
      <div className="card-default text-center">
        <div className="text-2xl font-bold text-secondary mb-1">
          {exp.toFixed(0)}
        </div>
        <div className="caption-text">현재 경험치</div>
      </div>
      <div className="card-default text-center">
        <div className="text-2xl font-bold text-success mb-1">
          {requiredExp.toFixed(0)}
        </div>
        <div className="caption-text">필요 경험치</div>
      </div>
    </div>
  </div>
)}
```

### 3. 데이터 초기화 함수 수정

**변경 전**: 로컬스토리지의 보상, 할 일 데이터 제거
**변경 후**: 설정 관련 로컬스토리지만 제거

```typescript
const handleResetData = () => {
  if (confirm("로컬 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
    localStorage.removeItem("ulala-dark-mode");
    localStorage.removeItem("ulala-notifications");
    alert("로컬 데이터가 초기화되었습니다.");
    window.location.reload();
  }
};
```

## 주요 개선사항

### 1. 데이터 정확성
- 로컬스토리지 기반 계산 → 서버 데이터 사용
- 여러 디바이스에서 동일한 통계 표시

### 2. 게이미피케이션 강화
- 실시간 경험치 진행률 표시
- 레벨업까지 필요한 경험치 명확히 표시
- 포인트 획득 현황 확인 가능

### 3. 코드 단순화
- 불필요한 로컬스토리지 계산 로직 제거
- 샘플 데이터 의존성 제거
- AuthContext의 member 정보만 사용

### 4. 일관성
- 다른 페이지(records, rewards)와 동일한 데이터 소스 사용
- 통일된 데이터 관리 방식

## 체크리스트

### 구현 전 확인사항
- [x] API 명세서 확인 (MemberResponse)
- [x] Member 타입 필드 타입 확인 (number)
- [x] AuthContext에서 member 정보 제공 확인

### 구현 중 확인사항
- [x] Member 타입 업데이트
- [x] 프로필 헤더 UI 수정
- [x] 활동 통계 섹션 수정
- [x] 로컬스토리지 기반 계산 로직 제거
- [x] 경험치 진행률 계산 구현

### 구현 후 확인사항
- [x] 타입 체크 통과
- [x] 린트 검사 통과 (기존 경고만 존재)
- [x] 로그인 전 기본값 표시 확인
- [x] 로그인 후 API 데이터 표시 확인
- [x] 경험치 바 진행률 계산 정확성
- [x] 디자인 가이드라인 준수

## 테스트 시나리오

1. **로그인 전 상태**
   - 레벨 1, 포인트/경험치 0 표시
   - 활동 통계 섹션 숨김

2. **로그인 후 상태**
   - API에서 받아온 레벨/포인트/경험치 표시
   - 경험치 바 진행률 정확히 표시
   - 활동 통계 섹션에 4가지 정보 표시

3. **경험치 진행률**
   - exp=50, requiredExp=100 → 50% 진행률
   - exp=0, requiredExp=100 → 0% 진행률
   - exp=100, requiredExp=100 → 100% 진행률

4. **숫자 표시 형식**
   - 소수점 없이 정수로 표시 (.toFixed(0))
   - 큰 숫자도 읽기 쉽게 표시

## 향후 개선 방향

1. **실시간 업데이트**
   - 할 일 완료 시 경험치/포인트 자동 갱신
   - WebSocket 또는 주기적 polling

2. **추가 통계**
   - 연속 달성 일수 (서버에서 계산)
   - 완료율 (서버에서 계산)
   - 주간/월간 통계

3. **레벨업 애니메이션**
   - 레벨업 시 축하 애니메이션
   - 새로운 레벨 달성 알림

4. **경험치 상세 정보**
   - 경험치 획득 내역
   - 레벨별 보상 안내

## 주의사항

### 데이터 타입
- 백엔드 BigDecimal → 프론트엔드 number 변환
- 소수점 처리: toFixed(0)로 정수 표시
- null 체크: Nullish coalescing (??) 사용

### 성능
- member 정보는 AuthContext에서 한 번만 조회
- 불필요한 재계산 없음
- 조건부 렌더링으로 최적화

### UI/UX
- 로그인 전에도 기본 UI 표시
- 경험치 바는 항상 0-100% 범위
- 큰 숫자는 읽기 쉽게 포맷팅
