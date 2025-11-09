/**
 * useRewards Hook
 *
 * Reward 관련 상태 관리 및 API 작업을 제공합니다.
 */

import { useState, useCallback } from "react";
import { searchRewards, type RewardResponse } from "@/api/rewards";
import { apiClient } from "@/api/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { logger } from "@/utils/logger";

/**
 * 페이지네이션 응답 타입
 */
interface PageResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

/**
 * 보상 검색 결과 타입
 */
export interface RewardSearchResult {
  completedTasksCount: number;
  totalExp: number;
  totalPoints: number;
}

interface UseRewardsOptions {
  accessToken: string | null;
}

interface UseRewardsReturn {
  // 보상 검색 (POST /api/rewards/search)
  searchTaskRewards: (taskIds: string[]) => Promise<RewardSearchResult>;
  isSearching: boolean;
  searchError: string | null;

  // 보상 목록 조회 (GET /api/rewards)
  fetchRewardsList: (page: number, size: number) => Promise<PageResponse<RewardResponse>>;
  isFetching: boolean;
  fetchError: string | null;
}

export function useRewards({ accessToken }: UseRewardsOptions): UseRewardsReturn {
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  /**
   * 태스크 ID 배열로 보상 검색 및 집계
   */
  const searchTaskRewards = useCallback(
    async (taskIds: string[]): Promise<RewardSearchResult> => {
      if (!accessToken) {
        return {
          completedTasksCount: 0,
          totalExp: 0,
          totalPoints: 0,
        };
      }

      if (taskIds.length === 0) {
        return {
          completedTasksCount: 0,
          totalExp: 0,
          totalPoints: 0,
        };
      }

      setIsSearching(true);
      setSearchError(null);

      try {
        const rewards = await searchRewards(
          {
            sourceType: "TASK",
            sourceIds: taskIds,
          },
          accessToken
        );

        // 데이터 집계
        const totalExp = rewards.reduce((sum, reward) => sum + reward.exp, 0);
        const totalPoints = rewards.reduce(
          (sum, reward) => sum + reward.point,
          0
        );

        return {
          completedTasksCount: taskIds.length,
          totalExp,
          totalPoints,
        };
      } catch (error) {
        logger.error("Failed to search task rewards:", error);
        setSearchError("보상 검색에 실패했습니다.");
        // 에러 발생 시에도 태스크 수는 반환
        return {
          completedTasksCount: taskIds.length,
          totalExp: 0,
          totalPoints: 0,
        };
      } finally {
        setIsSearching(false);
      }
    },
    [accessToken]
  );

  /**
   * 보상 목록 조회 (페이지네이션)
   */
  const fetchRewardsList = useCallback(
    async (
      page: number = 0,
      size: number = 10
    ): Promise<PageResponse<RewardResponse>> => {
      if (!accessToken) {
        throw new Error("인증 토큰이 필요합니다.");
      }

      setIsFetching(true);
      setFetchError(null);

      try {
        const response = await apiClient.get(
          `${API_ENDPOINTS.REWARDS.LIST}?page=${page}&size=${size}`,
          { token: accessToken }
        );

        if (!response.ok) {
          throw new Error(`API 요청 실패: ${response.status}`);
        }

        const data: PageResponse<RewardResponse> = await response.json();
        return data;
      } catch (error) {
        logger.error("Failed to fetch rewards list:", error);
        setFetchError("보상 목록을 불러오는데 실패했습니다.");
        throw error;
      } finally {
        setIsFetching(false);
      }
    },
    [accessToken]
  );

  return {
    searchTaskRewards,
    isSearching,
    searchError,
    fetchRewardsList,
    isFetching,
    fetchError,
  };
}
