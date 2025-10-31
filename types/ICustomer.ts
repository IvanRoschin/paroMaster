import { IOrder } from './IOrder';
import { PaymentMethod } from './paymentMethod';

export interface ICustomer {
  _id?: string;
  user: string;
  city: string;
  warehouse: string;
  payment: PaymentMethod;
  orders?: string[] | IOrder[];
  createdAt?: Date;
  updatedAt?: Date;
}
