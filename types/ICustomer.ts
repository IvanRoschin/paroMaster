import { Types } from 'mongoose';

import { IGoodUI } from './IGood';
import { IOrder } from './IOrder';
import { IUser } from './IUser';
import { PaymentMethod } from './paymentMethod';

export interface ICustomer {
  _id?: string;
  user?: Types.ObjectId;
  city: string;
  warehouse: string;
  payment: PaymentMethod;
  favorites?: string[] | IGoodUI[];
  orders?: string[] | IOrder[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICustomerUI {
  _id?: string;
  user: IUser;
  city: string;
  warehouse: string;
  payment: PaymentMethod;
  favorites?: string[] | IGoodUI[];
  orders?: string[] | IOrder[];
  createdAt?: Date;
  updatedAt?: Date;
}
