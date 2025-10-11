import { Home as HomeContent } from "@/components/Home";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { logger } from "@/utils/logger";

export function meta() {
  return [
    { title: "ulala" },
    { name: "description", content: "Life like game" },
  ];
}

export default function Home() {
  return (
    <>
      <TopBar
        level={1}
        onSettingsClick={() => logger.log('메뉴 버튼 클릭')}
      />
      <main className="pb-16">
        <HomeContent />
      </main>
      <BottomNav />
    </>
  );
}
