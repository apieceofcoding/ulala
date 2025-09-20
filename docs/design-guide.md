# Ulala Frontend Design Guide

Microsoft Fluent 2 디자인 시스템을 기반으로 하되, Ulala 서비스의 디자인 원칙을 반영한 프론트엔드 디자인 가이드입니다.

## 핵심 디자인 원칙

### 1. 일관성 (Consistency)
- 모든 화면에서 버튼, 컬러, 폰트, 간격을 동일하게 사용
- 동일한 기능은 동일한 UI 패턴으로 구현
- 디자인 토큰 시스템을 통한 일관된 스타일 적용

### 2. 가독성 (Readability)
- 충분한 텍스트 크기와 줄 간격으로 읽기 쉬운 디자인
- WCAG 기준(최소 4.5:1) 이상의 색상 대비
- 명확한 정보 계층 구조

### 3. 단순성 (Simplicity)
- 한 화면에는 필요한 정보만 배치
- 핵심 행동(CTA)을 가장 눈에 띄는 곳에 배치
- 2-3단계의 단순한 텍스트 위계

## 색상 시스템 (Color System)

### Tailwind 커스텀 테마 설정
Fluent 2 디자인 시스템의 색상을 Tailwind CSS 테마로 적용합니다.

#### @tailwind/theme.css 설정 (v4)
```css
@import "tailwindcss";

@theme {
  --color-primary: #0078d4;
  --color-primary-hover: #106ebe;
  --color-primary-pressed: #005a9e;
  --color-primary-disabled: #a19f9d;

  --color-secondary: #605e5c;
  --color-secondary-hover: #484644;
  --color-secondary-pressed: #323130;

  --color-accent: #8764b8;
  --color-accent-hover: #744da9;
  --color-accent-pressed: #5a2d91;

  --color-neutral-bg-1: #ffffff;
  --color-neutral-bg-2: #fafafa;
  --color-neutral-bg-3: #f5f5f5;
  --color-neutral-fg-1: #323130;
  --color-neutral-fg-2: #605e5c;
  --color-neutral-fg-3: #8a8886;

  --color-success: #107c10;
  --color-success-bg: #dff6dd;

  --color-error: #d83b01;
  --color-error-bg: #fed9cc;

  --color-warning: #ff8c00;
  --color-warning-bg: #fff4ce;

  --color-info: #0078d4;
  --color-info-bg: #deecf9;

  /* 다크 모드 색상 */
  @media (prefers-color-scheme: dark) {
    --color-neutral-bg-1: #1f1f1f;
    --color-neutral-bg-2: #292929;
    --color-neutral-bg-3: #323130;
    --color-neutral-fg-1: #ffffff;
    --color-neutral-fg-2: #d2d0ce;
    --color-neutral-fg-3: #b3b0ad;

    --color-primary: #4cc2ff;
    --color-primary-hover: #6bcbff;
    --color-primary-pressed: #0078d4;
  }
}
```

#### 클래스 기반 다크 모드 지원
```css
@theme {
  /* 기본 라이트 모드 색상들... */

  /* 클래스 기반 다크 모드 */
  .dark {
    --color-neutral-bg-1: #1f1f1f;
    --color-neutral-bg-2: #292929;
    --color-neutral-bg-3: #323130;
    --color-neutral-fg-1: #ffffff;
    --color-neutral-fg-2: #d2d0ce;
    --color-neutral-fg-3: #b3b0ad;

    --color-primary: #4cc2ff;
    --color-primary-hover: #6bcbff;
    --color-primary-pressed: #0078d4;
  }
}
```

### 테마 지원
- 라이트 모드와 다크 모드에서 모든 컬러가 적절한 대비를 유지
- CSS 변수를 통한 동적 색상 토큰 시스템
- 색상만으로 상태를 구분하지 않고 아이콘/텍스트도 함께 제공

## 타이포그래피 (Typography)

### 폰트 시스템 원칙
- **단일 폰트 패밀리 사용**: 일관성을 위해 1개 폰트만 사용
- **명확한 위계**: 제목·본문·캡션 2-3단계로 단순하게 구분
- **충분한 줄 간격**: 1.4~1.6배의 line-height로 가독성 확보

### Tailwind v4 폰트 설정
```css
@theme {
  --font-family-sans: "Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif;

  --font-size-heading-primary: 1.5rem; /* 24px */
  --line-height-heading-primary: 2.25rem; /* 36px */

  --font-size-heading-secondary: 1.25rem; /* 20px */
  --line-height-heading-secondary: 1.875rem; /* 30px */

  --font-size-body: 1rem; /* 16px */
  --line-height-body: 1.5rem; /* 24px */

  --font-size-body-small: 0.875rem; /* 14px */
  --line-height-body-small: 1.3125rem; /* 21px */

  --font-size-caption: 0.75rem; /* 12px */
  --line-height-caption: 1.125rem; /* 18px */
}
```

### 타이포그래피 클래스 (Tailwind 기반)
```jsx
// 제목 (Headlines)
<h1 className="text-[length:--font-size-heading-primary] leading-[--line-height-heading-primary] font-semibold text-[--color-neutral-fg-1]">
  주요 제목
</h1>

<h2 className="text-[length:--font-size-heading-secondary] leading-[--line-height-heading-secondary] font-semibold text-[--color-neutral-fg-1]">
  부제목
</h2>

// 본문 (Body)
<p className="text-[length:--font-size-body] leading-[--line-height-body] font-normal text-[--color-neutral-fg-2]">
  본문 텍스트
</p>

<p className="text-[length:--font-size-body-small] leading-[--line-height-body-small] font-normal text-[--color-neutral-fg-2]">
  작은 본문 텍스트
</p>

// 캡션 (Caption)
<span className="text-[length:--font-size-caption] leading-[--line-height-caption] font-normal text-[--color-neutral-fg-3]">
  캡션 텍스트
</span>
```

### 다크 모드 타이포그래피
```jsx
<h1 className="text-[length:--font-size-heading-primary] leading-[--line-height-heading-primary] font-semibold text-[--color-neutral-fg-1]">
  다크 모드 지원 제목 (자동 적용)
</h1>

<p className="text-[length:--font-size-body] leading-[--line-height-body] font-normal text-[--color-neutral-fg-2]">
  다크 모드 지원 본문 (자동 적용)
</p>
```

### 가독성 규칙
- 제목과 본문 간 명확한 크기 차이 유지
- 줄 간격은 글자가 "숨 쉴 수 있게" 1.4~1.6배로 설정
- 한 문장은 20자 내외로 간결하게 작성

## 레이아웃 & 간격 시스템 (Layout & Spacing)

### 간격 원칙
- **8px 기반 시스템**: 모든 마진과 패딩은 8px 또는 4px 단위 사용
- **충분한 여백**: 버튼과 입력창 같은 주요 요소 사이에 충분한 여백
- **모바일 우선**: Mobile First 반응형 디자인

### 간격 토큰 (8px 기반)
```css
@theme {
  /* 기본 간격 시스템 */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-s: 0.5rem;     /* 8px */
  --spacing-m: 1rem;       /* 16px */
  --spacing-l: 1.5rem;     /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-xxl: 3rem;     /* 48px */
  --spacing-xxxl: 4rem;    /* 64px */

  /* 컴포넌트별 간격 */
  --spacing-button-padding-x: var(--spacing-m);
  --spacing-button-padding-y: var(--spacing-s);
  --spacing-input-padding-x: var(--spacing-m);
  --spacing-input-padding-y: var(--spacing-s);
  --spacing-card-padding: var(--spacing-m);
  --spacing-section-margin: var(--spacing-xl);
}
```

### 반응형 중단점 (Mobile First)
```css
@theme {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}

/* 모바일 우선 설계 */
.container {
  padding: var(--spacing-m);
}

/* 태블릿 */
@media (width >= 768px) {
  .container {
    padding: var(--spacing-l);
  }
}

/* 데스크톱 */
@media (width >= 1024px) {
  .container {
    padding: var(--spacing-xl);
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

## 컴포넌트 디자인 패턴

### 버튼 (5가지 상태 필수)

#### Primary 버튼 (Tailwind 클래스)
```jsx
// 기본 Primary 버튼
<button className="bg-[--color-primary] text-white px-[--spacing-button-padding-x] py-[--spacing-button-padding-y] rounded text-sm font-semibold border border-transparent transition-all duration-150 hover:bg-[--color-primary-hover] active:bg-[--color-primary-pressed] disabled:bg-[--color-primary-disabled] disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:ring-offset-2">
  기본 버튼
</button>

// Secondary 버튼
<button className="bg-transparent text-[--color-secondary] border border-[--color-secondary] px-[--spacing-button-padding-x] py-[--spacing-button-padding-y] rounded text-sm font-semibold transition-all duration-150 hover:bg-[--color-secondary] hover:text-white focus:outline-none focus:ring-2 focus:ring-[--color-secondary] focus:ring-offset-2">
  보조 버튼
</button>

// 로딩 상태 버튼 (컴포넌트로 구현)
<button className="bg-[--color-primary] text-white px-[--spacing-button-padding-x] py-[--spacing-button-padding-y] rounded text-sm font-semibold border border-transparent transition-all duration-150 relative" disabled>
  <span className="opacity-0">버튼 텍스트</span>
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  </div>
</button>
```

#### 버튼 컴포넌트 클래스 정의
```css
/* app.css에 추가할 기본 버튼 스타일 */
.btn-base {
  @apply px-[--spacing-button-padding-x] py-[--spacing-button-padding-y] rounded text-sm font-semibold border border-transparent transition-all duration-150 cursor-pointer inline-flex items-center justify-center;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply btn-base bg-[--color-primary] text-white hover:bg-[--color-primary-hover] active:bg-[--color-primary-pressed];
  @apply disabled:bg-[--color-primary-disabled] disabled:cursor-not-allowed focus:ring-[--color-primary];
}

.btn-secondary {
  @apply btn-base bg-transparent text-[--color-secondary] border-[--color-secondary];
  @apply hover:bg-[--color-secondary] hover:text-white focus:ring-[--color-secondary];
}

.btn-loading {
  @apply relative;
}

.btn-loading span {
  @apply opacity-0;
}

.btn-loading::after {
  @apply absolute inset-0 flex items-center justify-center;
  content: '';
  background-image: url("data:image/svg+xml,%3csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z' fill='%23fff' fill-opacity='.3'/%3e%3cpath d='M8 1.5V8' stroke='%23fff' stroke-width='2' stroke-linecap='round'/%3e%3c/svg%3e");
  animation: spin 1s linear infinite;
}
```

### 입력 필드 (필수 요소 포함)

#### 기본 입력 필드 (Tailwind 클래스)
```jsx
// 기본 입력 필드 그룹
<div className="flex flex-col gap-1">
  <label className="text-sm font-semibold text-neutral-fg-1">
    이메일 주소
  </label>
  <input
    type="email"
    placeholder="이메일을 입력하세요"
    className="border border-[--color-neutral-fg-3] rounded px-[--spacing-input-padding-x] py-[--spacing-input-padding-y] text-base bg-[--color-neutral-bg-1] text-[--color-neutral-fg-1] placeholder-[--color-neutral-fg-3] transition-colors duration-150 focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:ring-offset-2"
  />
</div>

// 에러 상태 입력 필드
<div className="flex flex-col gap-1">
  <label className="text-sm font-semibold text-neutral-fg-1">
    비밀번호
  </label>
  <input
    type="password"
    className="border border-[--color-error] rounded px-[--spacing-input-padding-x] py-[--spacing-input-padding-y] text-base bg-[--color-neutral-bg-1] text-[--color-neutral-fg-1] placeholder-[--color-neutral-fg-3] transition-colors duration-150 focus:border-[--color-error] focus:outline-none focus:ring-2 focus:ring-[--color-error] focus:ring-offset-2"
  />
  <div className="flex items-center gap-1 text-xs text-[--color-error]">
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zM8 4a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0v-3.5A.75.75 0 0 0 8 4zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
    </svg>
    비밀번호는 8자 이상이어야 합니다
  </div>
</div>
```

#### 입력 필드 컴포넌트 클래스
```css
/* app.css에 추가할 입력 필드 스타일 */
.input-group {
  @apply flex flex-col gap-1;
}

.input-label {
  @apply text-sm font-semibold text-[--color-neutral-fg-1];
}

.input-base {
  @apply border border-[--color-neutral-fg-3] rounded px-[--spacing-input-padding-x] py-[--spacing-input-padding-y] text-base bg-[--color-neutral-bg-1] text-[--color-neutral-fg-1];
  @apply placeholder-[--color-neutral-fg-3] transition-colors duration-150;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.input-default {
  @apply input-base focus:border-[--color-primary] focus:ring-[--color-primary];
}

.input-error {
  @apply input-base border-[--color-error] focus:border-[--color-error] focus:ring-[--color-error];
}

.error-message {
  @apply flex items-center gap-1 text-xs text-[--color-error];
}
```

### 카드 (반복 데이터용)

#### 기본 카드 (Tailwind 클래스)
```jsx
// 기본 카드
<div className="bg-[--color-neutral-bg-1] rounded-lg border border-[--color-neutral-fg-3] shadow-sm p-[--spacing-card-padding] transition-shadow duration-150 hover:shadow-md">
  <h3 className="text-[length:--font-size-heading-secondary] leading-[--line-height-heading-secondary] font-semibold text-[--color-neutral-fg-1] mb-2">
    카드 제목
  </h3>
  <p className="text-[length:--font-size-body] leading-[--line-height-body] text-[--color-neutral-fg-2]">
    카드 내용이 들어갑니다.
  </p>
</div>

// 클릭 가능한 카드
<div className="bg-[--color-neutral-bg-1] rounded-lg border border-[--color-neutral-fg-3] shadow-sm p-[--spacing-card-padding] transition-all duration-150 hover:shadow-md hover:border-[--color-primary] cursor-pointer">
  <h3 className="text-[length:--font-size-heading-secondary] leading-[--line-height-heading-secondary] font-semibold text-[--color-neutral-fg-1] mb-2">
    클릭 가능한 카드
  </h3>
  <p className="text-[length:--font-size-body] leading-[--line-height-body] text-[--color-neutral-fg-2]">
    이 카드는 클릭할 수 있습니다.
  </p>
</div>
```

#### 카드 컴포넌트 클래스
```css
/* app.css에 추가할 카드 스타일 */
.card-base {
  @apply bg-[--color-neutral-bg-1] rounded-lg border border-[--color-neutral-fg-3] shadow-sm p-[--spacing-card-padding];
  @apply transition-shadow duration-150;
}

.card-default {
  @apply card-base hover:shadow-md;
}

.card-clickable {
  @apply card-base hover:shadow-md hover:border-[--color-primary] cursor-pointer;
  @apply transition-all duration-150;
}
```

### 피드백 요소

#### 알림 (Toast)
```css
.toast {
  position: fixed;
  top: var(--spacing-l);
  right: var(--spacing-l);
  padding: var(--spacing-m);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 200ms ease;
}

.toast-success {
  background-color: var(--colorSuccessBackground);
  border-left: 4px solid var(--colorSuccess);
}

.toast-error {
  background-color: var(--colorErrorBackground);
  border-left: 4px solid var(--colorError);
}
```

## 인터랙션 & 모션 (Interaction & Motion)

### 모션 원칙
- **즉각적인 반응**: 클릭, 입력 등 사용자 행동에 즉각적인 시각적 반응
- **빠르고 자연스러운 전환**: 150~300ms 사이의 애니메이션
- **사용성 중심**: 불필요한 모션 제거, 사용성을 돕는 경우에만 적용

### 애니메이션 지속 시간
```css
@theme {
  --duration-fast: 150ms;      /* 버튼 hover, focus */
  --duration-normal: 200ms;    /* 토스트, 모달 등장 */
  --duration-gentle: 300ms;    /* 페이지 전환, 슬라이드 */
}
```

### 이징 함수 (단순화)
```css
@theme {
  --ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);  /* 등장 애니메이션 */
  --ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);     /* 상태 전환 */
  --ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* 강조 효과 */
}
```

### 애니메이션 예시
```css
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## 그림자 시스템 (Elevation)
```css
@theme {
  --shadow-low: 0 2px 4px rgba(0, 0, 0, 0.1);      /* 카드 기본 */
  --shadow-medium: 0 4px 8px rgba(0, 0, 0, 0.15);  /* 카드 hover */
  --shadow-high: 0 8px 16px rgba(0, 0, 0, 0.2);    /* 모달, 드롭다운 */
}
```

## 경계 반지름 (Border Radius)
```css
@theme {
  --border-radius-small: 4px;   /* 버튼, 입력창 */
  --border-radius-medium: 8px;  /* 카드 */
  --border-radius-large: 12px;  /* 큰 카드, 이미지 */
  --border-radius-circle: 50%;  /* 아바타, 아이콘 버튼 */
}
```

## 접근성 가이드라인 (Accessibility)

### 키보드 접근성
- **모든 버튼과 링크는 Tab으로 접근 가능**해야 함
- **명확한 포커스 표시**를 제공
- **논리적인 Tab 순서** 유지

```css
.focusable:focus {
  outline: 2px solid var(--colorPrimary);
  outline-offset: 2px;
  border-radius: var(--border-radius-small);
}
```

### 스크린 리더 지원
- **이미지에는 반드시 alt 텍스트** 작성
- **폼 요소에는 Label 또는 aria-label** 속성 사용
- **상태 변화는 aria-live로 알림**

```html
<!-- 좋은 예시 -->
<img src="profile.jpg" alt="사용자 프로필 사진" />
<label for="email">이메일 주소</label>
<input id="email" type="email" required />
<div aria-live="polite" id="status"></div>
```

### 색상 접근성
- **WCAG AA 기준 (4.5:1) 이상** 색상 대비 유지
- **색상만으로 상태 구분 금지** - 아이콘이나 텍스트 함께 제공

## 콘텐츠 & 카피라이팅 (Content & Copy)

### 버튼 텍스트
- **짧고 동사 중심**으로 작성 (예: "등록하기", "저장됨")
- **사용자가 다음에 할 일을 명확히 안내**

```html
<!-- 좋은 예시 -->
<button>로그인</button>
<button>계정 만들기</button>
<button>저장하기</button>

<!-- 나쁜 예시 -->
<button>확인</button>
<button>OK</button>
<button>계속</button>
```

### 메시지 작성
- **한 문장은 20자 내외**로 간결하게
- **명확하고 구체적인 안내** 제공

## 구현 가이드라인

### 1. Tailwind CSS 기반 구현
- **Tailwind CSS 유틸리티 클래스** 우선 사용
- **Tailwind 커스텀 테마**로 Fluent 2 디자인 토큰 적용
- **@apply 지시문**으로 컴포넌트 스타일 구성

### 2. 일관성 원칙
- 모든 컴포넌트에서 **동일한 Tailwind 유틸리티** 사용
- 동일한 기능은 **동일한 클래스 조합**으로 구현
- **Tailwind 커스텀 테마**를 통한 일관된 스타일링

### 3. 성능 고려사항
- 애니메이션은 **Tailwind transition 유틸리티** 사용
- **150~300ms 내외**로 제한
- **transform과 opacity**만 사용하여 성능 최적화

### 4. 반응형 구현
- **Tailwind 모바일 우선** 반응형 접근법
- **sm: md: lg:** 중단점 사용
- 중단점: sm(640px), md(768px), lg(1024px)

### 5. 다크 모드 지원
- **Tailwind dark:** 수식어 사용
- 모든 컴포넌트는 **라이트/다크 테마 지원** 필수
- 시스템 선호도 자동 감지

### 6. 개발자 가이드
```jsx
// Tailwind v4 클래스 사용 예시
<div className="bg-[--color-neutral-bg-1] text-[--color-neutral-fg-1] p-[--spacing-m] rounded border border-[--color-neutral-fg-3] transition-all duration-[--duration-fast] hover:shadow-[--shadow-medium]">
  <button className="bg-[--color-primary] text-white px-[--spacing-button-padding-x] py-[--spacing-button-padding-y] rounded text-sm font-semibold hover:bg-[--color-primary-hover] focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:ring-offset-2">
    버튼
  </button>
</div>

// 컴포넌트 스타일링 (v4 방식)
.custom-component {
  @apply bg-[--color-neutral-bg-1] text-[--color-neutral-fg-1] p-[--spacing-m] rounded border border-[--color-neutral-fg-3];
  @apply transition-all duration-[--duration-fast] hover:shadow-[--shadow-medium];
}
```

## 체크리스트

### 컴포넌트 구현 시 확인사항
- 5가지 버튼 상태 (기본/hover/active/disabled/loading)를 모두 구현하라
- 입력창에 placeholder, error, focus 상태를 반드시 포함하라
- 모든 요소를 키보드 Tab으로 접근 가능하게 만들어라
- WCAG AA 색상 대비 기준(4.5:1 이상)을 준수하라
- 모바일 우선 반응형 디자인을 적용하라
- 라이트/다크 모드를 지원하라
- 애니메이션은 150-300ms 범위로 제한하라
- 에러 메시지에 아이콘을 함께 포함하라
- 이미지 alt 텍스트와 aria 레이블을 작성하라