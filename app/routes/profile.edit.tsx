import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_ENDPOINTS } from "@/api/endpoints";
import { apiClient } from "@/api/api";
import type { Member } from "@/types/member";
import { logger } from "@/utils/logger";

export function meta() {
  return [
    { title: "프로필 수정 - ulala" },
    { name: "description", content: "프로필 정보를 수정하세요" },
  ];
}

type MemberIdStatus = "idle" | "checking" | "available" | "taken" | "invalid";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const location = useLocation();

  // profile 페이지에서 전달받은 state
  const stateFromProfile = location.state as {
    accessToken?: string;
    member?: Member;
  } | null;

  const [member, setMember] = useState<Member | null>(
    stateFromProfile?.member || null
  );
  const [accessToken, setAccessToken] = useState<string | null>(
    stateFromProfile?.accessToken || null
  );
  const [memberId, setMemberId] = useState(
    stateFromProfile?.member?.memberId || ""
  );
  const [displayName, setDisplayName] = useState(
    stateFromProfile?.member?.displayName || ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [memberIdStatus, setMemberIdStatus] = useState<MemberIdStatus>(
    stateFromProfile?.member?.memberId ? "available" : "idle"
  );
  const [memberIdMessage, setMemberIdMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    displayName: "",
  });

  const memberIdCheckTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 페이지 로드 시 accessToken 발급 (없을 때만)
  useEffect(() => {
    const getAccessToken = async () => {
      // 이미 accessToken이 있으면 발급하지 않음
      if (accessToken) {
        return;
      }

      try {
        const response = await apiClient.post(API_ENDPOINTS.AUTH.TOKEN, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.accessToken) {
            setAccessToken(data.accessToken);
          }
        } else {
          // 토큰 발급 실패 시 프로필 페이지로 이동
          navigate("/profile");
        }
      } catch (error) {
        logger.error("AccessToken 발급 오류:", error);
        navigate("/profile");
      }
    };

    getAccessToken();
  }, [accessToken, navigate]);

  // accessToken이 있고 member 정보가 없으면 회원 정보 조회
  useEffect(() => {
    const fetchMemberInfo = async () => {
      // accessToken이 없거나 이미 member 정보가 있으면 조회하지 않음
      if (!accessToken || member) {
        return;
      }

      try {
        const memberResponse = await apiClient.get(API_ENDPOINTS.MEMBERS.ME, {
          token: accessToken,
        });

        if (memberResponse.ok) {
          const memberData = await memberResponse.json();
          setMember(memberData);
          setMemberId(memberData.memberId || "");
          setDisplayName(memberData.displayName || "");
          // 기존 memberId가 있으면 중복 인증된 상태로 표시
          if (memberData.memberId) {
            setMemberIdStatus("available");
            setMemberIdMessage("현재 사용 중인 ID입니다.");
          }
        } else {
          // 회원 정보 조회 실패 시 프로필 페이지로 이동
          navigate("/profile");
        }
      } catch (error) {
        logger.error("회원 정보 조회 오류:", error);
        navigate("/profile");
      }
    };

    fetchMemberInfo();
  }, [accessToken, member, navigate]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (memberIdCheckTimerRef.current) {
        clearTimeout(memberIdCheckTimerRef.current);
      }
    };
  }, []);

  // 회원 ID 유효성 검증
  const validateMemberId = (id: string): boolean => {
    if (id.length < 6 || id.length > 20) {
      setMemberIdStatus("invalid");
      setMemberIdMessage("회원 ID는 6자 이상 20자 이하여야 합니다.");
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(id)) {
      setMemberIdStatus("invalid");
      setMemberIdMessage(
        "회원 ID는 영문 대소문자, 숫자, _ 만 사용할 수 있습니다."
      );
      return false;
    }

    return true;
  };

  // 회원 ID 중복 확인
  const checkMemberIdDuplicate = async (id: string): Promise<void> => {
    if (!validateMemberId(id)) {
      return;
    }

    if (id === member?.memberId) {
      setMemberIdStatus("available");
      setMemberIdMessage("현재 사용 중인 ID입니다.");
      return;
    }

    setMemberIdStatus("checking");
    setMemberIdMessage("");

    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.MEMBERS.CHECK_MEMBER_ID}/${encodeURIComponent(id)}/check`,
        { token: accessToken || "" }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          setMemberIdStatus("taken");
          setMemberIdMessage("이미 사용 중인 ID입니다.");
        } else {
          setMemberIdStatus("available");
          setMemberIdMessage("사용 가능한 ID입니다.");
        }
      } else {
        setMemberIdStatus("invalid");
        setMemberIdMessage("중복 확인에 실패했습니다.");
      }
    } catch (error) {
      logger.error("회원 ID 중복 확인 오류:", error);
      setMemberIdStatus("invalid");
      setMemberIdMessage("중복 확인에 실패했습니다.");
    }
  };

  // 회원 ID 입력 핸들러 (Debounce 적용)
  const handleMemberIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = e.target.value;
    setMemberId(newId);
    setMemberIdStatus("idle");
    setMemberIdMessage("");

    if (memberIdCheckTimerRef.current) {
      clearTimeout(memberIdCheckTimerRef.current);
    }

    if (!newId) {
      return;
    }

    memberIdCheckTimerRef.current = setTimeout(() => {
      checkMemberIdDuplicate(newId);
    }, 1000);
  };

  // 이름 유효성 검증
  const validateDisplayName = (name: string): boolean => {
    if (name.length > 20) {
      setErrors((prev) => ({
        ...prev,
        displayName: "이름은 20자 이하여야 합니다.",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, displayName: "" }));
    return true;
  };

  // 이름 입력 핸들러
  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setDisplayName(newName);
    validateDisplayName(newName);
  };

  // 프로필 저장
  const handleSave = async () => {
    if (!validateMemberId(memberId) || !validateDisplayName(displayName)) {
      return;
    }

    if (memberIdStatus === "taken" || memberIdStatus === "invalid") {
      return;
    }

    if (memberId !== member?.memberId && memberIdStatus !== "available") {
      alert("회원 ID 중복 확인이 필요합니다.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await apiClient.patch(
        API_ENDPOINTS.MEMBERS.UPDATE_PROFILE,
        {
          token: accessToken || "",
          body: JSON.stringify({
            memberId,
            displayName,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("프로필이 수정되었습니다.");
        navigate("/profile");
      } else {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || "프로필 업데이트에 실패했습니다."
        );
      }
    } catch (error) {
      logger.error("프로필 업데이트 오류:", error);
      alert(
        error instanceof Error ? error.message : "프로필 수정에 실패했습니다."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // 취소
  const handleCancel = () => {
    navigate("/profile");
  };

  // 상태별 아이콘
  const getMemberIdStatusIcon = () => {
    switch (memberIdStatus) {
      case "checking":
        return (
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
        );
      case "available":
        return <span className="text-success text-xl">✓</span>;
      case "taken":
      case "invalid":
        return <span className="text-error text-xl">✗</span>;
      default:
        return null;
    }
  };

  if (!member) {
    return (
      <div className="min-h-screen bg-bg-secondary dark:bg-bg-secondary-dark flex items-center justify-center">
        <div className="text-text-secondary dark:text-text-secondary-dark">
          로딩 중...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary dark:bg-bg-secondary-dark p-4 pb-16">
      <div className="container max-w-lg mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleCancel}
            className="text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary transition-colors"
          >
            ←
          </button>
          <h1 className="heading-primary">프로필 수정</h1>
          <div className="w-12"></div>
        </div>

        {/* 프로필 수정 폼 */}
        <div className="card-default space-y-6">
          {/* 회원 ID */}
          <div>
            <label
              htmlFor="memberId"
              className="block body-text font-semibold mb-2"
            >
              회원 ID
            </label>
            <div className="relative">
              <input
                type="text"
                id="memberId"
                value={memberId}
                onChange={handleMemberIdChange}
                className={`w-full px-4 py-2 pr-12 rounded-lg bg-bg-tertiary dark:bg-bg-tertiary-dark text-text-primary dark:text-text-primary-dark border-2 transition-colors ${
                  memberIdStatus === "invalid" || memberIdStatus === "taken"
                    ? "border-error"
                    : "border-transparent focus:border-primary"
                }`}
                placeholder="회원 ID를 입력하세요"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getMemberIdStatusIcon()}
              </div>
            </div>
            {memberIdMessage && (
              <p
                className={`caption-text mt-1 ${
                  memberIdStatus === "available" ? "text-success" : "text-error"
                }`}
              >
                {memberIdMessage}
              </p>
            )}
          </div>

          {/* 이름 */}
          <div>
            <label
              htmlFor="displayName"
              className="block body-text font-semibold mb-2"
            >
              이름
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={handleDisplayNameChange}
              className={`w-full px-4 py-2 rounded-lg bg-bg-tertiary dark:bg-bg-tertiary-dark text-text-primary dark:text-text-primary-dark border-2 transition-colors ${
                errors.displayName
                  ? "border-error"
                  : "border-transparent focus:border-primary"
              }`}
              placeholder="이름을 입력하세요"
            />
            {errors.displayName && (
              <p className="caption-text text-error mt-1">
                {errors.displayName}
              </p>
            )}
            <p className="caption-text text-text-tertiary dark:text-text-tertiary-dark mt-1">
              {displayName.length}/20
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 px-4 py-3 rounded-lg bg-bg-tertiary dark:bg-bg-tertiary-dark text-text-primary dark:text-text-primary-dark font-semibold hover:opacity-80 active:opacity-60 transition-opacity disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={
                isSaving ||
                !memberId ||
                memberIdStatus === "taken" ||
                memberIdStatus === "invalid" ||
                !!errors.displayName
              }
              className="flex-1 px-4 py-3 rounded-lg bg-primary text-white font-semibold hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
