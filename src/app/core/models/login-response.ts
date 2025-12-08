export interface LoginResponse {
  user: {
    id: number;
    username: string;
    email?: string;
    roles?: string[];
  };
  message: string;
}
