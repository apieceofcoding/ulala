import { useEffect, useRef, useCallback } from "react";
import type { GameState, GameConfig, InputState } from "@/types/character";

/**
 * 게임 루프 훅
 * requestAnimationFrame을 사용하여 60fps로 게임 물리를 업데이트합니다.
 */
export function useGameLoop(
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  inputState: InputState,
  config: GameConfig,
) {
  const animationFrameId = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);

  const updateGame = useCallback(
    (currentTime: number) => {
      // 프레임 시간 계산 (60fps 목표)
      const deltaTime = currentTime - lastTimeRef.current;

      // 약 16.67ms(60fps)마다 업데이트
      if (deltaTime < 16) {
        animationFrameId.current = requestAnimationFrame(updateGame);
        return;
      }

      lastTimeRef.current = currentTime;

      setGameState((prevState) => {
        const newState = { ...prevState };

        // 좌우 이동 처리
        if (inputState.left) {
          newState.velocityX = -config.moveSpeed;
          newState.direction = "left";
          if (!newState.isJumping) {
            newState.animationState = "walk";
          }
        } else if (inputState.right) {
          newState.velocityX = config.moveSpeed;
          newState.direction = "right";
          if (!newState.isJumping) {
            newState.animationState = "walk";
          }
        } else {
          newState.velocityX = 0;
          if (!newState.isJumping) {
            newState.animationState = "idle";
          }
        }

        // 점프 처리
        if (inputState.jump && !newState.isJumping) {
          newState.velocityY = config.jumpSpeed;
          newState.isJumping = true;
          newState.animationState = "jump";
        }

        // 중력 적용
        if (newState.isJumping) {
          newState.velocityY += config.gravity;
        }

        // 위치 업데이트
        newState.x += newState.velocityX;
        newState.y += newState.velocityY;

        // 좌우 경계 충돌 감지
        const minX = 0;
        const maxX = config.mapWidth - config.characterSize;
        if (newState.x < minX) {
          newState.x = minX;
          newState.velocityX = 0;
        } else if (newState.x > maxX) {
          newState.x = maxX;
          newState.velocityX = 0;
        }

        // 바닥 충돌 감지
        if (newState.y >= config.groundY) {
          newState.y = config.groundY;
          newState.velocityY = 0;
          newState.isJumping = false;
          // 착지 후 애니메이션 상태 업데이트
          if (newState.velocityX !== 0) {
            newState.animationState = "walk";
          } else {
            newState.animationState = "idle";
          }
        }

        return newState;
      });

      animationFrameId.current = requestAnimationFrame(updateGame);
    },
    [inputState, config, setGameState],
  );

  useEffect(() => {
    lastTimeRef.current = performance.now();
    animationFrameId.current = requestAnimationFrame(updateGame);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [updateGame]);
}
