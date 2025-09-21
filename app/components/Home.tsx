import { NavLink } from "react-router";
import logoDark from "@/assets/images/ulala_dark.png";
import logoLight from "@/assets/images/ulala.png";

const motivationalQuotes = [
  {
    text: "작은 진전이라도 계속 나아가는 것이 중요합니다.",
    author: "마틴 루터 킹"
  },
  {
    text: "성공은 매일 반복되는 작은 노력들의 총합입니다.",
    author: "로버트 콜리어"
  },
  {
    text: "오늘의 작은 행동이 내일의 큰 변화를 만듭니다.",
    author: "익명"
  },
  {
    text: "완벽함을 추구하지 말고, 진전을 추구하세요.",
    author: "윈스턴 처칠"
  },
  {
    text: "천 리 길도 한 걸음부터 시작됩니다.",
    author: "노자"
  }
];

export function Home() {
  const todayQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <main className="container min-h-screen flex items-center justify-center">
      <div className="flex-1 flex flex-col items-center max-w-4xl mx-auto">
        <header className="flex flex-col items-center mb-8">
          <div className="w-[500px] max-w-[100vw] p-4">
            <img
              src={logoLight}
              alt="Ulala Application"
              className="block w-full dark:hidden rounded-xl shadow-sm border border-border-light bg-bg-primary"
            />
            <img
              src={logoDark}
              alt="Ulala Application"
              className="hidden w-full dark:block rounded-xl shadow-sm border border-border-dark bg-bg-primary-dark"
            />
          </div>
        </header>

        <div className="w-full max-w-sm space-y-6">
          <div className="card-default">
            <div className="text-center space-y-4">
              <h2 className="heading-secondary mb-4">오늘의 동기부여</h2>
              <blockquote className="space-y-3">
                <p className="body-text text-center italic leading-relaxed">
                  "{todayQuote.text}"
                </p>
                <cite className="caption-text block text-center font-medium not-italic">
                  - {todayQuote.author}
                </cite>
              </blockquote>
            </div>
          </div>
          <div className="card-default">
            <h2 className="heading-secondary mb-4 text-center">시작하기</h2>
            <NavLink to="/records" className="btn-primary w-full block text-center">
              기록 시작하기
            </NavLink>
          </div>

          <div className="text-center">
            <p className="caption-text">Ulala © 2025 All rights reserved.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

