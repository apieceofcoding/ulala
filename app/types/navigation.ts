export interface TabInfo {
  path: string;
  label: string;
}

export const TAB_INFO: Record<string, string> = {
  '/': '홈',
  '/records': '기록',
  '/rewards': '보상',
  '/profile': '내정보',
};