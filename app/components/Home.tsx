import logoDark from "@/assets/images/ulala_dark.png";
import logoLight from "@/assets/images/ulala.png";

export function Home() {
  return (
    <main className="container min-h-screen flex items-center justify-center">
      <div className="flex-1 flex flex-col items-center max-w-4xl mx-auto">
        <header className="flex flex-col items-center mb-12">
          <div className="w-[500px] max-w-[100vw] p-4">
            <img
              src={logoLight}
              alt="Ulala Application"
              className="block w-full dark:hidden"
            />
            <img
              src={logoDark}
              alt="Ulala Application"
              className="hidden w-full dark:block"
            />
          </div>
        </header>

        <div className="w-full max-w-sm space-y-6">
          <div className="card-default">
            <h2 className="heading-secondary mb-4 text-center">시작하기</h2>
            <p className="body-text-small text-center mb-6">
              다음 리소스를 통해 더 많은 정보를 확인하세요
            </p>

            <div className="space-y-3">
              {resources.map(({ href, text, icon, description }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="card-clickable block"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex-shrink-0 w-6 h-6"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="body-text-small font-semibold"
                        style={{ color: "var(--color-neutral-fg-1)" }}
                      >
                        {text}
                      </div>
                      <div className="caption-text">{description}</div>
                    </div>
                    <div
                      className="flex-shrink-0 w-4 h-4"
                      style={{ color: "var(--color-neutral-fg-3)" }}
                    >
                      <svg viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z" />
                      </svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div
              className="mt-6 pt-6 border-t"
              style={{ borderColor: "var(--color-neutral-fg-3)" }}
            >
              <button className="btn-primary w-full">
                애플리케이션 시작하기
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="caption-text">Ulala © 2025 All rights reserved.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

const resources = [
  {
    href: "https://reactrouter.com/docs",
    text: "React Router 문서",
    description: "라우팅과 내비게이션 가이드",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
          clipRule="evenodd"
        />
        <path
          fillRule="evenodd"
          d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    href: "https://docs.microsoft.com/en-us/fluent-ui/",
    text: "Fluent 2 디자인 시스템",
    description: "Microsoft의 디자인 언어",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M2 3a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm6 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1V3zm6 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V3zm-6 6a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1V9zm6 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V9zm-6 6a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1v-2zm6 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    href: "https://tailwindcss.com/docs",
    text: "Tailwind CSS 문서",
    description: "유틸리티 퍼스트 CSS 프레임워크",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
          clipRule="evenodd"
        />
        <path
          fillRule="evenodd"
          d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114L8.704 10.75H18.25A.75.75 0 0019 10z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];
