export interface IItem {
  _id?: string;
  imgUrl: string;
  brand: string;
  model: string;
  vendor: string;
  title: string;
  description: string;
  price: number;
  isAvailable: boolean;
  isCompatible: boolean;
  compatibility: string[];
}
