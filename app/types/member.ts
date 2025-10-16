/**
 * 회원 관련 타입 정의
 */

export interface Member {
  id: number;
  username: string;
  displayName: string | null;
  imageUrl: string | null;
  level: string;
}
