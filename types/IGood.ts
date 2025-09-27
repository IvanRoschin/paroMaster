import { ICategory } from './ICategory';
import { IBrand } from './IBrand';

export interface IGood {
  _id: string;
  brand: IBrand | string;
  category: ICategory | string;
  src: string[];
  model: string;
  vendor: string;
  title: string;
  description: string;
  price: number;
  isCondition: boolean;
  isAvailable: boolean;
  isCompatible: boolean;
  compatibility: string[];
  quantity?: number;
  averageRating?: number;
  ratingCount?: number;
  compatibleGoods?: IGood[];
}

export interface SGood {
  quantity: number;
  _id: string;
  category: string;
  src: string[];
  brand: string;
  model: string;
  vendor: string;
  title: string;
  description: string;
  price: number;
  isCondition: boolean;
  isAvailable: boolean;
  isCompatible: boolean;
  compatibility: string[];
}
