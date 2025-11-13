import { useState, useEffect } from "react";
import type { TaskResponse } from "@/types/task";
import { TaskStatus } from "@/types/task";

interface TaskDetailModalProps {
  task: TaskResponse;
  onClose: () => void;
  onSave: (taskId: string, title: string, description: string, status: TaskStatus, startAt: string | null, endAt: string | null, dueAt: string | null) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export function TaskDetailModal({
  task,
  onClose,
  onSave,
  onDelete,
}: TaskDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [editStatus, setEditStatus] = useState(task.status);

  // 날짜 파싱 헬퍼 함수
  const parseDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    // ISO 문자열이면 날짜 부분만 추출
    if (dateStr.includes("T")) {
      return dateStr.split("T")[0];
    }
    // 슬래시 형식이면 하이픈으로 변환 (yyyy/MM/dd -> yyyy-MM-dd)
    if (dateStr.includes("/")) {
      return dateStr.split("/").join("-");
    }
    // 이미 yyyy-MM-dd 형식이면 그대로 사용
    return dateStr;
  };

  const [editStartAt, setEditStartAt] = useState(parseDate(task.startAt));
  const [editEndAt, setEditEndAt] = useState(parseDate(task.endAt));
  const [editDueAt, setEditDueAt] = useState(parseDate(task.dueAt));

  const handleClose = () => {
    setShowDeleteConfirm(false);
    onClose();
  };

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowDeleteConfirm(false);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    // 날짜들을 ISO 형식으로 변환
    const startAtValue = editStartAt ? `${editStartAt}T00:00:00.000Z` : null;
    const endAtValue = editEndAt ? `${editEndAt}T00:00:00.000Z` : null;
    const dueAtValue = editDueAt ? `${editDueAt}T00:00:00.000Z` : null;
    await onSave(task.id, editTitle.trim(), editDescription.trim(), editStatus, startAtValue, endAtValue, dueAtValue);
    handleClose();
  };

  const handleDelete = async () => {
    await onDelete(task.id);
    handleClose();
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return "할일";
      case TaskStatus.IN_PROGRESS:
        return "진행중";
      case TaskStatus.DONE:
        return "완료";
      case TaskStatus.ON_HOLD:
        return "보류";
      default:
        return "할일";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="card-default max-w-md w-full space-y-4"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between gap-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark font-semibold text-lg"
            autoFocus
          />
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
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="예: 30페이지 목표, 공원에서 가볍게 등"
              className="w-full px-4 py-2 rounded bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark"
            />
          </div>

          {/* 상태 */}
          <div>
            <label className="block caption-text mb-2">상태</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as TaskStatus)}
              className="w-full px-4 py-2 rounded bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark border border-border-light dark:border-border-dark"
            >
              <option value={TaskStatus.TODO}>{getStatusLabel(TaskStatus.TODO)}</option>
              <option value={TaskStatus.IN_PROGRESS}>{getStatusLabel(TaskStatus.IN_PROGRESS)}</option>
              <option value={TaskStatus.DONE}>{getStatusLabel(TaskStatus.DONE)}</option>
              <option value={TaskStatus.ON_HOLD}>{getStatusLabel(TaskStatus.ON_HOLD)}</option>
            </select>
          </div>

          {/* 생성일 */}
          {task.createdAt && (
            <div>
              <label className="block caption-text mb-2">생성일</label>
              <p className="body-text">
                {parseDate(task.createdAt).split('-').join('/')}
              </p>
            </div>
          )}

          {/* 시작일 */}
          <div>
            <label className="block caption-text mb-2">시작일</label>
            <div className="relative">
              <input
                type="text"
                value={editStartAt ? editStartAt.split('-').join('/') : ''}
                readOnly
                onClick={() => {
                  const dateInput = document.getElementById('start-date-input') as HTMLInputElement;
                  dateInput?.showPicker?.();
                }}
                placeholder="yyyy/MM/dd"
                className="w-full px-4 py-2 pr-20 rounded bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark border border-border-light dark:border-border-dark cursor-pointer"
              />
              {editStartAt && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditStartAt('');
                  }}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-text-tertiary dark:text-text-tertiary-dark hover:text-text-secondary dark:hover:text-text-secondary-dark"
                  title="시작일 삭제"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              )}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary dark:text-text-tertiary-dark">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 3V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M14 3V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <input
                id="start-date-input"
                type="date"
                value={editStartAt}
                onChange={(e) => setEditStartAt(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
                style={{ pointerEvents: 'none' }}
              />
            </div>
          </div>

          {/* 종료일 */}
          <div>
            <label className="block caption-text mb-2">종료일</label>
            <div className="relative">
              <input
                type="text"
                value={editEndAt ? editEndAt.split('-').join('/') : ''}
                readOnly
                onClick={() => {
                  const dateInput = document.getElementById('end-date-input') as HTMLInputElement;
                  dateInput?.showPicker?.();
                }}
                placeholder="yyyy/MM/dd"
                className="w-full px-4 py-2 pr-20 rounded bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark border border-border-light dark:border-border-dark cursor-pointer"
              />
              {editEndAt && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditEndAt('');
                  }}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-text-tertiary dark:text-text-tertiary-dark hover:text-text-secondary dark:hover:text-text-secondary-dark"
                  title="종료일 삭제"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              )}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary dark:text-text-tertiary-dark">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 3V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M14 3V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <input
                id="end-date-input"
                type="date"
                value={editEndAt}
                onChange={(e) => setEditEndAt(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
                style={{ pointerEvents: 'none' }}
              />
            </div>
          </div>

          {/* 마감일 */}
          <div>
            <label className="block caption-text mb-2">마감일</label>
            <div className="relative">
              <input
                type="text"
                value={editDueAt ? editDueAt.split('-').join('/') : ''}
                readOnly
                onClick={() => {
                  const dateInput = document.getElementById('due-date-input') as HTMLInputElement;
                  dateInput?.showPicker?.();
                }}
                placeholder="yyyy/MM/dd"
                className="w-full px-4 py-2 pr-20 rounded bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark border border-border-light dark:border-border-dark cursor-pointer"
              />
              {editDueAt && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditDueAt('');
                  }}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-text-tertiary dark:text-text-tertiary-dark hover:text-text-secondary dark:hover:text-text-secondary-dark"
                  title="마감일 삭제"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              )}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary dark:text-text-tertiary-dark">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 3V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M14 3V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <input
                id="due-date-input"
                type="date"
                value={editDueAt}
                onChange={(e) => setEditDueAt(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
                style={{ pointerEvents: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="space-y-3 pt-4 border-t border-border-light dark:border-border-dark">
          {/* 저장/삭제 버튼 */}
          {!showDeleteConfirm ? (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={!editTitle.trim()}
                className="btn-primary flex-1 disabled:bg-primary-disabled disabled:cursor-not-allowed"
              >
                저장
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn-secondary flex-1 !text-error hover:!bg-error-bg"
              >
                삭제
              </button>
            </div>
          ) : (
            <div className="space-y-3">
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
    </div>
  );
}
