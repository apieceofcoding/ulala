export interface TabInfo {
  path: string;
  label: string;
}

export const TAB_INFO: Record<string, string> = {
  '/': '홈',
  '/stories': '스토리',
  '/rewards': '보상',
  '/profile': '내정보',
};