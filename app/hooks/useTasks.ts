/**
 * useTasks Hook
 *
 * Task 관련 상태 관리 및 CRUD 작업을 제공합니다.
 */

import { useState, useEffect, useCallback } from "react";
import type {
  TaskResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
} from "@/types/task";
import {
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
  getDailyStats,
  getRecentTasks,
  getWeeklyStats,
  type DailyStatsResponse,
  type WeeklyStatsResponse,
} from "@/api/tasks";
import { logger } from "@/utils/logger";

interface UseTasksOptions {
  accessToken: string | null;
}

interface UseTasksReturn {
  tasks: TaskResponse[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (data: CreateTaskRequest) => Promise<void>;
  editTask: (id: string, data: UpdateTaskRequest) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  clearError: () => void;
  // 일별 통계 관련
  dailyStats: DailyStatsResponse[];
  isDailyStatsLoading: boolean;
  fetchDailyStats: (startDate: string, endDate: string) => Promise<void>;
  // 최근 활동 관련
  recentTasks: TaskResponse[];
  isRecentTasksLoading: boolean;
  fetchRecentTasks: () => Promise<void>;
  // 주간 통계 관련
  weeklyStats: WeeklyStatsResponse | null;
  isWeeklyStatsLoading: boolean;
  fetchWeeklyStats: () => Promise<void>;
}

export function useTasks({ accessToken }: UseTasksOptions): UseTasksReturn {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 일별 통계 관련 상태
  const [dailyStats, setDailyStats] = useState<DailyStatsResponse[]>([]);
  const [isDailyStatsLoading, setIsDailyStatsLoading] = useState(false);

  // 최근 활동 관련 상태
  const [recentTasks, setRecentTasks] = useState<TaskResponse[]>([]);
  const [isRecentTasksLoading, setIsRecentTasksLoading] = useState(false);

  // 주간 통계 관련 상태
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStatsResponse | null>(
    null
  );
  const [isWeeklyStatsLoading, setIsWeeklyStatsLoading] = useState(false);

  // 태스크 목록 조회
  const fetchTasks = useCallback(async () => {
    if (!accessToken) {
      setTasks([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getMyTasks(accessToken);
      setTasks(data);
    } catch (err) {
      logger.error("Failed to fetch tasks:", err);
      setError("태스크 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  // 태스크 생성
  const addTask = useCallback(
    async (data: CreateTaskRequest) => {
      if (!accessToken) {
        setError("로그인이 필요합니다.");
        throw new Error("인증이 필요합니다.");
      }

      setIsCreating(true);
      setError(null);

      try {
        const newTask = await createTask(data, accessToken);
        setTasks((prev) => [...prev, newTask]);
      } catch (err) {
        logger.error("Failed to create task:", err);
        setError("태스크 생성에 실패했습니다.");
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [accessToken]
  );

  // 태스크 수정
  const editTask = useCallback(
    async (id: string, data: UpdateTaskRequest) => {
      if (!accessToken) {
        setError("로그인이 필요합니다.");
        throw new Error("인증이 필요합니다.");
      }

      const originalTask = tasks.find((t) => t.id === id);
      if (!originalTask) return;

      // 낙관적 업데이트
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...data } : task))
      );

      try {
        const updatedTask = await updateTask(id, data, accessToken);
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updatedTask : task))
        );
      } catch (err) {
        logger.error("Failed to update task:", err);
        // 롤백
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? originalTask : task))
        );
        setError("태스크 수정에 실패했습니다.");
        throw err;
      }
    },
    [accessToken, tasks]
  );

  // 태스크 삭제
  const removeTask = useCallback(
    async (id: string) => {
      if (!accessToken) {
        setError("로그인이 필요합니다.");
        throw new Error("인증이 필요합니다.");
      }

      const taskToDelete = tasks.find((t) => t.id === id);
      if (!taskToDelete) return;

      // 낙관적 업데이트
      setTasks((prev) => prev.filter((task) => task.id !== id));

      try {
        await deleteTask(id, accessToken);
      } catch (err) {
        logger.error("Failed to delete task:", err);
        // 롤백
        setTasks((prev) => [...prev, taskToDelete]);
        setError("태스크 삭제에 실패했습니다.");
        throw err;
      }
    },
    [accessToken, tasks]
  );

  // 태스크 상태 토글 (완료/미완료)
  const toggleTaskStatus = useCallback(
    async (id: string) => {
      if (!accessToken) {
        setError("로그인이 필요합니다.");
        return;
      }

      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const { TaskStatus } = await import("@/types/task");
      const wasCompleted = task.status === TaskStatus.DONE;
      const newStatus = wasCompleted ? TaskStatus.TODO : TaskStatus.DONE;

      // 낙관적 업데이트
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );

      try {
        await updateTask(id, { status: newStatus }, accessToken);
      } catch (err) {
        logger.error("Failed to toggle task status:", err);
        // 롤백
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: task.status } : t))
        );
        setError("태스크 상태 업데이트에 실패했습니다.");
        throw err;
      }
    },
    [accessToken, tasks]
  );

  // 일별 통계 조회
  const fetchDailyStats = useCallback(
    async (startDate: string, endDate: string) => {
      if (!accessToken) {
        setDailyStats([]);
        return;
      }

      setIsDailyStatsLoading(true);
      setError(null);

      try {
        const data = await getDailyStats(startDate, endDate, accessToken);
        setDailyStats(data);
      } catch (err) {
        logger.error("Failed to fetch daily stats:", err);
        setError("일별 통계를 불러오는데 실패했습니다.");
        setDailyStats([]);
      } finally {
        setIsDailyStatsLoading(false);
      }
    },
    [accessToken]
  );

  // 최근 활동 조회
  const fetchRecentTasks = useCallback(async () => {
    if (!accessToken) {
      setRecentTasks([]);
      return;
    }

    setIsRecentTasksLoading(true);
    setError(null);

    try {
      const data = await getRecentTasks(accessToken);
      setRecentTasks(data);
    } catch (err) {
      logger.error("Failed to fetch recent tasks:", err);
      setError("최근 활동을 불러오는데 실패했습니다.");
      setRecentTasks([]);
    } finally {
      setIsRecentTasksLoading(false);
    }
  }, [accessToken]);

  // 주간 통계 조회
  const fetchWeeklyStats = useCallback(async () => {
    if (!accessToken) {
      setWeeklyStats(null);
      return;
    }

    setIsWeeklyStatsLoading(true);
    setError(null);

    try {
      const data = await getWeeklyStats(accessToken);
      setWeeklyStats(data);
    } catch (err) {
      logger.error("Failed to fetch weekly stats:", err);
      setError("주간 통계를 불러오는데 실패했습니다.");
      setWeeklyStats(null);
    } finally {
      setIsWeeklyStatsLoading(false);
    }
  }, [accessToken]);

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // accessToken이 변경되면 태스크 목록 다시 조회
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    isCreating,
    error,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    toggleTaskStatus,
    clearError,
    // 일별 통계 관련
    dailyStats,
    isDailyStatsLoading,
    fetchDailyStats,
    // 최근 활동 관련
    recentTasks,
    isRecentTasksLoading,
    fetchRecentTasks,
    // 주간 통계 관련
    weeklyStats,
    isWeeklyStatsLoading,
    fetchWeeklyStats,
  };
}
