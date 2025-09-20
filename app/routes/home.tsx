import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ulala" },
    { name: "description", content: "Life like game" },
  ];
}

export default function Home() {
  return <Welcome />;
}
