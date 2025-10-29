import { ITestimonial } from './ITestimonial';
import { ICategory } from './ICategory';
import { IBrand } from './IBrand';

export interface IGoodBase {
  _id: string;
  src: string[];
  model: string;
  sku: string;
  title: string;
  description: string;
  price: number;
  isNew: boolean;
  isAvailable: boolean;
  isCompatible: boolean;
  quantity?: number;
  averageRating?: number;
  ratingCount?: number;
}

export interface IGoodDB extends IGoodBase {
  brand: string;
  category: string;
  isDailyDeal?: boolean;
  dealExpiresAt?: string;
  discountPrice?: number;
  compatibleGoods?: string[];
}

export interface IGoodUI extends IGoodBase {
  brand: IBrand | null;
  category: ICategory | null;
  isDailyDeal?: boolean;
  dealExpiresAt?: Date | string;
  discountPrice?: number;
  compatibleGoods?: (string | IGoodUI)[];
  testimonials?: ITestimonial[];
}
