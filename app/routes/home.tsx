import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { TopBar } from "../components/TopBar";

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
        onSettingsClick={() => console.log('설정 버튼 클릭')}
      />
      <Welcome />
    </>
  );
}
