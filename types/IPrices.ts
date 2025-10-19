export interface IMinMaxPriceResponse {
  success: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  minDiscountPrice: number | null;
  maxDiscountPrice: number | null;
  message?: string;
}
