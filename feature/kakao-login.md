# 카카오 로그인 기능 명세서

**상태**: 📝 검토 대기
**관련 파일**: app/routes/profile.tsx
**작성일**: 2025-01-30

## 개요

내정보 페이지에 카카오 JavaScript SDK를 활용한 소셜 로그인 기능을 구현합니다.

### 목적과 필요성

- 사용자 인증 및 프로필 관리 체계 구축
- 간편한 소셜 로그인으로 사용자 경험 개선
- 카카오 계정 정보를 활용한 개인화 서비스 제공
- 향후 데이터 동기화 및 백업 기능의 기반 마련

## 요구사항

### 기능적 요구사항

1. **카카오 SDK 통합**
   - Kakao JavaScript SDK 설치 및 초기화
   - JavaScript Key를 환경변수로 관리
   - 웹사이트 도메인 등록 (Kakao Developers)

2. **로그인 기능**
   - "카카오로 시작하기" 버튼 구현
   - OAuth 2.0 기반 인증 프로세스
   - Access Token 저장 및 관리
   - 로그인 상태 유지

3. **사용자 정보 표시**
   - 카카오 ID로 사용자 식별
   - 로그인 전/후 UI 전환
   - 기존 프로필 정보 유지 (아바타, 이름은 로컬 데이터 사용)

4. **로그아웃 기능**
   - 카카오 로그아웃 처리
   - 로컬 토큰 제거
   - 초기 화면으로 복귀

### 비기능적 요구사항

- Access Token을 HttpOnly Cookie에 안전하게 저장 (서버 연동)
- Authorization Code를 서버로 전송하여 토큰 발급 처리
- SDK 로드 실패 시 에러 핸들링
- 로그인 프로세스 로딩 상태 표시
- 모바일 환경에서 정상 동작
- 보안: HTTPS 환경에서만 작동

## 디자인 고려사항

### docs/design-guide.md 적용 원칙

- **일관성**: 기존 버튼 및 카드 디자인 재사용
- **가독성**: 명확한 로그인 상태 구분
- **단순성**: 직관적인 로그인 프로세스
- **자연스러운 구분**: 카드 기반 레이아웃

### 사용할 컴포넌트와 색상 시스템

- 버튼: 카카오 브랜드 컬러 (#FEE500, #000000)
- 카드: `card-default` 스타일
- 타이포그래피: `heading-secondary`, `body-text`, `caption-text`
- 간격: 8px 기반 시스템
- 아이콘: 카카오 로고 (공식 가이드라인 준수)

### 카카오 브랜드 가이드라인

- 버튼 배경색: #FEE500 (카카오 옐로우)
- 버튼 텍스트: #000000 (블랙)
- 버튼 텍스트: "카카오로 시작하기" 또는 "카카오 로그인"
- 로고: 공식 카카오 로고 사용 (다운로드 필요)

## 구현 계획

### 1단계: SDK 설정 및 초기화

**파일**: `app/root.tsx`

- Kakao SDK 스크립트 추가 (CDN 방식)
- SDK 초기화 스크립트 작성
- JavaScript Key 환경변수 설정

```tsx
// app/root.tsx에 추가
<script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
  integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
  crossorigin="anonymous"></script>
<script>
  window.Kakao.init('{JAVASCRIPT_KEY}');
</script>
```

### 2단계: 로그인 버튼 UI 구현

**파일**: `app/routes/profile.tsx`

- 로그인 전 상태: "카카오로 시작하기" 버튼 표시
- 카카오 브랜드 컬러 적용
- 로딩 상태 표시
- 버튼 5가지 상태 구현 (기본/hover/active/disabled/loading)

### 3단계: 로그인 프로세스 구현

**파일**: `app/routes/profile.tsx`

- `handleKakaoLogin` 함수 작성
- `Kakao.Auth.authorize()` 호출 (Authorization Code 방식)
- Redirect URI에서 Authorization Code 수신
- Authorization Code를 서버로 전송
- 서버에서 Access Token 발급 및 HttpOnly Cookie 설정
- 사용자 정보 서버 API로 요청

### 4단계: 로그인 상태 표시

**파일**: `app/routes/profile.tsx`

- 로그인 상태에 따른 UI 조건부 렌더링
- 로그인 전/후 화면 전환
- 기존 프로필 정보 유지 (아바타, 이름은 로컬 데이터 사용)
- 로그인 성공 시 "카카오 연동됨" 표시

### 5단계: 로그아웃 기능 구현

**파일**: `app/routes/profile.tsx`

- `handleKakaoLogout` 함수 작성
- 서버 로그아웃 API 호출
- 서버에서 HttpOnly Cookie 삭제 및 카카오 로그아웃 처리
- UI 상태 초기화

## 데이터 구조

### 서버 API 구조

#### 1. 로그인 API

```typescript
// POST /api/auth/kakao/callback
// Request
{
  code: string; // Authorization Code
}

// Response
{
  user: {
    id: number; // 카카오 사용자 ID (식별용)
  }
}

// HttpOnly Cookie 자동 설정
// Set-Cookie: access_token={token}; HttpOnly; Secure; SameSite=Strict
// Set-Cookie: refresh_token={token}; HttpOnly; Secure; SameSite=Strict
```

#### 2. 사용자 정보 조회 API

```typescript
// GET /api/auth/me
// Request: Cookie (자동 전송)

// Response
{
  user: {
    id: number; // 카카오 사용자 ID (식별용)
  } | null
}
```

#### 3. 로그아웃 API

```typescript
// POST /api/auth/logout
// Request: Cookie (자동 전송)

// Response

// HttpOnly Cookie 삭제
// Set-Cookie: access_token=; Max-Age=0
// Set-Cookie: refresh_token=; Max-Age=0
```

### 클라이언트 상태 관리

```typescript
// 사용자 정보 (React State)
interface UserState {
  isLoggedIn: boolean;
  kakaoId: number | null; // 카카오 사용자 ID (식별용)
}

// 기존 프로필 정보는 로컬 데이터 사용
// - 이름: 로컬 데이터
// - 아바타: 로컬 데이터
// - 레벨, 경험치: 로컬 데이터 기반 계산
```

## 보안 고려사항

1. **환경변수 관리**
   - 클라이언트: JavaScript Key는 `.env` 파일로 관리
   - 서버: REST API Key, Client Secret은 서버 환경변수로 관리
   - `.gitignore`에 `.env` 추가 필수
   - 프로덕션 환경에서는 서버 환경변수 사용

2. **토큰 보안 (HttpOnly Cookie 방식)**
   - Access Token은 HttpOnly Cookie에 저장 (XSS 공격 방지)
   - Secure 플래그 설정 (HTTPS 환경에서만 전송)
   - SameSite=Strict 설정 (CSRF 공격 방지)
   - Refresh Token으로 자동 갱신 구현
   - 클라이언트는 토큰에 직접 접근 불가 (JavaScript로 읽을 수 없음)

3. **Authorization Code 방식 사용**
   - Implicit Grant 방식 사용 금지 (보안 취약)
   - Authorization Code Grant 방식 사용 (서버에서 토큰 발급)
   - Client Secret은 서버에서만 사용
   - 프론트엔드는 Authorization Code만 수신하여 서버로 전달

4. **CORS 및 도메인 설정**
   - 서버 API에 CORS 설정 (credentials: 'include')
   - 카카오 개발자 사이트에 프로덕션 도메인 등록
   - Redirect URI 화이트리스트 관리

5. **API 권한**
   - 최소한의 스코프만 요청 (카카오 ID만 사용)
   - 이름, 프로필 이미지 등의 추가 정보는 요청하지 않음

6. **세션 관리**
   - 토큰 만료 시간 체크
   - Refresh Token으로 자동 갱신
   - 로그인 세션 타임아웃 설정 (예: 7일)

## 참고 자료

- [카카오 로그인 JavaScript SDK 문서](https://developers.kakao.com/docs/latest/ko/kakaologin/js)
- [카카오 JavaScript SDK 시작하기](https://developers.kakao.com/docs/latest/ko/javascript/getting-started)
- [카카오 로그인 REST API](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)
- [카카오 브랜드 가이드라인](https://developers.kakao.com/docs/latest/ko/reference/design-guide)
- [OAuth 2.0 Authorization Code Grant](https://datatracker.ietf.org/doc/html/rfc6749#section-4.1)
