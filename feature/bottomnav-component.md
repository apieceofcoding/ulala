# BottomNav 컴포넌트 기능 명세서

**상태**: ✅ 구현 완료 (2025-09-20)
**구현된 파일**:
- `app/components/BottomNav.tsx` - 메인 컴포넌트 (4개 탭 + 아이콘)
- `app/routes/records.tsx` - 기록 페이지
- `app/routes/rewards.tsx` - 보상 페이지
- `app/routes/profile.tsx` - 내정보 페이지
- `test/BottomNav.test.tsx` - 테스트 파일
**주요 변경사항**: 하단 네비게이션, 4개 페이지, 반응형 컨테이너 적용 완료

## 개요
화면 하단에 고정되는 탭 네비게이션 컴포넌트로, 주요 4개 섹션 간 이동을 제공합니다.

## 요구사항

### 기능적 요구사항
1. **4개 탭 구성**: "홈", "기록", "보상", "내정보"
2. **아이콘 + 텍스트**: 각 탭은 아이콘과 텍스트로 구성
3. **활성 상태 표시**: 현재 탭은 파란색 + underline, 비활성 탭은 회색
4. **하단 고정**: 모바일 화면 하단에 고정 위치
5. **균등 분배**: flex를 사용하여 4개 탭을 동일한 너비로 배치
6. **페이지 이동**: 탭 클릭 시 해당 페이지로 라우팅

### 비기능적 요구사항
- 모든 디바이스에서 터치 친화적
- 빠른 반응성과 부드러운 전환
- 접근성 기준 준수
- React Router와 연동

## 디자인 고려사항

### docs/design-guide.md 적용 원칙
1. **색상 시스템**:
   - 활성 탭: `--color-primary` (파란색)
   - 비활성 탭: `--color-neutral-fg-3` (회색)
   - 배경: `--color-neutral-bg-1` (흰색)
   - 경계선: `--color-neutral-fg-3` (상단 보더)

2. **타이포그래피**:
   - 탭 텍스트: `--font-size-caption` (12px)
   - 폰트 weight: 활성 `font-semibold`, 비활성 `font-normal`

3. **간격 시스템**:
   - 탭 높이: 64px (8px 기반)
   - 내부 패딩: `--spacing-s` (8px)
   - 아이콘-텍스트 간격: 4px

4. **접근성**:
   - 최소 44px 터치 영역
   - 명확한 활성 상태 표시
   - 키보드 네비게이션 지원

### 아이콘 디자인
- **홈**: 집 모양 아이콘
- **기록**: 차트/그래프 아이콘
- **보상**: 선물/트로피 아이콘
- **내정보**: 사용자/프로필 아이콘
- **크기**: 20x20px
- **스타일**: 선형(outline) 스타일

## 구현 계획

### 1단계: 기본 구조 생성
- `app/components/BottomNav.tsx` 파일 생성
- 4개 탭 기본 레이아웃 구성

### 2단계: 아이콘 및 스타일링
- 각 탭별 SVG 아이콘 추가
- 활성/비활성 상태 스타일링
- 하단 고정 위치 설정

### 3단계: 라우팅 연동
- React Router NavLink 활용
- 현재 경로에 따른 활성 탭 표시
- 페이지 이동 기능 구현

### 4단계: 임시 페이지 생성
- 각 탭에 해당하는 빈 페이지 생성
- 기본 라우팅 설정

### 구현된 파일 구조
```
app/
├── components/
│   └── BottomNav.tsx        # ✅ 메인 컴포넌트 (NavLink + 4개 탭)
├── routes/
│   ├── home.tsx            # ✅ 홈 (BottomNav 적용)
│   ├── records.tsx         # ✅ 기록 페이지
│   ├── rewards.tsx         # ✅ 보상 페이지
│   └── profile.tsx         # ✅ 내정보 페이지
test/
└── BottomNav.test.tsx       # ✅ 테스트 파일 (3개 테스트 통과)
```

## 상세 구현 방안

### 컴포넌트 구조
```tsx
<nav className="fixed bottom-0 left-0 right-0 bg-[--color-neutral-bg-1] border-t border-[--color-neutral-fg-3]">
  <div className="mx-auto max-w-none lg:max-w-6xl xl:max-w-6xl">
    <div className="flex">
      {tabs.map(tab => (
        <NavLink key={tab.path} to={tab.path} className="flex-1 flex flex-col items-center py-2">
          <Icon />
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </div>
  </div>
</nav>
```

### 탭 데이터 구조
```typescript
interface Tab {
  path: string;
  label: string;
  icon: React.ComponentType;
}

const tabs: Tab[] = [
  { path: '/', label: '홈', icon: HomeIcon },
  { path: '/records', label: '기록', icon: ChartIcon },
  { path: '/rewards', label: '보상', icon: GiftIcon },
  { path: '/profile', label: '내정보', icon: UserIcon },
];
```

### 활성 상태 스타일링
```tsx
// NavLink의 className 함수 활용
className={({ isActive }) =>
  `flex-1 flex flex-col items-center py-2 min-h-[44px] transition-colors duration-150 ${
    isActive
      ? 'text-[--color-primary] border-b-2 border-[--color-primary]'
      : 'text-[--color-neutral-fg-3] hover:text-[--color-neutral-fg-2]'
  }`
}
```

### 반응형 컨테이너
- TopBar와 동일한 반응형 컨테이너 패턴 적용
- 넓은 화면에서 최대 1200px로 제한

## 페이지 레이아웃 조정

### 메인 레이아웃 변경
```tsx
// 기존 home.tsx 구조 예시
<>
  <TopBar />
  <main>
    <Outlet /> {/* 각 페이지 컨텐츠 */}
  </main>
  <BottomNav />
</>
```

### 하단 여백 처리
- 메인 콘텐츠에 `pb-16` (64px) 여백 추가
- BottomNav 높이만큼 공간 확보

## 테스트 계획

### 테스트 시나리오
1. **렌더링 테스트**:
   - 4개 탭이 올바르게 표시되는지 확인
   - 각 탭의 아이콘과 텍스트 렌더링 확인

2. **네비게이션 테스트**:
   - 탭 클릭 시 올바른 경로로 이동하는지 확인
   - 현재 경로에 따른 활성 탭 표시 확인

3. **스타일링 테스트**:
   - 활성/비활성 탭의 색상 차이 확인
   - 반응형 레이아웃 확인

### 구현된 테스트
1. ✅ 4개 탭 렌더링 확인
2. ✅ 네비게이션 링크 경로 확인
3. ✅ 접근성 속성 확인

### 검증 방법
- Vitest + React Testing Library로 단위 테스트 (3개 테스트 통과)
- NavLink 모킹으로 라우터 컨텍스트 문제 해결
- 접근성 테스트 (네비게이션 role, 링크 확인)

## 성능 고려사항
- 아이콘 SVG 최적화로 번들 크기 최소화
- NavLink의 내장 최적화 활용
- 불필요한 리렌더링 방지

## 향후 확장 가능성
- 탭별 뱃지/알림 표시 기능
- 탭 순서 커스터마이징
- 다국어 지원
- 다크 모드 최적화