/**
 * 날짜 관련 유틸리티 함수
 */

/**
 * 로컬 날짜를 YYYY-MM-DD 형식의 문자열로 변환하는 함수
 * @param date - 변환할 Date 객체
 * @returns YYYY-MM-DD 형식의 문자열
 */
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 달력 표시 범위의 시작일과 종료일을 계산하는 함수
 * @param currentDate - 현재 선택된 월의 Date 객체
 * @returns 시작일과 종료일 (YYYY-MM-DD 형식)
 */
export function getCalendarDateRange(currentDate: Date): {
  startDate: string;
  endDate: string;
} {
  // 현재 월의 첫째 날
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // 현재 월의 마지막 날
  const lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // 첫째 날이 포함된 주의 일요일
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay() + 1);

  // 마지막 날이 포함된 주의 토요일
  const endDate = new Date(lastDay);
  endDate.setDate(lastDay.getDate() + (7 - lastDay.getDay()));

  return {
    startDate: formatLocalDate(startDate),
    endDate: formatLocalDate(endDate),
  };
}

