import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { TopBar } from "../components/TopBar";
import { BottomNav } from "../components/BottomNav";

export function meta(_: Route.MetaArgs) {
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
        onSettingsClick={() => console.log('메뉴 버튼 클릭')}
      />
      <main className="pb-16">
        <Welcome />
      </main>
      <BottomNav />
    </>
  );
}
