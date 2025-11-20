import { Types } from 'mongoose';

import { IGoodUI } from './IGood';
import { IOrder } from './IOrder';
import { PaymentMethod } from './paymentMethod';

export interface ICustomer {
  _id?: string;
  user: Types.ObjectId;
  city: string;
  warehouse: string;
  payment: PaymentMethod;
  favorites?: string[] | IGoodUI[];
  orders?: string[] | IOrder[];
  createdAt?: Date;
  updatedAt?: Date;
}
