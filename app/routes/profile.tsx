import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";

export function meta() {
  return [
    { title: "내정보 - ulala" },
    { name: "description", content: "프로필과 설정을 관리하세요" },
  ];
}

export default function Profile() {
  return (
    <>
      <TopBar
        level={1}
        onSettingsClick={() => console.log('메뉴 버튼 클릭')}
      />
      <main className="min-h-screen bg-[--color-neutral-bg-2] p-4 pb-16">
        <div className="text-center">
          <h1 className="text-[length:--font-size-heading-primary] leading-[--line-height-heading-primary] font-semibold text-[--color-neutral-fg-1] mb-4">
            내정보
          </h1>
          <p className="text-[length:--font-size-body] leading-[--line-height-body] text-[--color-neutral-fg-2]">
            프로필과 설정 페이지입니다.
          </p>
        </div>
      </main>
      <BottomNav />
    </>
  );
}