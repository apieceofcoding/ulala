/**
 * 환경별 로거 유틸리티
 *
 * 개발 환경에서는 콘솔에 로그를 출력하고,
 * 프로덕션 환경에서는 로그를 출력하지 않습니다.
 * 추후 에러 모니터링 서비스(Sentry 등)와 연동 가능합니다.
 */

const isDevelopment = import.meta.env.DEV;

/**
 * 로거 객체
 * 모든 로깅은 이 객체를 통해 수행해야 합니다.
 */
export const logger = {
  /**
   * 에러 로그
   * @param args - 로그 메시지 및 데이터
   */
  error: (...args: unknown[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
    // TODO: 프로덕션 환경에서 에러 모니터링 서비스로 전송
    // 예: Sentry.captureException(args[0]);
  },

  /**
   * 경고 로그
   * @param args - 로그 메시지 및 데이터
   */
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * 정보 로그
   * @param args - 로그 메시지 및 데이터
   */
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * 디버그 로그
   * @param args - 로그 메시지 및 데이터
   */
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  /**
   * 일반 로그 (console.log 대체)
   * @param args - 로그 메시지 및 데이터
   */
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
};
