# 홈 화면 울랄라 캐릭터 기능 명세서

**상태**: ✅ 구현 완료 (2025-01-15)

**구현된 파일**:
- `app/types/character.ts` - 캐릭터 관련 타입 정의
- `app/api/endpoints.ts` - 캐릭터 API 엔드포인트 추가
- `app/hooks/useGameLoop.ts` - 게임 물리 엔진 훅
- `app/components/character/Character.tsx` - 캐릭터 렌더링 컴포넌트
- `app/components/character/MapControls.tsx` - 모바일 컨트롤 컴포넌트
- `app/components/character/CharacterMap.tsx` - 맵 및 게임 로직 컴포넌트
- `app/components/character/HomeCharacter.tsx` - 전체 래퍼 컴포넌트
- `app/components/Home.tsx` - 홈 화면 통합

**주요 변경사항**:
- requestAnimationFrame 기반 60fps 게임 루프 구현
- 키보드(화살표 키, WASD, Space) 및 터치 입력 지원
- 4가지 캐릭터 스타일 (happy, cool, cute, energetic) 이모지로 구현
- 상태별 애니메이션 (idle, walk, jump) 구현
- prefers-reduced-motion 접근성 지원
- 현재 로컬 캐릭터 생성 시뮬레이션 (API 연동 준비 완료)

## 개요

홈 화면에 사용자의 울랄라 캐릭터를 표시하고, 캐릭터가 없는 사용자에게는 캐릭터 생성 기능을 제공합니다. 캐릭터는 작은 맵에서 좌우로 이동하고 점프할 수 있는 인터랙티브한 경험을 제공합니다.

## 요구사항

### 기능적 요구사항

- 로그인한 사용자 대상으로만 제공
- 캐릭터가 없는 경우: "캐릭터 생성하기" 버튼 표시
- 캐릭터가 있는 경우: 귀여운 울랄라 캐릭터 표시
- 캐릭터 생성 버튼 클릭 시 캐릭터 생성 및 화면에 표시
- API 연동을 위한 확장 가능한 구조

#### 캐릭터 인터랙션

- **작은 맵**: 캐릭터가 움직일 수 있는 제한된 공간 (예: 300-400px 너비)
- **좌우 이동**: 키보드 화살표 키 또는 터치/버튼으로 좌우 이동
- **점프**: 스페이스바 또는 점프 버튼으로 점프 액션
- **물리**: 중력, 바닥 충돌 등 기본 물리 법칙 적용
- **맵 경계**: 캐릭터가 맵 밖으로 나가지 않도록 제한
- **애니메이션**: 걷기, 점프, idle 상태별 애니메이션

### 비기능적 요구사항

- 캐릭터 이미지는 SVG 또는 이모지를 활용하여 경량화
- 로딩 상태 표시
- 에러 처리 (캐릭터 생성 실패 시)
- 모바일 우선 반응형 디자인
- 60fps 부드러운 애니메이션 (requestAnimationFrame 사용)
- 터치 디바이스와 키보드 모두 지원
- 성능 최적화 (불필요한 리렌더링 방지)

## 디자인 고려사항

### docs/design-guide.md 적용

- **색상 시스템**:
  - 맵 배경: `bg-surface-secondary`
  - 맵 바닥: `bg-border-strong` 또는 그라데이션
  - 버튼: Primary 버튼 스타일 적용
  - 캐릭터 강조: Brand 색상 활용
  - 컨트롤 버튼 (모바일): Secondary 버튼 스타일

- **컴포넌트**:
  - 8px 기반 간격 시스템
  - 둥근 모서리(`rounded-3` = 12px)
  - 부드러운 그림자 효과
  - 버튼 5가지 상태 구현 (기본/hover/active/disabled/loading)

- **레이아웃**:
  - 카드 형태로 맵 영역 구성
  - 맵: 가로 비율 유지 (예: 16:9 또는 2:1)
  - 모바일 컨트롤: 맵 하단에 좌/우/점프 버튼 배치
  - 적절한 여백(padding)

- **접근성**:
  - 버튼에 적절한 aria-label
  - 키보드 접근성 (화살표 키, 스페이스바)
  - 로딩/에러 상태의 스크린 리더 지원
  - 모션을 선호하지 않는 사용자를 위한 `prefers-reduced-motion` 대응

- **애니메이션**:
  - 부드러운 트랜지션 (150-300ms)
  - 점프: ease-out 곡선 사용
  - 이동: linear 또는 ease 곡선
  - 캐릭터 idle 애니메이션: 미묘한 흔들림 또는 깜빡임

## 구현 계획

### 1단계: 컴포넌트 구조 설계

- `HomeCharacter` 컴포넌트: 전체 래퍼
- `CharacterMap` 컴포넌트: 맵과 캐릭터를 포함하는 게임 영역
- `Character` 컴포넌트: 캐릭터 렌더링 및 애니메이션
- `MapControls` 컴포넌트: 모바일용 이동/점프 버튼
- 캐릭터 생성 버튼 컴포넌트

### 2단계: 상태 관리

- 캐릭터 존재 여부 상태
- 로딩 상태
- 에러 상태
- 캐릭터 데이터 (이름, 레벨, 스타일 등)
- 게임 물리 상태:
  - 캐릭터 위치 (x, y)
  - 속도 (velocityX, velocityY)
  - 점프 중인지 여부
  - 현재 애니메이션 상태 (idle/walk/jump)
  - 바라보는 방향 (left/right)

### 3단계: API 연동 준비

- API 엔드포인트 정의 (`app/api/endpoints.ts`)
  - `GET /api/members/{memberId}/character` - 캐릭터 조회
  - `POST /api/members/{memberId}/character` - 캐릭터 생성
- API 클라이언트 함수 작성
- 타입 정의 (Character 인터페이스)

### 4단계: 게임 물리 엔진

- `useGameLoop` 커스텀 훅: requestAnimationFrame 기반 게임 루프
- 중력 시뮬레이션 (예: 0.5px/frame²)
- 이동 속도 (예: 3-5px/frame)
- 점프 속도 (예: -10px/frame)
- 충돌 감지 (바닥, 좌우 경계)
- 키보드 입력 처리 (ArrowLeft/Right, Space)
- 터치/클릭 입력 처리

### 5단계: 캐릭터 디자인

- 귀여운 울랄라 캐릭터 SVG 또는 이모지 조합
- 상태별 스프라이트/스타일:
  - Idle: 기본 서 있는 자세
  - Walk: 걷는 애니메이션
  - Jump: 점프 자세
- 캐릭터 다양성 (랜덤 스타일 또는 사용자 선택)
- 좌우 반전 (transform: scaleX(-1))

### 6단계: 통합

- 홈 화면(`app/routes/_index.tsx`)에 통합
- 인증 상태 확인
- 에러 핸들링 및 폴백 UI
- 게임 루프 최적화 (컴포넌트 언마운트 시 정리)

## 테스트 계획

### 테스트 시나리오

1. 비로그인 사용자: 캐릭터 영역 미표시
2. 로그인 + 캐릭터 없음: "캐릭터 생성하기" 버튼 표시
3. 캐릭터 생성 버튼 클릭: 로딩 → 캐릭터 생성 → 캐릭터 표시
4. 로그인 + 캐릭터 있음: 캐릭터 즉시 표시
5. API 에러 발생: 에러 메시지 표시

#### 캐릭터 인터랙션 테스트

6. 키보드 좌우 화살표: 캐릭터가 좌우로 이동
7. 스페이스바: 캐릭터가 점프
8. 맵 경계: 캐릭터가 맵 밖으로 나가지 않음
9. 모바일 컨트롤 버튼: 터치로 이동/점프 동작
10. 연속 점프 방지: 공중에서는 점프 불가
11. 애니메이션 전환: idle ↔ walk ↔ jump 상태 전환 확인
12. 성능: 60fps 유지 확인

### 검증 방법

- 각 상태별 UI 렌더링 확인
- 버튼 상호작용 테스트
- 반응형 디자인 확인 (모바일/데스크톱)
- 접근성 검증 (키보드 네비게이션, 모바일 터치)
- 라이트/다크 모드 확인
- 브라우저 개발자 도구로 FPS 모니터링
- 다양한 디바이스에서 터치 입력 테스트
- `prefers-reduced-motion` 설정 테스트

## 데이터 구조 예시

```typescript
interface Character {
  id: string;
  memberId: string;
  name: string;
  style: 'happy' | 'cool' | 'cute' | 'energetic';
  level: number;
  createdAt: string;
}

interface GameState {
  x: number;              // 캐릭터 X 위치
  y: number;              // 캐릭터 Y 위치
  velocityX: number;      // X축 속도
  velocityY: number;      // Y축 속도
  isJumping: boolean;     // 점프 중인지
  direction: 'left' | 'right';  // 바라보는 방향
  animationState: 'idle' | 'walk' | 'jump';  // 애니메이션 상태
}

interface GameConfig {
  mapWidth: number;       // 맵 너비
  mapHeight: number;      // 맵 높이
  characterSize: number;  // 캐릭터 크기
  gravity: number;        // 중력 가속도
  moveSpeed: number;      // 이동 속도
  jumpSpeed: number;      // 점프 초기 속도
}
```

## 향후 확장 가능성

- 캐릭터 커스터마이징 (색상, 액세서리 등)
- 캐릭터 레벨업 시스템
- 캐릭터 상태 변화 (기분, 활동 등)
- 캐릭터와 상호작용 기능
- 맵에 장애물, 아이템 추가
- 더블 점프, 대시 등 추가 액션
- 배경 음악 및 효과음
- 멀티플레이어 (다른 사용자 캐릭터 표시)
