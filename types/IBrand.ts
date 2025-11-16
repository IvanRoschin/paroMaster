export interface IBrand {
  _id?: string;
  name: string;
  slug: string;
  src?: string;
  country?: string;
  website?: string;
}

export interface IBrandLean {
  _id: string;
  slug: string;
  name: string;
}

export type GetAllBrandsResponse = {
  success: boolean;
  brands: IBrand[];
  count: number;
};
