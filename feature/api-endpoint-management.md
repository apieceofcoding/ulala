# API 엔드포인트 중앙 관리 기능 명세서

**상태**: ✅ 구현 완료 (2025-10-10)
**구현된 파일**:
- `app/api/api.ts` (API 설정 및 클라이언트 통합)
- `app/api/endpoints.ts` (엔드포인트 상수 정의)
- `app/routes/profile.tsx` (마이그레이션 완료)

**주요 변경사항**:
- API 관련 파일을 `app/api/` 폴더로 통합
- `config/api.ts`와 `utils/api.ts`를 `api/api.ts`로 통합
- `constants/endpoints.ts`를 `api/endpoints.ts`로 이동
- profile.tsx의 모든 API 호출을 새로운 구조로 마이그레이션
- 타입 안전한 API 클라이언트 제공

## 개요

유지보수와 변경 시 일관성을 유지하기 위해 API 엔드포인트를 한 곳에서 중앙 관리하여 코드의 재사용성과 유지보수성을 개선합니다.

## 요구사항

### 기능적 요구사항

1. **API 엔드포인트 중앙화**
   - 모든 API 엔드포인트를 한 파일에서 관리
   - BASE_URL과 각 엔드포인트 경로를 분리하여 관리
   - 타입 안전성을 보장하는 TypeScript 구조

2. **환경 변수 통합**
   - `VITE_API_BASE_URL`을 한 곳에서만 읽어오기
   - 개발/프로덕션 환경 자동 대응

3. **API 클라이언트 함수 제공**
   - 인증 토큰 자동 주입
   - 에러 핸들링 표준화
   - fetch API 래퍼 함수

### 비기능적 요구사항

- TypeScript를 활용한 타입 안전성
- 절대 경로 import 규칙 준수 (`@/` 사용)
- 명확한 네이밍 컨벤션
- 확장 가능한 구조

## 디자인 고려사항

이 기능은 UI 컴포넌트가 아닌 유틸리티 함수이므로 `docs/design-guide.md`의 적용 대상이 아닙니다.

## 구현 계획

### 1. 디렉토리 구조

```
app/
└── api/
    ├── api.ts           # API 설정 및 클라이언트 함수 (통합)
    └── endpoints.ts     # API 엔드포인트 상수
```

### 2. 파일별 구현 내용

#### `app/api/api.ts`
- `API_BASE_URL` 환경 변수 관리
- API 설정 객체 (`API_CONFIG`, `API_TIMEOUT`)
- fetch 래퍼 함수 제공 (GET, POST, PUT, DELETE)
- 인증 토큰 자동 주입 옵션
- 타임아웃 처리 및 에러 핸들링

#### `app/api/endpoints.ts`
- 모든 API 엔드포인트 경로를 상수로 정의
- 카테고리별 구조화 (AUTH, OAUTH, MEMBERS 등)
- 타입 안전성을 위한 유틸리티 타입

### 3. 기존 코드 마이그레이션

- `profile.tsx`의 API 호출 코드를 새로운 구조로 변경
- 중복된 `API_BASE_URL` 선언 제거

## 테스트 계획

### 검증 방법

1. **타입 체크**: `npm run typecheck` 실행하여 타입 오류 없음 확인
2. **린트 검사**: `npm run lint` 실행하여 코드 품질 확인
3. **기능 테스트**:
   - 카카오 로그인 정상 동작
   - 사용자 정보 조회 정상 동작
   - 로그아웃 정상 동작
4. **환경 변수 테스트**: 개발/프로덕션 환경에서 올바른 BASE_URL 사용 확인

### 테스트 시나리오

- [x] API 엔드포인트 상수가 올바르게 정의됨
- [x] profile.tsx에서 새로운 구조를 사용하여 API 호출 성공
- [x] 모든 API 호출이 정상적으로 작동
- [x] 타입스크립트 타입 체크 통과
- [x] 린트 검사 통과 (기존 console.log 경고는 제외)

## 사용 예시 (마이그레이션 후)

### Before (현재)
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const response = await fetch(`${API_BASE_URL}/api/auth/token`, {
  method: "POST",
  credentials: "include",
});
```

### After (개선 후)
```typescript
import { API_ENDPOINTS } from "@/api/endpoints";
import { apiClient } from "@/api/api";

const response = await apiClient.post(API_ENDPOINTS.AUTH.TOKEN, {
  credentials: "include",
});
```

## 구현 결과

### 생성된 파일 상세

#### `app/api/api.ts` (통합 파일)
- **API 설정**:
  - `API_BASE_URL`: 환경 변수에서 API 서버 주소 관리
  - `API_TIMEOUT`: API 요청 타임아웃 설정 (30초)
  - `API_CONFIG`: 전체 API 설정을 담은 객체
- **API 클라이언트**:
  - `apiClient.get()`: GET 요청 함수
  - `apiClient.post()`: POST 요청 함수
  - `apiClient.put()`: PUT 요청 함수
  - `apiClient.delete()`: DELETE 요청 함수
  - `apiClient.buildUrl()`: 완전한 URL 생성 함수
- **기능**:
  - 인증 토큰 자동 주입 기능
  - 타임아웃 처리 (AbortController 사용)
  - `ApiError` 클래스로 에러 핸들링

#### `app/api/endpoints.ts`
- `AUTH_ENDPOINTS`: 인증 관련 엔드포인트 (TOKEN, LOGOUT)
- `OAUTH_ENDPOINTS`: OAuth 관련 엔드포인트 (KAKAO)
- `MEMBER_ENDPOINTS`: 회원 관련 엔드포인트 (ME)
- `API_ENDPOINTS`: 모든 엔드포인트를 카테고리별로 그룹화
- 타입 안전성을 위한 유틸리티 타입 export

#### `app/routes/profile.tsx` 마이그레이션
- 4곳의 API 호출을 모두 새로운 구조로 변경
- `import.meta.env.VITE_API_BASE_URL` 중복 사용 제거
- 타입 안전한 API 호출로 개선
- Member 타입 정의 및 회원 정보 표시 구현

## 달성한 이점

1. **유지보수성 향상**: API 엔드포인트 변경 시 한 곳만 수정
2. **타입 안전성**: 오타나 잘못된 경로 사용 방지
3. **코드 재사용**: 공통 API 호출 로직 재사용
4. **일관성**: 모든 API 호출이 동일한 패턴 사용
5. **확장성**: 새로운 엔드포인트 추가가 용이

## 향후 개선 사항

1. 다른 라우트 파일(`home.tsx`, `records.tsx` 등)도 동일한 구조로 마이그레이션
2. API 응답 타입 정의 추가
3. API 캐싱 전략 구현
4. 요청/응답 인터셉터 추가 (로깅, 재시도 등)
