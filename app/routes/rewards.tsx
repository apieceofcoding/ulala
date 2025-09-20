import { TopBar } from "../components/TopBar";
import { BottomNav } from "../components/BottomNav";

export function meta() {
  return [
    { title: "보상 - ulala" },
    { name: "description", content: "받을 수 있는 보상을 확인하세요" },
  ];
}

export default function Rewards() {
  return (
    <>
      <TopBar
        level={1}
        onSettingsClick={() => console.log('메뉴 버튼 클릭')}
      />
      <main className="min-h-screen bg-[--color-neutral-bg-2] p-4 pb-16">
        <div className="text-center">
          <h1 className="text-[length:--font-size-heading-primary] leading-[--line-height-heading-primary] font-semibold text-[--color-neutral-fg-1] mb-4">
            보상
          </h1>
          <p className="text-[length:--font-size-body] leading-[--line-height-body] text-[--color-neutral-fg-2]">
            받을 수 있는 보상 페이지입니다.
          </p>
        </div>
      </main>
      <BottomNav />
    </>
  );
}