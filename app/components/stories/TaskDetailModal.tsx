import { useState } from "react";
import type { TaskResponse } from "@/types/task";
import { TaskStatus } from "@/types/task";

interface TaskDetailModalProps {
  task: TaskResponse;
  onClose: () => void;
  onSave: (taskId: string, title: string, description: string) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onToggleStatus: (taskId: string) => Promise<void>;
}

export function TaskDetailModal({
  task,
  onClose,
  onSave,
  onDelete,
  onToggleStatus,
}: TaskDetailModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");

  const handleClose = () => {
    setIsEditMode(false);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleStartEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    await onSave(task.id, editTitle.trim(), editDescription.trim());
    setIsEditMode(false);
  };

  const handleDelete = async () => {
    await onDelete(task.id);
    handleClose();
  };

  const handleToggleStatus = async () => {
    await onToggleStatus(task.id);
  };

  const getStatusLabel = () => {
    if (task.status === TaskStatus.TODO) return "진행중으로";
    if (task.status === TaskStatus.IN_PROGRESS) return "완료로";
    return "할일로";
  };

  const getStatusText = () => {
    if (task.status === TaskStatus.DONE) return "완료";
    if (task.status === TaskStatus.IN_PROGRESS) return "진행중";
    return "할일";
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={handleClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") handleClose();
      }}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div
        className="card-default max-w-md w-full space-y-4"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="document"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between gap-3">
          {isEditMode ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 px-3 py-2 rounded bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark font-semibold text-lg"
              autoFocus
            />
          ) : (
            <h2 className="heading-secondary truncate">{task.title}</h2>
          )}
          <button
            onClick={handleClose}
            className="text-text-tertiary dark:text-text-tertiary-dark hover:text-text-secondary dark:hover:text-text-secondary-dark flex-shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* 메모 */}
          <div>
            <label className="block caption-text mb-2">메모</label>
            {isEditMode ? (
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="예: 30페이지 목표, 공원에서 가볍게 등"
                className="w-full px-4 py-2 rounded bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark"
              />
            ) : task.description ? (
              <p className="body-text">{task.description}</p>
            ) : (
              <p className="caption-text">메모 없음</p>
            )}
          </div>

          {/* 상태 */}
          <div>
            <label className="block caption-text mb-2">상태</label>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  task.status === TaskStatus.DONE
                    ? "bg-primary"
                    : task.status === TaskStatus.IN_PROGRESS
                      ? "bg-primary opacity-60"
                      : "bg-text-tertiary dark:bg-text-tertiary-dark"
                }`}
              />
              <p className="body-text">{getStatusText()}</p>
            </div>
          </div>

          {/* 생성일 */}
          {task.createdAt && (
            <div>
              <label className="block caption-text mb-2">생성일</label>
              <p className="body-text">
                {new Date(task.createdAt).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}

          {/* 완료일 */}
          {task.status === TaskStatus.DONE &&
            (task.endAt || task.modifiedAt) && (
              <div>
                <label className="block caption-text mb-2">완료일</label>
                <p className="body-text">
                  {new Date(
                    task.endAt || task.modifiedAt!
                  ).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
        </div>

        {/* 액션 버튼 */}
        {isEditMode ? (
          <div className="flex gap-3 pt-4 border-t border-border-light dark:border-border-dark">
            <button onClick={handleCancelEdit} className="btn-secondary flex-1">
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={!editTitle.trim()}
              className="btn-primary flex-1 disabled:bg-primary-disabled disabled:cursor-not-allowed"
            >
              저장
            </button>
          </div>
        ) : !showDeleteConfirm ? (
          <div className="flex gap-3 pt-4 border-t border-border-light dark:border-border-dark">
            <button onClick={handleStartEdit} className="btn-secondary flex-1">
              수정
            </button>
            <button
              onClick={handleToggleStatus}
              className="btn-secondary flex-1"
            >
              {getStatusLabel()}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-secondary flex-1 !text-error hover:!bg-error-bg"
            >
              삭제
            </button>
          </div>
        ) : (
          <div className="space-y-3 pt-4 border-t border-border-light dark:border-border-dark">
            <div className="text-center">
              <p className="body-text text-error font-medium">
                정말 삭제하시겠습니까?
              </p>
              <p className="caption-text mt-1">
                삭제된 할 일은 복구할 수 없습니다.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary flex-1"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="btn-primary flex-1 !bg-error !hover:bg-error-pressed"
              >
                삭제
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
