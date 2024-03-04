export interface MyJwtPayload {
    exp: number;
    data: any;
    userId: number; 
    email: string;
    role: string;
    name: string; 
  }