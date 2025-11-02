import { useState, useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";

export function meta() {
  return [
    { title: "보상 - ulala" },
    { name: "description", content: "완료한 할 일에 대한 보상을 확인하세요" },
  ];
}

interface Reward {
  id: number;
  title: string;
  description: string;
  earnedAt: string;
  type: 'points' | 'badge' | 'achievement';
  value?: number;
  icon: string;
  isNew?: boolean;
}

const sampleRewards: Reward[] = [
  {
    id: 1,
    title: "첫 할 일 완료",
    description: "첫 번째 할 일을 완료했습니다!",
    earnedAt: "2025-01-24T10:30:00Z",
    type: "badge",
    icon: "🎯",
    isNew: true
  },
  {
    id: 2,
    title: "건강한 하루",
    description: "물 8잔 마시기를 완료했습니다",
    earnedAt: "2025-01-24T09:15:00Z",
    type: "points",
    value: 10,
    icon: "💧"
  },
  {
    id: 3,
    title: "운동 마스터",
    description: "30분 산책하기를 완료했습니다",
    earnedAt: "2025-01-23T18:45:00Z",
    type: "points",
    value: 15,
    icon: "🚶‍♂️"
  },
  {
    id: 4,
    title: "학습 달성",
    description: "책 30페이지 읽기를 완료했습니다",
    earnedAt: "2025-01-23T14:20:00Z",
    type: "points",
    value: 20,
    icon: "📚"
  },
  {
    id: 5,
    title: "연속 달성자",
    description: "3일 연속 할 일을 완료했습니다",
    earnedAt: "2025-01-22T23:59:00Z",
    type: "achievement",
    icon: "🏆"
  }
];

export default function Rewards() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    // 로컬 스토리지에서 보상 데이터 로드
    const savedRewards = localStorage.getItem('ulala-rewards');
    if (savedRewards) {
      const parsedRewards = JSON.parse(savedRewards);
      setRewards(parsedRewards);

      // 총 포인트 계산
      const points = parsedRewards.reduce((total: number, reward: Reward) => {
        return total + (reward.value || 0);
      }, 0);
      setTotalPoints(points);
    } else {
      // 초기 샘플 데이터 설정
      setRewards(sampleRewards);
      localStorage.setItem('ulala-rewards', JSON.stringify(sampleRewards));

      const points = sampleRewards.reduce((total, reward) => {
        return total + (reward.value || 0);
      }, 0);
      setTotalPoints(points);
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "오늘";
    if (diffDays === 2) return "어제";
    if (diffDays <= 7) return `${diffDays - 1}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'points': return '포인트';
      case 'badge': return '뱃지';
      case 'achievement': return '업적';
      default: return '';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'points': return 'text-primary';
      case 'badge': return 'text-accent';
      case 'achievement': return 'text-secondary';
      default: return 'text-text-secondary';
    }
  };

  return (
    <>
      <TopBar level={1} />
      <main className="min-h-screen bg-bg-secondary dark:bg-bg-secondary-dark p-1 pt-14 pb-16 md:pb-1 md:pl-64">
        <div className="container max-w-lg mx-auto space-y-6">
          {/* 헤더 및 총 포인트 */}
          <div className="card-default text-center space-y-4">
            <h1 className="heading-primary mb-4">보상</h1>
            <div className="card-default">
              <h3 className="heading-secondary mb-2">내 포인트</h3>
              <div className="text-3xl font-bold text-primary mb-2">{totalPoints}</div>
              <div className="caption-text">누적 포인트</div>
            </div>
          </div>

          {/* 최근 보상 */}
          {rewards.length > 0 ? (
            <div className="card-default">
              <h3 className="heading-secondary mb-4">최근 획득한 보상</h3>
              <div className="space-y-3">
                {rewards
                  .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
                  .map((reward) => (
                    <div
                      key={reward.id}
                      className={`card-clickable p-3 relative ${
                        reward.isNew ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      {reward.isNew && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
                      )}
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{reward.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-text-primary dark:text-text-primary-dark">
                              {reward.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              {reward.value && (
                                <span className="text-sm font-bold text-primary">
                                  +{reward.value}
                                </span>
                              )}
                              <span className={`caption-text ${getTypeColor(reward.type)}`}>
                                {getTypeLabel(reward.type)}
                              </span>
                            </div>
                          </div>
                          <p className="body-text-small mb-2">{reward.description}</p>
                          <div className="caption-text">{formatDate(reward.earnedAt)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="card-default text-center space-y-4">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="heading-secondary">아직 보상이 없어요</h3>
              <p className="body-text">
                스토리 탭에서 할 일을 완료하면 보상을 받을 수 있어요!
              </p>
            </div>
          )}

          {/* 보상 정보 */}
          <div className="card-default">
            <h3 className="heading-secondary mb-4">보상 안내</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="text-xl">🎯</div>
                <div>
                  <div className="font-semibold text-text-primary dark:text-text-primary-dark">
                    할 일 완료
                  </div>
                  <div className="caption-text">할 일을 완료할 때마다 포인트와 뱃지를 획득</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xl">🏆</div>
                <div>
                  <div className="font-semibold text-text-primary dark:text-text-primary-dark">
                    업적 달성
                  </div>
                  <div className="caption-text">연속 완료, 특별한 도전 과제 달성 시 특별 보상</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xl">💎</div>
                <div>
                  <div className="font-semibold text-text-primary dark:text-text-primary-dark">
                    포인트 활용
                  </div>
                  <div className="caption-text">모은 포인트로 다양한 혜택을 받아보세요</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}