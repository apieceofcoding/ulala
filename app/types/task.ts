/**
 * Task 관련 타입 정의
 */

/**
 * Task 상태
 */
export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

/**
 * Task 응답 타입
 */
export interface TaskResponse {
  id: string;
  memberId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  displayOrder: number;
  startAt: string | null;
  endAt: string | null;
  dueAt: string | null;
  createdAt: string | null;
  modifiedAt: string | null;
}

/**
 * Task 생성 요청 타입
 */
export interface CreateTaskRequest {
  title: string;
  description?: string;
  startAt?: string;
  endAt?: string;
  dueAt?: string;
}

/**
 * Task 수정 요청 타입
 */
export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  startAt?: string;
  endAt?: string;
  dueAt?: string;
}

/**
 * 페이지 정보 타입
 */
export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

/**
 * Task 목록 페이지네이션 응답 타입
 */
export interface TaskPageResponse {
  content: TaskResponse[];
  page: PageInfo;
}
