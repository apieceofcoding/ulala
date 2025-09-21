# 부드러운 경계선 색상 업데이트 기능 명세서

**상태**: ✅ 구현 완료 (2025-09-21)
**구현된 파일**: docs/design-guide.md, app/app.css, app/components/Home.tsx, app/components/TopBar.tsx, app/components/BottomNav.tsx
**주요 변경사항**: 기존 진한 경계선을 부드러운 색상으로 변경하여 배경과 자연스럽게 어울리도록 개선

## 개요

기존의 `--color-neutral-fg-3` 경계선 색상이 너무 진해서 자연스럽지 못한 문제를 해결하기 위해 새로운 부드러운 경계선 색상 시스템을 도입하고 모든 컴포넌트에 적용합니다.

## 구현된 변경사항

### 1. 디자인 가이드 업데이트 (docs/design-guide.md)

새로운 경계선 색상 변수 추가:

```css
/* 라이트 모드 */
--color-border-soft: #e1dfdd;     /* 가장 부드러운 경계선 */
--color-border-medium: #d2d0ce;   /* 중간 경계선 */
--color-border-subtle: #f3f2f1;   /* 아주 미묘한 경계선 */

/* 다크 모드 */
--color-border-soft: #484644;     /* 다크 모드 부드러운 경계선 */
--color-border-medium: #323130;   /* 다크 모드 중간 경계선 */
--color-border-subtle: #3b3a39;   /* 다크 모드 미묘한 경계선 */
```

### 2. CSS 변수 시스템 업데이트 (app/app.css)

- 새로운 경계선 색상 변수를 CSS 커스텀 속성으로 추가
- 라이트/다크 모드 모두 지원
- 기존 카드 컴포넌트들의 경계선 색상을 `--color-border-soft`로 변경

### 3. 컴포넌트 업데이트

#### Home 컴포넌트 (app/components/Home.tsx)
- Ulala 로고 이미지의 경계선을 `border-[--color-border-soft]`로 변경

#### TopBar 컴포넌트 (app/components/TopBar.tsx)
- 하단 경계선을 `border-b border-[--color-border-soft]`로 변경

#### BottomNav 컴포넌트 (app/components/BottomNav.tsx)
- 상단 경계선을 `border-t border-[--color-border-soft]`로 변경

### 4. 전역 스타일 업데이트

카드 컴포넌트 클래스들의 경계선 색상 업데이트:
- `.card-default`: `border: 1px solid var(--color-border-soft)`
- `.card-clickable`: `border: 1px solid var(--color-border-soft)`

## 적용된 디자인 원칙

1. **일관성**: 모든 컴포넌트에서 동일한 경계선 색상 사용
2. **가독성**: 배경과 적절한 대비를 유지하면서도 자연스러운 시각적 구분
3. **접근성**: 다크 모드에서도 적절한 대비 유지

## 색상 선택 기준

- **라이트 모드**: `#e1dfdd` - 기존 `#8a8886`보다 훨씬 밝고 부드러운 색상
- **다크 모드**: `#484644` - 다크 배경과 조화를 이루는 중간 톤

## 향후 확장 가능성

- `--color-border-medium`: 더 강조가 필요한 경계선용
- `--color-border-subtle`: 아주 미묘한 구분이 필요한 경우용
- 입력 필드, 모달, 드롭다운 등 추가 컴포넌트에 적용 가능