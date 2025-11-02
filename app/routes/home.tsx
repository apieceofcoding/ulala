import { Home as HomeContent } from "@/components/Home";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";

export function meta() {
  return [
    { title: "ulala" },
    { name: "description", content: "Life like game" },
  ];
}

export default function Home() {
  return (
    <>
      <TopBar level={1} />
      <main className="pt-14 pb-16 md:pb-0 md:pl-64">
        <HomeContent />
      </main>
      <BottomNav />
    </>
  );
}
