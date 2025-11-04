import { Types } from 'mongoose';

import { IOrder } from './IOrder';
import { PaymentMethod } from './paymentMethod';

export interface ICustomer {
  _id?: string;
  user: Types.ObjectId;
  city: string;
  warehouse: string;
  payment: PaymentMethod;
  orders?: string[] | IOrder[];
  createdAt?: Date;
  updatedAt?: Date;
}
