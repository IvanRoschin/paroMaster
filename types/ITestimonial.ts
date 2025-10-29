export interface ITestimonial {
  _id?: string;
  author: string[];
  text: string;
  rating?: number | null;
  isActive: boolean;
  product?: string;
  createdAt: string | number | Date;
}
