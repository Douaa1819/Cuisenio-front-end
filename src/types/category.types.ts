export interface CategoryRequest {
    name: string;
}

export interface CategoryResponse {
    id: number;
    name: string;
    slug?: string;
}

export interface CategoryCountResponse {
    count: number;
  }