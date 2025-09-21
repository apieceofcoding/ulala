import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";

export function meta() {
  return [
    { title: "기록 - ulala" },
    { name: "description", content: "게임 기록과 통계를 확인하세요" },
  ];
}

export default function Records() {
  return (
    <>
      <TopBar
        level={1}
        onSettingsClick={() => console.log('메뉴 버튼 클릭')}
      />
      <main className="min-h-screen bg-bg-secondary dark:bg-bg-secondary-dark p-4 pb-16">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark mb-4">
            기록
          </h1>
          <p className="text-base text-text-secondary dark:text-text-secondary-dark">
            게임 기록과 통계 페이지입니다.
          </p>
        </div>
      </main>
      <BottomNav />
    </>
  );
}