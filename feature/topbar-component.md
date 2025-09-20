# TopBar 컴포넌트 기능 명세서

**상태**: ✅ 구현 완료 (2025-09-20)
**구현된 파일**:
- `app/components/TopBar.tsx` - 메인 컴포넌트 (동적 탭 이름 + 햄버거 메뉴)
- `app/types/navigation.ts` - 네비게이션 타입 정의
- `app/routes/home.tsx` - 페이지 레이아웃 조정
- `test/TopBar.test.tsx` - 테스트 파일
**주요 변경사항**: 모바일 퍼스트, 스크롤 동작, 반응형 컨테이너, 햄버거 메뉴 아이콘, 동적 탭 이름 적용 완료

## 개요
페이지 상단의 네비게이션 바 컴포넌트로, 모바일 퍼스트 원칙과 반응형 컨테이너를 적용하여 모든 화면에서 최적화된 사용자 경험을 제공합니다.

## 핵심 기능

### 기본 요구사항
1. **동적 탭 이름 표시**: 현재 하단 네비게이션 탭에 따른 이름 표시 ("홈", "기록", "보상", "내정보")
2. **레벨 표시**: 중앙에 현재 레벨 표시 (예: "Lv.1")
3. **메뉴 버튼**: 오른쪽에 햄버거 메뉴 아이콘 버튼 배치
4. **스크롤 동작**: 페이지와 함께 자연스럽게 스크롤

### 모바일 퍼스트 최적화
1. **반응형 간격**: 모바일 8px, 태블릿+ 16px 패딩
2. **반응형 텍스트**: 화면 크기에 따른 서비스명 표시 최적화
3. **터치 친화적**: 최소 44x44px 터치 영역 보장
4. **반응형 컨테이너**: 넓은 화면에서 최대 1200px로 제한, 중앙 정렬

## 디자인 시스템 적용

### docs/design-guide.md 준수 사항
- **색상 시스템**: Fluent 2 기반 커스텀 테마 사용
- **타이포그래피**: 일관된 폰트 크기와 weight
- **간격 시스템**: 8px 기반 spacing 토큰
- **접근성**: WCAG AA 기준 준수
- **반응형**: 모바일 우선 중단점 (md: 768px)

## 구현 세부사항

### 파일 구조
```
app/
├── components/
│   └── TopBar.tsx           # ✅ 메인 컴포넌트 (모바일 퍼스트)
test/
└── TopBar.test.tsx          # ✅ 테스트 파일
```

### 주요 특징
- **고정 높이**: 56px (h-14)
- **스크롤 동작**: 일반 위치로 페이지와 함께 스크롤
- **반응형 컨테이너**: 넓은 화면에서 최대 1200px 제한
- **내장 아이콘**: SVG 햄버거 메뉴 아이콘 포함
- **반응형 클래스**: Tailwind md: 중단점 활용

### 반응형 구현
```tsx
// 반응형 컨테이너: 넓은 화면에서 최대 1200px
<div className="bg-[--color-neutral-bg-1] border-b border-[--color-neutral-fg-3]">
  <div className="mx-auto max-w-none lg:max-w-6xl xl:max-w-6xl">

// 서비스명: 모바일에서 축약
<span className="text-sm font-semibold md:text-[length:--font-size-heading-secondary]">
  <span className="md:hidden">울랄라</span>
  <span className="hidden md:inline">울랄라 (ulala)</span>
</span>

// 간격: 모바일 8px, 태블릿+ 16px
<div className="px-2 md:px-[--spacing-m]">

// 터치 영역: 최소 44px 보장
<button className="w-11 h-11 min-w-[44px] min-h-[44px]">
```

## 컴포넌트 인터페이스

### Props
```typescript
interface TopBarProps {
  level?: number;              // 현재 레벨 (기본값: 1)
  onSettingsClick?: () => void; // 메뉴 버튼 클릭 핸들러 (사용자 설정 메뉴)
  className?: string;          // 추가 CSS 클래스
}
```

### 사용 예시
```tsx
import { TopBar } from '~/components/TopBar';

// 기본 사용
<TopBar />

// 커스텀 레벨과 핸들러
<TopBar
  level={5}
  onSettingsClick={() => console.log('메뉴 클릭')}
/>

// 페이지 레이아웃에 적용 (자연스러운 흐름)
<>
  <TopBar level={userLevel} onSettingsClick={handleSettings} />
  <MainContent /> {/* TopBar와 함께 스크롤 */}
</>
```

## 테스트 커버리지

### 구현된 테스트
1. ✅ 서비스명 렌더링 확인
2. ✅ 기본 레벨(1) 표시 확인
3. ✅ 커스텀 레벨 표시 확인
4. ✅ 메뉴 버튼 aria-label 확인
5. ✅ 메뉴 버튼 클릭 이벤트 확인
6. ✅ 커스텀 className 적용 확인

### 추가 테스트 권장사항
- 다양한 화면 크기에서 반응형 동작 확인
- 키보드 네비게이션 테스트
- 터치 디바이스에서 인터랙션 테스트

## 성능 고려사항
- CSS transform 속성 사용으로 하드웨어 가속 활용
- 불필요한 리렌더링 방지를 위한 최적화된 클래스 구조
- 모바일에서 빠른 터치 반응성 확보

## 향후 개선 사항
- 다국어 지원 시 서비스명 국제화
- 사용자 설정에 따른 레벨 표시 형식 커스터마이징
- 다크 모드 전환 애니메이션 추가