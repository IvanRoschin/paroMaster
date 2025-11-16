export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  src: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type GetAllCategoriesResponse = {
  success: boolean;
  categories: ICategory[];
  count: number;
};
