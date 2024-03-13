export interface IProduct {
    id: number;
    name: string;
    category: string;
    quantity: number;
    createdBy?: string;
    createdOn?: string;
    updatedBy?: string;
    updatedOn?: string;
  }
  
  export interface IApiResponse {
    map: any;
    status: string;
    message?: string;
    products?: IProduct[];
    id?: number;
  }

  
  