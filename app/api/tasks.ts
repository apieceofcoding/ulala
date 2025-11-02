/**
 * Task API 클라이언트
 *
 * Task 관련 API 요청 함수를 제공합니다.
 */

import { apiClient, ApiError } from "@/api/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  TaskResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskPageResponse,
} from "@/types/task";
import { logger } from "@/utils/logger";

/**
 * 내 태스크 목록 조회
 * @param token - 인증 토큰
 * @returns Task 목록 (페이지네이션 응답에서 content만 추출)
 */
export async function getMyTasks(token: string): Promise<TaskResponse[]> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.TASKS.LIST, {
      token,
      credentials: "include",
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        response.statusText,
        "태스크 목록을 불러오는데 실패했습니다.",
      );
    }

    const data: TaskPageResponse = await response.json();
    // 페이지네이션 응답에서 content 배열만 반환
    return data.content;
  } catch (error) {
    logger.error("Failed to fetch tasks:", error);
    throw error;
  }
}

/**
 * 특정 태스크 조회
 * @param id - Task ID
 * @param token - 인증 토큰
 * @returns Task 정보
 */
export async function getTask(
  id: string,
  token: string,
): Promise<TaskResponse> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.TASKS.GET(id), {
      token,
      credentials: "include",
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        response.statusText,
        "태스크를 불러오는데 실패했습니다.",
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error(`Failed to fetch task ${id}:`, error);
    throw error;
  }
}

/**
 * 태스크 생성
 * @param request - 생성할 태스크 정보
 * @param token - 인증 토큰
 * @returns 생성된 Task 정보
 */
export async function createTask(
  request: CreateTaskRequest,
  token: string,
): Promise<TaskResponse> {
  try {
    const response = await apiClient.post(API_ENDPOINTS.TASKS.CREATE, {
      token,
      credentials: "include",
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        response.statusText,
        "태스크 생성에 실패했습니다.",
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Failed to create task:", error);
    throw error;
  }
}

/**
 * 태스크 수정
 * @param id - Task ID
 * @param request - 수정할 태스크 정보
 * @param token - 인증 토큰
 * @returns 수정된 Task 정보
 */
export async function updateTask(
  id: string,
  request: UpdateTaskRequest,
  token: string,
): Promise<TaskResponse> {
  try {
    const response = await apiClient.put(API_ENDPOINTS.TASKS.UPDATE(id), {
      token,
      credentials: "include",
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        response.statusText,
        "태스크 수정에 실패했습니다.",
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error(`Failed to update task ${id}:`, error);
    throw error;
  }
}

/**
 * 태스크 삭제
 * @param id - Task ID
 * @param token - 인증 토큰
 */
export async function deleteTask(id: string, token: string): Promise<void> {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.TASKS.DELETE(id), {
      token,
      credentials: "include",
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        response.statusText,
        "태스크 삭제에 실패했습니다.",
      );
    }
  } catch (error) {
    logger.error(`Failed to delete task ${id}:`, error);
    throw error;
  }
}

/**
 * 일별 태스크 통계 응답 타입
 */
export interface DailyStatsResponse {
  date: string; // YYYY-MM-DD 형식
  count: number; // 해당 날짜의 태스크 수
}

/**
 * 일별 태스크 통계 조회
 * @param startDate - 시작 날짜 (YYYY-MM-DD)
 * @param endDate - 종료 날짜 (YYYY-MM-DD)
 * @param token - 인증 토큰
 * @returns 일별 태스크 통계 목록
 */
export async function getDailyStats(
  startDate: string,
  endDate: string,
  token: string,
): Promise<DailyStatsResponse[]> {
  try {
    const url = `${API_ENDPOINTS.TASKS.DAILY_STATS}?startDate=${startDate}&endDate=${endDate}`;
    const response = await apiClient.get(url, {
      token,
      credentials: "include",
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        response.statusText,
        "일별 태스크 통계를 불러오는데 실패했습니다.",
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Failed to fetch daily stats:", error);
    throw error;
  }
}

/**
 * 최근 활동 조회
 * @param token - 인증 토큰
 * @returns 최근 태스크 목록
 */
export async function getRecentTasks(
  token: string,
): Promise<TaskResponse[]> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.TASKS.RECENT, {
      token,
      credentials: "include",
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        response.statusText,
        "최근 활동을 불러오는데 실패했습니다.",
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Failed to fetch recent tasks:", error);
    throw error;
  }
}

/**
 * 주간 태스크 통계 응답 타입
 */
export interface WeeklyStatsResponse {
  totalCount: number; // 총 태스크 수
  completedCount: number; // 완료된 태스크 수
}

/**
 * 주간 태스크 통계 조회
 * @param token - 인증 토큰
 * @returns 주간 태스크 통계
 */
export async function getWeeklyStats(
  token: string,
): Promise<WeeklyStatsResponse> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.TASKS.WEEKLY_STATS, {
      token,
      credentials: "include",
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        response.statusText,
        "주간 태스크 통계를 불러오는데 실패했습니다.",
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Failed to fetch weekly stats:", error);
    throw error;
  }
}
