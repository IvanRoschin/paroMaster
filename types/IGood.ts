import { IBrand } from './IBrand';
import { ICategory } from './ICategory';
import { ITestimonial } from './ITestimonial';

export interface IGoodBase {
  _id: string;
  src: string[];
  model: string;
  sku: string;
  title: string;
  description: string;
  price: number;
  discountPrice: number;
  isNew: boolean;
  isAvailable: boolean;
  isCompatible: boolean;
  compatibility: string[];
  quantity?: number;
  averageRating?: number;
  ratingCount?: number;
}

export interface IGoodDB extends IGoodBase {
  brand: string;
  category: string;
  compatibleGoods?: string[];
}

export interface IGoodUI extends IGoodBase {
  brand: IBrand | null;
  category: ICategory | null;
  compatibleGoods: IGoodUI[];
  testimonials?: ITestimonial[];
}
