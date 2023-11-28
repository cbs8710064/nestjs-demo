export interface GetUserDto {
  page: number;
  limit?: number;
  role?: number;
  gender?: number;
  username?: string;
}
