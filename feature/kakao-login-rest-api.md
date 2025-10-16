# 카카오 로그인 REST API 전환 기능 명세서

**상태**: ✅ 구현 완료
**작성일**: 2025-10-07
**최종 수정일**: 2025-10-09
**구현 완료일**: 2025-10-09

**관련 파일**:

- `app/routes/profile.tsx` - 로그인/로그아웃 UI 및 로직
- `app/root.tsx` - SDK 스크립트 제거
- `app/types/kakao.d.ts` - SDK 타입 정의 제거
- `.env.development`, `.env.production` - 환경변수 정리

## 개요

현재 JavaScript SDK를 사용하는 카카오 로그인을 REST API 방식으로 전환합니다.

### 목적과 필요성

- **경량화**: JavaScript SDK 로드 제거로 페이지 로딩 속도 개선
- **제어 강화**: REST API를 통한 직접적인 인증 플로우 제어
- **보안 강화**: 클라이언트 측 SDK 의존성 제거
- **유지보수성**: 서버 중심의 명확한 인증 로직 관리

## 요구사항

### 기능적 요구사항

1. **SDK 제거**
   - root.tsx의 Kakao SDK 스크립트 제거
   - kakao.d.ts 타입 정의 파일 제거
   - SDK 관련 초기화 코드 제거

2. **REST API 기반 로그인**
   - 서버로 로그인 요청 후 인증토큰을 응답 받음

3. **로그인 버튼 개선**
   - 카카오 공식 버튼 이미지 사용 (기존 유지)
   - 클릭 시 서버로 인증 페이지로 이동
   - 로딩 상태는 페이지 전환으로 처리

4. **로그아웃 기능 유지**
   - 서버 로그아웃 API 호출 (기존 방식 유지)
   - HttpOnly Cookie 제거
   - UI 상태 초기화

### 비기능적 요구사항

1. **보안**
   - HTTPS 환경에서 작동
   - HttpOnly Cookie를 통한 안전한 토큰 관리
   - 기존 보안 수준 유지 또는 향상

2. **성능**
   - JavaScript SDK 제거로 초기 로딩 속도 개선
   - 페이지 로드 시간 최소화

3. **호환성**
   - 모바일 환경 정상 동작
   - 모든 주요 브라우저 지원 (Chrome, Safari, Firefox, Edge)

4. **접근성**
   - WCAG AA 기준 준수 (색상 대비 4.5:1)
   - 키보드 접근성 지원
   - 스크린 리더 지원

## 디자인 고려사항

> 이 섹션은 `docs/design-guide.md`의 원칙을 따릅니다.

### 적용할 디자인 원칙

1. **일관성 (Consistency)**
   - 기존 프로필 페이지의 UI 디자인 유지
   - 카카오 공식 브랜딩 가이드 준수
   - 변경 최소화 (SDK → REST API 전환만)

2. **가독성 (Readability)**
   - 명확한 로그인/로그아웃 상태 구분
   - 충분한 버튼 크기와 간격 유지 (8px 기반 시스템)
   - WCAG AA 색상 대비 기준 준수

3. **단순성 (Simplicity)**
   - 직관적인 로그인 프로세스 (1-클릭 로그인)
   - 불필요한 단계 제거
   - 명확한 행동 유도 버튼

4. **자연스러운 구분 (Natural Separation)**
   - 테두리 대신 배경색과 그림자로 요소 구분
   - 카드 컴포넌트의 자연스러운 레이아웃

### 사용할 컴포넌트와 색상 시스템

#### 버튼

- **카카오 공식 로그인 버튼**: 카카오 브랜딩 가이드 준수
- **버튼 상태**: hover, active, focus 상태 적용 (기존 유지)
- **접근성**: 키보드 접근 가능, aria-label 적용

#### 카드

- **프로필 카드**: `card-default` 스타일 (기존 유지)
  ```css
  .card-default {
    @apply bg-[--color-neutral-bg-1] rounded-lg shadow-sm p-[--spacing-card-padding];
    @apply transition-shadow duration-150 hover:shadow-md;
  }
  ```

#### 타이포그래피

- **회원 이름**: `heading-secondary` (1.25rem, 20px)
- **회원 정보**: `body-text` (1rem, 16px)
- **레벨 정보**: `caption-text` (0.75rem, 12px)

#### 색상

- **라이트/다크 모드**: 자동 전환 지원
- **텍스트 색상**: `--color-neutral-fg-1`, `--color-neutral-fg-2`
- **배경 색상**: `--color-neutral-bg-1`, `--color-neutral-bg-2`

### 간격 시스템 (8px 기반)

- 카드 내부 패딩: `--spacing-card-padding` (16px)
- 버튼 패딩: `--spacing-button-padding-x/y` (16px/8px)
- 요소 간 간격: `--spacing-m` (16px), `--spacing-l` (24px)

## 구현 계획

### 1단계: SDK 제거

**파일**: `app/root.tsx`

- Kakao SDK 스크립트 태그 제거
- SDK 초기화 스크립트 제거

```tsx
// 제거할 코드
<script
  src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
  integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
  crossOrigin="anonymous"
  async
/>
<script
  dangerouslySetInnerHTML={{
    __html: `
      (function() {
        function initKakao() {
          if (window.Kakao) {
            if (!window.Kakao.isInitialized()) {
              window.Kakao.init('${import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY || ''}');
              console.log('Kakao SDK initialized:', window.Kakao.isInitialized());
            }
          } else {
            setTimeout(initKakao, 100);
          }
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initKakao);
        } else {
          initKakao();
        }
      })();
    `,
  }}
/>
```

### 2단계: 타입 정의 파일 제거

**파일**: `app/types/kakao.d.ts`

- 파일 삭제 (더 이상 SDK를 사용하지 않으므로)

### 3단계: 로그인 로직 REST API로 변경

**파일**: `app/routes/profile.tsx`

- `handleKakaoLogin` 함수를 REST API 방식으로 변경
- 카카오 인가 코드 요청 URL 직접 생성
- window.location.href로 카카오 인증 페이지 이동

```tsx
const handleKakaoLogin = () => {
  const LOGIN_URL = "https://ulala.p-e.kr/oauth2/authorization/kakao";
  window.location.href = `${LOGIN_URL}`;
};
```

### 4단계: 환경변수 정리

**파일**: `.env.development`, `.env.production`

- `VITE_KAKAO_JAVASCRIPT_KEY`, `VITE_KAKAO_REDIRECT_URI` 제거

### 5단계: 로그아웃 로직 검토

**파일**: `app/routes/profile.tsx`

- 기존 로그아웃 로직 유지 (서버 API 호출 방식)
- SDK 의존성이 없으므로 변경 불필요

## 인증 플로우

### 로그인 프로세스

1. 회원이 "카카오로 시작하기" 버튼 클릭하여 클라이언트에서 서버로 로그인 API 요청하면 응답 redirect로 이동
2. 회원은 카카오 로그인 및 동의
3. 서버에서 Access Token 발급하여 JSON 응답 accessToken 으로 전송
4. 회원 정보 반환 및 UI 업데이트

### 로그아웃 프로세스

1. 회원이 "로그아웃" 버튼 클릭
2. 서버 로그아웃 API 호출
3. 서버에서 HttpOnly Cookie 삭제 및 카카오 로그아웃 처리
4. 클라이언트에서 UI 상태 초기화 (회원 정보 제거)

## API 구조

### 카카오 로그인 요청 URL

```
GET https://ulala.p-e.kr/oauth2/authorization/kakao
```

#### 2. 회원 정보 조회 API

```typescript
// GET /api/members/me
// Response
{
  id: number,
  username: string,
  displayName: string | null,
  imageUrl: string | null,
  level: string
}
```

#### 3. 로그아웃 API

```typescript
// POST /api/auth/logout
// Response: 200 OK
```

---

## 구현 완료 결과

### 실제 구현된 파일 목록

#### 수정된 파일

- `app/root.tsx` - Kakao SDK 스크립트 제거 (51-80행)
- `app/routes/profile.tsx` - 로그인 로직을 REST API 방식으로 변경 (158-161행)
- `.env.development` - 카카오 환경변수 제거, API URL만 유지
- `.env.production` - 카카오 환경변수 제거, API URL 수정

#### 삭제된 파일

- `app/types/kakao.d.ts` - SDK 타입 정의 파일 완전 제거

### 주요 변경사항

1. **SDK 완전 제거**
   - Kakao JavaScript SDK 스크립트 태그 제거
   - SDK 초기화 코드 제거
   - 약 5KB의 외부 의존성 제거

2. **로그인 로직 단순화**

   ```tsx
   // Before: SDK 방식
   window.Kakao.Auth.authorize({
     redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
   });

   // After: REST API 방식
   const LOGIN_URL = "https://ulala.p-e.kr/oauth2/authorization/kakao";
   window.location.href = LOGIN_URL;
   ```

3. **환경변수 최적화**
   - 제거: `VITE_KAKAO_JAVASCRIPT_KEY`, `VITE_KAKAO_REDIRECT_URI`
   - 유지: `VITE_API_BASE_URL` (백엔드 통신용)

### 테스트 결과

#### 코드 품질 검증

- ✅ **ESLint**: 통과 (에러 0개, 경고 12개 - 기존 경고)
- ✅ **TypeScript**: 타입 체크 통과
- ✅ **개발 서버**: 정상 실행 확인 (포트 5174)
- ✅ **빌드**: 컴파일 성공

#### 기능 검증

- ✅ SDK 스크립트 로드 안됨 확인
- ✅ 로그인 버튼 클릭 시 서버 URL로 리다이렉트
- ✅ 기존 UI/UX 완전 유지
- ✅ 다크 모드 정상 작동

### 성능 개선 효과

- **네트워크 요청**: Kakao SDK 로드 제거 (-1 request)
- **번들 크기**: 외부 스크립트 의존성 제거 (~5KB gzipped)
- **초기 로딩**: JavaScript 실행 시간 단축 예상
- **보안**: 클라이언트 측 SDK 키 노출 제거

### 다음 단계 (프로덕션 배포 전)

1. **백엔드 확인**
   - [ ] `/oauth2/authorization/kakao` 엔드포인트 동작 확인
   - [ ] 카카오 인증 콜백 처리 정상 작동
   - [ ] HttpOnly Cookie 설정 확인

2. **통합 테스트**
   - [ ] 실제 카카오 로그인 end-to-end 테스트
   - [ ] 모바일 브라우저 테스트
   - [ ] 다양한 브라우저 호환성 테스트

3. **성능 측정**
   - [ ] Lighthouse 점수 비교 (before/after)
   - [ ] 실제 페이지 로딩 속도 측정
