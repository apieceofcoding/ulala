/**
 * useCharacters Hook
 *
 * Character 관련 상태 관리 및 CRUD 작업을 제공합니다.
 */

import { useState, useEffect, useCallback } from "react";
import type {
  Character,
  RoleModel,
  CharacterResponse,
} from "@/types/character";
import { toCharacter } from "@/types/character";
import { apiClient } from "@/api/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { logger } from "@/utils/logger";

interface UseCharactersOptions {
  accessToken: string | null;
  autoFetch?: boolean;
}

interface UseCharactersReturn {
  character: Character | null;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  fetchCharacter: () => Promise<void>;
  createCharacter: (roleModel: RoleModel) => Promise<void>;
  updateCharacter: (characterId: number, roleModel: RoleModel) => Promise<void>;
  deleteCharacter: () => Promise<void>;
  clearError: () => void;
}

export function useCharacters({
  accessToken,
  autoFetch = true,
}: UseCharactersOptions): UseCharactersReturn {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 캐릭터 조회
  const fetchCharacter = useCallback(async () => {
    if (!accessToken) {
      setCharacter(null);
      setIsFetching(false);
      return;
    }

    setIsFetching(true);
    setError(null);

    try {
      const response = await apiClient.get(API_ENDPOINTS.CHARACTERS.ME, {
        token: accessToken,
      });

      if (response.ok) {
        const data: CharacterResponse[] = await response.json();
        if (data.length > 0) {
          setCharacter(toCharacter(data[0]));
        } else {
          setCharacter(null);
        }
      } else if (response.status === 404) {
        setCharacter(null);
      } else {
        logger.error("캐릭터 조회 실패:", response.status);
      }
    } catch (err) {
      logger.error("캐릭터 조회 에러:", err);
      setError("캐릭터를 불러오는데 실패했습니다.");
    } finally {
      setIsFetching(false);
    }
  }, [accessToken]);

  // 캐릭터 생성
  const createCharacter = useCallback(
    async (roleModel: RoleModel) => {
      if (!accessToken) {
        setError("로그인이 필요합니다.");
        throw new Error("인증이 필요합니다.");
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.post(API_ENDPOINTS.CHARACTERS.CREATE, {
          token: accessToken,
          body: JSON.stringify({ roleModel }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CharacterResponse = await response.json();
        const newCharacter = toCharacter(data);
        setCharacter(newCharacter);
        logger.log("캐릭터 생성 완료:", newCharacter);
      } catch (err) {
        logger.error("캐릭터 생성 실패:", err);
        setError("캐릭터를 생성하는데 실패했습니다. 다시 시도해주세요.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken]
  );

  // 캐릭터 수정 (PATCH)
  const updateCharacter = useCallback(
    async (characterId: number, roleModel: RoleModel) => {
      if (!accessToken) {
        setError("로그인이 필요합니다.");
        throw new Error("인증이 필요합니다.");
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.patch(
          API_ENDPOINTS.CHARACTERS.UPDATE(characterId),
          {
            token: accessToken,
            body: JSON.stringify({ roleModel }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CharacterResponse = await response.json();
        const updatedCharacter = toCharacter(data);
        setCharacter(updatedCharacter);
        logger.log("캐릭터 수정 완료:", updatedCharacter);
      } catch (err) {
        logger.error("캐릭터 수정 실패:", err);
        setError("캐릭터를 수정하는데 실패했습니다. 다시 시도해주세요.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken]
  );

  // 캐릭터 삭제
  const deleteCharacter = useCallback(async () => {
    if (!accessToken || !character) {
      setError("로그인이 필요합니다.");
      throw new Error("인증이 필요합니다.");
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.delete(
        API_ENDPOINTS.CHARACTERS.DELETE(character.id),
        {
          token: accessToken,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setCharacter(null);
      logger.log("캐릭터 삭제 완료");
    } catch (err) {
      logger.error("캐릭터 삭제 실패:", err);
      setError("캐릭터를 삭제하는데 실패했습니다. 다시 시도해주세요.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, character]);

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // accessToken이 변경되면 캐릭터 조회 (autoFetch가 true일 때만)
  useEffect(() => {
    if (autoFetch) {
      fetchCharacter();
    }
  }, [fetchCharacter, autoFetch]);

  return {
    character,
    isLoading,
    isFetching,
    error,
    fetchCharacter,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    clearError,
  };
}
