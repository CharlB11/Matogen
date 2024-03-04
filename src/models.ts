export interface Product {
    id: number;
    name: string;
    category: string;
    quantity: number;
    createdBy?: string;
    createdOn?: string;
    updatedBy?: string;
    updatedOn?: string;
  }
  
  export interface ApiResponse {
    map: any;
    status: string;
    message?: string;
    products?: Product[];
  }
  