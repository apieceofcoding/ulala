import { NavLink } from "react-router";

interface Tab {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M2.5 7.5L10 1.25L17.5 7.5V16.25C17.5 16.913 16.913 17.5 16.25 17.5H3.75C3.087 17.5 2.5 16.913 2.5 16.25V7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 17.5V10H12.5V17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3.75 15L7.5 11.25L11.25 15L16.25 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 10H16.25V13.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GiftIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16.25 7.5H3.75V15.625C3.75 16.2463 4.2537 16.75 4.875 16.75H15.125C15.7463 16.75 16.25 16.2463 16.25 15.625V7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 16.75V7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 7.5H6.875C6.1837 7.5 5.625 6.9413 5.625 6.25C5.625 5.5587 6.1837 5 6.875 5C8.25 5 10 6.25 10 7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 7.5H13.125C13.8163 7.5 14.375 6.9413 14.375 6.25C14.375 5.5587 13.8163 5 13.125 5C11.75 5 10 6.25 10 7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16.25 17.5V15.625C16.25 14.6875 15.875 13.7875 15.2062 13.1187C14.5375 12.45 13.6375 12.075 12.7 12.075H7.3C6.3625 12.075 5.4625 12.45 4.79375 13.1187C4.125 13.7875 3.75 14.6875 3.75 15.625V17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 8.75C11.7259 8.75 13.125 7.35089 13.125 5.625C13.125 3.89911 11.7259 2.5 10 2.5C8.27411 2.5 6.875 3.89911 6.875 5.625C6.875 7.35089 8.27411 8.75 10 8.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const tabs: Tab[] = [
  { path: "/", label: "홈", icon: HomeIcon },
  { path: "/stories", label: "스토리", icon: ChartIcon },
  { path: "/rewards", label: "보상", icon: GiftIcon },
  { path: "/profile", label: "내정보", icon: UserIcon },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-primary dark:bg-bg-primary-dark z-50 shadow-high">
      <div className="mx-auto max-w-none lg:max-w-6xl xl:max-w-6xl">
        <div className="flex">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-2 min-h-[44px] transition-colors duration-150 ${
                  isActive
                    ? "text-primary font-semibold bg-bg-secondary dark:bg-bg-secondary-dark"
                    : "text-text-tertiary dark:text-text-tertiary-dark font-normal hover:text-text-secondary dark:hover:text-text-secondary-dark"
                }`
              }
            >
              <tab.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">
                {tab.label}
              </span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}