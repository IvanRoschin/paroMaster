export interface FilterParams {
  q?: string;
  status?: string | null;
  brand?: string | string[];
  category?: string | string[];
  low?: string;
  high?: string;
  page?: string;
  sort?: 'asc' | 'desc';
  limit?: string;
  [key: string]: any;
}

export interface ISearchParams {
  q?: string;
  status?: string | null;
  brand?: string | string[];
  category?: string | string[];
  low?: string;
  high?: string;
  page?: string;
  sort?: 'asc' | 'desc';
  limit?: string;
  [key: string]: any;
}

// export interface ISearchParams {
// 	search?: string
// 	sort?: string
// 	low?: string
// 	high?: string
// 	category?: string
// 	brand?: string
// 	q?: string
// 	page?: number
// 	id?: string
// 	status?: string | null
// 	sortOrder?: 'asc' | 'desc'
// }
