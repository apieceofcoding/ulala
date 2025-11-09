/**
 * Reward API 클라이언트
 *
 * Reward 관련 API 요청 함수를 제공합니다.
 */

import { apiClient, ApiError } from "@/api/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { logger } from "@/utils/logger";

/**
 * 보상 응답 타입
 */
export interface RewardResponse {
  id: string;
  memberId: string;
  sourceId: string;
  sourceType: "TASK" | "EVENT";
  point: number;
  exp: number;
  createdAt: string | null;
  modifiedAt: string | null;
}

/**
 * 보상 검색 요청 타입
 */
export interface RewardSearchRequest {
  sourceType: "TASK" | "EVENT";
  sourceIds: string[];
}

/**
 * 보상 검색
 * @param request - 보상 검색 요청 (소스 타입과 ID 배열)
 * @param token - 인증 토큰
 * @returns 보상 목록
 */
export async function searchRewards(
  request: RewardSearchRequest,
  token: string,
): Promise<RewardResponse[]> {
  try {
    const response = await apiClient.post(API_ENDPOINTS.REWARDS.SEARCH, {
      token,
      credentials: "include",
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        response.statusText,
        "보상 검색에 실패했습니다.",
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Failed to search rewards:", error);
    throw error;
  }
}
