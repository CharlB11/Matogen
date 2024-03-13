export interface IMyJwtPayload {
  exp: number;
  data: {
    id: number;
    email: string;
    role: string;
    name: string;
  };
}